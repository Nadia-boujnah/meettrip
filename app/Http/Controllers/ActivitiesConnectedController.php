<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ActivitiesConnectedController extends Controller
{
    public function index()
    {
        $activities = Activities::with('hostUser')->latest()->get();

        return Inertia::render('ActivitiesConnected', [
            'activities' => $activities,
        ]);
    }

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

        return redirect()->route('annonces')->with('success', 'Activité créée avec succès.');
    }

    public function show($id)
    {
        $activity = Activities::with('hostUser')->findOrFail($id);

        return Inertia::render('DetailsActivityConnected', [
            'activity' => $activity,
        ]);
    }

    public function edit($id)
    {
        $activity = Activities::findOrFail($id);

        return Inertia::render('EditAnnonce', [
            'activity' => $activity,
        ]);
    }

    public function update(Request $request, $id)
    {
        $activity = Activities::findOrFail($id);

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

        $activity->update($validated);

        return redirect()->route('annonces')->with('success', 'Activité mise à jour.');
    }

    public function destroy($id)
    {
        $activity = Activities::findOrFail($id);
        $activity->delete();

        return redirect()->route('annonces')->with('success', 'Activité supprimée.');
    }
}
