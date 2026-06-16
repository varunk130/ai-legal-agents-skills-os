import type { Artifact } from "@/lib/types";

export type Priority = "now" | "soon" | "optional";

export type RecAction = {
  action: string;
  where: string;
  target: string;
  priority: Priority;
};

export type Guidance = {
  recommendations: RecAction[];
  nextSteps: string[];
};

const TYPE_ACTION: Record<string, string> = {
  renewal: "Serve a renewal / non-renewal notice",
  payment: "Release the payment",
  report: "Request and file the report",
  termination: "Decide: renew vs. terminate",
};

export function guidanceFor(artifact: Artifact): Guidance {
  switch (artifact.type) {
    case "matter": {
      const recommendations: RecAction[] = [
        {
          action: "Escalate the first-pass exposure to the deal owner",
          where: `${artifact.matterId} · intake note`,
          target: artifact.firstPassRisk,
          priority: "now",
        },
        ...artifact.route.map((r) => ({
          action: `Dispatch the ${r} skill`,
          where: "Workflow queue",
          target: "Return findings within SLA",
          priority: "now" as Priority,
        })),
      ];
      return {
        recommendations,
        nextSteps: [
          "Run a full risk review of the agreement.",
          "Run the compliance-by-design check (GDPR / DPA).",
          "Draft the customer-side redline from the playbook.",
          "Share the triage summary with the business owner and set a negotiation date.",
        ],
      };
    }

    case "review": {
      const recommendations: RecAction[] = artifact.benchmark
        .filter((b) => b.status !== "pass")
        .map((b) => ({
          action: b.status === "fail" ? "Replace this clause" : "Tighten this clause",
          where: b.clause,
          target: b.market,
          priority: (b.status === "fail" ? "now" : "soon") as Priority,
        }));
      if (recommendations.length === 0) {
        recommendations.push({
          action: "Confirm the terms are acceptable",
          where: artifact.document,
          target: "Proceed to signature",
          priority: "optional",
        });
      }
      const blockers = artifact.distribution.critical + artifact.distribution.high;
      return {
        recommendations,
        nextSteps: [
          "Approve the clause changes above with the deal owner.",
          "Generate a customer-side redline that auto-fills these positions.",
          "Run the compliance check and attach a GDPR DPA if personal data is processed.",
          "Send the redline with a cover note and open negotiation.",
          blockers > 0
            ? `Do not sign until the ${blockers} critical/high issue(s) are resolved.`
            : "Proceed once the open items are agreed.",
        ],
      };
    }

    case "redline": {
      const recommendations: RecAction[] = artifact.items
        .filter((i) => i.severity !== "low")
        .slice(0, 6)
        .map((i) => ({
          action: "Send the tracked change",
          where: i.clause,
          target: i.replacement,
          priority: (i.severity === "critical" || i.severity === "high"
            ? "now"
            : "soon") as Priority,
        }));
      return {
        recommendations,
        nextSteps: [
          `Share the redlined ${artifact.document} with the counterparty.`,
          "Hold the preferred positions; use the fallback ladder only on pushback.",
          "Log every concession to the audit trail.",
          "Re-run the guardian before signature.",
        ],
      };
    }

    case "negotiation": {
      const settled = artifact.rounds[artifact.rounds.length - 1]?.movedTo ?? artifact.outcome;
      return {
        recommendations: [
          {
            action: "Confirm the settlement with the deal owner",
            where: artifact.clause,
            target: settled,
            priority: "now",
          },
          {
            action: "Hold the line if the clause is reopened",
            where: artifact.clause,
            target: `Never accept: ${artifact.walkAway}`,
            priority: "now",
          },
        ],
        nextSteps: [
          "Update the contract with the agreed position.",
          "Record the concession in the negotiation log / audit trail.",
          "Move the remaining open clauses (indemnity, DPA) to the next round.",
          "Re-run the guardian, then route for signature.",
        ],
      };
    }

    case "compliance": {
      const recommendations: RecAction[] = artifact.checks
        .filter((c) => c.status !== "pass")
        .map((c) => ({
          action: c.remedy ?? "Remediate this requirement",
          where: c.ref,
          target: `Pass ${c.ref}`,
          priority: (c.status === "fail" ? "now" : "soon") as Priority,
        }));
      const fails = artifact.checks.filter((c) => c.status === "fail").length;
      return {
        recommendations,
        nextSteps: [
          "Insert the DPA exhibit and Standard Contractual Clauses before signature.",
          "Re-run the compliance check to confirm the score rises.",
          "Have the privacy lead / DPO sign off on the derived-data position.",
          fails > 0
            ? `Block signature until the ${fails} failing rule(s) pass.`
            : "Proceed once the warnings are reviewed.",
        ],
      };
    }

    case "memo": {
      const recommendations: RecAction[] = [
        {
          action: "Use these authorities to justify the redline",
          where: "Liability & indemnity rationale",
          target: artifact.citations[0]?.source ?? "the cited authority",
          priority: "soon",
        },
        {
          action: "Verify the counterparty's public exposure",
          where: "Counterparty due diligence",
          target: "Review SEC EDGAR filings & risk factors",
          priority: "soon",
        },
      ];
      if (artifact.confidence === "Low") {
        recommendations.push({
          action: "Escalate to senior counsel",
          where: "Low-confidence answer",
          target: "Obtain primary-source confirmation before relying on it",
          priority: "now",
        });
      }
      return {
        recommendations,
        nextSteps: [
          "Attach the citations to the negotiation cover note.",
          "Apply the memo's reasoning to the relevant redlines.",
          artifact.confidence === "Low"
            ? "Confirm with primary sources before relying on it."
            : "Proceed with the cited position.",
        ],
      };
    }

    case "diligence": {
      const recommendations: RecAction[] = artifact.rows
        .filter((r) => r.flag !== "green")
        .slice(0, 6)
        .map((r) => ({
          action: r.flag === "red" ? "Block signing and remediate" : "Request an amendment",
          where: r.contract,
          target: "Bring the flagged terms to market standard",
          priority: (r.flag === "red" ? "now" : "soon") as Priority,
        }));
      return {
        recommendations,
        nextSteps: [
          "Triage the red-flag contract(s) into the redline workflow.",
          "Request amendments on the assignment / confidentiality outliers.",
          "Summarize the findings for the deal committee.",
          "Re-run diligence after the amendments land.",
        ],
      };
    }

    case "schedule": {
      const recommendations: RecAction[] = artifact.items.map((it) => ({
        action: TYPE_ACTION[it.type] ?? "Action this obligation",
        where: it.obligation,
        target: `Complete ${it.due} · owner: ${it.owner}`,
        priority: (it.urgency === "soon" ? "now" : "soon") as Priority,
      }));
      return {
        recommendations,
        nextSteps: [
          "Add every obligation to the legal calendar with a named owner.",
          "Set reminders 14 days ahead of each deadline.",
          "Action the items due soon this week.",
          "Review the schedule at the next legal-ops standup.",
        ],
      };
    }

    case "guardian": {
      const flagged = artifact.checks.filter((c) => c.status !== "pass");
      const recommendations: RecAction[] = flagged.length
        ? flagged.map((c) => ({
            action: "Obtain human sign-off",
            where: c.name,
            target: c.note,
            priority: "now" as Priority,
          }))
        : [
            {
              action: "Release the package for signature",
              where: "Verified output",
              target: "All checks passed",
              priority: "now",
            },
          ];
      return {
        recommendations,
        nextSteps: [
          "Route any flagged item to the responsible owner (e.g. the privacy lead).",
          "On approval, release the package for signature.",
          "Archive the audit trail with the matter.",
        ],
      };
    }

    case "package": {
      return {
        recommendations: [
          {
            action: "Approve the redline set",
            where: "Liability, indemnity, IP & term clauses",
            target: "Customer-favorable, market-standard positions",
            priority: "now",
          },
          {
            action: "Attach the DPA + Standard Contractual Clauses",
            where: "Data-protection terms",
            target: "GDPR-compliant addendum",
            priority: "now",
          },
          {
            action: "Execute the negotiated cap",
            where: "Limitation of liability",
            target: "24 months' fees (settled)",
            priority: "now",
          },
        ],
        nextSteps: [
          "Circulate the package to the deal owner for approval.",
          "Send the redline to the counterparty and close the remaining points.",
          "Re-run the guardian, then route for e-signature.",
          "On signature, load obligations & renewals into the calendar.",
        ],
      };
    }
  }
}
