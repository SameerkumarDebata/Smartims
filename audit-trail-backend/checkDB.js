const mongoose = require("mongoose");

async function checkDatabases() {
    try {
        await mongoose.connect("mongodb://localhost:27017/", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const adminDb = mongoose.connection.db.admin();
        const result = await adminDb.listDatabases();
        console.log("✅ Databases Found:", result.databases);

    } catch (error) {
        console.error("❌ Error fetching databases:", error);
    } finally {
        mongoose.connection.close(); // Close connection
        process.exit();
    }
}

checkDatabases();
