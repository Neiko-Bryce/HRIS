<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = [
        'title',
        'department_id',
        'description',
        'requirements',
        'type',
        'slots',
        'status',
        'closing_date',
    ];

    protected function casts(): array
    {
        return [
            'closing_date' => 'date',
        ];
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function applicants()
    {
        return $this->hasMany(Applicant::class);
    }
}
