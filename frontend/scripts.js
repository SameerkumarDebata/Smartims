// Function to log in the user
// async function login() {
//     const username = prompt("Enter your username:");
//     if (username) {
//         sessionStorage.setItem("loggedInUser", username);
//         alert(`Welcome, ${username}`);

//         // Hide login button, show logout button
//         document.getElementById("loginBtn").style.display = "none";
//         document.getElementById("logoutBtn").style.display = "inline";

//         console.log("🟠 Logging in:", username); // Debugging log

//         // Record login action in the audit log
//         await addAuditLog("User Logged In");

//         // Load logs after login
//         loadAuditLogs();
//     }
// }


async function login() {
    const username = prompt("Enter your username:");
    if (!username) return;

    const password = prompt("Enter your password:");
    if (!password) return alert("Password is required to login.");

    // For simplicity, using hardcoded password validation (you can replace with backend check)
    const validCredentials = {
        manager: "manager@123",
        
    };

    if (validCredentials[username] !== password) {
        alert("Invalid username or password!");
        return;
    }

    sessionStorage.setItem("loggedInUser", username);
    alert(`Welcome, ${username}`);

    // Hide login button, show logout button
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline";

    console.log("🟠 Logging in:", username);

    await addAuditLog("User Logged In");

    loadAuditLogs();
}








// Function to log out the user
async function logout() {
    console.log("🔵 Logging out..."); // Debugging log
    const username = sessionStorage.getItem("loggedInUser");

    if (username) {
        await addAuditLog("User Logged Out"); // Ensure log is recorded before session removal
    }

    sessionStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");

    // Show login button, hide logout button
    document.getElementById("loginBtn").style.display = "inline";
    document.getElementById("logoutBtn").style.display = "none";

    // Reload logs to reflect changes
    loadAuditLogs();
}

// Function to load audit logs from the backend
async function loadAuditLogs() {
    try {
        const response = await fetch("http://localhost:5000/audit-log");
        if (!response.ok) throw new Error("Failed to fetch logs");

        const data = await response.json();
        console.log("📜 Logs retrieved:", data); // Debugging log

        const tableBody = document.getElementById("logTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ""; // Clear previous entries

        data.forEach(log => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = log.activity;
            row.insertCell(1).innerText = log.user;
            row.insertCell(2).innerText = log.email;
            row.insertCell(3).innerText = log.electronicallySigned;
            row.insertCell(4).innerText = log.timezone;
            row.insertCell(5).innerText = formatDate(log.createdOn); // Convert to local time
        });
    } catch (error) {
        console.error("🔴 Error loading logs:", error);
        alert("Failed to load logs. Please refresh the page.");
    }
}

// Function to format date & time properly
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

// Function to add an audit log entry
async function addAuditLog(action) {
    try {
        const username = sessionStorage.getItem("loggedInUser") || "Guest";
        const email = username !== "Guest" ? `${username}@example.com` : "N/A";
        const electronicallySigned = "Yes"; // Assuming electronic signature is required
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date().toISOString(); // Store UTC time

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

        console.log("✅ Log successfully added");
    } catch (error) {
        console.error("🔴 Error adding log:", error);
        alert("Failed to add log. Please try again.");
    }
}

// Function to download audit logs as a PDF
// async function downloadPDF() {
//     console.log("🔵 Downloading PDF..."); // Debugging log

//     try {
//         const response = await fetch("http://localhost:5000/audit-log");
//         if (!response.ok) throw new Error("Failed to fetch logs");

//         const data = await response.json();
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();

//         doc.text("Audit Logs", 14, 10);

//         const tableColumn = ["Activity", "User", "Email", "Signed", "Timezone", "Timestamp"];
//         const tableRows = [];

//         data.forEach(log => {
//             const logData = [
//                 log.activity,
//                 log.user,
//                 log.email,
//                 log.electronicallySigned,
//                 log.timezone,
//                 formatDate(log.createdOn) // Convert to readable format
//             ];
//             tableRows.push(logData);
//         });

//         doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
//         doc.save("Audit_Logs.pdf");

//         console.log("🟢 PDF Downloaded - Logging Action"); // Debugging log
//         await addAuditLog("Downloaded Audit Logs as PDF");
//     } catch (error) {
//         console.error("🔴 Error downloading PDF:", error);
//         alert("Failed to generate PDF. Please try again.");
//     }
// }











async function downloadPDF() {
    console.log("🔵 Downloading PDF...");

    try {
        const response = await fetch("http://localhost:5000/audit-log");
        if (!response.ok) throw new Error("Failed to fetch logs");

        const data = await response.json();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Prepare table content
        const tableColumn = ["Activity", "User", "Email", "Signed", "Timezone", "Timestamp"];
        const tableRows = [];

        data.forEach(log => {
            const logData = [
                log.activity,
                log.user,
                log.email,
                log.electronicallySigned,
                log.timezone,
                formatDate(log.createdOn)
            ];
            tableRows.push(logData);
        });

        // Get footer details
        const username = sessionStorage.getItem("loggedInUser") || "Guest";
        const timestamp = new Date().toLocaleString('en-IN', {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        const footerText = `Downloaded by ${username} at ${timestamp}`;

        // Generate table and footer
        doc.text("Audit Logs", 14, 10);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            margin: { bottom: 20 }, // Reserve space for footer
            didDrawPage: function (data) {
                // Footer will appear on each page
                const pageHeight = doc.internal.pageSize.height;
                doc.setFontSize(10);
                doc.text(footerText, 14, pageHeight - 10);
            }
        });

        doc.save("Audit_Logs.pdf");

        // Log the action
        await addAuditLog(`Audit Log PDF Downloaded by ${username}`);
    } catch (error) {
        console.error("🔴 Error downloading PDF:", error);
        alert("Failed to generate PDF. Please try again.");
    }
}











// Load logs when the page opens
window.onload = function () {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    document.getElementById("loginBtn").style.display = loggedInUser ? "none" : "inline";
    document.getElementById("logoutBtn").style.display = loggedInUser ? "inline" : "none";

    loadAuditLogs();
};
