import { router } from "@inertiajs/react";

const Layout = ({ children, user }) => {
    const handleLogout = async () => {
        router.post("/logout");
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Top Navbar */}
            <div className="navbar bg-base-100 shadow-lg">
                <div className="flex-1">
                    <a
                        className="btn btn-ghost normal-case text-xl"
                        href="/dashboard"
                    >
                        JobHive
                    </a>
                </div>
                <div className="flex-none gap-2">
                    <button className="btn btn-ghost btn-circle">
                        {/* Bell Icon */}
                        <svg
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 01-3.46 0"></path>
                        </svg>
                    </button>

                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="m-5 mr-10">
                            <div className="avatar">
                                <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img
                                        src="https://i.pravatar.cc/150?img=3"
                                        alt="profile"
                                    />
                                </div>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box shadow-sm w-20"
                        >
                            <li>
                                <button
                                    className="btn btn-error btn-sm"
                                    onClick={async () => {
                                        const token =
                                            localStorage.getItem("token");
                                        if (!token) return;
                                        await fetch("/api/logout", {
                                            method: "POST",
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                                "Content-Type":
                                                    "application/json",
                                            },
                                        });
                                        localStorage.removeItem("token");
                                        window.location.href = "/login";
                                    }}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4">{children}</div>
        </div>
    );
};

export default Layout;
