const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

let uploadedDocs = [];

app.post("/upload", upload.single("document"), (req, res) => {
  const { docName, role } = req.body;
  uploadedDocs.push({ doc: docName, role, filename: req.file.filename });
  res.json({ success: true, file: req.file.filename });
});

app.get("/files", (req, res) => {
  res.json(uploadedDocs);
});

app.delete("/delete", (req, res) => {
  const { doc, role } = req.query;
  const index = uploadedDocs.findIndex(d => d.doc === doc && d.role === role);
  if (index !== -1) {
    const [removed] = uploadedDocs.splice(index, 1);
    fs.unlink(path.join(__dirname, "uploads", removed.filename), err => {
      if (err) console.error(err);
    });
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
