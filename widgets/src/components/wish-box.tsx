import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout';

type WishCategory = 'toy' | 'experience' | 'kindness' | 'magic';
type WishPriority = 'dream wish' | 'hopeful wish' | 'small wish';

export interface WishData {
  wish?: string;
  category?: WishCategory;
  priority?: WishPriority;
  timestamp?: string;
  granted?: boolean;
  grantedAt?: string;
  [key: string]: string | boolean | undefined;
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

export interface WishBoxProps {
  data?: WishData;
}

/**
 * Wish Box Component
 *
 * Displays a single wish with category, priority, and grant status
 */
export function WishBox({ data }: WishBoxProps) {
  const wish = data?.wish;
  const category: WishCategory = data?.category || 'magic';
  const priority: WishPriority = data?.priority || 'hopeful wish';
  const timestamp = data?.timestamp as string | undefined;
  const granted = data?.granted || false;
  const grantedAt = data?.grantedAt as string | undefined;

  return (
    <Layout>
      <Card
        className="max-w-2xl mx-auto border-2 shadow-2xl relative"
        style={{
          borderColor: granted
            ? 'rgba(255, 215, 0, 0.8)'
            : 'rgba(79, 195, 247, 0.4)',
          background: granted
            ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 255, 255, 0.95))'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: granted
            ? '0 8px 32px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 215, 0, 0.3), 0 0 120px rgba(255, 215, 0, 0.2)'
            : '0 8px 32px rgba(79, 195, 247, 0.2), 0 0 60px rgba(186, 104, 200, 0.1)',
        }}
      >
        <CardHeader
          className="text-center border-b-2 relative"
          style={{
            borderColor: granted
              ? 'rgba(255, 215, 0, 0.6)'
              : 'rgba(79, 195, 247, 0.3)',
            background: granted
              ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.15))'
              : 'linear-gradient(135deg, rgba(79, 195, 247, 0.15), rgba(186, 104, 200, 0.15))',
          }}
        >
          <CardTitle
            className={`text-3xl font-bold ${granted ? 'animate-pulse' : ''}`}
            style={{
              color: granted ? '#d4af37' : '#0277bd',
              textShadow: granted
                ? '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)'
                : '0 0 20px rgba(79, 195, 247, 0.6)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {granted
              ? '🌟✨ WISH GRANTED! ✨🌟'
              : '✨ WINTER FAIRY\'S WISHBOX ✨'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-start gap-3">
            <span
              className={`text-3xl ${granted ? 'animate-pulse' : ''}`}
              style={{
                filter: granted
                  ? 'drop-shadow(0 0 16px rgba(255, 215, 0, 1))'
                  : 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
              }}
            >
              {granted ? '⭐' : categoryEmojis[category]}
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

          {granted && grantedAt && (
            <div
              className="text-center pt-3 space-y-1"
              style={{
                color: '#d4af37',
                fontWeight: 'bold',
              }}
            >
              <p className="text-lg animate-pulse">
                🎉 Granted by the Winter Fairy! 🎉
              </p>
              <p className="text-sm" style={{ opacity: 0.8 }}>
                Granted at: {new Date(grantedAt).toLocaleString()}
              </p>
            </div>
          )}

          {!granted && timestamp && (
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
