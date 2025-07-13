import React from 'react'
import { useEffect, useState } from 'react'
const Dashboard = ({user} ) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  return (

    // <div
    //   className="flex items-center justify-center min-h-screen"
    //   style={{
    //     background:
    //       'radial-gradient(circle at 20% 30%, #a18cd1 0%, #fbc2eb 40%, #fad0c4 100%), repeating-linear-gradient(135deg, rgba(102,126,234,0.1) 0px, rgba(102,126,234,0.1) 2px, transparent 2px, transparent 8px)',
    //     backgroundBlendMode: 'overlay',
    //     position: 'relative',
    //   }}
    // >

    
    
    <div className="min-h-screen bg-base-200 p-4">
      {/* Top Bar */}
      <div className="flex justify-end mb-2">
        
        
      </div>
      <div className="navbar bg-base-100 shadow-lg rounded-xl mb-4">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">JobHive Dashboard</a>
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-ghost btn-circle">
            {/* Bell Icon */}
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 01-3.46 0"></path>
            </svg>
          </button>
          
          <div className="dropdown">
          <div tabIndex={0} role="button" className="m-5 mr-10"><div className="avatar">

            <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://i.pravatar.cc/150?img=3" alt="profile" />
              
            </div>
          </div></div>
               <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                 <li><button
          className="btn btn-error btn-sm"
          onClick={async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            await fetch('/api/logout', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          Logout 
        </button></li>
                 <li><a>Item 2</a></li>
              </ul>
        </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        

        {/* Profile Card + My Applications */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              {/* User Icon */}
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M5.5 21a8.38 8.38 0 0113 0"></path>
              </svg>
              <h2 className="card-title">{user?.name || "User"}</h2>
              <p>Frontend Developer - Dhaka</p>
              <progress className="progress progress-primary w-56" value="75" max="100"></progress>
              <div className="card-actions mt-2">
                <button
                  className="btn btn-outline btn-primary btn-sm"
                  onClick={() => window.location.href = '/edit'}
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
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                My Applications
              </h2>
              <ul className="list-disc ml-6 mt-2">
                <li>Frontend Developer at TechSoft – <span className="text-success">Shortlisted</span></li>
                <li>Backend Engineer at Cloudify – <span className="text-warning">Viewed</span></li>
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
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 3v4"></path>
                    <path d="M8 3v4"></path>
                    <path d="M2 13h20"></path>
                  </svg>
                  Recommended Jobs
                </h2>
                <div className="flex gap-2">
                  {/* Replaced Search a Job button with search input */}
                  <label className="input">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.0"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </g>
                    </svg>
                    <input type="search" className="grow" placeholder="Search jobs" />
                  </label>
                  <button className="btn btn-primary btn-sm" onClick={()=>document.getElementById('my_modal_4').showModal()}>Post a Job</button>
                  <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                      <h3 className="font-bold text-lg">Hello!</h3>
                      <p className="py-4">Click the button below to close</p>
                      <div className="modal-action">
                        <form method="dialog">
                          {/* if there is a button, it will close the modal */}
                          <button className="btn btn-primary btn-sm">Post</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                <div className="card bg-base-200 p-4">
                  <h3 className="font-semibold">React Developer - Remote</h3>
                  <p className="text-sm">by StartupX</p>
                  <button className="btn btn-primary btn-sm mt-2">Apply Now</button>
                </div>
                <div className="card bg-base-200 p-4">
                  <h3 className="font-semibold">Laravel Backend Engineer</h3>
                  <p className="text-sm">by CodeNest</p>
                  <button className="btn btn-primary btn-sm mt-2">Apply Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>

  )
}

export default Dashboard

// JobDashboard.jsx



