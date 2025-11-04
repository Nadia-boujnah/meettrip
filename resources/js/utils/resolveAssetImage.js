// Charge toutes les images depuis resources/js/assets/** (y compris /images/)
// Compatible avec les sous-dossiers (images, icons, etc.)

const maps = [
  import.meta.glob('/resources/js/assets/**/*', { eager: true, import: 'default' }),
  import.meta.glob('@/assets/**/*', { eager: true, import: 'default' }),
];

const images = Object.assign({}, ...maps);

function normalize(path) {
  return (path || '').toString().trim().toLowerCase().replace(/^\/+/, '');
}

export function resolveAssetImage(fileName) {
  if (!fileName) return null;

  const wanted = normalize(fileName);

  // 🔹 Cherche par correspondance exacte (ex: "images/rome.png")
  const direct1 = `/resources/js/assets/${wanted}`;
  const direct2 = `/src/assets/${wanted}`;
  if (images[direct1]) return images[direct1];
  if (images[direct2]) return images[direct2];

  // 🔹 Sinon, on parcourt toutes les clés pour trouver une correspondance (fin du chemin)
  const keys = Object.keys(images);
  const match = keys.find((key) => key.toLowerCase().endsWith(`/${wanted}`));
  if (match) return images[match];

  // 🔹 Pas trouvé → log pour t’aider
  console.warn('[resolveAssetImage] Image non trouvée :', fileName);
  return null;
}
