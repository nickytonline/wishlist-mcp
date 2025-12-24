import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useToolOutput } from '../hooks/use-tool-output';
import { WishBox, type WishData } from '@/components/wish-box';

/**
 * Wish Box Widget - MCP-UI
 *
 * Receives data via URL query params (?data=...)
 * Sends actions via postMessage to MCP host
 */
export default function App() {
  const toolOutput = useToolOutput<WishData>();

  return <WishBox data={toolOutput || undefined} />;
}

// Mount widget
const rootElement = document.getElementById('wish-box-root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
