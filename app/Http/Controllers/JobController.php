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
    try {
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
        'company_name' => $request->company_name,
        'deadline' => $request->deadline,
        'title' => $request->title,
        'description' => $request->description,
        'location' => $request->location,
        'category' => $request->category,
        'salary' => $request->salary,
      ]);

      return response()->json(['message' => 'Job posted successfully', 'job' => $job]);
    } catch (\Exception $e) {
      return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
    }
}
public function updateJob(Request $request, Job $job){
  try {
    $user = Auth::user();

    $request->validate([
      'title' => 'required|string|max:255',
      'description' => 'required|string',
      'location' => 'required|string',
      'company_name' => 'nullable|string|max:255',
      'deadline' => 'nullable|date',
      'category' => 'nullable|string|max:255',
      'salary' => 'nullable|integer'
    ]);

    $job = Job::find($job->id);
    if (!$job || $job->user_id !== $user->id) {
      return response()->json(['message' => 'Job not found or unauthorized'], 404);
    }

    $job->title = $request->title;
    $job->company_name = $request->company_name;
    $job->deadline = $request->deadline;
    $job->description = $request->description;
    $job->location = $request->location;
    $job->category = $request->category;
    $job->salary = $request->salary;
    $job->save();

    return response()->json(['message' => 'Job updated successfully', 'job' => $job]);
  } catch (\Exception $e) {
    return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
  }
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
  public function searchJobs(Request $request){
    $user = Auth::user();
    $jobs = Job::where('user_id', '!=', $user->id)
      ->where(function($query) use ($request) {
          $query->where('title', 'like', '%' . $request->input('search') . '%')
                ->orWhere('description', 'like', '%' . $request->input('search') . '%');
      })
      ->orderBy('created_at', 'desc')
      ->get();
    return response()->json(['jobs' => $jobs]);
  }
}