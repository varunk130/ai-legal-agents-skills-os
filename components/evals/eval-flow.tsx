type NodeProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  variant?: "default" | "accent" | "data";
};

function EvalNode({ x, y, w, h, title, sub, variant = "default" }: NodeProps) {
  const rectCls =
    variant === "accent"
      ? "fill-[var(--accent)] stroke-[var(--accent-2)]"
      : variant === "data"
        ? "fill-[var(--surface-2)] stroke-[var(--accent-2)]"
        : "fill-[var(--surface)] stroke-[var(--accent-2)]";
  const titleCls = variant === "accent" ? "fill-[#fbf7ec]" : "fill-[var(--text)]";
  const subCls = variant === "accent" ? "fill-[#efdcb6]" : "fill-[var(--text-soft)]";
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={11}
        strokeWidth={1.4}
        className={rectCls}
      />
      <text
        x={cx}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 5}
        textAnchor="middle"
        fontSize={13.5}
        fontWeight={600}
        className={titleCls}
      >
        {title}
      </text>
      {sub && (
        <text
          x={cx}
          y={y + h / 2 + 14}
          textAnchor="middle"
          fontSize={10}
          className={subCls}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

const LINE = "stroke-[var(--accent-2)]";

export function EvalFlow() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-soft bg-surface/50 p-4">
      <svg
        viewBox="0 0 980 250"
        role="img"
        aria-label="Evaluation pipeline flow diagram"
        className="w-full"
        style={{ minWidth: 720 }}
      >
        <defs>
          <marker
            id="evarrow"
            markerWidth="9"
            markerHeight="9"
            refX="7"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L7,3 L0,6 Z" className="fill-[var(--accent-2)]" />
          </marker>
        </defs>

        {/* Pipeline */}
        <EvalNode x={20} y={70} w={140} h={64} title="Test set" sub="20 golden prompts" />
        <EvalNode x={180} y={70} w={140} h={64} title="Run agent" sub="capture output" />
        <EvalNode x={340} y={70} w={160} h={64} title="LLM-as-judge" sub="score 6 dimensions" variant="accent" />
        <EvalNode x={520} y={70} w={140} h={64} title="Aggregate" sub="per-dimension + overall" />
        <EvalNode x={680} y={70} w={130} h={64} title="Threshold" sub="pass ≥ 4.0 / 5" />
        <EvalNode x={830} y={70} w={130} h={64} title="Report" sub="scores · verdicts" />

        {[
          [160, 178],
          [320, 338],
          [500, 518],
          [660, 678],
          [810, 828],
        ].map(([x1, x2]) => (
          <line
            key={x1}
            x1={x1}
            y1={102}
            x2={x2}
            y2={102}
            strokeWidth={1.8}
            className={LINE}
            markerEnd="url(#evarrow)"
          />
        ))}

        {/* Golden answers feed the judge */}
        <line
          x1={420}
          y1={170}
          x2={420}
          y2={136}
          strokeWidth={1.8}
          className={LINE}
          markerEnd="url(#evarrow)"
        />
        <EvalNode
          x={340}
          y={172}
          w={160}
          h={44}
          title="Golden answers"
          sub="reference dataset"
          variant="data"
        />

        <text
          x={250}
          y={232}
          textAnchor="middle"
          fontSize={10}
          className="fill-[var(--text-soft)]"
        >
          deterministic · reproducible
        </text>
      </svg>
    </div>
  );
}
