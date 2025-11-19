const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const mkdirp = require('mkdirp');
const fs = require('fs');

const PORT = process.env.PORT || 5500;
const PUBLIC_DIR = path.resolve(__dirname);
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads');

mkdirp.sync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Prefix with timestamp to avoid collisions
    const ts = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-\_\u0600-\u06FF]/g, '_');
    cb(null, `${ts}_${safeName}`);
  }
});

const upload = multer({ storage });

const app = express();
app.use(cors());

// Serve static files (the site)
app.use(express.static(PUBLIC_DIR));

// Upload endpoint (accepts multiple files under field name 'files')
app.post('/upload', upload.array('files'), (req, res) => {
  try {
    // Save form fields (metadata)
    const fields = req.body || {};
    const files = (req.files || []).map(f => ({
      originalName: f.originalname,
      storedName: path.basename(f.path),
      size: f.size,
      path: `/uploads/${path.basename(f.path)}`
    }));

    // Optionally: write a small JSON record for each submission
    const record = {
      time: new Date().toISOString(),
      fields,
      files
    };
    const logFile = path.join(UPLOAD_DIR, 'submissions.log');
    fs.appendFileSync(logFile, JSON.stringify(record, null, 2) + '\n---\n');

    return res.json({ ok: true, files, fields });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

// Simple health-check
app.get('/_health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} — serving ${PUBLIC_DIR}`);
  console.log(`Uploads directory: ${UPLOAD_DIR}`);
});
