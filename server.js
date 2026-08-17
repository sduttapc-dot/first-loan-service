const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Static Files Serve
app.use(express.static(__dirname));

// Registration Data Save API
app.post('/api/register', (req, res) => {
    const newEntry = { id: Date.now(), ...req.body, date: new Date().toLocaleString() };
    
    let applications = [];
    if (fs.existsSync('applications.json')) {
        try {
            const fileData = fs.readFileSync('applications.json', 'utf8');
            applications = fileData ? JSON.parse(fileData) : [];
        } catch (e) {
            applications = [];
        }
    }
    
    applications.push(newEntry);
    fs.writeFileSync('applications.json', JSON.stringify(applications, null, 2));
    
    console.log("New Entry Received:", newEntry);
    res.status(200).json({ success: true, message: 'Application registered successfully!' });
});

// Render / Local Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});