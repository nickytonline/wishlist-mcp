import { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EchoMarquee } from '../echo-marquee/EchoMarquee';
import { useOpenAiGlobal } from '../hooks/use-openai-global';
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
 * Echo Marquee Widget - MCP-UI Compatible
 *
 * Supports both:
 * 1. MCP-UI: Data via URL query params
 * 2. ChatGPT App: Data via window.openai (backward compatible)
 */
export default function App() {
  const [urlData, setUrlData] = useState<EchoToolOutput | null>(null);
  
  // Try to get data from window.openai (ChatGPT App SDK)
  const toolOutput = useOpenAiGlobal<EchoToolOutput>('toolOutput');
  const theme = useOpenAiGlobal('theme');
  const displayMode = useOpenAiGlobal('displayMode');

  // On mount, check URL params for MCP-UI data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setUrlData(parsed);
      } catch (err) {
        console.error('Failed to parse URL data:', err);
      }
    }
  }, []);

  // Use URL data if available, otherwise fallback to window.openai
  const data = urlData || toolOutput;
  const message = data?.echoedMessage || 'No message yet';
  const timestamp = data?.timestamp;

  const [callResult, setCallResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Call tool - works with window.openai if available
   */
  const handleCallEcho = async () => {
    if (!window.openai?.callTool) {
      setCallResult('callTool not available in this environment');
      return;
    }

    setIsLoading(true);
    setCallResult(null);

    try {
      const result = await window.openai.callTool('echo', {
        message: `Re-echoing: ${message}`,
      });

      const text = result?.content?.[0]?.text || 'Success!';
      setCallResult(text);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setCallResult(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-background">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Echo Marquee</CardTitle>
          <CardDescription>
            Scrolling message display
            {theme && ` • Theme: ${theme}`}
            {displayMode && ` • Mode: ${displayMode}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EchoMarquee message={message} />
          
          {timestamp && (
            <p className="text-sm text-muted-foreground text-center">
              Echoed at: {new Date(timestamp).toLocaleString()}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleCallEcho}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Calling...' : 'Call Echo Tool Again'}
            </Button>

            {callResult && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm">{callResult}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Data source: {urlData ? 'URL params (MCP-UI)' : toolOutput ? 'window.openai (ChatGPT)' : 'None'}</p>
            {urlData && <p className="mt-1">✅ MCP-UI compatible mode</p>}
          </div>
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
