import { router } from '@inertiajs/react';

export default function SuccessDialog({
  open,
  title = 'Message envoyé',
  subtitle,
  onClose,
  viewHref, // ex: route('messages.show', newMessageId) ou '/messages/123'
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* card */}
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl p-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
            ✓
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
          >
            Quitter
          </button>
          <button
            type="button"
            onClick={() => {
              if (viewHref) {
                if (typeof viewHref === 'string') {
                  router.visit(viewHref);
                } else {
                  router.visit(viewHref.url, viewHref.options || {});
                }
              } else {
                onClose();
              }
            }}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Voir le message
          </button>
        </div>
      </div>
    </div>
  );
}
