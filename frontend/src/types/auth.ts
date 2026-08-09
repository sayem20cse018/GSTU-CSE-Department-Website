// ─── Admin profile returned by the backend ───────────────────────────────────
export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions: string[];
  lastLoginAt: string | null;
}

// ─── Tokens returned at login / refresh ──────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

// ─── Login API response shape ─────────────────────────────────────────────────
export interface LoginResponse {
  success: boolean;
  data: AuthTokens & { admin: AdminProfile };
}

// ─── /auth/me response shape ──────────────────────────────────────────────────
export interface MeResponse {
  success: boolean;
  data: AdminProfile;
}

// ─── Refresh response shape ───────────────────────────────────────────────────
export interface RefreshResponse {
  success: boolean;
  data: { accessToken: string; expiresIn: number };
}

// ─── AuthContext value shape ──────────────────────────────────────────────────
export interface AuthContextValue {
  admin: AdminProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: AdminProfile['role']) => boolean;
  hasPermission: (permission: string) => boolean;
}

// ─── Login form fields ────────────────────────────────────────────────────────
export interface LoginFormValues {
  email: string;
  password: string;
}
