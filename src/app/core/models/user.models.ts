export interface UserResponse {
  id: number;
  email: string;
  mobile: string;
  fullName: string;
  role: string;
  enabled: boolean;
}

export interface UpdateProfileRequest {
  fullName?: string;
  mobile?: string;
}
