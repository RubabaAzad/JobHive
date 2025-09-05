<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = [
    'company_name',
    'title',
    'description',
    'deadline',
    'location',
    'category',
    'salary',
    'user_id',
];

public function user()
{
    return $this->belongsTo(User::class);
}
public function applications(){
  return $this->hasMany(Application::class);
}
public function notifications()
{
    return $this->hasMany(Notification::class);}
}