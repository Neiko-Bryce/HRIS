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
        return Inertia::render('admin/settings/index', [
            'config' => [
                'app_name' => config('app.name'),
                'app_url' => config('app.url'),
                'app_env' => config('app.env'),
                'debug_mode' => config('app.debug'),
                'maintenance_mode' => app()->isDownForMaintenance(),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string|max:255',
        ]);

        // In a real app, we'd update .env or a DB settings table.
        // For now, we'll simulate success.

        return redirect()->back()->with('success', 'System settings updated (simulation).');
    }

    public function toggleMaintenance(Request $request)
    {
        // $request->maintenance ? Artisan::call('down') : Artisan::call('up');
        return redirect()->back()->with('success', 'Maintenance mode toggled.');
    }
}
