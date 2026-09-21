'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrentUser, UserRole, Profile } from '@/lib/types';
import { db, INITIAL_PROFILES } from '@/lib/store/mock-db';
import { createClient } from '@/lib/supabase/client';

export interface SignUpData {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  departmentId?: string;
  classId?: string;
}

interface AuthContextType {
  user: CurrentUser | null;
  loading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved session in localStorage
    const saved = localStorage.getItem('edugap_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('edugap_current_user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password?: string,
    expectedRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    // 1. Try Supabase Auth if configured
    const supabase = createClient();
    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.warn('Supabase auth attempt returned:', error.message);
        } else if (data.user) {
          const authUser: CurrentUser = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            role: (data.user.user_metadata?.role as UserRole) || expectedRole || 'student',
            departmentId: '22222222-2222-2222-2222-222222222001',
            departmentName: 'Mathematics & Computational Sciences',
          };
          setUser(authUser);
          localStorage.setItem('edugap_current_user', JSON.stringify(authUser));
          return { success: true };
        }
      } catch (err) {
        console.warn('Supabase client error, falling back to institutional registry:', err);
      }
    }

    // 2. Authenticate against registered institutional database
    const trimmedEmail = email.trim().toLowerCase();
    const existing = db.profiles.find((p) => p.email.toLowerCase() === trimmedEmail);

    if (existing) {
      if (!existing.isActive) {
        return { success: false, error: 'This institutional account is inactive. Please contact your HOD.' };
      }

      if (expectedRole && existing.role !== expectedRole) {
        return {
          success: false,
          error: `This account is registered as a ${existing.role.toUpperCase()}, not as a ${expectedRole.toUpperCase()}. Please select the correct role portal.`,
        };
      }

      const authUser: CurrentUser = {
        id: existing.id,
        email: existing.email,
        fullName: existing.fullName,
        role: existing.role,
        departmentId: existing.departmentId,
        departmentName: 'Mathematics & Computational Sciences',
      };

      setUser(authUser);
      localStorage.setItem('edugap_current_user', JSON.stringify(authUser));
      return { success: true };
    }

    return {
      success: false,
      error: 'Unrecognized institutional email. Please verify credentials or register for access.',
    };
  };

  const signup = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    if (db.profiles.some((p) => p.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An institutional profile with this email address already exists.' };
    }

    // Attempt Supabase sign-up if credentials configured
    const supabase = createClient();
    let newUserId = `usr-${Date.now()}`;
    if (supabase && data.password) {
      try {
        const { data: sbData, error: sbError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              role: data.role,
            },
          },
        });
        if (sbData?.user) {
          newUserId = sbData.user.id;
        }
      } catch (e) {
        console.warn('Supabase sign-up fallback:', e);
      }
    }

    const newProfile: Profile = {
      id: newUserId,
      email: trimmedEmail,
      fullName: data.fullName,
      role: data.role,
      departmentId: data.departmentId || '22222222-2222-2222-2222-222222222001',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    db.profiles.push(newProfile);

    // If student, create default study plan
    if (data.role === 'student') {
      db.studyPlans.push({
        id: `sp-${Date.now()}`,
        studentId: newProfile.id,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        schoolEndTime: '15:30',
        commuteTimeMins: 30,
        extracurriculars: 'None',
        preferredStudyTime: '18:00 - 20:00',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        examGoals: 'Complete Grade 10 Diagnostics',
        status: 'active',
        sessions: [],
        createdAt: new Date().toISOString(),
      });
    }

    const authUser: CurrentUser = {
      id: newProfile.id,
      email: newProfile.email,
      fullName: newProfile.fullName,
      role: newProfile.role,
      departmentId: newProfile.departmentId,
      departmentName: 'Mathematics & Computational Sciences',
    };

    setUser(authUser);
    localStorage.setItem('edugap_current_user', JSON.stringify(authUser));
    return { success: true };
  };

  const logout = () => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem('edugap_current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
