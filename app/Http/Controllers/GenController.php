<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class GenController extends Controller
{
    public function loginView(): \Inertia\Response
    {
        return Inertia::render('Login');
    }

    public function dashboardView(): \Inertia\Response
    {
        return Inertia::render('Dashboard');
    }
    public function registerView(): \Inertia\Response
    {
        return Inertia::render('Register');
    }
    public function editView(): \Inertia\Response
    {
        return Inertia::render('Edit');
    }
}
