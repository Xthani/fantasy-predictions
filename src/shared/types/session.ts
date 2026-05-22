export type AuthProvider = 'google' | 'email';

export type Session = {
  userId: string;
  displayName: string;
  provider: AuthProvider;
};
