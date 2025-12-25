import { useEffect } from 'react';
import '../index.css';
import { Snowflakes } from '@/components/snowflakes';

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Auto-resize the iframe to fit content - observe only the container
    const container = document.body;
    if (container) {
      // Send initial size
      window.parent.postMessage(
        {
          type: 'ui-size-change',
          payload: { height: container.offsetHeight },
        },
        '*'
      );

      // Observe container only (not document which snowflakes affect)
      new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          window.parent.postMessage(
            {
              type: 'ui-size-change',
              payload: { height: entry.contentRect.height + 100 },
            },
            '*'
          );
        });
      }).observe(container);
    }
  }, []);

  return (
    <div
      className="p-8 relative rounded"
      style={{
        background:
          'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #e1f5fe 100%)',
      }}
    >
      <Snowflakes />
      {children}
    </div>
  );
}
