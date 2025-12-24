### /Users/nicktaylor/dev/oss/wishlist-mcp/README.md
```markdown
1: # MCP-UI App Template
2: 
3: A well-architected starter template demonstrating best practices for building [MCP-UI apps](https://mcpui.dev/) using the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) with [React](https://react.dev/) widgets. It leverages TypeScript, Tailwind CSS v4, Pino logging, Storybook, and Vitest for a robust development experience.
4: 
5: ## Features
6: 
7: - **MCP Server** - Node.js server with MCP-UI widget support
8: - **Echo Tool** - Example tool with [Zod](https://zod.dev/) validation and widget response
9: - **React Widgets** - Interactive wish box component with `callTool` demo
10: - **[Pino](https://getpino.io/) Logging** - Structured logging with pretty printing in development
11: - **TypeScript** - Strict mode with ES2023 target
12: - **[Tailwind CSS v4](https://tailwindcss.com/)** - Modern styling with dark mode support
13: - **[Storybook](https://storybook.js.org/)** - Component development with a11y addon
14: - **Testing** - [Vitest](https://vitest.dev/) for server and widgets with accessibility checks
15: - **Build Optimizations** - Parallel builds, content hashing, compression
16: - **[Docker](https://www.docker.com/)** - Multi-stage builds with health checks
17: - **Production Ready** - Session management, graceful shutdown, error handling
18: 
19: ## Architecture
20: 
21: ```mermaid
22: graph TD
23:     A[MCP Client] -->|HTTPStreamable| B[MCP Server<br/>Node.js + Express]
24:     B -->|createUIResource| C[Widget<br/>React in iframe]
25: 
26:     B -.-> B1[Echo Tool]
27:     B -.-> B2[Resource Registration]
28:     B -.-> B3[text/html<br/>standard MIME type]
29: 
30:     C -.-> C1[Reads URL params for data]
31:     C -.-> C2[postMessage for actions]
32:     C -.-> C3[Responsive, accessible UI]
33: 
34:     style A fill:#e1f5ff
35:     style B fill:#fff4e6
36:     style C fill:#f3e5f5
37: ```
38: 
39: ## Quick Start
40: 
41: **Setup time: ~5 minutes (first time)**
42: 
43: ### Prerequisites
44: 
45: - **[Node.js](https://nodejs.org/) 22+** (required for ES2023 support)
46:   - Verify: `node -v` (should show v22.0.0 or higher)
47: - **npm 10+** (ships with Node 22)
48:   - Verify: `npm -v` (should show v10.0.0 or higher)
49: 
50: **Supported platforms:** macOS, Linux, Windows (via WSL2)
51: 
52: ### Installation & Setup
53: 
54: ```bash
55: git clone https://github.com/pomerium/wishlist-mcp your-mcp-ui-app
56: cd your-mcp-ui-app
57: npm install
58: npm run dev
59: ```
60: 
61: This starts both the MCP server and widget dev server:
62: 
63: - **MCP Server**: `http://localhost:8080`
64: - **Widget Assets**: `http://localhost:4444`
65: 
66: > **Note:** The MCP server is a backend service. To test it, follow the MCP client connection steps below or use `npm run inspect` for local testing.
67: 
68: You should see output indicating both servers are running successfully:
69: 
70: ```
71: ❯ npm run dev
72: 
73: > wishlist-mcp@1.0.0 dev
74: > concurrently "npm run dev:server" "npm run dev:widgets"
75: 
76: [1]
77: [1] > wishlist-mcp@1.0.0 dev:widgets
78: [1] > npm run dev --workspace=widgets
79: [1]
80: [0]
81: [0] > wishlist-mcp@1.0.0 dev:server
82: [0] > npm run dev --workspace=server
83: [0]
84: [1]
85: [1] > mcp-ui-widgets@1.0.0 dev
86: [1] > vite
87: [1]
88: [0]
89: [0] > mcp-ui-server@1.0.0 dev
90: [0] > tsx watch src/server.ts
91: [0]
92: [1]
93: [1] Found 1 widget(s):
94: [1]   - wish-box
95: [1]
96: [1]
97: [1]   VITE v6.4.1  ready in 151 ms
98: [1]
99: [1]   ➜  Local:   http://localhost:4444/
100: [1]   ➜  Network: use --host to expose
101: [0] [12:45:12] INFO: Starting MCP-UI App Template server
102: [0]     port: 8080
103: [0]     nodeEnv: "development"
104: [0]     logLevel: "info"
105: [0]     assetsDir: "/Users/nicktaylor/dev/oss/wishlist-mcp/assets"
106: [0] [12:45:12] INFO: Server started successfully
107: [0]     port: 8080
108: [0]     mcpEndpoint: "http://localhost:8080/mcp"
109: [0]     healthEndpoint: "http://localhost:8080/health"
110: ```
111: 
112: ### Connect to MCP Client
113: 
114: To test your app in an MCP client (like ChatGPT or Claude Desktop), you need to expose your local server publicly. The fastest way is using [Pomerium's SSH tunnel](https://www.pomerium.com/docs/tcp/ssh):
115: 
116: **1. Create a public tunnel** (in a new terminal, keep `npm run dev` running):
117: 
118: ```bash
119: ssh -R 0 pom.run
120: ```
121: 
122: **First-time setup:**
123: 
124: 1. You'll see a sign-in URL in your terminal:
125: 
126:    ```
127:    Please sign in with hosted to continue
128:    https://data-plane-us-central1-1.dataplane.pomerium.com/.pomerium/sign_in?user_code=some-code
129:    ```
130: 
131: 2. Click the link and sign up
132: 3. Authorize via the Pomerium OAuth flow
133: 4. Your terminal will display connection details:
134: 
135: ![Pomerium SSH Tunnel UI](docs/images/pomerium-tui.png)
136: 
137: **2. Find your public URL:**
138: 
139: Look for the **Port Forward Status** section showing:
140: 
141: - **Status**: `ACTIVE` (tunnel is running)
142: - **Remote**: `https://template.first-wallaby-240.pom.run` (your unique URL)
143: - **Local**: `http://localhost:8080` (your local server)
144: 
145: **3. Add to MCP Client:**
146: 
147: For **ChatGPT**:
148: 1. [Enable ChatGPT apps dev mode](https://platform.openai.com/docs/guides/developer-mode) in your ChatGPT settings
149: 2. Go to: **Settings → Connectors → Add Connector**
150: 3. Enter your Remote URL + `/mcp`, e.g. `https://template.first-wallaby-240.pom.run/mcp`
151: 4. Save the connector
152: 
153: For **Claude Desktop** or other MCP clients:
154: 1. Configure the MCP server URL in your client's settings
155: 2. Use your Remote URL + `/mcp` endpoint
156: 
157: **4. Test it:**
158: 
159: 1. Start a new chat in your MCP client
160: 2. Add your app to the chat (if applicable)
161: 3. Send: `echo hello world`
162: 4. You should see the message displayed in an interactive wish box widget
163: 
164: The tunnel stays active as long as the SSH session is running.
165: 
166: ### Success! What's Next?
167: 
168: Now that your app is working, you can:
169: 
170: - **[Customize the echo tool](#adding-new-tools)** - Modify the example tool or add your own logic
171: - **[Create a new widget](#widget-development)** - Build custom UI components for your tools
172: - **[Test locally](#local-testing-with-mcp-inspector)** - Use `npm run inspect` for debugging without an MCP client
173: - **[Deploy to production](#production-deployment)** - Take your app live when ready
174: 
175: ## Available Commands
176: 
177: ### Development
178: 
179: ```bash
180: # Start everything (server + widgets in watch mode)
181: npm run dev
182: 
183: # Start only MCP server (watch mode)
184: npm run dev:server
185: 
186: # Start only widget dev server
187: npm run dev:widgets
188: 
189: # Test with MCP Inspector
190: npm run inspect
191: ```
192: 
193: ### Building
194: 
195: ```bash
196: # Full production build (widgets + server)
197: npm run build
198: 
199: # Build only widgets
200: npm run build:widgets
201: 
202: # Build only server
203: npm run build:server
204: ```
205: 
206: ### Testing
207: 
208: ```bash
209: # Run all tests
210: npm test
211: 
212: # Run server tests only
213: npm run test:server
214: 
215: # Run widget tests only
216: npm run test:widgets
217: 
218: # Run tests with coverage
219: npm run test:coverage
220: ```
221: 
222: ### Code Quality
223: 
224: ```bash
225: # Lint all TypeScript files
226: npm run lint
227: 
228: # Format code with Prettier
229: npm run format
230: 
231: # Check formatting without modifying
232: npm run format:check
233: 
234: # Type check all workspaces
235: npm run type-check
236: ```
237: 
238: ### Storybook
239: 
240: ```bash
241: # Run Storybook dev server
242: npm run storybook
243: 
244: # Build Storybook for production
245: npm run build:storybook
246: ```
247: 
248: ### Testing Your App
249: 
250: #### 1. Local Testing with MCP Inspector
251: 
252: ```bash
253: npm run inspect
254: ```
255: 
256: This opens a browser interface to:
257: 
258: - List available tools
259: - Test tool invocations
260: - Inspect responses and metadata
261: - Verify widget resources load correctly
262: 
263: #### 2. Connect from MCP Client
264: 
265: For complete MCP client connection instructions, see the [Quick Start: Connect to MCP Client](#connect-to-mcp-client) section above.
266: 
267: **Already connected?** After making code changes:
268: 
269: For ChatGPT:
270: 1. **Settings → Connectors → Your App → Refresh**
271: 2. This reloads tool definitions and metadata
272: 
273: For other MCP clients:
274: 1. Restart or refresh the connection as per your client's documentation
275: 
276: **Production Setup:**
277: 
278: When deploying to production:
279: 
280: 1. Deploy your server to a public URL (see [Production Deployment](#production-deployment))
281: 2. In your MCP client, add the connector with your server URL: `https://your-domain.com/mcp`
282: 3. Test the `echo` tool in your MCP client
283: 
284: ## Project Structure
285: 
286: ```
287: wishlist-mcp/
288: ├── server/                  # MCP server
289: │   ├── src/
290: │   │   ├── server.ts       # Main server with echo tool
291: │   │   ├── types.ts        # Type definitions
292: │   │   └── utils/
293: │   │       └── session.ts  # Session management
294: │   ├── tests/
295: │   │   └── echo-tool.test.ts
296: │   └── package.json        # Server dependencies
297: │
298: ├── widgets/                 # React widgets
299: │   ├── src/
300: │   │   ├── widgets/
301: │   │   │   └── wish-box.tsx       # Widget entry (includes mounting code)
302: │   │   ├── wish-box/
303: │   │   │   ├── WishBox.tsx        # Shared components
304: │   │   │   ├── WishBox.stories.tsx
305: │   │   │   └── styles.css
306: │   │   ├── components/
307: │   │   │   └── ui/              # ShadCN components
308: │   │   ├── hooks/
309: │   │   │   └── [custom hooks]
310: │   │   └── types/
311: │   │       └── [type definitions]
312: │   ├── .storybook/         # Storybook config
313: │   └── package.json        # Widget dependencies
314: │
315: ├── assets/                  # Asset build artifacts
316: │   ├── wish-box.html
317: │   ├── wish-box-[hash].js
318: │   └── wish-box-[hash].css
319: │
320: ├── scripts/
321: │   └── build-all.mts       # Parallel widget builds
322: │
323: ├── docker/
324: │   ├── Dockerfile          # Multi-stage build
325: │   └── docker-compose.yml
326: │
327: └── package.json            # Root workspace
328: ```
329: 
330: ## Adding New Tools
331: 
332: ### 1. Define Tool Schema
333: 
334: ```typescript
335: // server/src/server.ts
336: 
337: const myTool: Tool = {
338:   name: 'my_tool',
339:   description: 'Does something cool',
340:   inputSchema: {
341:     type: 'object',
342:     properties: {
343:       input: { type: 'string', description: 'Tool input' },
344:     },
345:     required: ['input'],
346:   },
347: };
348: ```
349: 
350: ### 2. Implement Tool Handler
351: 
352: ```typescript
353: // In CallToolRequestSchema handler
354: 
355: if (name === 'my_tool') {
356:   const args = MyToolInputSchema.parse(request.params.arguments);
357: 
358:   return {
359:     content: [{ type: 'text', text: 'Result' }],
360:     structuredContent: {
361:       result: args.input,
362:     },
363:
367:       },
368:     },
369:   };
370: }
371: ```
372: 
373: ### 3. Create Widget
374: 
375: Create `widgets/src/widgets/my-widget.tsx`:
376: 
377: ```tsx
378: // widgets/src/widgets/my-widget.tsx
379: import { StrictMode, useState, useEffect } from 'react';
380: import { createRoot } from 'react-dom/client';
381: 
382: function MyWidget() {
383:   const [data, setData] = useState(null);
384: 
385:   // Read data from URL params (MCP-UI protocol)
386:   useEffect(() => {
387:     const params = new URLSearchParams(window.location.search);
388:     const dataParam = params.get('data');
389:     if (dataParam) {
390:       try {
391:         setData(JSON.parse(decodeURIComponent(dataParam)));
392:       } catch (err) {
393:         console.error('Failed to parse URL data:', err);
394:       }
395:     }
396:   }, []);
397: 
398:   return (
399:     <div>
400:       <h1>My Widget</h1>
401:       <pre>{JSON.stringify(data, null, 2)}</pre>
402:     </div>
403:   );
404: }
405: 
406: // Mounting code - required at the bottom of each widget file
407: const rootElement = document.getElementById('my-widget-root');
408: if (rootElement) {
409:   createRoot(rootElement).render(
410:     <StrictMode>
411:       <MyWidget />
412:     </StrictMode>
413:   );
414: }
415: ```
416: 
417: ### 4. Register Widget Resource
418: 
419: ```typescript
420: // In ReadResourceRequestSchema handler
421: 
422: if (uri === 'ui://my-widget') {
423:   const html = readWidgetHtml('my-widget');
424:   return {
425:     contents: [
426:       {
427:         uri,
428:         // HTML served via createUIResource
429:         text: html,
430:       },
431:     ],
432:   };
433: }
434: ```
435: 
436: ### 5. Build
437: 
438: ```bash
439: npm run build:widgets
440: npm run dev:server
441: ```
442: 
443: The build script auto-discovers widgets in `widgets/src/widgets/*.{tsx,jsx}` and bundles them with their mounting code
444: 
445: ## Widget Development
446: 
447: ### Widget Pattern
448: 
449: Widgets include both the component and mounting code:
450: 
451: **1. Create widget entry point** in `widgets/src/widgets/[name].tsx`:
452: 
453: ```tsx
454: import { StrictMode, useState, useEffect } from 'react';
455: import { createRoot } from 'react-dom/client';
456: 
457: function MyWidget() {
458:   const [data, setData] = useState(null);
459: 
460:   // Read data from URL params (MCP-UI protocol)
461:   useEffect(() => {
462:     const params = new URLSearchParams(window.location.search);
463:     const dataParam = params.get('data');
464:     if (dataParam) {
465:       try {
466:         setData(JSON.parse(decodeURIComponent(dataParam)));
467:       } catch (err) {
468:         console.error('Failed to parse URL data:', err);
469:       }
470:     }
471:   }, []);
472: 
473:   return <div>Widget content: {JSON.stringify(data)}</div>;
474: }
475: 
476: // Mounting code - required
477: const rootElement = document.getElementById('my-widget-root');
478: if (rootElement) {
479:   createRoot(rootElement).render(
480:     <StrictMode>
481:       <MyWidget />
482:     </StrictMode>
483:   );
484: }
485: ```
486: 
487: **2. Build discovers and bundles widget**:
488: 
489: ```bash
490: npm run build:widgets
491: ```
492: 
493: **3. Widget available as** `ui://my-widget`
494: 
495: The build system:
496: 
497: - Auto-discovers all files in `widgets/src/widgets/*.{tsx,jsx}`
498: - Bundles the component and mounting code together
499: - Creates content-hashed bundles and HTML templates
500: 
501: ### MCP-UI Widget API Reference
502: 
503: #### Receiving Data from Tools
504: 
505: Widgets receive data via URL query parameters:
506: 
507: ```typescript
508: useEffect(() => {
509:   const params = new URLSearchParams(window.location.search);
510:   const dataParam = params.get('data');
511: 
512:   if (dataParam) {
513:     try {
514:       const toolOutput = JSON.parse(decodeURIComponent(dataParam));
515:       // Use toolOutput in your widget
516:     } catch (err) {
517:       console.error('Failed to parse URL data:', err);
518:     }
519:   }
520: }, []);
521: ```
522: 
523: #### Sending Actions via postMessage
524: 
525: Widgets communicate with the MCP host using postMessage:
526: 
527: ```typescript
528: // Call another tool
529: window.parent.postMessage({
530:   type: 'tool',
531:   payload: {
532:     toolName: 'my_tool',
533:     params: { arg: 'value' }
534:   }
535: }, '*');
536: 
537: // Send a prompt to the host
538: window.parent.postMessage({
539:   type: 'prompt',
540:   payload: {
541:     prompt: 'Continue the conversation...'
542:   }
543: }, '*');
544: 
545: // Send an intent (custom action)
546: window.parent.postMessage({
547:   type: 'intent',
548:   payload: {
549:     intent: 'open_external',
550:     params: { href: 'https://example.com' }
551:   }
552: }, '*');
553: ```
554: 
555: #### Best Practices
556: 
557: - **Data parsing**: Always wrap JSON parsing in try-catch blocks
558: - **Security**: Validate all data received from URL parameters
559: - **Responsiveness**: Design widgets to work across different viewport sizes
560: - **Accessibility**: Follow ARIA guidelines and semantic HTML
561: - **Performance**: Keep initial bundle size under 500kb
562: 
563: ### Example: Full Widget with Interactions
564: 
565: ```tsx
566: // widgets/src/widgets/my-widget.tsx
567: import { StrictMode, useState, useEffect } from 'react';
568: import { createRoot } from 'react-dom/client';
569: 
570: function MyWidget() {
571:   const [data, setData] = useState(null);
572:   const [count, setCount] = useState(0);
573: 
574:   // Read data from URL params
575:   useEffect(() => {
576:     const params = new URLSearchParams(window.location.search);
577:     const dataParam = params.get('data');
578: 
579:     if (dataParam) {
580:       try {
581:         setData(JSON.parse(decodeURIComponent(dataParam)));
582:       } catch (err) {
583:         console.error('Failed to parse URL data:', err);
584:       }
585:     }
586:   }, []);
587: 
588:   // Send action to host via postMessage
589:   const handleCallTool = () => {
590:     window.parent.postMessage({
591:       type: 'tool',
592:       payload: {
593:         toolName: 'another_tool',
594:         params: { count }
595:       }
596:     }, '*');
597:   };
598: 
599:   return (
600:     <div className="p-4">
601:       <h1>My Widget</h1>
602:       <p>Tool output: {JSON.stringify(data)}</p>
603:       <button onClick={() => setCount(count + 1)}>Count: {count}</button>
604:       <button onClick={handleCallTool}>Call Another Tool</button>
605:     </div>
606:   );
607: }
608: 
609: // Mounting code - required at the bottom of each widget file
610: const rootElement = document.getElementById('my-widget-root');
611: if (rootElement) {
612:   createRoot(rootElement).render(
613:     <StrictMode>
614:       <MyWidget />
615:     </StrictMode>
616:   );
617: }
618: ```
619: 
620: ## Configuration
621: 
622: ### Environment Variables
623: 
624: Create `.env` file (see `.env.example`):
625: 
626: ```bash
627: # Server
628: NODE_ENV=development
629: PORT=8080
630: LOG_LEVEL=info          # fatal, error, warn, info, debug, trace
631: 
632: # Session Management
633: SESSION_MAX_AGE=3600000 # 1 hour in milliseconds
634: 
635: # CORS (development)
636: CORS_ORIGIN=*
637: 
638: # Asset Base URL (for CDN)
639: # BASE_URL=https://cdn.example.com/assets
640: ```
641: 
642: ### Critical Configuration Notes
643: 
644: 
