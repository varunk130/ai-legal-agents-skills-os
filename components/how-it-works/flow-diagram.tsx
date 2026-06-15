type NodeProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  variant?: "default" | "accent" | "bus" | "data";
};

function FlowNode({ x, y, w, h, title, sub, variant = "default" }: NodeProps) {
  const rectCls =
    variant === "accent"
      ? "fill-[var(--accent)] stroke-[var(--accent-2)]"
      : variant === "bus"
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
        fontSize={14.5}
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
          fontSize={10.5}
          className={subCls}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

const LINE = "stroke-[var(--accent-2)]";

export function FlowDiagram() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-soft bg-surface/50 p-4">
      <svg
        viewBox="0 0 980 440"
        role="img"
        aria-label="AI Legal Agents OS architecture flow diagram"
        className="w-full"
        style={{ minWidth: 720 }}
      >
        <defs>
          <marker
            id="arrow"
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

        {/* Feedback loop (over the top) */}
        <path
          d="M 870 44 V 22 H 100 V 42"
          fill="none"
          strokeWidth={1.6}
          strokeDasharray="5 4"
          className={LINE}
          markerEnd="url(#arrow)"
        />
        <text
          x={486}
          y={17}
          textAnchor="middle"
          fontSize={10.5}
          className="fill-[var(--text-soft)]"
        >
          verified result returned to the user
        </text>

        {/* Top lane: control flow */}
        <FlowNode x={24} y={44} w={152} h={60} title="Channels" sub="chat · Copilot · intake" />
        <FlowNode x={208} y={44} w={176} h={60} title="Master Agent" sub="planner · router" variant="accent" />
        <FlowNode x={416} y={44} w={152} h={60} title="Skills" sub="9 specialists" />
        <FlowNode x={600} y={44} w={152} h={60} title="Guardian" sub="AI-to-AI oversight" />
        <FlowNode x={784} y={44} w={172} h={60} title="Verified artifact" sub="+ audit trail" />

        {/* Top lane arrows */}
        {[
          [176, 206],
          [384, 414],
          [568, 598],
          [752, 782],
        ].map(([x1, x2]) => (
          <line
            key={x1}
            x1={x1}
            y1={74}
            x2={x2}
            y2={74}
            strokeWidth={1.8}
            className={LINE}
            markerEnd="url(#arrow)"
          />
        ))}

        {/* Down into the MCP bus */}
        {[296, 492, 676].map((x) => (
          <line
            key={x}
            x1={x}
            y1={104}
            x2={x}
            y2={213}
            strokeWidth={1.8}
            className={LINE}
            markerEnd="url(#arrow)"
          />
        ))}

        {/* MCP bus */}
        <FlowNode
          x={208}
          y={216}
          w={544}
          h={46}
          title="MCP Connector Bus"
          sub="tools · auth & scopes · audit logging"
          variant="bus"
        />

        {/* Bus down to data plane */}
        {[294, 488, 680].map((x) => (
          <line
            key={x}
            x1={x}
            y1={262}
            x2={x}
            y2={321}
            strokeWidth={1.8}
            className={LINE}
            markerEnd="url(#arrow)"
          />
        ))}

        {/* Data / model plane */}
        <FlowNode x={216} y={324} w={156} h={60} title="Retrieval · RAG" sub="semantic + keyword" variant="data" />
        <FlowNode x={400} y={324} w={176} h={60} title="Data sources" sub="case law · regs · CLM" variant="data" />
        <FlowNode x={604} y={324} w={152} h={60} title="Model · Claude" sub="reasoning + drafting" variant="data" />

        {/* Caption */}
        <text
          x={486}
          y={416}
          textAnchor="middle"
          fontSize={10.5}
          className="fill-[var(--text-soft)]"
        >
          Connectors: Contract Repository (CLM) · Legal Research · Regulatory Rule-Packs · Vector Store · E-signature · Calendar
        </text>
      </svg>
    </div>
  );
}
