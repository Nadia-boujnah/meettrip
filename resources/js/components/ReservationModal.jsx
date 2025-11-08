import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";       // ✅ AJOUT
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, startOfDay } from "date-fns";

export default function ReservationModal({ visible, onClose, activity }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!visible || !activity) return null;

  const allowedDates = (activity.dates || []).map((d) => {
    const [day, month, year] = d.split("-");
    return startOfDay(new Date(`${year}-${month}-${day}`));
  });

  const handleConfirm = () => {
    if (!selectedDate) return;

    const iso = new Date(selectedDate).toISOString().slice(0, 10); // YYYY-MM-DD
    setSubmitting(true);

    router.post(
      route ? route("activities.reserve", activity.id) : `/activities/${activity.id}/reserve`,
      { requested_date: iso },
      {
        preserveScroll: true,
        onFinish: () => setSubmitting(false),
        onSuccess: () => onClose && onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Réserver : {activity.title}</h2>

        <label className="block mb-4 text-sm text-gray-700">Choisissez une date :</label>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          defaultMonth={allowedDates[0]}
          disabled={(date) => !allowedDates.some((d) => isSameDay(d, date))}
        />

        <button
          onClick={handleConfirm}
          disabled={!selectedDate || submitting}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded disabled:opacity-50"
        >
          {selectedDate
            ? `Confirmer pour le ${format(selectedDate, "dd-MM-yyyy")}`
            : "Confirmer la réservation"}
        </button>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline block text-center w-full"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
