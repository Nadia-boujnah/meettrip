import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, startOfDay } from "date-fns";

export default function ReservationModal({ visible, onClose, activity }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!visible || !activity) return null;

  // ✅ Conversion des dates en objets Date
  const allowedDates = (activity.dates || []).map((d) => {
    const [day, month, year] = d.split("-");
    return startOfDay(new Date(`${year}-${month}-${day}`));
  });

  const handleConfirm = () => {
    if (selectedDate) {
      setConfirmed(true);
      setTimeout(() => {
        setConfirmed(false);
        setSelectedDate(null);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Réserver : {activity.title}</h2>

        <label className="block mb-4 text-sm text-gray-700">
          Choisissez une date :
        </label>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          defaultMonth={allowedDates[0]}
          disabled={(date) =>
            !allowedDates.some((allowedDate) =>
              isSameDay(allowedDate, date)
            )
          }
        />

        {confirmed ? (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-sm text-center mt-4">
            ✅ Réservé pour le {format(selectedDate, "dd-MM-yyyy")}
          </div>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={!selectedDate}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded disabled:opacity-50"
          >
            {selectedDate
              ? `Confirmer pour le ${format(selectedDate, "dd-MM-yyyy")}`
              : "Confirmer la réservation"}
          </button>
        )}

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
