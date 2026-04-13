"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import type { UserDoc } from "@/types";

// Extend UserDoc with the id field from Firestore
export interface UserData extends UserDoc {
  id: string;
}

interface AuthContextType {
  user: UserData | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    mobile: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  addPoints: (points: number) => Promise<void>;
  recordActivity: (
    activityType: string,
    activityId: string,
    activityTitle: string,
    pointsEarned: number,
    score?: number
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to get auth header
  const getAuthHeaders = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return {};
    const token = await currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  };

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          const res = await fetch("/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();

    // Fetch user profile from Firestore
    const res = await fetch("/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
    }
  };

  const register = async (
    name: string,
    email: string,
    mobile: string,
    password: string
  ) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get the token from the newly created user
    const token = await credential.user.getIdToken();

    // Create user document in Firestore — now authenticated via token
    await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        name,
        mobile,
      }),
    });

    const res = await fetch("/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const fetchProfile = async () => {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return;

    const res = await fetch("/api/user/profile", { headers });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
    }
  };

  const addPoints = async (points: number) => {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return;

    const res = await fetch("/api/user/points", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ points }),
    });
    if (res.ok) {
      const updatedUser = await res.json();
      setUser(updatedUser);
    }
  };

  const recordActivity = async (
    activityType: string,
    activityId: string,
    activityTitle: string,
    pointsEarned: number,
    score?: number
  ) => {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return;

    const res = await fetch("/api/user/activity", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        activityType,
        activityId,
        activityTitle,
        pointsEarned,
        score,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) setUser(data.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        register,
        logout,
        resetPassword,
        fetchProfile,
        addPoints,
        recordActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
