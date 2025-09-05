<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Models\Application;
use App\Models\Job;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    // POST /api/jobs/{id}/apply
    public function apply(Request $request, $jobId)
    {
        try {
            $user = Auth::user();

            // Optional: check if job exists
            $job = Job::findOrFail($jobId);

            // Check if already applied
            if (Application::where('user_id', $user->id)->where('job_id', $jobId)->exists()) {
          return response()->json(['message' => 'You already applied to this job'], 409);
            }

            // Validate input
            $request->validate([
          'cover_letter' => 'nullable|string',
          'cv' => 'required|file|mimes:pdf,doc,docx|max:2048', // CV is required
            ]);
            $cvPath = $request->file('cv')->store('cvs', 'public');

            // Save application
            $application = Application::create([
              'user_id' => $user->id,
              'job_id' => $jobId,
              'cover_letter' => $request->cover_letter,
              'cv_path' => $cvPath,
            ]);

            return response()->json(['message' => 'Application submitted', 'application' => $application]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
        }
    }

    // Optional: View user applications
    public function myApplications(Request $request)
    {
        $user = Auth::user();
        $applications = $user->applications()->with('job')->get();

        // Prepend the full file path to cv_path
        foreach ($applications as $application) {
            if ($application->cv_path) {
            $application->cv_full_path = 'D:/demoproject470/storage/app/public/' . $application->cv_path;
            } else {
            $application->cv_full_path = null;
            }
        }

        return response()->json($applications);
    }

    // Optional: View applicants for a specific job
    public function jobApplications($jobId)
    {
        $applications = Application::with('user')->where('job_id', $jobId)->get();
        return response()->json($applications);
    }
    // GET /api/jobs
    public function getJobs(Request $request)
    {
        $jobId = $request->id;
        $jobs = Job::where('id', $jobId)->get();
        return response()->json([
            'the job'=> $jobs,
            "Jobid" => $jobId,
            "message" => "Job details retrieved successfully"
        ]);
    }
    public function updateApplicationStatus(Request $request, $applicationId)
    {
        try {
            $request->validate([
          'status' => 'required|in:pending,reviewed,accepted,rejected',
            ]);

            $application = Application::findOrFail($applicationId);
            $application->status = $request->status;
            $application->save();
            
            if($application->status === 'accepted') { 
              $lotify = new \App\Models\Notification();
              $lotify->user_id = $application->user_id;
              $lotify->application_id = $application->id;
              $lotify->job_id = $application->job_id;
              $lotify->status = "unread";
              $lotify->message = "Your application status has been updated to: " . $application->status. "Congratulations!";
              $lotify->save();
            }

            return response()->json(['message' => 'Application status updated successfully', 'application' => $application]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
        }
    }
    public function markRead(Request $request, $notificationId)
    {
        try {
            $notification = \App\Models\Notification::findOrFail($notificationId);
            $notification->status = 'read';
            $notification->save();

            return response()->json(['message' => 'Notification marked as read', 'notification' => $notification]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
        }
    }
    public function markReadAll(Request $request)
    {
        try {
            $user = Auth::user();
            \App\Models\Notification::where('user_id', $user->id)->update(['status' => 'read']);

            return response()->json(['message' => 'All notifications marked as read']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
        }
    }
}