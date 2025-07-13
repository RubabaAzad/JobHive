<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_id',
        'cover_letter',
        'cv_path',
        'status',
    ];

    /**
     * The user who applied.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The job being applied to.
     */
    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}
