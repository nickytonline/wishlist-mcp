import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { config } from 'dotenv';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { InMemoryEventStore } from '@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js';
import { createUIResource } from '@mcp-ui/server';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  isInitializeRequest,
  type CallToolRequest,
  type CallToolResult,
  type ReadResourceRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { SessionManager } from './utils/session.js';
import { MakeAWishInputSchema, type WishToolOutput } from './types.js';

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const ASSETS_DIR = path.resolve(ROOT_DIR, 'assets');

const PORT = parseInt(process.env.PORT || '8080', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || '3600000', 10);
const WIDGET_PORT = parseInt(process.env.WIDGET_PORT || '4444', 10);

const logger = pino({
  level: LOG_LEVEL,
  transport:
    NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

function getWidgetUrl(widgetId: string): string {
  return NODE_ENV === 'development'
    ? `http://localhost:${WIDGET_PORT}/${widgetId}.html`
    : `/widgets/${widgetId}.html`;
}

function createMcpServer(sessionId: string): Server {
  const server = new Server(
    { name: 'mcp-ui-app', version: '1.0.0' },
    { capabilities: { tools: {}, resources: {} } }
  );
  const sessionLogger = logger.child({ sessionId });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'make_wish',
        description:
          "Adds a wish to the Winter Fairy's Wishbox and displays it in a magical winter-themed widget. Each wish has a category (toy/experience/kindness/magic) and priority (dream wish/hopeful wish/small wish).",
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The wish to add to the wishbox',
            },
            category: {
              type: 'string',
              enum: ['toy', 'experience', 'kindness', 'magic'],
              description: 'Category of the wish',
              default: 'magic',
            },
            priority: {
              type: 'string',
              enum: ['dream wish', 'hopeful wish', 'small wish'],
              description: 'How much they want it',
              default: 'hopeful wish',
            },
          },
          required: ['message'],
        },
        annotations: { readOnlyHint: true, openWorldHint: true },
      },
    ],
  }));

  // // Register resources
  // server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  //   resources: [{
  //     uri: 'ui://echo-marquee/welcome',
  //     name: 'Welcome Message',
  //     description: 'A welcome message displayed in the echo marquee widget',
  //     mimeType: 'text/plain',
  //   }],
  // }));

  // Register resource templates
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
    resourceTemplates: [
      {
        uriTemplate: 'ui://wish-box/{message}',
        name: 'Wish Box Message',
        description:
          "Displays a custom wish in the Winter Fairy's Wishbox widget",
        mimeType: 'text/uri-list',
      },
    ],
  }));

  // Handle resource reading
  server.setRequestHandler(
    ReadResourceRequestSchema,
    async (request: ReadResourceRequest) => {
      const { uri } = request.params;

      // Handle template URIs like ui://wish-box/{message}
      const templateMatch = uri.match(/^ui:\/\/wish-box\/(.+)$/);
      if (templateMatch) {
        const message = decodeURIComponent(templateMatch[1]);
        const widgetUrl = getWidgetUrl('wish-box');
        const data: WishToolOutput = {
          wish: message,
          category: 'magic',
          priority: 'hopeful wish',
          timestamp: new Date().toISOString(),
        };

        const uiResource = createUIResource({
          uri: uri,
          content: {
            type: 'externalUrl',
            iframeUrl: `${widgetUrl}?data=${encodeURIComponent(JSON.stringify(data))}`,
          },
          encoding: 'text',
        });

        return {
          contents: [uiResource],
        };
      }

      throw new Error(`Resource not found: ${uri}`);
    }
  );

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest): Promise<CallToolResult> => {
      const { name, arguments: args } = request.params;
      sessionLogger.info({ toolName: name, args }, 'Tool invoked');

      if (name !== 'make_wish') throw new Error(`Unknown tool: ${name}`);

      const { message, category, priority } = MakeAWishInputSchema.parse(args);
      const timestamp = new Date().toISOString();
      const widgetUrl = getWidgetUrl('wish-box');
      const data: WishToolOutput = {
        wish: message,
        category,
        priority,
        timestamp,
      };

      const uiResource = createUIResource({
        uri: 'ui://wish-box',
        content: {
          type: 'externalUrl',
          iframeUrl: `${widgetUrl}?data=${encodeURIComponent(JSON.stringify(data))}`,
        },
        encoding: 'text',
      });

      return {
        content: [
          {
            type: 'text',
            text: `✨ Wish added to the Winter Fairy's Wishbox!\n🌟 Wish: ${message}\n📦 Category: ${category}\n💫 Priority: ${priority}`,
          },
          uiResource,
        ],
      };
    }
  );

  return server;
}

const app = express();
const httpServer = createServer(app);

app.use(
  pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } })
);
app.use(express.json());

if (NODE_ENV !== 'development' && fs.existsSync(ASSETS_DIR)) {
  app.use('/widgets', express.static(ASSETS_DIR));
}

const sessionManager = new SessionManager(logger);
let cleanupTimer: NodeJS.Timeout;

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    sessions: Array.from((sessionManager as any).sessions.keys()).length,
  });
});

app.post('/mcp', async (req, res) => {
  let sessionId = req.headers['mcp-session-id'] as string | undefined;

  if (!sessionId || isInitializeRequest(req.body)) {
    const newSessionId = uuidv4();
    const server = createMcpServer(newSessionId);
    const eventStore = new InMemoryEventStore();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => newSessionId,
      eventStore,
    });

    (sessionManager as any).sessions.set(newSessionId, {
      server,
      transport,
      createdAt: Date.now(),
    });
    res.setHeader('mcp-session-id', newSessionId);
    await server.connect(transport);
    sessionId = newSessionId;
  }

  const session = (sessionManager as any).sessions.get(sessionId);
  if (!session)
    return res.status(404).json({ error: { message: 'Session not found' } });

  return await session.transport.handleRequest(req, res, req.body);
});

app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId)
    return res
      .status(400)
      .json({ error: { message: 'Missing mcp-session-id header' } });

  const session = (sessionManager as any).sessions.get(sessionId);
  if (!session)
    return res.status(404).json({ error: { message: 'Session not found' } });

  return await session.transport.handleRequest(req, res);
});

app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId)
    return res
      .status(400)
      .json({ error: { message: 'Missing mcp-session-id header' } });

  const session = (sessionManager as any).sessions.get(sessionId);
  if (!session)
    return res.status(404).json({ error: { message: 'Session not found' } });

  await session.transport.handleRequest(req, res);
  (sessionManager as any).sessions.delete(sessionId);
  return;
});

function shutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received');
  clearInterval(cleanupTimer);
  httpServer.close(() => {
    sessionManager.cleanup(SESSION_MAX_AGE);
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

httpServer.listen(PORT, () => {
  logger.info(
    { port: PORT, nodeEnv: NODE_ENV, widgetPort: WIDGET_PORT },
    'MCP-UI server started'
  );
  cleanupTimer = setInterval(
    () => sessionManager.cleanup(SESSION_MAX_AGE),
    SESSION_MAX_AGE
  );
});
