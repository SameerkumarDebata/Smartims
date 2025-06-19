const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ✅ Middleware
app.use(cors({ origin: "*" })); // Allows access from all domains (Adjust for production)
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb://localhost:27017/auditDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("🔴 MongoDB Connection Error:", err));

// ✅ Audit Log Schema
const auditSchema = new mongoose.Schema({
    activity: String,
    user: String,
    email: String,
    electronicallySigned: String,
    timezone: String,
    createdOn: { type: Date, default: () => new Date() } // Ensure UTC timestamp
});

const AuditLog = mongoose.model("AuditLog", auditSchema);

// ✅ API to Get Audit Logs (Sorted by Newest)
app.get("/audit-log", async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ createdOn: -1 });
        res.json(logs);
    } catch (error) {
        console.error("🔴 Error retrieving logs:", error);
        res.status(500).json({ error: "Error retrieving logs" });
    }
});

// ✅ API to Add an Audit Log
app.post("/audit-log", async (req, res) => {
    try {
        const { activity, user, email, electronicallySigned, timezone } = req.body;
        
        if (!activity || !user || !email || !electronicallySigned || !timezone) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newLog = new AuditLog({ 
            activity, 
            user, 
            email, 
            electronicallySigned, 
            timezone,
            createdOn: new Date() // Store timestamp in UTC
        });

        await newLog.save();

        res.status(201).json({ message: "✅ Log added successfully" });
    } catch (error) {
        console.error("🔴 Error saving log:", error);
        res.status(500).json({ error: "Error saving log" });
    }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
