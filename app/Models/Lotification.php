<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lotification extends Model
{
    protected $fillable = [
        'user_id',
        'application_id',
        'job_id',
        'message',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function application()
    {
        return $this->belongsTo(Application::class);
    }
    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}