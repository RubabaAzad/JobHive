<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Job;

class JobController extends Controller
{
    //
    public function createJob(Request $request)
{
    $user = Auth::user();

    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'location' => 'required|string',
        'category' => 'nullable|string|max:255',
        'salary' => 'nullable|integer'
    ]);

    $job = Job::create([
        'user_id' => $user->id,
        'title' => $request->title,
        'description' => $request->description,
        'location' => $request->location,
        'category' => $request->category,
        'salary' => $request->salary,
    ]);

    return response()->json(['message' => 'Job posted successfully', 'job' => $job]);
}
public function updateJob(Request $request, Job $job){
  $user = Auth::user();
  $job = Job::find($job->id);
  if (!$job || $job->user_id !== $user->id) {
      return response()->json(['message' => 'Job not found or unauthorized'], 404);
  }
  $job->title = $request->title;
  $job->description = $request->description;
  $job->location = $request->location;
  $job->category = $request->category;
  $job->salary = $request->salary;
  $job->save();
  return response()->json(['message' => 'Job updated successfully', 'job' => $job]);
}
public function deleteJob(Job $job)
{
    $user = Auth::user();
    if ($job->user_id !== $user->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $job->delete();
    return response()->json(['message' => 'Job deleted successfully']);}

public function getJobs(){
  $user = Auth::user();
  $jobs = Job::where('user_id', '!=', $user->id)
    ->orderBy('created_at', 'desc')
    ->get();
  return response()->json(['jobs' => $jobs]);
}
}