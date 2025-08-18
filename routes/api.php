<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;

Route::get('/user', function (Request $request) {
  return $request->user()->load('jobs');
})->middleware('auth:sanctum');


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/dashboard', [AuthController::class, 'dashboard'])->middleware('auth:sanctum');

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::delete('/delete-account', [AuthController::class, 'deleteAccount'])->middleware('auth:sanctum');
Route::post('/edit-profile', [AuthController::class,'editProfile'])->middleware(middleware: 'auth:sanctum');
Route::post('/post-a-job', [JobController::class, 'createJob'])->middleware('auth:sanctum');
Route::put('/jobs/{job}', [JobController::class, 'updateJob'])->middleware('auth:sanctum');
Route::delete('/jobs/{job}', [JobController::class, 'deleteJob'])->middleware('auth:sanctum');
Route::get('/jobs', [JobController::class, 'getJobs'])->middleware('auth:sanctum');
Route::get('/search-jobs', [JobController::class, 'searchJobs'])->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/jobs/{id}/apply', [ApplicationController::class, 'apply']);
    Route::get('/jobs/{id}', [ApplicationController::class, 'getJobs']);
    Route::get('/my-applications', [ApplicationController::class, 'myApplications']);
    Route::get('/jobs/{id}/applications', [ApplicationController::class, 'jobApplications']);
});