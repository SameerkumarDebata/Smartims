// Function to add an audit log entry
async function addAuditLog(action) {
    try {
        const username = sessionStorage.getItem("loggedInUser") || "Guest";
        const email = username !== "Guest" ? `${username}@example.com` : "N/A";
        const electronicallySigned = "Yes"; // Assuming electronic signature is required
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date().toISOString(); // Store time in UTC format

        const logEntry = { 
            activity: action, 
            user: username, 
            email, 
            electronicallySigned, 
            timezone, 
            createdOn: now 
        };

        console.log("🟢 Sending log entry:", logEntry); // Debugging log

        const response = await fetch("http://localhost:5000/audit-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(logEntry)
        });

        if (!response.ok) throw new Error("Failed to add log");

        const data = await response.json();
        console.log("✅ Log successfully added:", data);

        // Append new log entry instead of reloading everything
        appendLogEntry(logEntry);
    } catch (error) {
        console.error("🔴 Error adding log:", error);
        alert("Failed to add log. Please try again.");
    }
}

// Function to load audit logs from the backend
async function loadAuditLogs() {
    try {
        const response = await fetch("http://localhost:5000/audit-log");
        if (!response.ok) throw new Error("Failed to load logs");

        const data = await response.json();
        console.log("📜 Logs retrieved:", data); // Debugging log

        const tableBody = document.getElementById("logTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ""; // Clear previous entries

        data.forEach(log => appendLogEntry(log));
    } catch (error) {
        console.error("🔴 Error loading logs:", error);
        alert("Failed to load logs. Please refresh the page.");
    }
}

// Function to append a new log entry to the table
function appendLogEntry(log) {
    const tableBody = document.getElementById("logTable").getElementsByTagName("tbody")[0];
    const row = tableBody.insertRow();

    row.insertCell(0).innerText = log.activity;
    row.insertCell(1).innerText = log.user;
    row.insertCell(2).innerText = log.email;
    row.insertCell(3).innerText = log.electronicallySigned;
    row.insertCell(4).innerText = log.timezone;
    row.insertCell(5).innerText = formatDate(log.createdOn); // Convert to local time
}

// Function to properly format date & time
function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    return date.toLocaleString('en-US', { 
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
    });
}

// Load logs when the page opens
window.onload = function () {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    document.getElementById("loginBtn").style.display = loggedInUser ? "none" : "inline";
    document.getElementById("logoutBtn").style.display = loggedInUser ? "inline" : "none";

    loadAuditLogs();
};
