import { useState } from "react";

const Register = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        //const form= e.target;
        const form = {
            first_name: firstname,
            last_name: lastname,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
        };
        //console.log(form);
        //return
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(form),
        });
        const data = await response.json();
        if (response.ok) {
            // Handle successful registration, e.g., redirect to login page or show success message
            console.log("Registration successful:", data);
            window.location.href = "/login"; // Redirect to login page
        } else {
            console.error("Registration failed:", data);
            alert("Registration failed: " + data.message);
        }

        console.log(data);
    };

    return (
        <>
            <nav className="w-full bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 p-4 flex items-center justify-between shadow-lg relative z-10">
                <div className="flex items-center space-x-3">
                    {/* Removed the + icon SVG */}
                    <span className="text-white font-extrabold text-2xl tracking-wide drop-shadow-lg">
                        MyApp
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <a
                        href="/"
                        className="relative group text-white font-medium px-3 py-1 transition"
                    >
                        Home
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                    </a>
                    <a
                        href="/login"
                        className="relative group text-white font-medium px-3 py-1 transition"
                    >
                        Login
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                    </a>
                    <a
                        href="/register"
                        className="relative group text-white font-medium px-3 py-1 transition"
                    >
                        Register
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                    </a>
                </div>
            </nav>
            <div
                className="flex items-center justify-center min-h-screen"
                style={{
                    background:
                        "radial-gradient(circle at 20% 30%, #a18cd1 0%, #fbc2eb 40%, #fad0c4 100%), repeating-linear-gradient(135deg, rgba(102,126,234,0.1) 0px, rgba(102,126,234,0.1) 2px, transparent 2px, transparent 8px)",
                    backgroundBlendMode: "overlay",
                    position: "relative",
                }}
            >
                <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-10 max-w-md w-full">
                    <h1 className="text-3xl font-bold text-center text-indigo-700">
                        Register
                    </h1>
                    <br />
                    <p className="text-lg text-center text-gray-700">
                        Create a new account
                    </p>
                    <br />
                    <br />
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="first name"
                            className="input input-neutral w-full mb-4"
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder="Last name"
                            className="input input-neutral w-full mb-4"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="input input-primary w-full mb-4"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="input input-secondary w-full mb-4"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            name="passwordConfirmation"
                            placeholder="Password confirmation"
                            className="input input-accent w-full mb-6"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                            required
                        />
                        <button
                            className="btn btn-primary w-full"
                            type="submit"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
