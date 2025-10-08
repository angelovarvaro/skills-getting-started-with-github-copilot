import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "Chess Club" in data

def test_signup_for_activity():
    email = "testuser@mergington.edu"
    activity = "Chess Club"
    # Ensure user is not already signed up
    client.delete(f"/activities/{activity}/participants/{email}")
    response = client.post(f"/activities/{activity}/signup?email={email}")
    assert response.status_code == 200
    assert email in client.get("/activities").json()[activity]["participants"]

    # Try to sign up again (should fail)
    response = client.post(f"/activities/{activity}/signup?email={email}")
    assert response.status_code == 400

    # Remove participant
    response = client.delete(f"/activities/{activity}/participants/{email}")
    assert response.status_code in (200, 404)
    if response.status_code == 200:
        assert email not in client.get("/activities").json()[activity]["participants"]

def test_remove_nonexistent_participant():
    response = client.delete("/activities/Chess Club/participants/nonexistent@mergington.edu")
    assert response.status_code == 404

def test_signup_nonexistent_activity():
    response = client.post("/activities/Nonexistent Activity/signup?email=test@mergington.edu")
    assert response.status_code == 404
