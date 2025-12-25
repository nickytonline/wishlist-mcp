import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
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
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  isInitializeRequest,
  type CallToolRequest,
  type CallToolResult,
  type ReadResourceRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { SessionManager } from './utils/session.js';
import {
  MakeAWishInputSchema,
  type WishToolOutput,
  type StoredWish,
} from './types.js';

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const ASSETS_DIR = path.resolve(ROOT_DIR, 'assets');

const PORT = parseInt(process.env.PORT || '8080', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || '3600000', 10);
const WIDGET_PORT = parseInt(process.env.WIDGET_PORT || '4444', 10);
const { BASE_URL } = process.env;

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
  if (NODE_ENV === 'development') {
    return `http://localhost:${WIDGET_PORT}/${widgetId}.html`;
  }

  if (!BASE_URL) {
    throw new Error(
      'BASE_URL environment variable is required for production. ' +
        'Set it to your public URL (e.g., BASE_URL=https://wishlist.yourdomain.com)'
    );
  }

  // Strip trailing slash to avoid double slashes
  const baseUrl = BASE_URL.replace(/\/$/, '');

  return `${baseUrl}/widgets/${widgetId}.html`;
}

// In-memory ephemeral wish storage per session
const sessionWishes = new Map<string, StoredWish[]>();

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
        annotations: { openWorldHint: true },
      },
      {
        name: 'view_wishes',
        description:
          "Displays all wishes in the Winter Fairy's Wishbox in a beautiful, magical UI. Dream wishes glow brighter! Use this when the user asks to see their wishes or wishbox.",
        inputSchema: {
          type: 'object',
          properties: {},
        },
        annotations: { readOnlyHint: true, openWorldHint: true },
      },
      {
        name: 'grant_wish',
        description:
          "Grants a wish and displays it sparkling as granted! Use when user says a wish came true (e.g., 'My mittens wish came true!' or 'Grant the snow wish'). Fuzzy matches wish text.",
        inputSchema: {
          type: 'object',
          properties: {
            wish_text: {
              type: 'string',
              description:
                'The text of the wish to grant (can be partial match, e.g., "mittens" or "snow wish")',
            },
          },
          required: ['wish_text'],
        },
        annotations: { openWorldHint: true },
      },
      {
        name: 'release_wish',
        description:
          "Releases a wish from the Winter Fairy's Wishbox, letting it float away into the winter sky. Use when user wants to remove a wish (e.g., 'Remove the mittens wish' or 'Let go of my first wish'). Fuzzy matches wish text.",
        inputSchema: {
          type: 'object',
          properties: {
            wish_text: {
              type: 'string',
              description:
                'The text of the wish to release (can be partial match, e.g., "mittens" or "first wish")',
            },
          },
          required: ['wish_text'],
        },
        annotations: { destructiveHint: true, openWorldHint: true },
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
          uri: uri as `ui://${string}`,
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

  // tool call to UI mapping
  const widgetRegistry: ReadonlyMap<string, string> = new Map([
    ['make_wish', 'wish-box'],
    ['grant_wish', 'wish-box'],
    ['view_wishes', 'wish-list'],
    ['release_wish', 'wish-list'],
  ] as const);

  type WidgetID =
    typeof widgetRegistry extends Map<infer K, unknown> ? K : never;

  function createWidget(widgetId: WidgetID, data: unknown) {
    const widgetName = widgetRegistry.get(widgetId);
    if (!widgetName) {
      throw new Error(`Unknown widget: ${widgetId}`);
    }

    const widgetUrl = getWidgetUrl(widgetName);
    return createUIResource({
      uri: `ui://${widgetId}`,
      content: {
        type: 'externalUrl',
        iframeUrl: `${widgetUrl}?data=${encodeURIComponent(JSON.stringify(data))}`,
      },
      encoding: 'text',
    });
  }

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest): Promise<CallToolResult> => {
      const { name, arguments: args } = request.params;
      sessionLogger.info({ toolName: name, args }, 'Tool invoked');

      switch (name) {
        case 'make_wish': {
          const { message, category, priority } =
            MakeAWishInputSchema.parse(args);
          const timestamp = new Date().toISOString();
          const wishId = uuidv4();

          // Store the wish
          if (!sessionWishes.has(sessionId)) {
            sessionWishes.set(sessionId, []);
          }
          const wishes = sessionWishes.get(sessionId)!;
          wishes.push({
            id: wishId,
            wish: message,
            category,
            priority,
            timestamp,
          });

          const data: WishToolOutput = {
            wish: message,
            category,
            priority,
            timestamp,
          };

          const uiResource = createWidget(name, data);

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

        case 'view_wishes': {
          const wishes = sessionWishes.get(sessionId) || [];
          const uiResource = createWidget(name, { wishes });

          return {
            content: [
              {
                type: 'text',
                text: `✨ Your Winter Fairy Wishbox contains ${wishes.length} wish${wishes.length !== 1 ? 'es' : ''}!`,
              },
              uiResource,
            ],
          };
        }

        case 'grant_wish': {
          const { wish_text } = args as { wish_text: string };
          const wishes = sessionWishes.get(sessionId) || [];

          // Fuzzy match: find wish that contains the text (case-insensitive)
          const matchedWish = wishes.find((w) =>
            w.wish.toLowerCase().includes(wish_text.toLowerCase())
          );

          if (!matchedWish) {
            return {
              content: [
                {
                  type: 'text',
                  text: `❌ Could not find a wish matching "${wish_text}". Try being more specific or use view_wishes to see all wishes.`,
                },
              ],
            };
          }

          // Mark as granted
          matchedWish.granted = true;
          matchedWish.grantedAt = new Date().toISOString();

          const data: WishToolOutput & {
            granted?: boolean;
            grantedAt?: string;
          } = {
            wish: matchedWish.wish,
            category: matchedWish.category,
            priority: matchedWish.priority,
            timestamp: matchedWish.timestamp,
            granted: matchedWish.granted,
            grantedAt: matchedWish.grantedAt,
          };

          const uiResource = createWidget(name, data);

          return {
            content: [
              {
                type: 'text',
                text: `🌟✨ WISH GRANTED! ✨🌟\n\n💫 "${matchedWish.wish}" has been granted by the Winter Fairy!\n🎉 Granted at: ${new Date(matchedWish.grantedAt!).toLocaleString()}`,
              },
              uiResource,
            ],
          };
        }

        case 'release_wish': {
          const { wish_text } = args as { wish_text: string };
          const wishes = sessionWishes.get(sessionId) || [];

          // Fuzzy match: find wish that contains the text (case-insensitive)
          const matchedWishIndex = wishes.findIndex((w) =>
            w.wish.toLowerCase().includes(wish_text.toLowerCase())
          );

          if (matchedWishIndex === -1) {
            return {
              content: [
                {
                  type: 'text',
                  text: `❌ Could not find a wish matching "${wish_text}". Try being more specific or use view_wishes to see all wishes.`,
                },
              ],
            };
          }

          // Remove the wish
          const [releasedWish] = wishes.splice(matchedWishIndex, 1);

          const uiResource = createWidget(name, { wishes });

          return {
            content: [
              {
                type: 'text',
                text: `🍃✨ Wish Released! ✨🍃\n\n💨 "${releasedWish.wish}" has been released into the winter sky.\n🌟 ${wishes.length} wish${wishes.length !== 1 ? 'es' : ''} remaining in your Wishbox.`,
              },
              uiResource,
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    }
  );

  return server;
}

const app = express();
const httpServer = createServer(app);

// Trust proxy headers from ingress/load balancer (required for k8s, etc.)
app.set('trust proxy', true);

app.use(
  pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } })
);
app.use(express.json());

if (NODE_ENV !== 'development' && existsSync(ASSETS_DIR)) {
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
  sessionManager.delete(sessionId, (id) => {
    // Clean up wishes for this session
    sessionWishes.delete(id);
    logger.info({ sessionId: id }, 'Cleaned up session data');
  });
  return;
});

function shutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received');
  clearInterval(cleanupTimer);
  httpServer.close(() => {
    sessionManager.cleanup(SESSION_MAX_AGE, (id) => {
      // Clean up wishes for this session
      sessionWishes.delete(id);
      logger.info({ sessionId: id }, 'Cleaned up session data on shutdown');
    });
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

httpServer.listen(PORT, () => {
  logger.info(
    {
      port: PORT,
      nodeEnv: NODE_ENV,
      widgetPort: WIDGET_PORT,
      baseUrl: BASE_URL,
    },
    'MCP-UI server started'
  );

  cleanupTimer = setInterval(() => {
    sessionManager.cleanup(SESSION_MAX_AGE, (id) => {
      // Clean up wishes for stale session
      sessionWishes.delete(id);
      logger.info({ sessionId: id }, 'Cleaned up stale session data');
    });
  }, SESSION_MAX_AGE);
});
