const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const adminFile = path.join(dataDir, 'admins.json');
const sessionsFile = path.join(dataDir, 'admin-sessions.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(adminFile)) {
    fs.writeFileSync(adminFile, '[]', 'utf8');
    console.log('Created admins.json');
} else {
    console.log('admins.json already exists');
}

if (!fs.existsSync(sessionsFile)) {
    fs.writeFileSync(sessionsFile, '[]', 'utf8');
    console.log('Created admin-sessions.json');
} else {
    console.log('admin-sessions.json already exists');
}

console.log('Admin storage migration completed.');