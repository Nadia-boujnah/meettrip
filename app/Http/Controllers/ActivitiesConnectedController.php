<?php 

namespace App\Http\Controllers;

use App\Models\Activities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ActivitiesConnectedController extends Controller
{
    public function index()
    {
        $activities = Activities::query()
            ->with(['hostUser:id,name,prenom,nom'])
            ->latest()
            ->get();

        // Plus besoin d'ajouter image_url : l'accessor du modèle s'en charge.

        return Inertia::render('ActivitiesConnected', [
            'activities' => $activities,
            'auth' => ['user' => Auth::user()],
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
            'date'         => 'nullable|date',
            'description'  => 'required|string',
            'why'          => 'required|string',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        // Mappe "date" vers "dates" (JSON) si fourni
        if (!empty($validated['date'])) {
            $validated['dates'] = json_encode([$this->normalizeDate($validated['date'])]);
            unset($validated['date']);
        }

        // Upload image optionnelle : on stocke uniquement le nom de fichier
        if ($request->hasFile('image')) {
            $file = $request->file('image');

            if (!$file->isValid()) {
                return back()->withErrors([
                    'image' => 'Fichier image invalide. Réessaie avec une autre image.',
                ])->withInput();
            }

            $path = $file->store('activities', 'public'); // ex: activities/xyz.png
            $validated['image'] = basename($path);        // on enregistre "xyz.png"
        }

        $validated['host_user_id'] = Auth::id();

        Activities::create($validated);

        return redirect()->route('activities.connected')->with('success', 'Activité créée avec succès.');
    }

    public function show($id)
    {
        $activity = Activities::with(['hostUser:id,name,prenom,nom'])->findOrFail($id);
        // image_url dispo via accessor

        return Inertia::render('DetailsActivityConnected', [
            'activity' => $activity,
        ]);
    }

    public function edit($id)
    {
        $activity = Activities::findOrFail($id);
        // image_url dispo via accessor

        // Expose une date simple au front depuis le JSON "dates" si besoin
        if (empty($activity->date)) {
            $firstDate = null;
            if (!empty($activity->dates)) {
                $arr = is_array($activity->dates) ? $activity->dates : json_decode($activity->dates, true);
                if (is_array($arr) && !empty($arr[0])) $firstDate = $arr[0];
            }
            $activity->date = $firstDate;
        }

        return Inertia::render('AnnoncesEdit', [
            'activity' => $activity,
        ]);
    }

    public function update(Request $request, $id)
    {
        $activity = Activities::findOrFail($id);

        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'location'     => 'required|string|max:255',
            'latitude'     => 'required|numeric|between:-90,90',
            'longitude'    => 'required|numeric|between:-180,180',
            'participants' => 'required|integer|min:1|max:100',
            'date'         => 'nullable|date',
            'description'  => 'required|string',
            'why'          => 'required|string',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        // Mappe "date" vers "dates" (JSON)
        if (!empty($validated['date'])) {
            $validated['dates'] = json_encode([$this->normalizeDate($validated['date'])]);
            unset($validated['date']);
        } else {
            unset($validated['date']);
        }

        // Nouvelle image ?
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            if (!$file->isValid()) {
                return back()->withErrors(['image' => 'Le fichier image est invalide.'])->withInput();
            }

            // Supprime l’ancienne si elle existe
            if ($activity->image) {
                $old = $this->storageRelativePath($activity->image); // activities/xxx.png
                if (Storage::disk('public')->exists($old)) {
                    Storage::disk('public')->delete($old);
                }
            }

            $newPath = $file->store('activities', 'public'); // activities/yyy.png
            $validated['image'] = basename($newPath);        // enregistre "yyy.png"
        }

        $activity->update($validated);

        return redirect()->route('activities.connected')->with('success', 'Activité mise à jour.');
    }

    public function destroy($id)
    {
        $activity = Activities::findOrFail($id);

        // Supprimer aussi le fichier image (si présent)
        if ($activity->image) {
            $old = $this->storageRelativePath($activity->image); // activities/xxx.png
            if (Storage::disk('public')->exists($old)) {
                Storage::disk('public')->delete($old);
            }
        }

        $activity->delete();

        return redirect()->route('activities.connected')->with('success', 'Activité supprimée.');
    }

    public function myAnnonces()
    {
        $me = Auth::id();

        $activities = Activities::query()
            ->with(['hostUser:id,name,prenom,nom'])
            ->where('host_user_id', $me)
            ->latest()
            ->get();

        // image_url disponible via accessor

        return Inertia::render('Annonces', [
            'activities' => $activities,
            'auth' => ['user' => Auth::user()],
        ]);
    }

    // Carte connectée
    public function map()
    {
        $mapActivities = Activities::query()
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->latest()
            ->take(500)
            ->get(['id','title','location','image','latitude as lat','longitude as lng'])
            ->map(function ($a) {
                return [
                    'id'        => $a->id,
                    'title'     => $a->title,
                    'location'  => $a->location,
                    'lat'       => (float)$a->lat,
                    'lng'       => (float)$a->lng,
                    // on consomme l'accessor du modèle :
                    'image_url' => $a->image_url,
                ];
            });

        return Inertia::render('MapConnected', [
            'mapActivities' => $mapActivities,
            'auth'          => ['user' => Auth::user()],
        ]);
    }

    /**
     * Normalise divers formats de date vers Y-m-d (yyyy-mm-dd).
     */
    private function normalizeDate(string $value): string
    {
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            return $value; // déjà ISO
        }
        if (preg_match('/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/', $value, $m)) {
            // dd/mm/yyyy ou dd-mm-yyyy -> yyyy-mm-dd
            return "{$m[3]}-{$m[2]}-{$m[1]}";
        }
        $ts = strtotime($value);
        return $ts ? date('Y-m-d', $ts) : date('Y-m-d');
    }

    /**
     * Renvoie le chemin relatif sur le disk "public" pour suppression,
     * en tolérant les valeurs "x.png" ou "activities/x.png".
     */
    private function storageRelativePath(string $value): string
    {
        $file = basename($value);
        return 'activities/' . $file; // storage/app/public/activities/xxx
    }
}
