/** Section separator — "sparkle" variant (default from the mockup). */
function Star({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2 l2.2 7.8 L22 12 l-7.8 2.2 L12 22 l-2.2-7.8 L2 12 l7.8-2.2 Z"
        fill={color}
      />
    </svg>
  );
}

export function Divider() {
  return (
    <div className="mx-auto max-w-container px-6 py-[46px]">
      <div className="flex items-center justify-center gap-[18px]">
        <span
          className="h-0.5 max-w-[200px] flex-1"
          style={{
            background: "linear-gradient(90deg,transparent,#FEC9D3)",
          }}
        />
        <Star size={16} color="#FEC9D3" />
        <Star size={28} color="#B15272" />
        <Star size={16} color="#FEC9D3" />
        <span
          className="h-0.5 max-w-[200px] flex-1"
          style={{
            background: "linear-gradient(90deg,#FEC9D3,transparent)",
          }}
        />
      </div>
    </div>
  );
}
