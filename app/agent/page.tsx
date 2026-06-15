import type { Metadata } from "next";
import { AgentConsole } from "@/components/agent/agent-console";

export const metadata: Metadata = {
  title: "Master Agent — AI Legal Agents OS",
  description:
    "A single conversational AI agent that runs every legal job end to end and shows its skills executing.",
};

export default function AgentPage() {
  return (
    <div>
      <div className="mx-auto w-full max-w-7xl px-5 pt-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-text-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
          Conversational agent · runs skills live
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-text">
          The master agent
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-soft">
          One agent, every job. Ask in plain language or pick a job — the agent
          plans, runs the right specialist skill, streams its console, and
          produces a verified artifact. Like an M365 Copilot agent, for legal
          work.
        </p>
      </div>
      <AgentConsole />
    </div>
  );
}
