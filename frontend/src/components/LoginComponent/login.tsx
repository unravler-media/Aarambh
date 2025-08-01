
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-hooks';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/">
            <h1 className="text-3xl font-bold text-white mb-2">Aarambh.</h1>
          </Link>
          <p className="text-gray-400">Welcome back to your account</p>
        </div>

        <Card className="bg-[#151619] border-[#2A2C36]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <LogIn size={24} className="text-tech-red" />
              Sign in
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#0A0B0F] border-[#2A2C36] text-white focus:border-tech-red"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#0A0B0F] border-[#2A2C36] text-white focus:border-tech-red pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-tech-red hover:bg-tech-red/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <a href="/register" className="text-tech-red hover:underline">
                  Sign up
                </a>
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;