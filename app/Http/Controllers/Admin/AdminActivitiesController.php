<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activities;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminActivitiesController extends Controller
{
    /**
     * Affiche la liste des activités pour l'administration
     */
    public function index()
    {
        $activities = Activities::with('hostUser')->get();

        return Inertia::render('admin/AdminActivities', [
            'activities' => $activities
        ]);
    }

    /**
     * Ajoute une nouvelle activité depuis l'espace admin
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'location' => 'required|string',
            'image' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'participants' => 'nullable|integer',
            'description' => 'required|string',
            'why' => 'required|string',
            'host_user_id' => 'required|exists:users,id',
        ]);

        Activities::create($request->all());

        return redirect()->back()->with('success', 'Activité ajoutée !');
    }

    /**
     * Supprime une activité
     */
    public function destroy(Activities $activities)
    {
        $activities->delete();
        return redirect()->back()->with('success', 'Activité supprimée.');
    }
}
