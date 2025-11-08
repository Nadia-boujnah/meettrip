<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnnoncesController extends Controller
{
    // ✅ Afficher toutes les annonces de l'utilisateur connecté
    public function index()
    {
        $me = Auth::id();

        $activities = Activities::query()
            ->where('host_user_id', $me)
            ->latest()
            ->get()
            ->map(fn($a) => [
                'id'           => $a->id,
                'title'        => $a->title,
                'location'     => $a->location,
                'description'  => $a->description,
                'why'          => $a->why,
                'date'         => $a->date,
                'dates'        => $a->dates ?? [],
                'image'        => $a->image,
                'image_url'    => $a->image_url,
                'latitude'     => $a->latitude,
                'longitude'    => $a->longitude,
                'participants' => $a->participants,
            ]);

        return Inertia::render('Annonces', [
            'activities' => $activities,
        ]);
    }

  public function store(Request $request)
{
    $validated = $request->validate([
        'title'        => 'required|string|max:255',
        'location'     => 'required|string|max:255',
        'latitude'     => 'required|numeric|between:-90,90',
        'longitude'    => 'required|numeric|between:-180,180',
        'participants' => 'required|integer|min:1|max:100',
        'date'         => 'nullable|date',       // ⬅️ arrive du formulaire
        'description'  => 'required|string',
        'why'          => 'required|string',
        'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
    ]);

    // ⬇️ on mappe "date" -> "dates" (JSON array) et on supprime "date"
    if (!empty($validated['date'])) {
        $validated['dates'] = [ date('Y-m-d', strtotime($validated['date'])) ];
        unset($validated['date']);
    }

    if ($request->hasFile('image')) {
        $file = $request->file('image');
        if (!$file->isValid()) {
            return back()->withErrors(['image' => 'Fichier image invalide'])->withInput();
        }
        $validated['image'] = $file->store('activities', 'public');
    }

    $validated['host_user_id'] = Auth::id();

    \App\Models\Activities::create($validated);

    return redirect()->route('activities.connected')->with('success', 'Activité créée avec succès.');
}
    // ✅ Supprimer une annonce
    public function destroy(int $id)
    {
        $a = Activities::where('host_user_id', Auth::id())->findOrFail($id);

        if ($a->image && Storage::disk('public')->exists($a->image)) {
            Storage::disk('public')->delete($a->image);
        }

        $a->delete();

        return back()->with('success', 'Annonce supprimée.');
    }

    // ✅ Afficher le formulaire d'édition d'une annonce
    public function edit(int $id)
    {
        $a = Activities::where('host_user_id', Auth::id())->findOrFail($id);

        return Inertia::render('AnnoncesEdit', [
            'activity' => [
                'id'           => $a->id,
                'title'        => $a->title,
                'location'     => $a->location,
                'description'  => $a->description,
                'why'          => $a->why,
                'date'         => $a->date,
                'image_url'    => $a->image_url,
                'latitude'     => $a->latitude,
                'longitude'    => $a->longitude,
                'participants' => $a->participants,
            ],
        ]);
    }
public function update(Request $request, int $id)
{
    $activity = \App\Models\Activities::findOrFail($id);

    $validated = $request->validate([
        'title'        => 'required|string|max:255',
        'location'     => 'required|string|max:255',
        'latitude'     => 'required|numeric|between:-90,90',
        'longitude'    => 'required|numeric|between:-180,180',
        'participants' => 'required|integer|min:1|max:100',
        'date'         => 'nullable|date',       // ⬅️ arrive du formulaire
        'description'  => 'required|string',
        'why'          => 'required|string',
        'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
    ]);

    // ⬇️ on mappe "date" -> "dates" (JSON array) et on supprime "date"
    if (!empty($validated['date'])) {
        $validated['dates'] = [ date('Y-m-d', strtotime($validated['date'])) ];
        unset($validated['date']);
    }

    if ($request->hasFile('image')) {
        $file = $request->file('image');
        if (!$file->isValid()) {
            return back()->withErrors(['image' => 'Fichier image invalide'])->withInput();
        }
        if ($activity->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($activity->image)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($activity->image);
        }
        $validated['image'] = $file->store('activities', 'public');
    }

    $activity->fill($validated)->save();

    return redirect()->route('activities.connected')->with('success', 'Activité mise à jour.');
}
}
