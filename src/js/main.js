"use strict";

// Navigationsmeny; flikar.

// Hämtar alla element med klassen "tablink".
const tablinks = document.querySelectorAll(".tablink");

// Loopar igenom varje sidflik och lägger en händelselyssnare på dem.
tablinks.forEach(tablink => {
    tablink.addEventListener("click", function() {
        // Tar bort klassen "active" från alla sidflikar.
        tablinks.forEach(tab => {
            tab.classList.remove("active");
        });

        // Lägger till klassen "active" endast för den klickade sidfliken.
        this.classList.add("active");
    });
});


// Funktionalitet för att hämta, radera och skapa jobb.

// Funktion som kör vid sidladdning efter koll om element finns.
window.onload = getJobs;

// Funktion som hämtar lagrade jobb.
async function getJobs() {

    // API-URL.
    const getUrl = "http://127.0.0.1:3000/work";

    // AJAX-anrop, loopar genom data och skriver ut till skärm.
    try {
        const response = await fetch(getUrl);
        const data = await response.json();

        // Hämtar ul-elementet vari datan ska skrivas ut.
        let jobListEl = document.getElementById("jobList");

        // Loopar genom objekt-array och skriver ut jobb-poster.
        data.forEach((job) => {
            // Skapar ett listelement för varje jobb.
            const jobItem = document.createElement("li");
            jobItem.innerHTML = `
                <h3>${job.companyname}</h3>
                <p><strong>Ort:</strong> ${job.location}</p>
                <p><strong>Befattning:</strong> ${job.jobtitle}</p>
                <p><strong>Beskrivning:</strong> ${job.description}</p>
                <form class="eraseButton">
                    <input type="hidden" name="jobId" value="${job.workid}">
                    <input type="submit" value="Radera" class="deleteJob">
                </form>
            `;
    
            // Lägger till listelementet i containern.
            jobListEl.appendChild(jobItem);
        });

    // Felmeddelande.
    } catch (error) {
        console.log("Fetch failed. This message was created:", error);
    }
}