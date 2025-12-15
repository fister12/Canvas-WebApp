export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt: Date;
  updatedAt: Date;
  preferences?: any;
}

// Data structures for authentication operationss
export type SignUpData = { email: string; password: string; displayName?: string };
export type SignInData = { email: string; password: string };
export type UpdateProfileData = { displayName?: string; photoURL?: string; preferences?: any };

// Keep as module
export {};
