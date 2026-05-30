export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  mobile: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  userId: number;
  email: string;
  role: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  email: string;
  userId: number;
  role: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
