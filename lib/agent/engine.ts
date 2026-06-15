import type { SkillRun } from "@/lib/types";
import * as S from "./skills";

export type AgentReply =
  | { kind: "runs"; intro: string; runs: SkillRun[] }
  | { kind: "text"; text: string };

type Route = {
  match: RegExp;
  intro: string;
  build: (msg: string) => SkillRun[];
};

const ROUTES: Route[] = [
  {
    match: /\b(mission|end[- ]?to[- ]?end|full workflow|entire workflow|run it all|complete pipeline)\b/i,
    intro:
      "Running the full end-to-end mission. I'll triage, review, redline, check compliance, negotiate, then verify and assemble the package.",
    build: () => S.runMission(),
  },
  {
    match: /\b(triage|intake|prioriti\w*|new (contract|matter|agreement|request))\b/i,
    intro: "I'll triage and route this with the intake skill.",
    build: () => [S.runTriage()],
  },
  {
    match: /\b(review\w*|risk|analy\w*|assess\w*|inspect\w*|examine)\b/i,
    intro: "Running the contract-review skill now.",
    build: () => [S.runReview()],
  },
  {
    match: /\b(redline\w*|mark ?up|track changes|rewrite|draft changes|propose edits)\b/i,
    intro: "Drafting redlines from the playbook.",
    build: (msg) => [
      S.runRedline(/\bvendor|provider|supplier\b/i.test(msg) && !/\bcustomer\b/i.test(msg) ? "Vendor" : "Customer"),
    ],
  },
  {
    match: /\b(negotiat\w*|counter\w*|push ?back|fall ?back|concede)\b/i,
    intro: "Running the negotiation simulation against the playbook.",
    build: () => [S.runNegotiate()],
  },
  {
    match: /\b(comply|complian\w*|complie\w*|gdpr|dpa|regulat\w*|privacy|data protection|by[- ]design)\b/i,
    intro: "Running the compliance-by-design check.",
    build: () => [S.runComply()],
  },
  {
    match: /\b(research\w*|case ?law|enforceab\w*|precedent\w*|memo|authorit\w*|is .* (legal|enforceable|valid))\b/i,
    intro: "Researching the question against the knowledge base.",
    build: (msg) => [S.runResearch(msg)],
  },
  {
    match: /\b(diligence|data ?room|portfolio|across .* contracts|matrix|red flags?)\b/i,
    intro: "Running diligence across the data room.",
    build: () => [S.runDiligence()],
  },
  {
    match: /\b(obligation\w*|renewal\w*|deadline\w*|calendar|expir\w*|auto-?renew\w*|after sign|post[- ]sign|track\w*)\b/i,
    intro: "Extracting obligations and renewal dates.",
    build: () => [S.runTrack()],
  },
  {
    match: /\b(guardian|verif\w*|hallucinat\w*|double[- ]check|oversight|audit\w*)\b/i,
    intro: "Running the guardian over the last result.",
    build: () => [S.runGuardian()],
  },
];

export function route(message: string): AgentReply {
  const msg = message.trim();
  for (const r of ROUTES) {
    if (r.match.test(msg)) {
      return { kind: "runs", intro: r.intro, runs: r.build(msg) };
    }
  }
  return {
    kind: "text",
    text:
      "I'm the AI Legal Agents OS master agent. I run the whole legal workflow — try one of the jobs on the left, or ask me to:\n" +
      "• “triage the new SaaS agreement”\n" +
      "• “review it for risk”\n" +
      "• “redline it as the customer”\n" +
      "• “check it against GDPR”\n" +
      "• “negotiate the liability cap”\n" +
      "• or “run the full end-to-end mission”.",
  };
}

export const GREETING =
  "I'm the AI Legal Agents OS master agent. Bring me a contract, a request, or a question and I'll run it end to end — triage, review, redline, negotiate, comply, research, diligence and tracking. Pick a job to watch a skill execute.";
