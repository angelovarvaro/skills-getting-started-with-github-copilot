document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

          participantsHTML = `
            <div class=\"participants-section\">\n              <strong>Participants:</strong>\n              <ul class=\"participants-list\">\n                ${details.participants.map(email => `<li><span class=\"participant-email\">${email}</span> <span class=\"delete-participant\" data-activity=\"${name}\" data-email=\"${email}\" title=\"Remove\">🗑️</span></li>`).join("")}\n              </ul>\n            </div>\n          `;
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Crea elenco partecipanti
        let participantsHTML = "";
        if (details.participants.length > 0) {
          participantsHTML = `
            <div class="participants-section">
              <strong>Participants:</strong>
              <ul class="participants-list">
                ${details.participants.map(email => `<li>${email}</li>`).join("")}
              </ul>
            </div>
          `;
        } else {
          participantsHTML = `
            <div class="participants-section">
              <strong>Participants:</strong>
              <p class="no-participants">No participants yet.</p>
            </div>
          `;
        }

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          ${participantsHTML}
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

              // Aggiungi event listener per cancellazione partecipante
              document.querySelectorAll('.delete-participant').forEach(icon => {
                icon.addEventListener('click', async (e) => {
                  const activity = icon.getAttribute('data-activity');
                  const email = icon.getAttribute('data-email');
                  if (confirm(`Rimuovere ${email} da ${activity}?`)) {
                    try {
                      const res = await fetch(`/activities/${activity}/participants/${email}`, {
                        method: 'DELETE'
                      });
                      if (res.ok) {
                        fetchActivities(); // aggiorna la lista
                      } else {
                        alert('Errore nella rimozione.');
                      }
                    } catch {
                      alert('Errore di rete.');
                    }
                  }
                });
              });

              // Popola select attività
              activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
              Object.keys(activities).forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                activitySelect.appendChild(option);
              });
  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        fetchActivities(); // aggiorna la lista delle attività
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
