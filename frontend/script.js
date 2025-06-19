

const credentials = {
  manager: "manager@123",
  admin: "admin@123"
};

const documents = [
  "Business level documents", "GAP", "GXP", "Validation Plan", "User Requirements Specification",
  "Functional Specification", "Design Specification", "Functional Risk Assessment",
  "Installation Qualification Protocol", "Operational Qualification Protocol",
  "Performance Qualification Protocol"
];

let currentRole = "";
let uploadedDocs = [];

function showLogin() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("uploadSection").classList.add("hidden");
}

function login() {
  const username = document.getElementById("username").value.toLowerCase();
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("loginError");

  if (credentials[username] && credentials[username] === password) {
    currentRole = username;
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("uploadSection").classList.remove("hidden");
    renderUploadFields();
    errorMsg.textContent = "";
  } else {
    errorMsg.textContent = "Invalid credentials. Try again.";
  }
}

function forgotPassword() {
  const email = prompt("Enter your registered email:");
  if (email) {
    alert("Password reset link has been sent to " + email);
  }
}

function renderUploadFields() {
  const formContainer = document.getElementById("uploadForms");
  formContainer.innerHTML = "";

  // Remove "Business level documents" for Admin role
  const filteredDocs = currentRole === "admin" ? documents.filter(doc => doc !== "Business level documents") : documents;

  filteredDocs.forEach(doc => {
    const id = doc.replace(/ /g, "_");
    const formGroup = document.createElement("div");
    formGroup.className = "upload-item";
    formGroup.innerHTML = `
      <label><strong>${doc}</strong></label><br/>
      <input type="file" id="${id}" multiple />
      <button onclick="submitFile('${doc}')">Submit</button>
      <button onclick="removeFile('${doc}')">Remove</button>
    `;
    formContainer.appendChild(formGroup);
  });
}

function submitFile(docName) {
  const inputId = docName.replace(/ /g, "_");
  const fileInput = document.getElementById(inputId);
  const files = fileInput.files;

  if (!files.length) {
    alert(`Please select files for ${docName}`);
    return;
  }

  const uploads = Array.from(files).map(file => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("docName", docName);
    formData.append("role", currentRole);

    return fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });
  });

  Promise.all(uploads)
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(results => {
      alert(`${docName} uploaded successfully!`);
      fetchUploadedDocs();
    })
    .catch(err => {
      console.error(err);
      alert("Server error.");
    });
}

function removeFile(docName) {
  fetch(`http://localhost:3000/delete?doc=${docName}&role=${currentRole}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(`${docName} removed.`);
        fetchUploadedDocs();
      } else {
        alert("Remove failed.");
      }
    });
}

function fetchUploadedDocs() {
  fetch("http://localhost:3000/files")
    .then(res => res.json())
    .then(data => {
      uploadedDocs = data;
      updateDocumentCenter();
    });
}

function updateDocumentCenter() {
  const docCount = uploadedDocs.length;
  const categories = [...new Set(uploadedDocs.map(d => d.doc))].length;

  document.getElementById("docCount").textContent = docCount;
  document.getElementById("catCount").textContent = categories;

  const docList = document.getElementById("docList");
  docList.innerHTML = "";

  uploadedDocs.forEach(doc => {
    const li = document.createElement("li");
    li.innerHTML = `${doc.doc} - <a href="http://localhost:3000/uploads/${doc.filename}" target="_blank">View</a> | <a href="http://localhost:3000/uploads/${doc.filename}" download>Download</a>`;
    docList.appendChild(li);
  });
}

function goBack() {
  currentRole = "";
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("uploadSection").classList.add("hidden");
}





window.onload = fetchUploadedDocs;
