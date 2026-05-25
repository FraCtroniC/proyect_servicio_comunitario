export type StoredUser = {
  userName: string;
  password: string;
  displayName: string;
};

export const DEFAULT_USERS: StoredUser[] = [
  { userName: 'arturo', password: '1234', displayName: 'Arturo' },
];
