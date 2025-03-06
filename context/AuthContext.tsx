import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useSupabase } from './SupabaseContext';
import { User } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    // Check for existing session
    const loadUser = async () => {
      try {
        const sessionString = await SecureStore.getItemAsync('session');
        
        if (sessionString) {
          const session = JSON.parse(sessionString);
          if (session) {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) throw error;
            setUser(data);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [supabase]);

  const createUserProfile = async (userId: string, email: string, name: string) => {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email,
            name,
            created_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.user.email_confirmed_at) {
        throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.');
      }

      // User is verified, proceed with profile creation/fetching
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      let userData: User;

      if (profileError || !profileData) {
        // Profile doesn't exist, create it
        userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          createdAt: data.user.created_at || new Date().toISOString()
        };
        
        const profileCreated = await createUserProfile(
          userData.id,
          userData.email,
          userData.name
        );

        if (!profileCreated) {
          console.warn('Failed to create profile, using basic user data');
        }
      } else {
        userData = profileData;
      }

      setUser(userData);
      
      // Store session with user data
      await SecureStore.setItemAsync('session', JSON.stringify({
        ...data.session,
        user: userData
      }));
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name // Store name in auth metadata
          }
        }
      });

      if (authError) throw authError;

      // Don't create profile yet - wait for email verification
      // Profile will be created on first successful login after email verification

    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      await SecureStore.deleteItemAsync('session');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      forgotPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
