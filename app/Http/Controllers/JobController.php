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
}
