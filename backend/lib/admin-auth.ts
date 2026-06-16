import crypto from 'crypto';
import { getStoreData, setStoreData } from './db';

export const ADMIN_SESSION_COOKIE = 'jobupdate_admin_session';
export const DEFAULT_ADMIN_EMAIL = 'admin@jobupdate.com';
export const DEFAULT_ADMIN_PASSWORD = 'Admin@123';

const HASH_ITERATIONS = 120_000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = 'sha512';

export type AdminRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin';
  createdAt: string;
};

type AdminSessionRecord = {
  token: string;
  adminId: string;
  createdAt: string;
  expiresAt: string;
};

export async function getAdmins(): Promise<AdminRecord[]> {
  return await getStoreData<AdminRecord[]>('admins', []);
}

export async function saveAdmins(admins: AdminRecord[]) {
  await setStoreData('admins', admins);
}

export async function getAdminByEmail(email: string): Promise<AdminRecord | null> {
  const admins = await getAdmins();
  return admins.find((admin) => admin.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString('hex');
  return `${salt}$${HASH_ITERATIONS}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, iterations, hash] = storedHash.split('$');
  if (!salt || !iterations || !hash) {
    return false;
  }

  const derived = crypto.pbkdf2Sync(password, salt, Number(iterations), HASH_KEYLEN, HASH_DIGEST).toString('hex');
  return derived === hash;
}

export async function ensureSeededAdmin(): Promise<AdminRecord[]> {
  const admins = await getAdmins();

  if (admins.length === 0) {
    const seededAdmin: AdminRecord = {
      id: `admin_${Date.now()}`,
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    admins.push(seededAdmin);
    await saveAdmins(admins);
  }

  return admins;
}

export async function createAdminSession(adminId: string) {
  const sessions = await getStoreData<AdminSessionRecord[]>('admin-sessions', []);
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  sessions.push({
    token,
    adminId,
    createdAt: new Date().toISOString(),
    expiresAt,
  });

  await setStoreData('admin-sessions', sessions);
  return token;
}

export async function getAdminBySessionToken(token: string | null) {
  if (!token) {
    return null;
  }

  const sessions = await getStoreData<AdminSessionRecord[]>('admin-sessions', []);
  const session = sessions.find((item) => item.token === token);

  if (!session) {
    return null;
  }

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    return null;
  }

  const admins = await getAdmins();
  return admins.find((admin) => admin.id === session.adminId) ?? null;
}

export async function invalidateAdminSession(token: string | null) {
  if (!token) {
    return;
  }

  const sessions = await getStoreData<AdminSessionRecord[]>('admin-sessions', []);
  const activeSessions = sessions.filter((item) => item.token !== token);
  await setStoreData('admin-sessions', activeSessions);
}

export function getSessionTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(/(?:^|; )jobupdate_admin_session=([^;]+)/);
  return match?.[1] ?? null;
}

export async function getAdminSession(request: Request) {
  const token = getSessionTokenFromRequest(request);
  return getAdminBySessionToken(token);
}

export function isAdmin(admin: AdminRecord | null): admin is AdminRecord {
  return Boolean(admin && admin.role === 'admin');
}
