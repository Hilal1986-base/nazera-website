export function DiagonalDivider({ flip = false, color = '#F8F9FA' }: { flip?: boolean; color?: string }) {
  return (
    <div
      className={`w-full overflow-hidden ${flip ? 'rotate-180' : ''}`}
      style={{ lineHeight: 0 }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="w-full h-[50px] sm:h-[70px]"
      >
        <polygon
          points={flip ? '0,0 1440,0 1440,80 0,80' : '0,80 1440,0 1440,80'}
          fill={color}
        />
        {/* Silver accent line along the diagonal */}
        <line
          x1="0"
          y1={flip ? '0' : '80'}
          x2="1440"
          y2={flip ? '0' : '0'}
          stroke="url(#silverAccent)"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="silverAccent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7A869A" />
            <stop offset="50%" stopColor="#E0E5EC" />
            <stop offset="100%" stopColor="#7A869A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}