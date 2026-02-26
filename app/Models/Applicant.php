<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    protected $fillable = [
        'job_posting_id',
        'name',
        'email',
        'phone',
        'resume_path',
        'status',
        'notes',
    ];

    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class);
    }
}
