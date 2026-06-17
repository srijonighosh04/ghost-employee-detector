export function Avatar({
  initials,
  color,
  size = 36,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-mono font-medium"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        color: "#06091A",
        background: `linear-gradient(145deg, ${color}, ${color}CC)`,
      }}
    >
      {initials}
    </div>
  );
}
