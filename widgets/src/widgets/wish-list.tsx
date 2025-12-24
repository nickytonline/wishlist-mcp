import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useToolOutput } from '../hooks/use-tool-output';
import { WishList, type WishListData } from '@/components/wish-list';

/**
 * Wish List Widget - MCP-UI
 *
 * Displays all wishes in a magical, scrollable list
 * Dream wishes glow brighter!
 */
export default function App() {
  const toolOutput = useToolOutput<WishListData>();

  return <WishList data={toolOutput || undefined} />;
}

// Mount widget
const rootElement = document.getElementById('wish-list-root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
