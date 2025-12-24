import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WishCategory, WishPriority } from '@/types/wish';

export interface StoredWish {
  id: string;
  wish: string;
  category: WishCategory;
  priority: WishPriority;
  timestamp: string;
  granted?: boolean;
  grantedAt?: string;
}

export interface WishListData {
  wishes?: StoredWish[];
  [key: string]: unknown;
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

// Glow intensity based on priority
const priorityGlow: Record<WishPriority, string> = {
  'dream wish':
    '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5)',
  'hopeful wish': '0 0 12px rgba(186, 104, 200, 0.5)',
  'small wish': '0 0 8px rgba(79, 195, 247, 0.3)',
};

const priorityBorderColor: Record<WishPriority, string> = {
  'dream wish': 'rgba(255, 215, 0, 0.6)',
  'hopeful wish': 'rgba(186, 104, 200, 0.4)',
  'small wish': 'rgba(79, 195, 247, 0.3)',
};

export interface WishListProps {
  data?: WishListData;
}

/**
 * Wish List Component
 *
 * Displays all wishes in a magical, scrollable list
 * Dream wishes glow brighter!
 */
export function WishList({ data }: WishListProps) {
  const wishes = data?.wishes || [];

  return (
    <Card
      className="max-w-4xl mx-auto border-2 shadow-2xl relative"
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
          ✨ YOUR WISHBOX ✨
        </CardTitle>
        <p
          className="text-sm mt-2"
          style={{
            color: '#0277bd',
            opacity: 0.8,
          }}
        >
          {wishes.length === 0
            ? 'Your wishbox is empty. Make a wish!'
            : `${wishes.length} magical wish${wishes.length !== 1 ? 'es' : ''}`}
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        {wishes.length === 0 ? (
          <div
            className="text-center py-12"
            style={{
              color: '#0277bd',
              opacity: 0.6,
            }}
          >
            <p className="text-xl mb-2">🌟</p>
            <p className="text-lg">No wishes yet...</p>
            <p className="text-sm mt-2">Ask goose to make a wish for you!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {wishes.map((wish) => (
              <Card
                key={wish.id}
                className={`border-2 transition-all hover:scale-[1.02] ${wish.granted ? 'animate-pulse' : ''}`}
                style={{
                  borderColor: wish.granted
                    ? 'rgba(255, 215, 0, 0.8)'
                    : priorityBorderColor[wish.priority],
                  background: wish.granted
                    ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 255, 255, 0.9))'
                    : 'rgba(255, 255, 255, 0.9)',
                  boxShadow: wish.granted
                    ? '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)'
                    : priorityGlow[wish.priority],
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-3xl ${wish.granted ? 'animate-pulse' : ''}`}
                      style={{
                        filter: wish.granted
                          ? 'drop-shadow(0 0 16px rgba(255, 215, 0, 1))'
                          : wish.priority === 'dream wish'
                            ? 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))'
                            : 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))',
                      }}
                    >
                      {wish.granted ? '⭐' : categoryEmojis[wish.category]}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <p
                          className="text-lg font-medium flex-1"
                          style={{
                            color: '#1a1a2e',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {wish.wish}
                        </p>
                        {wish.granted && (
                          <span
                            className="text-xs font-bold px-2 py-1 rounded animate-pulse"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.15))',
                              color: '#d4af37',
                              border: '1px solid rgba(255, 215, 0, 0.5)',
                            }}
                          >
                            ✨ GRANTED
                          </span>
                        )}
                      </div>
                      <div
                        className="flex flex-wrap gap-4 text-sm"
                        style={{ color: '#0f3460' }}
                      >
                        <span className="font-medium">
                          Category:{' '}
                          <span className="text-winter-ice-blue capitalize">
                            {wish.category}
                          </span>
                        </span>
                        <span className="font-medium inline-flex items-center gap-1">
                          Priority:{' '}
                          <span
                            className={`text-winter-soft-purple inline-flex items-center gap-1 ${
                              wish.priority === 'dream wish'
                                ? 'animate-pulse'
                                : ''
                            }`}
                          >
                            <span className="inline-block">
                              {priorityEmojis[wish.priority]}
                            </span>{' '}
                            {wish.priority}
                          </span>
                        </span>
                        {wish.granted && wish.grantedAt ? (
                          <span
                            className="text-xs font-medium"
                            style={{ color: '#d4af37' }}
                          >
                            🎉 Granted:{' '}
                            {new Date(wish.grantedAt).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-xs" style={{ opacity: 0.7 }}>
                            Wished: {new Date(wish.timestamp).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
