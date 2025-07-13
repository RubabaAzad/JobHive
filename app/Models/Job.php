<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = [
    'title',
    'description',
    'location',
    'category',
    'salary',
    'user_id',
];

public function user()
{
    return $this->belongsTo(User::class);
}
}
