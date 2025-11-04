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
        $activities = Activities::query()
            // ⬇ On charge aussi id et name (fallback si prenom/nom sont vides)
            ->with(['hostUser:id,name,prenom,nom'])
            ->latest()
            ->get();

        return Inertia::render('ActivitiesConnected', [
            'activities' => $activities,
            'auth' => ['user' => Auth::user()],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'location'    => 'required|string|max:255',
            'date'        => 'nullable|date',
            'description' => 'required|string',
            'why'         => 'required|string',
            'image'       => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('activities', 'public');
        }

        $validated['host_user_id'] = Auth::id();

        Activities::create($validated);

        return redirect()->route('activities.connected')->with('success', 'Activité créée avec succès.');
    }

    public function show($id)
    {
        $activity = Activities::with(['hostUser:id,name,prenom,nom'])->findOrFail($id);

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
            'title'       => 'required|string|max:255',
            'location'    => 'required|string|max:255',
            'date'        => 'nullable|date',           // voir point 2
            'description' => 'required|string',
            'why'         => 'required|string',
            'image'       => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('activities', 'public');
        }

        $activity->update($validated);

        return redirect()->route('activities.connected')->with('success', 'Activité mise à jour.');
    }

    public function destroy($id)
    {
        $activity = Activities::findOrFail($id);
        $activity->delete();

        return redirect()->route('activities.connected')->with('success', 'Activité supprimée.');
    }
    public function myAnnonces()
{
    $me = Auth::id();

    $activities = Activities::query()
        ->with(['hostUser:id,name,prenom,nom'])
        ->where('host_user_id', $me)   // <= uniquement MES annonces
        ->latest()
        ->get();

    return Inertia::render('Annonces', [
        'activities' => $activities,
        'auth' => ['user' => Auth::user()],
    ]);
}
}
