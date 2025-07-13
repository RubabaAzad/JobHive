import { useEffect, useState } from "react";
import Layout from "../Layouts/Layout";

const Edit = () => {
    const [user, setUser] = useState(null);
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [occupation, setOccupation] = useState("");

    const token = localStorage.getItem("token");

    // useEffect(() => {

    //}, [token]);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setFirstName(userData.first_name);
                    setLastName(userData.last_name);
                    setEmail(userData.email);
                    setLocation(userData.location);
                    setOccupation(userData.occupation);
                    console.log("User data:", userData);
                    console.log("user", user);
                } else {
                    window.location.href = "/login";
                }
            } catch (error) {
                window.location.href = "/login";
            }
        };

        if (token) {
            fetchUser();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedUser = {
            first_name,
            last_name,
            email,
            location,
            occupation,
        };
        try {
            const response = await fetch("/api/edit-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUser),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Profile updated successfully:", data);
                window.location.href = "/dashboard"; // Redirect to dashboard after successful update
                // Optionally, you can redirect or show a success message
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <Layout user={user}>
            <div className="flex items-center justify-center min-h-screen relative">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md bg-opacity-90 backdrop-blur">
                    <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="input input-primary w-full mb-4 bg-white bg-opacity-70"
                            value={user ? first_name : ""}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="input input-primary w-full mb-4 bg-white bg-opacity-70"
                            value={user ? last_name : ""}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-primary w-full mb-4 bg-white bg-opacity-70"
                            value={user ? email : ""}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="location"
                            className="input input-primary w-full mb-4 bg-white bg-opacity-70"
                            value={user ? location : ""}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Occupation"
                            className="input input-primary w-full mb-4 bg-white bg-opacity-70"
                            value={user ? occupation : ""}
                            onChange={(e) => setOccupation(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Save Changes
                        </button>
                    </form>
                    <button
                        onClick={() =>
                            document.getElementById("my_modal_5").showModal()
                        }
                        className="btn btn-error text-white w-full mt-4"
                    >
                        Delete User
                    </button>
                    <dialog
                        id="my_modal_5"
                        className="modal modal-bottom sm:modal-middle"
                    >
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">
                                Are you sure want to delete the account?
                            </h3>

                            <div className="modal-action">
                                <button
                                    className="btn btn-error text-white"
                                    onClick={async () => {
                                        const response = await fetch(
                                            "/api/delete-account",
                                            {
                                                method: "DELETE",
                                                headers: {
                                                    Authorization: `Bearer ${token}`,
                                                },
                                            }
                                        );
                                        if (response.ok) {
                                            console.log(
                                                "User deleted successfully"
                                            );
                                            window.location.href = "/login"; // Redirect to login after deletion
                                        } else {
                                            console.error(
                                                "Failed to delete user"
                                            );
                                        }
                                    }}
                                >
                                    Yes
                                </button>
                                <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn">No</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>
        </Layout>
    );
};

export default Edit;
