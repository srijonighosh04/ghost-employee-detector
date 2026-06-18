import pytest

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_employees(client):
    response = client.get("/api/v1/employees/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    # Check camelCase conversion of schema
    first_emp = data[0]
    assert "id" in first_emp
    assert "riskScore" in first_emp  # should be camelCase
    assert "riskLevel" in first_emp  # should be camelCase
    assert "avatarColor" in first_emp  # should be camelCase
    assert "ownedProjects" in first_emp  # should be list

def test_get_employee_by_id(client):
    # e1 is seeded
    response = client.get("/api/v1/employees/e1")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Priya Nair"
    assert data["id"] == "e1"
    
    # 404 test
    response_404 = client.get("/api/v1/employees/e-nonexistent")
    assert response_404.status_code == 404

def test_create_and_delete_employee(client):
    new_employee_payload = {
        "id": "e-test",
        "name": "Test Engineer",
        "role": "QA Engineer",
        "team": "Platform Infrastructure",
        "avatarColor": "#000000",
        "initials": "TE",
        "riskScore": 0,  # engine should compute this
        "riskLevel": "low",
        "tenureYears": 1.5,
        "documentationCoverage": 90,
        "dependents": 2,
        "lastActive": "Just now"
    }
    
    response = client.post("/api/v1/employees/", json=new_employee_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == "e-test"
    # assert risk score was computed
    assert data["riskScore"] > 0
    
    # Delete the created employee
    del_response = client.delete("/api/v1/employees/e-test")
    assert del_response.status_code == 204
    
    # Verify it is deleted
    get_response = client.get("/api/v1/employees/e-test")
    assert get_response.status_code == 404

def test_get_projects(client):
    response = client.get("/api/v1/projects/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "contributors" in data[0]

def test_get_teams(client):
    response = client.get("/api/v1/teams/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "memberIds" in data[0]

def test_get_documents(client):
    response = client.get("/api/v1/documents/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "lastUpdated" in data[0]

def test_resignation_simulation(client):
    response = client.get("/api/v1/simulator/e1")
    assert response.status_code == 200
    data = response.json()
    assert data["employeeId"] == "e1"
    assert len(data["impactedProjects"]) > 0
    assert data["knowledgeGapScore"] > 0
    assert data["estimatedRampWeeks"] > 0

def test_assistant_chat(client):
    response = client.post("/api/v1/assistant/chat", json={"message": "Who is responsible for project Core Deployment Pipeline?"})
    assert response.status_code == 200
    data = response.json()
    assert "content" in data
    assert len(data["content"]) > 0

def test_handover_generation(client):
    response = client.get("/api/v1/handover/e1")
    assert response.status_code == 200
    data = response.json()
    assert data["employeeId"] == "e1"
    assert len(data["sections"]) == 4
    headings = [s["heading"].lower() for s in data["sections"]]
    assert "scope" in headings
    assert "existing documentation" in headings or "documentation" in headings or "existing docs" in headings
    assert "open knowledge gaps" in headings or "gaps" in headings or "knowledge gaps" in headings
    assert "suggested successor ramp plan" in headings or "ramp plan" in headings or "successor ramp plan" in headings
