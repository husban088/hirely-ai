import Cookies from "js-cookie";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  targetRole?: string;
  targetMarket?: string;
  createdAt?: string;
}

const TOKEN_KEY = "hirely_token";
const USER_KEY = "hirely_user";

export function saveSession(token: string, user: AuthUser) {
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return Cookies.get(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function updateStoredUser(partial: Partial<AuthUser>) {
  const current = getUser();
  if (!current) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...current, ...partial }));
}

export function clearSession() {
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}
