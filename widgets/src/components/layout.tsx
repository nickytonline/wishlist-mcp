import '../index.css';
import { Snowflakes } from '@/components/snowflakes';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4 relative"
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
