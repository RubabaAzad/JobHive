import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

const Layout = ({ children, user }) => {
    const token = localStorage.getItem("token");
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const [notifications, setNotifications] = useState(
        user?.notifications.map((n) => ({
            ...n,
            read: n.status === "read",
        }))
    );
    console.log("Uer Heree", user);

    // Get user initials
    const getUserInitials = (firstName) => {
        if (!firstName) return "U";
        return (
            firstName.charAt(0).toUpperCase() +
            (firstName.charAt(1) || "").toUpperCase()
        );
    };

    // Mark a single notification as read
    const markAsRead = async (notificationId) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            await fetch(`/api/mark-notification-read/${notificationId}`, {
                method: "get",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            await fetch("/api/mark-all-notifications-read", {
                method: "get",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    // Toggle dropdown
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        const count = notifications?.filter((n) => !n.read).length;
        setUnreadCount(count);
    }, [notifications]);

    const handleLogout = async () => {
        router.post("/logout");
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-lg">
                <div className="flex-1">
                    <a
                        className="btn btn-ghost normal-case text-xl"
                        href="/dashboard"
                    >
                        JobHive
                    </a>
                </div>
                <div className="flex-none">
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                className="btn btn-ghost btn-circle"
                                onClick={toggleNotifications}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 01-3.46 0"></path>
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="badge badge-error badge-sm absolute -top-1 -right-1">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-base-100 rounded-xl shadow-lg p-4 z-50 border">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold">
                                            Notifications
                                        </h3>
                                        <button
                                            className="text-sm text-primary hover:underline"
                                            onClick={markAllAsRead}
                                        >
                                            Mark all as read
                                        </button>
                                    </div>
                                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                                        {notifications.map((n) => (
                                            <li
                                                key={n.id}
                                                className={`p-2 rounded-lg cursor-pointer border transition-colors ${
                                                    n.read
                                                        ? "bg-base-200 opacity-70"
                                                        : "bg-base-100 border-primary hover:bg-base-50"
                                                }`}
                                                onClick={() => markAsRead(n.id)}
                                            >
                                                <p className="text-sm">
                                                    {n.message}
                                                </p>
                                                <span className="text-xs text-gray-500">
                                                    {n.timestamp}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Avatar + Dropdown */}
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle"
                            >
                                <div className="avatar placeholder">
                                    <div className="bg-primary text-primary-content rounded-full w-8">
                                        <span className="text-xs font-medium">
                                            {getUserInitials(user?.first_name)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box shadow-lg w-32 mt-2"
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
            </div>

            {/* Page Content */}
            <div className="p-4">{children}</div>
        </div>
    );
};

export default Layout;
