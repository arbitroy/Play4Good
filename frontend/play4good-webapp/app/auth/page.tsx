'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/label"
import { Loader2 } from "lucide-react"
import { FeedbackPopup } from '../components/FeedBackPopup'
import { useUser } from '../contexts/UserContext';

const SocialIcon: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <a {...props} className="border border-gray-300 rounded-full inline-flex justify-center items-center m-0 h-10 w-10 hover:bg-gray-200">
    {props.children}
  </a>
);

const Page: React.FC = () => {
  const { setUser, loadUser } = useUser();
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  })
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
        const response = await fetch(`${api_url}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }

        setSuccess("Login successful! Redirecting...");
        setIsPopupOpen(true);

        setTimeout(() => {
            router.push('/');
        }, 2000);
    } catch (error) {
        setError((error as Error).message);
        setIsPopupOpen(true);
    } finally {
        setIsLoading(false);
    }
};


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const response = await fetch(`${api_url}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for receiving cookies
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Update user context with the new user data
    setUser({
      id: data.id.toString(),
      username: data.username,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      avatarUrl: data.avatarUrl || '/default-avatar.png',
    });

    setSuccess("Registration successful! Redirecting...");
    setIsPopupOpen(true);

    // Reload user data to ensure everything is up to date
    await loadUser();

    setTimeout(() => {
      router.push('/');
    }, 2000);
  } catch (error) {
    setError((error as Error).message);
    setIsPopupOpen(true);
  } finally {
    setIsLoading(false);
  }
};

  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    })
    setError(null);
    setSuccess(null);
  };

  return (
    <div className={`relative w-[766px] max-w-full min-h-[480px] bg-white my-[100px] mx-auto rounded-[10px] overflow-hidden ${isSignUp ? 'right-panel-active' : ''}`}>
      <FeedbackPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={error ? "Error" : "Success"}
        message={error || success || ""}
        type={error ? "error" : "success"}
      />
      <div className={`h-full absolute top-0 transition-all duration-600 ease-in-out ${isSignUp ? 'translate-x-full opacity-100 z-5' : 'opacity-0 z-1'} w-1/2 left-0`}>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center p-[0_50px] mt-5">
          <h1 className="text-2xl mb-5">Create Account</h1>
          <div className="h-5 mb-5">
            <SocialIcon href="#">
              <i className="fab fa-google"></i>
            </SocialIcon>
          </div>
          <span className="text-xs mb-5">or sign up using your email account</span>
          <Label htmlFor="signup-username" className="sr-only">Username</Label>
          <Input id="signup-username" type="text" placeholder="Username" name='username' value={formData.username} onChange={handleChange} required className="m-2 w-full p-3 bg-white border border-gray-300" />
          <div className="flex w-full justify-between">
            <Label htmlFor="signup-firstname" className="sr-only">First Name</Label>
            <Input id="signup-firstname" type="text" placeholder="First Name" name='first_name' value={formData.first_name} onChange={handleChange} required className="my-2 w-[48%] p-3 bg-white border border-gray-300" />
            <Label htmlFor="signup-lastname" className="sr-only">Last Name</Label>
            <Input id="signup-lastname" type="text" placeholder="Last Name" name='last_name' value={formData.last_name} onChange={handleChange} required className="my-2 w-[48%] p-3 bg-white border border-gray-300" />
          </div>
          <Label htmlFor="signup-email" className="sr-only">Email</Label>
          <Input id="signup-email" type="email" placeholder="Email" name='email' value={formData.email} onChange={handleChange} required className="m-2 w-full p-3 bg-white border border-gray-300" />
          <Label htmlFor="signup-password" className="sr-only">Password</Label>
          <Input id="signup-password" type="password" placeholder="Password" name='password' value={formData.password} onChange={handleChange} required className="m-2 w-full p-3 bg-white border border-gray-300" />
          <Button type="submit" disabled={isLoading} className="py-3 px-11 rounded-full bg-[#f736ce] text-white uppercase tracking-wider cursor-pointer hover:scale-97 transition-transform">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </div>
      <div className={`h-full absolute top-0 transition-all duration-800 ease-in-out ${isSignUp ? 'translate-y-full' : ''} w-1/2 left-0 z-2`}>
        <form onSubmit={handleLogin} className="flex flex-col justify-center items-center p-[0_50px] mt-5">
          <h1 className="text-2xl mb-5">Log In</h1>
          <div className="h-5 mb-5">
            <SocialIcon href="#">
              <i className="fa-brands fa-google"></i>
            </SocialIcon>
          </div>
          <span className="text-xs mb-5">or sign in using your email account</span>
          <Label htmlFor="login-email" className="sr-only">Email</Label>
          <Input id="login-email" type="email" placeholder="Email" name='email' value={formData.email} onChange={handleChange} required className="m-2 w-full p-3 bg-white border border-gray-300" />
          <Label htmlFor="login-password" className="sr-only">Password</Label>
          <Input id="login-password" type="password" placeholder="Password" name='password' value={formData.password} onChange={handleChange} required className="m-2 w-full p-3 bg-white border border-gray-300" />
          <a href="#" className="text-xs my-5 text-inherit">Forgot your password?</a>
          <Button type="submit" disabled={isLoading} className="py-3 px-11 rounded-full bg-[#f736ce] text-white uppercase tracking-wider cursor-pointer hover:scale-97 transition-transform">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </div>
      <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-800 ease-in-out z-100 ${isSignUp ? '-translate-x-full' : ''}`}>
        <div className="bg-gradient-to-r from-[#f736ce] via-[#df22a5] to-[#890544] w-full h-full relative">
          <div className={`absolute top-0 flex flex-col justify-center items-center p-[0_40px] h-full w-full text-center text-[#f5f5f5] transition-transform duration-800 ease-in-out ${isSignUp ? 'translate-x-0' : '-translate-x-full'}`}>
            <h1 className="text-2xl mb-5">Welcome Back!</h1>
            <p className="text-sm font-light leading-relaxed mb-5">To keep connected with us please login with your personal info</p>
            <Button onClick={toggleForm} className="py-3 px-11 rounded-full bg-transparent border border-white text-white uppercase tracking-wider cursor-pointer hover:scale-97 transition-transform">Log In</Button>
          </div>
          <div className={`absolute top-0 right-0 flex flex-col justify-center items-center p-[0_40px] h-full w-full text-center text-[#f5f5f5] transition-transform duration-800 ease-in-out ${isSignUp ? 'translate-x-full' : 'translate-x-0'}`}>
            <h1 className="text-2xl mb-5">Howdy, Stranger!</h1>
            <p className="text-sm font-light leading-relaxed mb-5">Sign up for an account and start your journey now!!</p>
            <Button onClick={toggleForm} className="py-3 px-11 rounded-full bg-transparent border border-white text-white uppercase tracking-wider cursor-pointer hover:scale-97 transition-transform">Sign Up</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;