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
                <form class="eraseButton" data-workid="${job.workid}">
                    <input type="hidden" name="jobId" value="${job.workid}">
                    <input type="submit" value="Radera" class="deleteJob">
                </form>
            `;
    
            // Lägger till listelementet i containern.
            jobListEl.appendChild(jobItem);

            // Lägger till händelselyssnare för "radera"-knappen.
            const eraseButton = jobItem.querySelector(".eraseButton");
            eraseButton.addEventListener("submit", deleteJob);
        });

    // Felmeddelande.
    } catch (error) {
        console.log("Fetch failed. This message was created:", error);
    }
}

// Funktion som raderar ett jobb vid klick på "radera"-knappen.
async function deleteJob(event) {

    // Hanterar default för submit vid formulär.
    event.preventDefault();

    // Hämtar id for jobb och deklarerar URL.
    const workid = event.currentTarget.getAttribute("data-workid");
    const deleteUrl = `http://127.0.0.1:3000/work/${workid}`;

    // AJAX-anrop med metoden DELETE.
    try {
        const response = await fetch(deleteUrl, {
            method: "DELETE"
        });

        // Villkor.
        if (response.ok) {
            // Raderar specifika jobb-posten från DOM.
            event.target.parentElement.remove();
            console.log("Job deleted successfully");
        
        // Felmeddelande vid specifik radering.
        } else {
            console.error("Failed to delete job, try again");
        }
    // Felmeddelande.
    } catch (error) {
        console.error("Error deleting job:", error);
    }
}

// Funktion som lägger till ett jobb vid klick på "lägg till"-knappen.
async function addJob(event) {
    // Hanterar default för submit vid formulär.
    event.preventDefault();

    // Hämtar inputvärden för de olika formulärfälten.
    const companyname = document.getElementById("companyname").value;
    const jobtitle = document.getElementById("jobtitle").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;

    // Skapar ett nytt objekt med input-värden.
    const newJob = {
        companyname: companyname,
        jobtitle: jobtitle,
        location: location,
        description: description
    };

    // Deklarerar URL.
    const addUrl = "http://127.0.0.1:3000/work";

    // AJAX-anrop med metoden POST.
    try {
        const response = await fetch(addUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newJob)
        });

        // Villkor.
        if (response.ok) {
            // Laddar om/uppdaterar jobblistan.
            getJobs();
            // Rensar formuläret.
            document.getElementById("jobForm").reset();
            console.log("Job added successfully");
            // Dirigerar om till index.html efter lyckad lagring.
    	    window.location.href = 'index.html';

        // Felmeddelande vid lagring av jobb.
        } else {
            console.error("Failed to add job");
        }
    // Felmeddelande.
    } catch (error) {
        console.error("Error adding job:", error);
    }
}

// Lägger till en händelselyssnare för formuläret och knappen "lägg till".
document.getElementById("jobForm").addEventListener("submit", addJob);