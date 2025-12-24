import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useToolOutput } from '../hooks/use-tool-output';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout';

type WishCategory = 'toy' | 'experience' | 'kindness' | 'magic';
type WishPriority = 'dream wish' | 'hopeful wish' | 'small wish';

export interface WishData {
  wish?: string;
  category?: WishCategory;
  priority?: WishPriority;
  timestamp?: string;
  [key: string]: string | undefined;
}

const categoryEmojis: Record<WishCategory, string> = {
  toy: '🎁',
  experience: '✨',
  kindness: '💝',
  magic: '🌟',
};

const priorityEmojis: Record<WishPriority, string> = {
  'dream wish': '💫',
  'hopeful wish': '⏳',
  'small wish': '🌙',
};

/**
 * Wish Box Widget - MCP-UI
 *
 * Receives data via URL query params (?data=...)
 * Sends actions via postMessage to MCP host
 */
export default function App() {
  const toolOutput = useToolOutput<WishData>();
  const wish = toolOutput?.wish;
  const category: WishCategory = toolOutput?.category || 'magic';
  const priority: WishPriority = toolOutput?.priority || 'hopeful wish';
  const timestamp = toolOutput?.timestamp as string | undefined;

  return (
    <Layout>
      <Card
        className="max-w-2xl mx-auto border-2 shadow-2xl relative"
        style={{
          borderColor: 'rgba(79, 195, 247, 0.4)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow:
            '0 8px 32px rgba(79, 195, 247, 0.2), 0 0 60px rgba(186, 104, 200, 0.1)',
        }}
      >
        <CardHeader
          className="text-center border-b-2 relative"
          style={{
            borderColor: 'rgba(79, 195, 247, 0.3)',
            background:
              'linear-gradient(135deg, rgba(79, 195, 247, 0.15), rgba(186, 104, 200, 0.15))',
          }}
        >
          <CardTitle
            className="text-3xl font-bold"
            style={{
              color: '#0277bd',
              textShadow: '0 0 20px rgba(79, 195, 247, 0.6)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            ✨ WINTER FAIRY&apos;S WISHBOX ✨
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-start gap-3">
            <span
              className="text-3xl"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
              }}
            >
              {categoryEmojis[category]}
            </span>
            <div className="flex-1">
              <p
                className="text-xl font-medium"
                style={{
                  color: '#1a1a2e',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {wish}
              </p>
            </div>
          </div>

          <div
            className="pl-11 space-y-2 text-base"
            style={{ color: '#0f3460' }}
          >
            <p className="font-medium">
              Category:{' '}
              <span className="text-winter-ice-blue capitalize">
                {category}
              </span>
            </p>
            <p className="font-medium">
              Priority:{' '}
              <span className="text-winter-soft-purple inline-flex items-center gap-1">
                <span className="inline-block animate-pulse">
                  {priorityEmojis[priority]}
                </span>{' '}
                {priority}
              </span>
            </p>
          </div>

          {timestamp && (
            <p
              className="text-sm text-center pt-3"
              style={{
                color: '#0277bd',
                opacity: 0.7,
              }}
            >
              Wished at: {new Date(timestamp).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
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
