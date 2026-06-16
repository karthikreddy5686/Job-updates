const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '..', 'data');
const adminFile = path.join(dataDir, 'admins.json');
const DEFAULT_ADMIN_EMAIL = 'admin@portal.com';
const DEFAULT_ADMIN_PASSWORD = 'Admin@123';
const HASH_ITERATIONS = 120000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = 'sha512';

const ensureStorage = () => {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(adminFile)) {
        fs.writeFileSync(adminFile, '[]', 'utf8');
    }
};

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString('hex');
    return `${salt}$${HASH_ITERATIONS}$${hash}`;
};

const main = () => {
    ensureStorage();

    const admins = JSON.parse(fs.readFileSync(adminFile, 'utf8')) || [];
    const existingAdmin = admins.find((admin) => admin.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase());

    if (existingAdmin) {
        console.log('Admin account already exists:', existingAdmin.email);
        return;
    }

    const newAdmin = {
        id: `admin_${Date.now()}`,
        email: DEFAULT_ADMIN_EMAIL,
        passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
        role: 'admin',
        createdAt: new Date().toISOString(),
    };

    admins.push(newAdmin);
    fs.writeFileSync(adminFile, JSON.stringify(admins, null, 2), 'utf8');
    console.log('Seeded admin account:', DEFAULT_ADMIN_EMAIL);
    console.log('Password:', DEFAULT_ADMIN_PASSWORD);
};

main();