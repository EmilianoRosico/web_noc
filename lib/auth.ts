// lib/auth.ts
export const mockUsers = [
    { id: 1, email: 'admin@noc.com', password: 'admin123', role: 'admin' },
    { id: 2, email: 'user@noc.com', password: 'user123', role: 'user' },
  ];
  
  export function authenticate(email: string, password: string) {
    return mockUsers.find((u) => u.email === email && u.password === password) || null;
  }