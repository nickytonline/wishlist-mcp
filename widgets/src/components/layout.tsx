import '../index.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen p-4 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #e1f5fe 100%)',
      }}
    >
      {/* Animated Snowflakes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="snowflake text-4xl left-[10%]"
          style={{ animationDelay: '0s', animationDuration: '15s' }}
        >
          ❄
        </div>
        <div
          className="snowflake text-3xl left-[20%]"
          style={{ animationDelay: '2s', animationDuration: '18s' }}
        >
          ❅
        </div>
        <div
          className="snowflake text-5xl left-[30%]"
          style={{ animationDelay: '4s', animationDuration: '20s' }}
        >
          ❆
        </div>
        <div
          className="snowflake text-3xl left-[40%]"
          style={{ animationDelay: '1s', animationDuration: '16s' }}
        >
          ✻
        </div>
        <div
          className="snowflake text-4xl left-[50%]"
          style={{ animationDelay: '3s', animationDuration: '19s' }}
        >
          ❄
        </div>
        <div
          className="snowflake text-3xl left-[60%]"
          style={{ animationDelay: '5s', animationDuration: '17s' }}
        >
          ❅
        </div>
        <div
          className="snowflake text-4xl left-[70%]"
          style={{ animationDelay: '2.5s', animationDuration: '21s' }}
        >
          ✼
        </div>
        <div
          className="snowflake text-3xl left-[80%]"
          style={{ animationDelay: '4.5s', animationDuration: '18s' }}
        >
          ❉
        </div>
        <div
          className="snowflake text-5xl left-[90%]"
          style={{ animationDelay: '1.5s', animationDuration: '22s' }}
        >
          ❆
        </div>
        <div
          className="snowflake text-4xl left-[15%]"
          style={{ animationDelay: '3.5s', animationDuration: '19s' }}
        >
          ✺
        </div>
        {children}
      </div>
    </div>
  );
}
