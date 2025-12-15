export const authService = {
  signUp: async (data: any) => ({}),
  signIn: async (data: any) => ({}),
  signInWithGoogle: async () => ({}),
  signOut: async () => {},
  getUserProfile: async (uid: string) => null,
  updateUserProfile: async (uid: string, updates: any) => ({}),
  onAuthStateChanged: (cb: (user: any | null) => void) => {
    // Minimal stub - returns unsubscribe
    const unsub = () => {};
    return unsub;
  },
  getCurrentUser: () => null,
};

export default authService;
