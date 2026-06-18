from app.services.risk_scoring import calculate_risk_score, get_risk_level

def test_risk_scoring_calculation():
    # Low risk parameters
    low_score = calculate_risk_score(
        tenure_years=1.0, 
        doc_coverage=90, 
        dependents=1, 
        owned_projects_count=0
    )
    assert low_score < 35
    assert get_risk_level(low_score) == "low"
    
    # Critical risk parameters
    critical_score = calculate_risk_score(
        tenure_years=8.0, 
        doc_coverage=10, 
        dependents=10, 
        owned_projects_count=3
    )
    assert critical_score >= 80
    assert get_risk_level(critical_score) == "critical"
    
    # Boundary tests
    assert get_risk_level(80) == "critical"
    assert get_risk_level(79) == "high"
    assert get_risk_level(60) == "high"
    assert get_risk_level(59) == "medium"
    assert get_risk_level(35) == "medium"
    assert get_risk_level(34) == "low"
