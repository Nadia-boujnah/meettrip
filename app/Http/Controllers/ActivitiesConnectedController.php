<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ActivitiesConnectedController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'date' => 'nullable|date',
            'description' => 'required|string',
            'why' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('activities', 'public');
        }

        $validated['host_user_id'] = Auth::id();

        $activity = Activities::create($validated);

        return Inertia::render('Annonces', [
            'activities' => Activities::where('host_user_id', Auth::id())->latest()->get(),
            'newActivity' => $activity,
        ]);
    }

    public function index()
    {
        $activities = Activities::with('hostUser')->latest()->get();

        return Inertia::render('ActivitiesConnected', [
            'activities' => $activities,
        ]);
    }
    public function show($id)
{
    $activity = Activities::with('hostUser')->findOrFail($id);

    return Inertia::render('DetailsActivityConnected', [
        'activity' => $activity,
    ]);
}

}
