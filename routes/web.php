<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use Inertia\Response;
use App\Http\Controllers\GenController;

Route::get('/', function (): Response {
    return Inertia::render("Home");
});
Route::get('/jobdas', function (): Response {
    return Inertia::render("Jobdas");
});

Route::get('/login', [GenController::class, 'loginView']);
Route::get('/dashboard', [GenController::class, 'dashboardView']);
Route::get('/register', [GenController::class, 'registerView']);
Route::get('/edit', [GenController::class, 'editView']);