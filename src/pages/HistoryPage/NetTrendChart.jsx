import { useEffect, useMemo, useRef, useState } from "react";

/* Tek serili net gelişim grafiği. Renk yalnızca seriyi taşır (vurgu rengi her
   iki temanın yüzeyine karşı doğrulandı, kontrast ≥ 3:1); değerler uç etiketi,
   araç ipucu ve alttaki kayıt listesiyle renk olmadan da okunur. */

const HEIGHT = 260;
const MARGIN = { top: 20, right: 68, bottom: 32, left: 48 };

const fmtNet = (n) => n.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

const fmtShortDate = (iso) =>
  new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });

const fmtLongDate = (iso) =>
  new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Temiz sayılarda (1-2-5 adımları) eksen çizgileri üretir
const ticksFor = (min, max) => {
  const rawStep = Math.max(1e-6, (max - min) / 4);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const norm = rawStep / magnitude;
  const step = (norm > 5 ? 10 : norm > 2 ? 5 : norm > 1 ? 2 : 1) * magnitude;
  const ticks = [];
  let t = Math.floor(min / step) * step;
  for (;;) {
    ticks.push(Math.round(t * 100) / 100);
    if (t >= max - 1e-9) break;
    t += step;
  }
  return ticks;
};

const NetTrendChart = ({ records }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [hoverIdx, setHoverIdx] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver((entries) =>
      setWidth(entries[0].contentRect.width)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { points, ticks, yMin, yMax } = useMemo(() => {
    const nets = records.map((r) => r.net);
    let lo = Math.min(0, Math.floor(Math.min(...nets)));
    let hi = Math.ceil(Math.max(...nets));
    if (hi <= lo) hi = lo + 1;
    const tickList = ticksFor(lo, hi);
    lo = tickList[0];
    hi = tickList[tickList.length - 1];

    const plotW = Math.max(0, width - MARGIN.left - MARGIN.right);
    const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
    const pts = records.map((record, i) => ({
      x:
        MARGIN.left +
        (records.length === 1 ? plotW / 2 : (i / (records.length - 1)) * plotW),
      y: MARGIN.top + plotH - ((record.net - lo) / (hi - lo)) * plotH,
      record,
    }));
    return { points: pts, ticks: tickList, yMin: lo, yMax: hi };
  }, [records, width]);

  const nearestIndex = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let best = 0;
    points.forEach((p, i) => {
      if (Math.abs(p.x - x) < Math.abs(points[best].x - x)) best = i;
    });
    return best;
  };

  const handleKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setHoverIdx((prev) => {
      if (prev === null) return points.length - 1;
      const next = prev + (e.key === "ArrowRight" ? 1 : -1);
      return Math.min(points.length - 1, Math.max(0, next));
    });
  };

  // Etiket çakışmasın diye x ekseninde en fazla ~6 tarih gösterilir
  const labelEvery = Math.ceil(points.length / 6);
  const showXLabel = (i) =>
    i === points.length - 1 ||
    (i % labelEvery === 0 && points.length - 1 - i >= labelEvery);

  const hovered = hoverIdx !== null ? points[hoverIdx] : null;
  const last = points[points.length - 1];
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  const latest = records[records.length - 1];
  const first = records[0];

  return (
    <div
      ref={containerRef}
      className="hs-chart"
      tabIndex={0}
      role="group"
      aria-label={`Net gelişimi: ${records.length} sınav, ilk net ${fmtNet(
        first.net
      )}, son net ${fmtNet(latest.net)}. Değerler aşağıdaki listede.`}
      onKeyDown={handleKeyDown}
      onBlur={() => setHoverIdx(null)}
    >
      {width > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          className="hs-chart-svg"
          aria-hidden="true"
          onPointerMove={(e) => setHoverIdx(nearestIndex(e.clientX))}
          onPointerLeave={() => setHoverIdx(null)}
        >
          {ticks.map((t) => {
            const y =
              MARGIN.top +
              (HEIGHT - MARGIN.top - MARGIN.bottom) *
                (1 - (t - yMin) / (yMax - yMin));
            return (
              <g key={t}>
                <line
                  x1={MARGIN.left}
                  x2={width - MARGIN.right}
                  y1={y}
                  y2={y}
                  className="hs-grid"
                />
                <text
                  x={MARGIN.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="hs-tick"
                >
                  {fmtNet(t)}
                </text>
              </g>
            );
          })}

          {points.map(
            (p, i) =>
              showXLabel(i) && (
                <text
                  key={p.record.id}
                  x={p.x}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                  className="hs-tick"
                >
                  {fmtShortDate(p.record.date)}
                </text>
              )
          )}

          {hovered && (
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={MARGIN.top}
              y2={HEIGHT - MARGIN.bottom}
              className="hs-crosshair"
            />
          )}

          <path d={pathD} className="hs-line" />

          {points.map((p, i) => (
            <circle
              key={p.record.id}
              cx={p.x}
              cy={p.y}
              r={i === hoverIdx ? 6 : 4.5}
              className="hs-dot"
            />
          ))}

          <text
            x={last.x + 12}
            y={last.y + 4}
            className="hs-endlabel"
          >
            {fmtNet(latest.net)} net
          </text>
        </svg>
      )}

      {hovered && (
        <div
          className="hs-tooltip"
          style={{
            left: Math.min(Math.max(hovered.x, 80), width - 80),
            top: hovered.y,
          }}
        >
          <span className="hs-tooltip-value">
            {fmtNet(hovered.record.net)} net
          </span>
          <span className="hs-tooltip-label">
            {fmtLongDate(hovered.record.date)} · %{hovered.record.score} başarı
          </span>
        </div>
      )}
    </div>
  );
};

export default NetTrendChart;
