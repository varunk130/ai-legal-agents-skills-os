"""Unit tests for agents.risk_agent."""

from agents.risk_agent import RISK_SIGNALS, RiskAgent, RiskScore


def test_empty_document_scores_zero_low():
    score = RiskAgent().score("")
    assert score.total == 0.0
    assert score.band == "low"
    assert all(v == 0 for v in score.breakdown.values())


def test_signal_weights_are_applied():
    agent = RiskAgent()
    # 'indemnif' weight is 3.0
    score = agent.score("indemnification clause")
    assert score.breakdown["indemnif"] == 3.0


def test_band_high_when_many_signals():
    agent = RiskAgent()
    doc = (
        "indemnification, indemnify, limitation of liability, "
        "consequential damages, exclusive remedy, warranty, terminate"
    )
    score = agent.score(doc)
    assert score.band == "high"
    assert score.total >= agent.threshold_high


def test_band_medium_between_thresholds():
    agent = RiskAgent()
    # Trigger ~3.5 <= total < 7.0
    doc = "warranty " * 2 + "terminate " * 1  # 1.5*2 + 1.2*1 = 4.2
    score = agent.score(doc)
    assert agent.threshold_medium <= score.total < agent.threshold_high
    assert score.band == "medium"


def test_thresholds_are_configurable():
    strict = RiskAgent(threshold_high=1.0, threshold_medium=0.5)
    score = strict.score("warranty")  # 1.5 > 1.0
    assert score.band == "high"


def test_summarize_lists_top_drivers():
    agent = RiskAgent()
    doc = "indemnification consequential damages warranty"
    summary = agent.summarize(agent.score(doc))
    assert "Risk band" in summary
    assert "Top drivers" in summary
    assert "indemnif" in summary


def test_risk_signals_dict_intact():
    # Guard against accidental edits to the keyword weights table.
    expected = {
        "indemnif", "limitation of liability", "warrant",
        "terminat", "force majeure", "exclusive remedy",
        "consequential damages",
    }
    assert set(RISK_SIGNALS.keys()) == expected
    assert all(v > 0 for v in RISK_SIGNALS.values())


def test_score_returns_riskscore_instance():
    score = RiskAgent().score("any text")
    assert isinstance(score, RiskScore)
    assert isinstance(score.breakdown, dict)
