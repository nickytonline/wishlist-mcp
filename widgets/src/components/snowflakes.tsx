import React from 'react';

const SNOWFLAKE_CHARS = ['❄', '❅', '❆', '✻', '✼', '❉', '✺'];

function randomSnowflake(i: number) {
  const left = Math.random() * 100; // vw
  const duration = 12 + Math.random() * 10; // 12s to 22s
  const delay = Math.random() * 8; // 0s to 8s
  const size = 2 + Math.random() * 2.5; // 2em to 4.5em
  const opacity = 0.7 + Math.random() * 0.3;
  const char =
    SNOWFLAKE_CHARS[Math.floor(Math.random() * SNOWFLAKE_CHARS.length)];
  return {
    key: `snowflake-${i}`,
    left,
    duration,
    delay,
    size,
    opacity,
    char,
  };
}

type SnowflakesProps = {
  count?: number;
};

export function Snowflakes({ count = 100 }: SnowflakesProps) {
  const snowflakes = React.useMemo(
    () => Array.from({ length: count }, (_, i) => randomSnowflake(i)),
    [count]
  );

  return (
    <div
      className="relative inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {snowflakes.map(({ key, left, duration, delay, size, opacity, char }) => (
        <span
          key={key}
          className="snowflake select-none"
          style={{
            left: `${left}%`,
            fontSize: `${size}em`,
            opacity,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            top: 0,
            position: 'absolute',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
