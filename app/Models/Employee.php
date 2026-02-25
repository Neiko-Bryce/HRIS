<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Employee extends Model
{
    protected $fillable = [
        'user_id',
        'employee_id',
        'contact_number',
        'address',
        'join_date',
        'department',
        'position',
        'salary_grade',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
