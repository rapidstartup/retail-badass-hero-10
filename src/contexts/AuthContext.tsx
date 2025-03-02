
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active session on mount
    const getSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
        
        // Handle password recovery event
        if (event === 'PASSWORD_RECOVERY') {
          // The user arrived from a password reset email
          navigate('/login?firstTime=true');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      console.log("Attempting to sign in with email:", cleanEmail);
      
      // Check if a staff record exists with this email before attempting to sign in
      const { data: staffList, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .ilike('email', cleanEmail);
      
      if (staffError) {
        console.error("Staff verification error:", staffError);
        throw new Error("Error verifying staff account");
      }
      
      if (!staffList || staffList.length === 0) {
        throw new Error("No staff account found with this email");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful, user data:", data.user);
      
      if (data.user) {
        const staffData = staffList[0];
          
        console.log("Staff verification after login:", { staffData });
        
        // Update the staff record with auth_id if not already set
        if (!staffData.auth_id) {
          const { error: updateError } = await supabase
            .from('staff')
            .update({ auth_id: data.user.id })
            .eq('id', staffData.id);
            
          if (updateError) {
            console.error("Failed to update staff auth_id:", updateError);
          } else {
            console.log("Updated staff record with auth_id");
          }
        }
      }
      
      navigate("/");
      toast.success("Signed in successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate("/login");
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
