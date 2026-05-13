import React, { createContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

export const AuthContext = createContext();

/**
 * AuthProvider that wraps Clerk hooks to provide a consistent
 * interface to the rest of the app. This preserves the existing
 * { user, logout, loading } shape that components depend on.
 */
export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Map Clerk user to the shape our app expects
  const user = clerkUser
    ? {
        _id: clerkUser.id,
        clerkId: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        profileImage:
          clerkUser.imageUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            clerkUser.fullName || 'User'
          )}&background=random`,
      }
    : null;

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading: !isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};
