import React, { useEffect, useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay } from "date-fns";

// Convertit "YYYY-MM-DD" -> Date locale 00:00 (retourne null si invalide)
const toDate = (s) => {
  if (!s || typeof s !== "string") return null;
  const d = new Date(`${s}T00:00:00`);
  return isNaN(d) ? null : startOfDay(d);
};

// Normalise activity.dates en tableau de chaînes "YYYY-MM-DD"
function normalizeDates(raw) {
  try {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      // JSON stringifié ?
      if (raw.trim().startsWith("[") || raw.trim().startsWith("{")) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        // objet {from,to} -> on le transforme en [from,to]
        if (parsed && typeof parsed === "object" && (parsed.from || parsed.to)) {
          return [parsed.from, parsed.to].filter(Boolean);
        }
        return [];
      }
      // simple string unique "YYYY-MM-DD"
      return [raw];
    }
    return [];
  } catch {
    return [];
  }
}

// --- petite ErrorBoundary pour afficher l’erreur exacte si jamais ---
class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) {
    console.error("[ReservationModal] Render error:", err);
    console.error("[ReservationModal] Info:", info);
  }
  render() { return this.state.hasError ? null : this.props.children; }
}

export default function ReservationModal({ visible, onClose, activity }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!visible || !activity) return null;

  // 1) On normalise d’abord ce qui vient du back
  const rawDates = useMemo(() => normalizeDates(activity?.dates), [activity?.dates]);

  // 2) On convertit en Date[] sûres
  const allowedDates = useMemo(
    () => rawDates.map(toDate).filter(Boolean),
    [rawDates]
  );

  const allowedSet = useMemo(
    () => new Set(allowedDates.map((d) => d.getTime())),
    [allowedDates]
  );

  const isAllowed = (date) =>
    !!date && allowedSet.has(startOfDay(date).getTime());

  const defaultMonth =
    (selectedDate && isAllowed(selectedDate) && selectedDate) ||
    allowedDates[0] ||
    new Date();

  const canRenderCalendar =
    allowedDates.length > 0 &&
    defaultMonth instanceof Date &&
    !isNaN(defaultMonth);

  // si l’activité change et invalide la sélection, on nettoie
  useEffect(() => {
    if (selectedDate && !isAllowed(selectedDate)) setSelectedDate(null);
  }, [selectedDate, allowedSet]);

  // Échap pour fermer
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleConfirm = () => {
    if (!selectedDate || !isAllowed(selectedDate)) return;

    const iso = new Date(selectedDate).toISOString().slice(0, 10); // YYYY-MM-DD
    setSubmitting(true);

    const url =
      typeof route === "function"
        ? route("activities.reserve", activity.id)
        : `/activities/${activity.id}/reserve`;

    router.post(
      url,
      { requested_date: iso },
      {
        preserveScroll: true,
        onFinish: () => setSubmitting(false),
        onSuccess: () => onClose && onClose(),
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Réserver : {activity?.title ?? "—"}</h2>

        <label className="mb-2 block text-sm text-gray-700">
          Choisissez une date :
        </label>

        <Boundary>
          {canRenderCalendar ? (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => setSelectedDate(d ? startOfDay(d) : null)}
              className="rounded-md border"
              defaultMonth={defaultMonth}
              disabled={(date) => !isAllowed(date)}
            />
          ) : (
            <p className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Aucune date disponible pour cette activité.
            </p>
          )}
        </Boundary>

        <button
          onClick={handleConfirm}
          disabled={!selectedDate || !isAllowed(selectedDate) || submitting}
          className="mt-4 w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {selectedDate
            ? `Confirmer pour le ${format(selectedDate, "dd-MM-yyyy")}`
            : "Confirmer la réservation"}
        </button>

        <button
          onClick={onClose}
          className="mt-3 block w-full text-center text-sm text-gray-500 hover:underline"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
