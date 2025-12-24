import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EchoMarquee } from '../echo-marquee/EchoMarquee';
import { useToolOutput } from '../hooks/use-tool-output';
import { useMcpActions } from '../hooks/use-mcp-actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { EchoToolOutput } from 'chatgpt-app-server/types';
import '../index.css';

/**
 * Echo Marquee Widget - MCP-UI
 *
 * Receives data via URL query params (?data=...)
 * Sends actions via postMessage to MCP host
 */
export default function App() {
  const toolOutput = useToolOutput<EchoToolOutput>();
  const { sendToolCall } = useMcpActions();

  const message = toolOutput?.echoedMessage || 'No message yet';
  const timestamp = toolOutput?.timestamp;

  /**
   * Call echo tool again via postMessage
   */
  const handleCallEcho = () => {
    sendToolCall('echo', {
      message: `Re-echoing: ${message}`,
    });
  };

  return (
    <div className="min-h-screen p-4 bg-background">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Echo Marquee</CardTitle>
          <CardDescription>
            Scrolling message display powered by MCP-UI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EchoMarquee message={message} />

          {timestamp && (
            <p className="text-sm text-muted-foreground text-center">
              Echoed at: {new Date(timestamp).toLocaleString()}
            </p>
          )}

          <Button
            onClick={handleCallEcho}
            className="w-full"
          >
            Call Echo Tool Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Mount widget
const rootElement = document.getElementById('echo-marquee-root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
