import { UserProfile, Task } from '../types/task';
import { CURRENT_USER, INITIAL_TASKS, createPersonalizedTasks, SARAH_AVATAR } from '../data/initialTasks';

export interface Account extends UserProfile {
  id: string;
  createdAt: number;
  password?: string;
}

const ACCOUNTS_STORAGE_KEY = 'taskpro_accounts_v2';
const CURRENT_ACCOUNT_ID_KEY = 'taskpro_current_account_id';
const LOGGED_IN_KEY = 'taskpro_is_logged_in';

const DEFAULT_SARAH_ACCOUNT: Account = {
  id: 'user-sarah-default',
  name: CURRENT_USER.name,
  email: CURRENT_USER.email,
  avatar: CURRENT_USER.avatar || SARAH_AVATAR,
  role: CURRENT_USER.role,
  appsConnected: CURRENT_USER.appsConnected,
  createdAt: 1700000000000,
};

export const AVATAR_GRADIENTS = [
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-pink-600',
  'from-emerald-600 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-cyan-600 to-blue-600',
  'from-rose-600 to-red-600',
  'from-violet-600 to-purple-800',
];

export function getStoredAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse accounts from localStorage', err);
  }
  // Initialize with default account
  const initial = [DEFAULT_SARAH_ACCOUNT];
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    // Ignore storage quota
  }
  return initial;
}

export function getCurrentAccountId(): string {
  try {
    const id = localStorage.getItem(CURRENT_ACCOUNT_ID_KEY);
    if (id) return id;
  } catch {
    // fallback
  }
  return DEFAULT_SARAH_ACCOUNT.id;
}

export function getCurrentAccount(): Account {
  const accounts = getStoredAccounts();
  const currentId = getCurrentAccountId();
  const found = accounts.find((acc) => acc.id === currentId);
  return found || accounts[0] || DEFAULT_SARAH_ACCOUNT;
}

export function saveAccount(account: Account): void {
  try {
    const accounts = getStoredAccounts();
    const existingIndex = accounts.findIndex((a) => a.id === account.id || a.email.toLowerCase() === account.email.toLowerCase());
    if (existingIndex >= 0) {
      accounts[existingIndex] = { ...accounts[existingIndex], ...account };
    } else {
      accounts.push(account);
    }
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    localStorage.setItem(CURRENT_ACCOUNT_ID_KEY, account.id);
  } catch (err) {
    console.error('Failed to save account', err);
  }
}

export function getAccountTasks(accountId: string, accountName?: string): Task[] {
  const storageKey = `taskpro_tasks_${accountId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load tasks for account', err);
  }

  // If it's the demo Sarah account, return INITIAL_TASKS
  if (accountId === DEFAULT_SARAH_ACCOUNT.id) {
    return INITIAL_TASKS;
  }

  // For any custom user account, generate clean, personalized tasks with ZERO overdue errors
  const account = getCurrentAccount();
  const tasks = createPersonalizedTasks({
    ...account,
    name: accountName || account.name,
  });

  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  } catch (e) {
    // ignore
  }

  return tasks;
}

export function saveAccountTasks(accountId: string, tasks: Task[]): void {
  const storageKey = `taskpro_tasks_${accountId}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks for account', err);
  }
}

export function registerAccount(name: string, email: string, password?: string): { account: Account; tasks: Task[] } {
  const accounts = getStoredAccounts();
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];

  // Pick gradient color deterministically
  const colorIndex = Math.abs(cleanName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % AVATAR_GRADIENTS.length;
  const avatarColor = AVATAR_GRADIENTS[colorIndex];

  // Check if account already exists with this email
  const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (existing) {
    existing.name = cleanName;
    if (password) existing.password = password;
    saveAccount(existing);
    localStorage.setItem(LOGGED_IN_KEY, 'true');
    const tasks = getAccountTasks(existing.id, cleanName);
    return { account: existing, tasks };
  }

  const newAccount: Account = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    password,
    avatar: '', // uses initials with vibrant gradient
    avatarColor,
    role: 'Lead Specialist',
    appsConnected: 3,
    createdAt: Date.now(),
  };

  saveAccount(newAccount);
  localStorage.setItem(LOGGED_IN_KEY, 'true');

  // Generate clean tasks tailored to this user (never overdue, no errors!)
  const tasks = createPersonalizedTasks(newAccount);
  saveAccountTasks(newAccount.id, tasks);

  return { account: newAccount, tasks };
}

export function loginAccount(email: string, password?: string, fallbackName?: string): { account: Account; tasks: Task[] } {
  const accounts = getStoredAccounts();
  const cleanEmail = email.trim().toLowerCase();

  const found = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (found) {
    localStorage.setItem(CURRENT_ACCOUNT_ID_KEY, found.id);
    localStorage.setItem(LOGGED_IN_KEY, 'true');
    const tasks = getAccountTasks(found.id, found.name);
    return { account: found, tasks };
  }

  // If not found, automatically register them smoothly
  return registerAccount(fallbackName || cleanEmail.split('@')[0], cleanEmail, password);
}

export function isUserLoggedIn(): boolean {
  try {
    const val = localStorage.getItem(LOGGED_IN_KEY);
    // Defaults to true so the user is never kicked out!
    return val !== 'false';
  } catch {
    return true;
  }
}

export function setSessionLoggedIn(loggedIn: boolean): void {
  try {
    localStorage.setItem(LOGGED_IN_KEY, loggedIn ? 'true' : 'false');
  } catch (err) {
    console.error('Failed to set login session', err);
  }
}
