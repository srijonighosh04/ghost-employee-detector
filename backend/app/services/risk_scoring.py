def calculate_risk_score(tenure_years: float, doc_coverage: int, dependents: int, owned_projects_count: int) -> int:
    """
    Calculate an employee's Knowledge Risk Score (0-100) based on:
    - Tenure: longer tenure represents more implicit knowledge (30% weight)
    - Documentation coverage: lower coverage equals higher risk (40% weight)
    - Dependents: more dependents increases vulnerability (20% weight)
    - Owned projects: more owned projects increases single point of failure risk (10% weight)
    """
    # Tenure score: maxes out at 8 years
    tenure_score = 30.0 * min(tenure_years / 8.0, 1.0)
    
    # Documentation coverage: inversely proportional (lower is riskier)
    doc_score = 40.0 * (1.0 - (doc_coverage / 100.0))
    
    # Dependents score: maxes out at 10 dependents
    dependents_score = 20.0 * min(dependents / 10.0, 1.0)
    
    # Owned projects: maxes out at 3 projects
    projects_score = 10.0 * min(owned_projects_count / 3.0, 1.0)
    
    total_score = tenure_score + doc_score + dependents_score + projects_score
    return min(max(round(total_score), 0), 100)

def get_risk_level(score: int) -> str:
    """
    Determine the Risk Level based on the Risk Score.
    Matches frontend thresholds.
    """
    if score >= 80:
        return "critical"
    if score >= 60:
        return "high"
    if score >= 35:
        return "medium"
    return "low"
