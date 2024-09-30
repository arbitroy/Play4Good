'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { AuthFormContainer } from '../components/AuthFormContainer';

const SocialIcon: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <a {...props} className="border border-gray-300 rounded-full inline-flex justify-center items-center m-0 h-10 w-10 hover:bg-gray-200">
    {props.children}
  </a>
);

const Page: React.FC = () => {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setState] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  })
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setState({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await fetch(api_url + '/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.token) {
        document.cookie = `token=${data.token};path=/; max-age=3600; SameSite=Strict`;
        sessionStorage.setItem("id", data.id);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("first_name", data.first_name.String);
        sessionStorage.setItem("last_name", data.last_name.String);
        sessionStorage.setItem("avatarUrl", data.avatarUrl.String);

        console.log("Login successful!");
        setState({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password: ""
        });

        router.push('/');
      } else {
        console.error("Token not received");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      const token = data.token;

      if (token) {
        document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict`;
        sessionStorage.setItem("id", data.id);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("first_name", data.first_name.String);
        sessionStorage.setItem("last_name", data.last_name.String);
        sessionStorage.setItem("avatarUrl", data.avatarUrl.String);

        console.log("Signup successful!");
        setState({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password: ""
        });

        router.push('/');
      } else {
        console.error("Token not received");
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
    }
  };

  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setState({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    })
  };

  return (
    <div className={`relative w-[766px] max-w-full min-h-[480px] bg-white my-[100px] mx-auto rounded-[10px] overflow-hidden ${isSignUp ? 'right-panel-active' : ''}`}>
      <div className={`h-full absolute top-0 transition-all duration-600 ease-in-out ${isSignUp ? 'translate-x-full opacity-100 z-5' : 'opacity-0 z-1'} w-1/2 left-0`}>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center p-[0_50px] mt-5">
          <h1 className="text-2xl mb-5">Create Account</h1>
          <div className="h-5 mb-5">
            <SocialIcon href="#">
              <i className="fab fa-google"></i>
            </SocialIcon>
          </div>
          <span className="text-xs mb-5">or sign up using your email account</span>
          <input type="text" placeholder="Username" name='username' value={formData.username} onChange={handleChange} required className="m-2 w-full p-3 bg-white border border-gray-300" />
          <div className="flex w-full justify-between">
            <input type="text" placeholder="First Name" name='first_name' value={formData.first_name} onChange={handleChange} required className="my-2 w-[48%] p-3 bg-white border border-gray-300" />
            <input type="text" placeholder="Last Name" name='last_name' value={formData.last_name} onChange={handleChange} required className="my-2 w-[48%] p-3 bg-white border border-gray-300" />
          </div>
          <input type="email" placeholder="Email" name='email' value={formData.email} onChange={handleChange} required className="m-2 w-full p-3 bg-white border border-gray-300" />
          <input type="password" placeholder="Password" name='password' value={formData.password} onChange={handleChange} required className="m-2 w-full p-3 bg-white border border-gray-300" />
          <button type="submit" className="py-3 px-11 rounded-full bg-[#f736ce] text-white uppercase tracking-wider cursor-pointer hover:scale-97 transition-transform">Sign Up</button>
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
          <input type="email" placeholder="Email" name='email' value={formData.email} onChange={handleChange} required className="m-2 w-full p-3 bg-white border border-gray-300" />
          <input type="password" placeholder="Password" name='password' value={formData.password} onChange={handleChange} required className="m-2 w-full p-3 bg-white border border-gray-300" />
          <a href="#" className="text-xs my-5 text-inherit">Forgot your password?</a>
          <button type="submit" className="py-3 px-11 rounded-full bg-[#f736ce] text-white uppercase tracking-wider cursor-pointer hover:scale-97 transition-transform">Sign In</button>
        </form>
      </div>
      <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-800 ease-in-out z-100 ${isSignUp ? '-translate-x-full' : ''}`}>
        <div className="bg-gradient-to-r from-[#f736ce] via-[#df22a5] to-[#890544] w-full h-full relative">
          <div className={`absolute top-0 flex flex-col justify-center items-center p-[0_40px] h-full w-full text-center text-[#f5f5f5] transition-transform duration-800 ease-in-out ${isSignUp ? 'translate-x-0' : '-translate-x-full'}`}>
            <h1 className="text-2xl mb-5">Welcome Back!</h1>
            <p className="text-sm font-light leading-relaxed mb-5">To keep connected with us please login with your personal info</p>
            <button onClick={toggleForm} className="py-3 px-11 rounded-full bg-transparent border border-white text-white uppercase tracking-wider cursor-pointer hover:scale-97 transition-transform">Log In</button>
          </div>
          <div className={`absolute top-0 right-0 flex flex-col justify-center items-center p-[0_40px] h-full w-full text-center text-[#f5f5f5] transition-transform duration-800 ease-in-out ${isSignUp ? 'translate-x-full' : 'translate-x-0'}`}>
            <h1 className="text-2xl mb-5">Howdy, Stranger!</h1>
            <p className="text-sm font-light leading-relaxed mb-5">Sign up for an account and start your journey now!!</p>
            <button onClick={toggleForm} className="py-3 px-11 rounded-full bg-transparent border border-white text-white uppercase tracking-wider cursor-pointer hover:scale-97 transition-transform">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;