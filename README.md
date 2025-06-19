A complete Validation Life Cycle Management System (VLMS) designed to streamline the documentation and compliance process for GxP-regulated environments. This project enables secure file uploads, role-based access (Manager/Admin), audit trails, and real-time document management, all while maintaining a simple and user-friendly UI.

🔧 Features
🔐 Login Authentication for Manager and Admin

📂 Role-based File Uploads (GAP, GXP, Validation Plan, URS, FS, DS, IQ, OQ, PQ, etc.)

🧾 Audit Logs with MongoDB integration (tracks actions like file uploads/deletions)

📄 Document Center updates dynamically with uploaded files

📤 Persistent File Uploads using Node.js, Express, and Multer

👁️ View, 📥 Download, and ❌ Remove options for every uploaded file

🔙 Logout (Go Back) button to return to login from Upload Files section

💾 Backend powered by MongoDB and Express.js

⚙️ Frontend built using HTML, CSS, JavaScript (No UI changes enforced)

📦 Technologies Used
Frontend: HTML5, CSS3, JavaScript (Vanilla)

Backend: Node.js, Express.js, Multer

Database: MongoDB (via MongoDB Compass)

Other: File System module for file persistence

🚀 How to Run
Clone the repo:

bash
Copy code
git clone https://github.com/your-username/validation-lifecycle-management.git
Install dependencies:

bash
Copy code
npm install
Run the backend server:

bash
Copy code
node server.js
Open index.html in your browser to start using the system.

