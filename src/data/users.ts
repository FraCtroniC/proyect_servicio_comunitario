export type StoredUser = {
  userName: string;
  displayName: string;
  passwordHash: string;
  salt: string;
};

export const DEFAULT_USERS: Array<{ userName: string; displayName: string; plainPassword: string }> = [
  { userName: 'arturo', displayName: 'Arturo', plainPassword: '1234' },
];
