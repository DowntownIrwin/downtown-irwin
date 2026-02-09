import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Lock, LogIn } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

export default function AdminLogin() {
  usePageTitle("Admin Login");
  const [, setLocation] = useLocation();
  const { login, isLoggingIn, loginError, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (isAuthenticated) {
    setTimeout(() => setLocation("/admin"), 0);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      setLocation("/admin");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-serif" data-testid="text-admin-login-title">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage site content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              data-testid="input-username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              data-testid="input-password"
            />
          </div>
          {loginError && (
            <p className="text-sm text-destructive" data-testid="text-login-error">
              Invalid username or password
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isLoggingIn} data-testid="button-login">
            <LogIn className="w-4 h-4 mr-2" />
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
