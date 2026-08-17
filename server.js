const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Static Files Serve
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'applications.json');

// Helper to read data safely
function getApplications() {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        return content ? JSON.parse(content) : [];
    } catch (e) {
        return [];
    }
}

// 1. Submit Application / CIBIL Request API
app.post('/api/register', (req, res) => {
    const newEntry = {
        id: Date.now(),
        ...req.body,
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    const applications = getApplications();
    applications.unshift(newEntry); // Newest on top
    fs.writeFileSync(DATA_FILE, JSON.stringify(applications, null, 2));

    console.log("New Lead Received:", newEntry);
    res.status(200).json({ success: true, message: 'Saved successfully' });
});

// 2. Admin Login & Data Fetch API
app.post('/api/admin/leads', (req, res) => {
    const { password } = req.body;
    // Security Password
    if (password !== 'admin123') {
        return res.status(401).json({ success: false, message: 'Invalid Admin Password' });
    }
    const applications = getApplications();
    res.status(200).json({ success: true, leads: applications });
});

// 3. Clear Leads API (Optional)
app.post('/api/admin/clear', (req, res) => {
    const { password } = req.body;
    if (password !== 'admin123') {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    res.status(200).json({ success: true, message: 'All leads cleared' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});