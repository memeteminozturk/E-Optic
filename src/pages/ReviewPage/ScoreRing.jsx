// Donut ring for the results hero. Segments are status-toned (good / bad / neutral)
// and separated by gaps in the surface color; the center slot holds the hero figure.
const ScoreRing = ({ segments, size = 220, thickness = 20, label, children }) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((acc, seg) => acc + seg.value, 0);
  const visible = segments.filter((seg) => seg.value > 0);
  const gap = visible.length > 1 ? 6 : 0;

  let traversed = 0;
  const arcs = visible.map((seg) => {
    const fullLength = (seg.value / total) * circumference;
    const arc = {
      ...seg,
      length: Math.max(fullLength - gap, 0),
      offset: traversed + gap / 2,
    };
    traversed += fullLength;
    return arc;
  });

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        <circle
          className="score-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
        />
        {total > 0 &&
          arcs.map((arc) => (
            <circle
              key={arc.tone}
              className={`score-ring-seg score-ring-seg--${arc.tone}`}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={thickness}
              strokeDasharray={`${arc.length} ${circumference - arc.length}`}
              strokeDashoffset={-arc.offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            >
              <title>{`${arc.label}: ${arc.value}`}</title>
            </circle>
          ))}
      </svg>
      <div className="score-ring-center">{children}</div>
    </div>
  );
};

export default ScoreRing;
