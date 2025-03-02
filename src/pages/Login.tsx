
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import LoginForm from "@/components/auth/LoginForm";
import PasswordSetupForm from "@/components/auth/PasswordSetupForm";
import { useSignIn } from "@/hooks/useSignIn";
import { usePasswordSetup } from "@/hooks/usePasswordSetup";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const [isNewStaffSetup, setIsNewStaffSetup] = useState(false);
  const { signIn, isAuthenticated, bypassAuth, setBypassAuth } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('firstTime') === 'true') {
      setIsFirstTimeLogin(true);
    }
  }, [location]);

  const { isLoading: isSignInLoading, handleSignIn } = useSignIn(
    signIn,
    setIsFirstTimeLogin
  );

  const { isLoading: isPasswordSetupLoading, handleSetPassword } = usePasswordSetup(signIn);

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSetPassword(
      email,
      firstName,
      lastName,
      newPassword,
      confirmPassword,
      () => {
        setIsFirstTimeLogin(false);
        setIsNewStaffSetup(false);
      },
      isNewStaffSetup
    );
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, password);
  };

  const handleFirstTimeSetupClick = () => {
    setIsFirstTimeLogin(true);
    setIsNewStaffSetup(false);
  };

  const handleNewStaffSetupClick = () => {
    setIsFirstTimeLogin(true);
    setIsNewStaffSetup(true);
  };

  const handleBackToLogin = () => {
    setIsFirstTimeLogin(false);
    setIsNewStaffSetup(false);
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
  };
  
  const handleBypassAuth = () => {
    setBypassAuth(true);
    window.location.href = '/'; // Hard redirect to ensure full app reload
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center theme-bg p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isFirstTimeLogin 
              ? isNewStaffSetup 
                ? "New Staff Registration" 
                : "Set Up Your Account" 
              : `${settings.storeName || "NextPOS"} Staff Login`}
          </CardTitle>
          <CardDescription className="text-center">
            {isFirstTimeLogin 
              ? isNewStaffSetup
                ? "Create a new staff account to get started"
                : "Welcome! Please set up your account to continue" 
              : "Enter your credentials to sign in to your account"}
          </CardDescription>
        </CardHeader>
        
        {isFirstTimeLogin ? (
          <PasswordSetupForm
            email={email}
            setEmail={setEmail}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleSetPassword={handlePasswordSetup}
            handleBackToLogin={handleBackToLogin}
            isLoading={isPasswordSetupLoading}
            isNewStaffSetup={isNewStaffSetup}
          />
        ) : (
          <>
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleSignIn={handleSignInSubmit}
              isLoading={isSignInLoading}
              onFirstTimeLoginDetected={setIsFirstTimeLogin}
              onFirstTimeSetupClick={handleFirstTimeSetupClick}
              onNewStaffSetupClick={handleNewStaffSetupClick}
            />
            <div className="px-6 pb-4">
              <Button 
                type="button" 
                variant="secondary" 
                className="w-full mt-2" 
                onClick={handleBypassAuth}
              >
                Skip Login (Development Mode)
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Login;
