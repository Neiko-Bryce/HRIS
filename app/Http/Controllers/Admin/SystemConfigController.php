<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class SystemConfigController extends Controller
{
    public function index()
    {
        $shiftStartTime = \App\Models\Setting::where('key', 'shift_start_time')->value('value') ?? '08:00';
        $shiftEndTime = \App\Models\Setting::where('key', 'shift_end_time')->value('value') ?? '17:00';

        return Inertia::render('admin/settings/index', [
            'config' => [
                'app_name' => config('app.name'),
                'app_url' => config('app.url'),
                'app_env' => config('app.env'),
                'debug_mode' => config('app.debug'),
                'maintenance_mode' => app()->isDownForMaintenance(),
                'shift_start_time' => $shiftStartTime,
                'shift_end_time' => $shiftEndTime,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string|max:255',
            'shift_start_time' => 'required|date_format:H:i',
            'shift_end_time' => 'required|date_format:H:i',
        ]);

        \App\Models\Setting::updateOrCreate(
            ['key' => 'shift_start_time'],
            ['value' => $request->shift_start_time]
        );

        \App\Models\Setting::updateOrCreate(
            ['key' => 'shift_end_time'],
            ['value' => $request->shift_end_time]
        );

        return redirect()->back()->with('success', 'System settings updated successfully.');
    }

    public function toggleMaintenance(Request $request)
    {
        // $request->maintenance ? Artisan::call('down') : Artisan::call('up');
        return redirect()->back()->with('success', 'Maintenance mode toggled.');
    }
}
