// resources/js/utils/resolveAssetImage.js

// Charge toutes les images depuis resources/js/assets/** (et @/assets/**)
const maps = [
  import.meta.glob('/resources/js/assets/**/*', { eager: true, import: 'default' }),
  import.meta.glob('@/assets/**/*', { eager: true, import: 'default' }),
];

const images = Object.assign({}, ...maps);

function normalize(path) {
  return (path || '').toString().trim().toLowerCase().replace(/^\/+/, '');
}

/**
 * Résout une image d'assets, qu'on passe:
 *  - "images/rome.png"
 *  - "rome.png" (sans dossier)  ⟵ on complétera automatiquement
 *  - "activities/rome.png"
 */
export function resolveAssetImage(fileName) {
  if (!fileName) return null;

  const wanted = normalize(fileName);

  // Si aucun dossier dans la valeur, on essaie des emplacements courants
  const candidates = [wanted];
  if (!wanted.includes('/')) {
    candidates.push(
      `images/${wanted}`,
      `img/${wanted}`,
      `activities/${wanted}`,
      `pictures/${wanted}`
    );
  }

  // On tente pour chaque candidate:
  for (const rel of candidates) {
    const direct1 = `/resources/js/assets/${rel}`;
    const direct2 = `/src/assets/${rel}`;

    if (images[direct1]) return images[direct1];
    if (images[direct2]) return images[direct2];

    // Fallback: cherche une fin de chemin équivalente
    const match = Object.keys(images).find((key) =>
      key.toLowerCase().endsWith(`/${rel}`)
    );
    if (match) return images[match];
  }

  console.warn('[resolveAssetImage] Image non trouvée :', fileName, 'candidats:', candidates);
  return null;
}
