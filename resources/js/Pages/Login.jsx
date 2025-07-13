import React from 'react'
import { useState } from 'react';

const Login = () => {
    const [email,setEmail] = useState('');  
    const [password,setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        //const form= e.target;
        const form = {
                    email: email,
                    password: password
                }
    
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(form)
            });
            const data = await response.json();
            localStorage.setItem('token', data.token); // Store the token in localStorage for future requests
        if (response.ok) {
            // Handle successful registration, e.g., redirect to login page or show success message 
            console.log('login successful:', data);
            window.location.href = '/dashboard'; // Redirect to dashboard page  
        } else {
            console.error('login failed:', data);
        
            throw new Error('Login failed');
        }   

            console.log(data);
        }
return (
        <>
                <nav className="w-full bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 p-4 flex items-center justify-between shadow-lg relative z-10">
                        <div className="flex items-center space-x-3">
                                <span className="text-white font-extrabold text-2xl tracking-wide drop-shadow-lg">MyApp</span>
                        </div>
                        <div className="flex items-center space-x-4">
                                <a href="/" className="relative group text-white font-medium px-3 py-1 transition">
                                        Home
                                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                                </a>
                                <a href="/login" className="relative group text-white font-medium px-3 py-1 transition">
                                        Login
                                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                                </a>
                                <a href="/register" className="relative group text-white font-medium px-3 py-1 transition">
                                        Register
                                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                                </a>
                        </div>
                </nav>
                <div
                        className="flex items-center justify-center min-h-screen"
                        style={{
                                background:
                                        'radial-gradient(circle at 20% 30%, #a18cd1 0%, #fbc2eb 40%, #fad0c4 100%), repeating-linear-gradient(135deg, rgba(102,126,234,0.1) 0px, rgba(102,126,234,0.1) 2px, transparent 2px, transparent 8px)',
                                backgroundBlendMode: 'overlay',
                                position: 'relative',
                        }}
                >
                        <form
                                onSubmit={handleSubmit}
                                className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-xl p-8 flex flex-col items-center"
                        >
                                <h1 className="text-3xl font-bold text-indigo-700 mb-2">Login</h1>
                                <p className="text-lg text-gray-700 mb-6">Welcome back! Please login to your account.</p>
                                <input
                                        type="text"
                                        placeholder="Email"
                                        className="input input-primary w-full mb-4 bg-white bg-opacity-70"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                />
                                <input
                                        type="password"
                                        placeholder="Password"
                                        className="input input-secondary w-full mb-6 bg-white bg-opacity-70"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                />
                                <button className="btn btn-primary w-full" type="submit">
                                        Login
                                </button>
                        </form>
                </div>
        </>
)
}

export default Login
