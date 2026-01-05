export function getLSRecentUsers(): string[] {
  const stored = localStorage.getItem("recentUsers");
  return stored ? JSON.parse(stored) : [];
}

export function setLSRecentUsers(recentUsers: string[]): void {
  localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
}
