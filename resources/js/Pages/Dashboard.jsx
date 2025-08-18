import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Layout from "../Layouts/Layout";
const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState(null);
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [myjobtitle, setMyJobTitle] = useState("");
    const [myjobid, setMyJobId] = useState(0);
    const [myjobdescription, setMyJobDescription] = useState("");
    const [myjobcompany, setMyJobCompany] = useState("");
    const [myjobdeadline, setMyJobDeadline] = useState("");
    const [myjobsalary, setMyJobSalary] = useState(0);
    const [myjoblocation, setMyJobLocation] = useState("");
    const [myjobcategory, setMyJobCategory] = useState("");
    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
        }
    }, []);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/user", {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });
                console.log("response", response);

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setLoading(false);
                    console.log("userData", userData);
                } else {
                    setUnauthorized(true);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUnauthorized(true);
                setLoading(false);
            }
        };

        fetchUser();
    }, []);
    useEffect(() => {
        const fetchjobs = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/jobs", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const jobsData = await response.json();
                    setJobs(jobsData.jobs);
                    setFilteredJobs(
                        jobsData.jobs.filter((job) =>
                            job.title
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                        )
                    );
                    console.log("jobs", jobs);
                } else {
                    window.location.href = "/login";
                }
            } catch (error) {
                window.location.href = "/login";
            }
        };

        if (token) {
            fetchjobs();
        }
    }, [token]);
    const handleApplySubmit = async (jobid) => {
        if (!coverLetter || !resume) {
            alert("Please fill in all fields.");
            return;
        }
        const formData = new FormData();
        formData.append("cover_letter", coverLetter);
        formData.append("cv", resume);
        try {
            const response = await fetch(`/api/jobs/${jobid}/apply`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            console.log("response", response);
            if (response.ok) {
                alert("Application submitted successfully!");
                setCoverLetter("");
                setResume(null);
                document.getElementById(`my_modal_${jobid}`).close();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error submitting application:", error);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    // Unauthorized state
    if (unauthorized) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                        <svg
                            width="48"
                            height="48"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            className="text-error"
                        >
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <h2 className="card-title text-error">Unauthorized</h2>
                        <p>You need to login to access this page.</p>
                        <div className="card-actions mt-4">
                            <button
                                className="btn btn-primary"
                                onClick={() => router.visit("/login")}
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Layout user={user}>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Profile Card + My Applications */}
                <div className="col-span-1 flex flex-col gap-4">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body items-center text-center">
                            {/* User Icon */}
                            <svg
                                width="32"
                                height="32"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="12" cy="7" r="4"></circle>
                                <path d="M5.5 21a8.38 8.38 0 0113 0"></path>
                            </svg>
                            <h2 className="card-title">
                                {user?.first_name || "User"}
                            </h2>
                            <p>{user?.occupation || "No occupation"}</p>
                            <progress
                                className="progress progress-primary w-56"
                                value="75"
                                max="100"
                            ></progress>
                            <div className="card-actions mt-2">
                                <button
                                    className="btn btn-outline btn-primary btn-sm"
                                    onClick={() => router.visit("/edit")}
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">
                                {/* FileText Icon */}
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                My Applications
                            </h2>
                            <ul className="list-disc ml-6 mt-2">
                                <li>
                                    Frontend Developer at TechSoft –{" "}
                                    <span className="text-success">
                                        Shortlisted
                                    </span>
                                </li>
                                <li>
                                    Backend Engineer at Cloudify –{" "}
                                    <span className="text-warning">Viewed</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">
                                {/* FileText Icon */}
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                My Jobs
                            </h2>
                            <ul className="list-disc ml-6 mt-2">
                                {user?.jobs?.length > 0 ? (
                                    user.jobs.map((job) => (
                                        <li key={job.id} className="my-2">
                                            <div className="flex flex-row justify-between items-center">
                                                <div
                                                    className="w-full hover:underline cursor-pointer"
                                                    onClick={() => {
                                                        setMyJobTitle(
                                                            job.title
                                                        );
                                                        setMyJobId(job.id);
                                                        setMyJobDescription(
                                                            job.description
                                                        );
                                                        setMyJobCompany(
                                                            job.company_name
                                                        );
                                                        setMyJobDeadline(
                                                            job.deadline
                                                        );
                                                        setMyJobSalary(
                                                            job.salary
                                                        );
                                                        setMyJobLocation(
                                                            job.location
                                                        );
                                                        setMyJobCategory(
                                                            job.category
                                                        );

                                                        document
                                                            .getElementById(
                                                                `job_modal_${job.id}`
                                                            )
                                                            .showModal();
                                                    }}
                                                >
                                                    {job.title.length > 20
                                                        ? `${job.title.slice(
                                                              0,
                                                              20
                                                          )}...`
                                                        : job.title}{" "}
                                                    –{" "}
                                                    <span className="text-success">
                                                        Active
                                                    </span>
                                                </div>
                                                <dialog
                                                    id={`job_modal_${job.id}`}
                                                    className="modal modal-bottom sm:modal-middle"
                                                >
                                                    <div className="modal-box flex flex-col gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <label htmlFor="jobtitle">
                                                                Job Title:
                                                            </label>
                                                            <input
                                                                className="input input-neutral w-full"
                                                                type="text"
                                                                value={
                                                                    myjobtitle
                                                                }
                                                                onChange={(e) =>
                                                                    setMyJobTitle(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <label htmlFor="jobcompany">
                                                                Company Name:
                                                            </label>
                                                            <input
                                                                className="input input-neutral w-full"
                                                                type="text"
                                                                value={
                                                                    myjobcompany
                                                                }
                                                                onChange={(e) =>
                                                                    setMyJobCompany(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            ></input>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <label htmlFor="jobdescription">
                                                                Description:
                                                            </label>
                                                            <textarea
                                                                className="textarea textarea-bordered w-full"
                                                                placeholder="Job description"
                                                                value={
                                                                    myjobdescription
                                                                }
                                                                onChange={(e) =>
                                                                    setMyJobDescription(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            ></textarea>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <label htmlFor="jobdeadline">
                                                                Deadline:
                                                            </label>
                                                            <input
                                                                className="input input-neutral w-full"
                                                                type="date"
                                                                value={
                                                                    myjobdeadline
                                                                }
                                                                onChange={(e) =>
                                                                    setMyJobDeadline(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            ></input>
                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                            <label htmlFor="jobsalary">
                                                                Salary:
                                                            </label>
                                                            <input
                                                                className="input input-neutral w-full"
                                                                type="number"
                                                                value={
                                                                    myjobsalary
                                                                }
                                                                onChange={(e) =>
                                                                    setMyJobSalary(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            ></input>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <label htmlFor="joblocation">
                                                                Location:
                                                            </label>
                                                            <input
                                                                className="input input-neutral w-full"
                                                                type="text"
                                                                value={
                                                                    myjoblocation
                                                                }
                                                                onChange={(e) =>
                                                                    setMyJobLocation(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            ></input>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <label htmlFor="jobcategory">
                                                                Category:
                                                            </label>
                                                            <input
                                                                className="input input-neutral w-full"
                                                                type="text"
                                                                value={
                                                                    myjobcategory
                                                                }
                                                                onChange={(e) =>
                                                                    setMyJobCategory(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            ></input>
                                                        </div>

                                                        <div className="modal-action space-x-2">
                                                            <button
                                                                className="btn btn-success"
                                                                onClick={async (
                                                                    e
                                                                ) => {
                                                                    try {
                                                                        const response =
                                                                            await fetch(
                                                                                `/api/jobs/${myjobid}`,
                                                                                {
                                                                                    method: "PUT",
                                                                                    headers:
                                                                                        {
                                                                                            "Content-Type":
                                                                                                "application/json",
                                                                                            Authorization: `Bearer ${token}`,
                                                                                        },
                                                                                    body: JSON.stringify(
                                                                                        {
                                                                                            title: myjobtitle,
                                                                                            company_name:
                                                                                                myjobcompany,
                                                                                            description:
                                                                                                myjobdescription,
                                                                                            deadline:
                                                                                                myjobdeadline,
                                                                                            salary: myjobsalary,
                                                                                            location:
                                                                                                myjoblocation,
                                                                                            category:
                                                                                                myjobcategory,
                                                                                        }
                                                                                    ),
                                                                                }
                                                                            );
                                                                        if (
                                                                            response.ok
                                                                        ) {
                                                                            alert(
                                                                                "Job updated successfully!"
                                                                            );
                                                                            document
                                                                                .getElementById(
                                                                                    `job_modal_${myjobid}`
                                                                                )
                                                                                .close();
                                                                            window.location.reload();
                                                                        } else {
                                                                            alert(
                                                                                "Failed to update job."
                                                                            );
                                                                        }
                                                                    } catch (error) {
                                                                        console.error(
                                                                            "Error updating job:",
                                                                            error
                                                                        );
                                                                        alert(
                                                                            "An error occurred while updating the job."
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                Save Changes
                                                            </button>
                                                            <form method="dialog">
                                                                {/* if there is a button in form, it will close the modal */}
                                                                <button
                                                                    className="btn"
                                                                    onClick={() => {
                                                                        setMyJobTitle(
                                                                            ""
                                                                        );
                                                                        setMyJobId(
                                                                            0
                                                                        );
                                                                        setMyJobDescription(
                                                                            ""
                                                                        );
                                                                        setMyJobCompany(
                                                                            ""
                                                                        );
                                                                        setMyJobDeadline(
                                                                            ""
                                                                        );
                                                                        setMyJobSalary(
                                                                            0
                                                                        );
                                                                        setMyJobLocation(
                                                                            ""
                                                                        );
                                                                        setMyJobCategory(
                                                                            ""
                                                                        );
                                                                    }}
                                                                >
                                                                    Close
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </dialog>
                                                <div className="w-20 text-sm btn btn-error btn-sm">
                                                    Delete
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>No jobs posted yet.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Recommended Jobs + Post a Job Button */}
                <div className="col-span-2 flex flex-col gap-4">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex justify-between items-center">
                                <h2 className="card-title">
                                    {/* Briefcase Icon */}
                                    <svg
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <rect
                                            x="2"
                                            y="7"
                                            width="20"
                                            height="14"
                                            rx="2"
                                            ry="2"
                                        ></rect>
                                        <path d="M16 3v4"></path>
                                        <path d="M8 3v4"></path>
                                        <path d="M2 13h20"></path>
                                    </svg>
                                    Recommended Jobs
                                </h2>
                                <div className="flex gap-2">
                                    <label className="input">
                                        <svg
                                            className="h-[1em] opacity-50"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <g
                                                strokeLinejoin="round"
                                                strokeLinecap="round"
                                                strokeWidth="2.0"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <circle
                                                    cx="11"
                                                    cy="11"
                                                    r="8"
                                                ></circle>
                                                <path d="m21 21-4.3-4.3"></path>
                                            </g>
                                        </svg>
                                        <input
                                            type="search"
                                            className="grow"
                                            placeholder="Search jobs"
                                            value={searchQuery}
                                            onChange={async (e) => {
                                                setSearchQuery(e.target.value);
                                                const response = await fetch(
                                                    `/api/search-jobs?query=${e.target.value}`,
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                    }
                                                );
                                                if (response.ok) {
                                                    const data =
                                                        await response.json();
                                                    setFilteredJobs(
                                                        data.jobs.filter(
                                                            (job) =>
                                                                job.title
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        e.target.value.toLowerCase()
                                                                    )
                                                        )
                                                    );
                                                } else {
                                                    console.error(
                                                        "Error fetching jobs"
                                                    );
                                                }
                                            }}
                                        />
                                    </label>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() =>
                                            document
                                                .getElementById("my_modal_4")
                                                .showModal()
                                        }
                                    >
                                        Post a Job
                                    </button>
                                    <dialog id="my_modal_4" className="modal">
                                        <div className="modal-box flex flex-col gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="jobtitle">
                                                    Job Title:
                                                </label>
                                                <input
                                                    className="input input-neutral w-full"
                                                    type="text"
                                                    value={myjobtitle}
                                                    onChange={(e) =>
                                                        setMyJobTitle(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="jobcompany">
                                                    Company Name:
                                                </label>
                                                <input
                                                    className="input input-neutral w-full"
                                                    type="text"
                                                    value={myjobcompany}
                                                    onChange={(e) =>
                                                        setMyJobCompany(
                                                            e.target.value
                                                        )
                                                    }
                                                ></input>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="jobdescription">
                                                    Description:
                                                </label>
                                                <textarea
                                                    className="textarea textarea-bordered w-full"
                                                    placeholder="Job description"
                                                    value={myjobdescription}
                                                    onChange={(e) =>
                                                        setMyJobDescription(
                                                            e.target.value
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="jobdeadline">
                                                    Deadline:
                                                </label>
                                                <input
                                                    className="input input-neutral w-full"
                                                    type="date"
                                                    value={myjobdeadline}
                                                    onChange={(e) =>
                                                        setMyJobDeadline(
                                                            e.target.value
                                                        )
                                                    }
                                                ></input>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="jobsalary">
                                                    Salary:
                                                </label>
                                                <input
                                                    className="input input-neutral w-full"
                                                    type="number"
                                                    value={myjobsalary}
                                                    onChange={(e) =>
                                                        setMyJobSalary(
                                                            e.target.value
                                                        )
                                                    }
                                                ></input>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="joblocation">
                                                    Location:
                                                </label>
                                                <input
                                                    className="input input-neutral w-full"
                                                    type="text"
                                                    value={myjoblocation}
                                                    onChange={(e) =>
                                                        setMyJobLocation(
                                                            e.target.value
                                                        )
                                                    }
                                                ></input>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="jobcategory">
                                                    Category:
                                                </label>
                                                <input
                                                    className="input input-neutral w-full"
                                                    type="text"
                                                    value={myjobcategory}
                                                    onChange={(e) =>
                                                        setMyJobCategory(
                                                            e.target.value
                                                        )
                                                    }
                                                ></input>
                                            </div>

                                            <div className="modal-action space-x-2">
                                                <button
                                                    className="btn btn-success"
                                                    onClick={async (e) => {
                                                        try {
                                                            if (
                                                                myjobtitle ===
                                                                    "" ||
                                                                myjobcompany ===
                                                                    "" ||
                                                                myjobdescription ===
                                                                    "" ||
                                                                myjobdeadline ===
                                                                    "" ||
                                                                myjobsalary <=
                                                                    0 ||
                                                                myjoblocation ===
                                                                    "" ||
                                                                myjobcategory ===
                                                                    ""
                                                            ) {
                                                                alert(
                                                                    "Please fill all fields correctly."
                                                                );
                                                            }
                                                            const response =
                                                                await fetch(
                                                                    `/api/post-a-job`,
                                                                    {
                                                                        method: "POST",
                                                                        headers:
                                                                            {
                                                                                "Content-Type":
                                                                                    "application/json",
                                                                                Authorization: `Bearer ${token}`,
                                                                            },
                                                                        body: JSON.stringify(
                                                                            {
                                                                                title: myjobtitle,
                                                                                company_name:
                                                                                    myjobcompany,
                                                                                description:
                                                                                    myjobdescription,
                                                                                deadline:
                                                                                    myjobdeadline,
                                                                                salary: myjobsalary,
                                                                                location:
                                                                                    myjoblocation,
                                                                                category:
                                                                                    myjobcategory,
                                                                            }
                                                                        ),
                                                                    }
                                                                );
                                                            if (response.ok) {
                                                                alert(
                                                                    "Job updated successfully!"
                                                                );
                                                                window.location.reload();
                                                            } else {
                                                                alert(
                                                                    "Failed to update job."
                                                                );
                                                            }
                                                        } catch (error) {
                                                            console.error(
                                                                "Error updating job:",
                                                                error
                                                            );
                                                            alert(
                                                                "An error occurred while updating the job."
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Post
                                                </button>
                                                <form method="dialog">
                                                    {/* if there is a button in form, it will close the modal */}
                                                    <button
                                                        className="btn"
                                                        onClick={() => {
                                                            setMyJobTitle("");
                                                            setMyJobId(0);
                                                            setMyJobDescription(
                                                                ""
                                                            );
                                                            setMyJobCompany("");
                                                            setMyJobDeadline(
                                                                ""
                                                            );
                                                            setMyJobSalary(0);
                                                            setMyJobLocation(
                                                                ""
                                                            );
                                                            setMyJobCategory(
                                                                ""
                                                            );
                                                        }}
                                                    >
                                                        Close
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </dialog>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mt-2">
                                {filteredJobs.map((job) => (
                                    <div
                                        key={job?.id}
                                        className="card bg-base-200 p-4"
                                    >
                                        <h3 className="font-semibold">
                                            {job?.title}
                                        </h3>
                                        <p className="text-sm">
                                            Location: {job?.location}
                                        </p>
                                        <p className="text-sm">
                                            Salary: {job?.salary} tk.
                                        </p>
                                        <button
                                            className="btn btn-primary btn-sm mt-2"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        `my_modal_${job?.id}`
                                                    )
                                                    .showModal()
                                            }
                                        >
                                            Apply Now
                                        </button>

                                        <dialog
                                            id={`my_modal_${job?.id}`}
                                            className="modal modal-bottom sm:modal-middle"
                                        >
                                            <div className="modal-box">
                                                <h3 className="font-bold text-lg">
                                                    Applying for {job?.title}
                                                </h3>
                                                <div className="form-control flex flex-col mt-4">
                                                    <label className="label">
                                                        <span className="label-text mb-3">
                                                            Cover Letter
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        className="textarea textarea-bordered w-full"
                                                        placeholder="Write your cover letter here..."
                                                        value={coverLetter}
                                                        onChange={(e) =>
                                                            setCoverLetter(
                                                                e.target.value
                                                            )
                                                        }
                                                    ></textarea>
                                                </div>
                                                <div className="form-control mt-4 flex flex-col">
                                                    <label className="label">
                                                        <span className="label-text mb-3">
                                                            Resume
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        className="file-input file-input-bordered w-full"
                                                        onChange={(e) =>
                                                            setResume(
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="modal-action">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() =>
                                                            handleApplySubmit(
                                                                job?.id
                                                            )
                                                        }
                                                    >
                                                        Submit Application
                                                    </button>
                                                    <form method="dialog">
                                                        <button className="btn">
                                                            Close
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </dialog>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

// JobDashboard.jsx
