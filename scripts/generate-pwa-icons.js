import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <!-- Background Gradient Mesh -->
    <radialGradient id="pwa-bg" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#1E1B4B" />
      <stop offset="55%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>

    <!-- Master Ribbon Gradient -->
    <linearGradient id="pwa-ribbon" x1="15%" y1="12%" x2="85%" y2="88%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="35%" stop-color="#3B82F6" />
      <stop offset="70%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#7C3AED" />
    </linearGradient>

    <!-- Specular Highlight -->
    <linearGradient id="pwa-specular" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <!-- Border Glow Gradient -->
    <linearGradient id="pwa-border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366F1" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.8" />
    </linearGradient>

    <linearGradient id="pwa-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>

    <filter id="pwa-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0284C7" flood-opacity="0.35" />
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#4F46E5" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Container Base -->
  <rect x="16" y="16" width="480" height="480" rx="110" fill="url(#pwa-bg)" />
  <rect x="16" y="16" width="480" height="480" rx="110" stroke="url(#pwa-border)" stroke-width="6" />

  <!-- Ambient Internal Light -->
  <circle cx="256" cy="180" r="160" fill="#4F46E5" opacity="0.25" />
  <circle cx="256" cy="340" r="140" fill="#06B6D4" opacity="0.2" />

  <!-- Collaborative Student Network Nodes and Synapses -->
  <g opacity="0.9">
    <path d="M 80,180 Q 130,160 170,180" stroke="#06B6D4" stroke-width="4" stroke-dasharray="8 6" stroke-opacity="0.8" />
    <path d="M 432,170 Q 380,190 340,180" stroke="#A78BFA" stroke-width="4" stroke-dasharray="8 6" stroke-opacity="0.8" />
    <path d="M 76,350 Q 126,370 170,350" stroke="#22D3EE" stroke-width="4" stroke-dasharray="8 6" stroke-opacity="0.8" />
    <path d="M 436,360 Q 386,336 346,360" stroke="#C084FC" stroke-width="4" stroke-dasharray="8 6" stroke-opacity="0.8" />

    <!-- Outer Peer Nodes -->
    <circle cx="80" cy="180" r="12" fill="#06B6D4" />
    <circle cx="80" cy="180" r="5" fill="#FFFFFF" />

    <circle cx="432" cy="170" r="12" fill="#A78BFA" />
    <circle cx="432" cy="170" r="5" fill="#FFFFFF" />

    <circle cx="76" cy="350" r="12" fill="#22D3EE" />
    <circle cx="76" cy="350" r="5" fill="#FFFFFF" />

    <circle cx="436" cy="360" r="12" fill="#C084FC" />
    <circle cx="436" cy="360" r="5" fill="#FFFFFF" />
  </g>

  <!-- 3D Ribbon Letter "S" Symbol -->
  <g id="ribbon-s" filter="url(#pwa-shadow)">
    <!-- Back 3D Extrusion -->
    <path
      d="M 330,120 C 330,120 220,95 170,140 C 120,185 130,240 190,265 C 245,285 300,295 285,345 C 265,395 195,405 145,370 C 130,360 120,340 120,340"
      stroke="#1E1B4B"
      stroke-width="56"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.75"
    />

    <!-- Main Ribbon Arc with 3D Flow -->
    <path
      d="M 330,120 C 330,120 220,95 170,140 C 120,185 130,240 190,265 C 245,285 300,295 285,345 C 265,395 195,405 145,370 C 130,360 120,340 120,340"
      stroke="url(#pwa-ribbon)"
      stroke-width="44"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Specular Highlight Ribbon Bevel -->
    <path
      d="M 315,122 C 230,105 180,140 175,178 C 170,218 215,245 250,262 C 285,280 305,310 295,348 C 280,380 230,392 170,372"
      stroke="url(#pwa-specular)"
      stroke-width="9"
      stroke-linecap="round"
      fill="none"
    />

    <!-- Center Connected Student Nodes & Curved Connection Paths Across S Center -->
    <g>
      <path d="M 180,210 C 210,195 240,200 270,190" stroke="#22D3EE" stroke-width="5" stroke-dasharray="7 5" stroke-linecap="round" />
      <path d="M 270,190 C 300,180 320,205 330,225" stroke="#818CF8" stroke-width="5" stroke-dasharray="7 5" stroke-linecap="round" />
      <path d="M 195,260 C 230,250 260,250 285,275" stroke="#38BDF8" stroke-width="6" stroke-linecap="round" />

      <!-- Center Nodes -->
      <circle cx="180" cy="210" r="10" fill="#06B6D4" />
      <circle cx="180" cy="210" r="4.5" fill="#FFFFFF" />

      <circle cx="270" cy="190" r="12" fill="#7C3AED" />
      <circle cx="270" cy="190" r="5" fill="#FFFFFF" />

      <circle cx="330" cy="225" r="10" fill="#3B82F6" />
      <circle cx="330" cy="225" r="4" fill="#FFFFFF" />

      <circle cx="285" cy="275" r="14" fill="#4F46E5" />
      <circle cx="285" cy="275" r="8" fill="#06B6D4" />
      <circle cx="285" cy="275" r="4" fill="#FFFFFF" />

      <circle cx="195" cy="260" r="11" fill="#06B6D4" />
      <circle cx="195" cy="260" r="4.5" fill="#FFFFFF" />
    </g>

    <!-- Embedded AI Circuit Traces at Bottom of S -->
    <g>
      <path d="M 185,340 L 220,340 L 245,320 L 295,320" stroke="#22D3EE" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="295" cy="320" r="9" fill="#06B6D4" />
      <circle cx="295" cy="320" r="3.5" fill="#FFFFFF" />

      <path d="M 170,368 L 210,368 L 240,392 L 275,392" stroke="#67E8F9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="275" cy="392" r="8" fill="#38BDF8" />
      <circle cx="275" cy="392" r="3" fill="#FFFFFF" />

      <path d="M 215,340 L 215,368" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="215" cy="340" r="4" fill="#22D3EE" />
      <circle cx="215" cy="368" r="4" fill="#22D3EE" />
    </g>

    <!-- Integrated Academic Graduation Cap at Top of S -->
    <g>
      <!-- 3D Mortarboard Platform -->
      <polygon points="270,45 365,80 270,115 175,80" fill="#1E1B4B" stroke="#4F46E5" stroke-width="4" />
      <polygon points="270,45 365,80 270,115 175,80" fill="url(#pwa-ribbon)" opacity="0.88" />
      <polyline points="175,80 270,45 365,80" stroke="#FFFFFF" stroke-width="5" fill="none" opacity="0.9" />

      <!-- Skullcap Base -->
      <path d="M 215,95 L 270,115 L 325,95 L 325,112 L 270,132 L 215,112 Z" fill="#0F172A" stroke="#3B82F6" stroke-width="2" />
      
      <!-- Center Pivot Stud -->
      <ellipse cx="270,80" rx="8" ry="5.5" fill="#FFFFFF" />

      <!-- Flowing Graduation Tassel -->
      <path d="M 270,80 C 310,82 345,102 355,130 C 360,148 355,168 345,188" stroke="url(#pwa-cyan)" stroke-width="6" stroke-linecap="round" fill="none" />
      <circle cx="345" cy="188" r="9" fill="#06B6D4" />
      <circle cx="345" cy="188" r="3.5" fill="#FFFFFF" />
    </g>
  </g>
</svg>`;

const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <!-- Solid/Gradient Full Bleed Background for Safe Zone Cropping -->
    <radialGradient id="mask-bg" cx="50%" cy="45%" r="75%">
      <stop offset="0%" stop-color="#1E1B4B" />
      <stop offset="50%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#050B1A" />
    </radialGradient>

    <!-- Master Ribbon Gradient -->
    <linearGradient id="mask-ribbon" x1="15%" y1="12%" x2="85%" y2="88%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="35%" stop-color="#3B82F6" />
      <stop offset="70%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#7C3AED" />
    </linearGradient>

    <linearGradient id="mask-specular" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <linearGradient id="mask-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
  </defs>

  <!-- Full bleed background covering 100% of 512x512 -->
  <rect width="512" height="512" fill="url(#mask-bg)" />

  <!-- Ambient Light Core -->
  <circle cx="256" cy="256" r="180" fill="#4F46E5" opacity="0.2" />
  <circle cx="256" cy="280" r="140" fill="#06B6D4" opacity="0.18" />

  <!-- Scaled Content within Safe Zone (80% box = centered in 512x512, ~60px inset) -->
  <g transform="translate(51, 48) scale(0.8)">
    <!-- 3D Ribbon Letter "S" Symbol -->
    <path
      d="M 330,120 C 330,120 220,95 170,140 C 120,185 130,240 190,265 C 245,285 300,295 285,345 C 265,395 195,405 145,370 C 130,360 120,340 120,340"
      stroke="#1E1B4B"
      stroke-width="56"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.75"
    />

    <path
      d="M 330,120 C 330,120 220,95 170,140 C 120,185 130,240 190,265 C 245,285 300,295 285,345 C 265,395 195,405 145,370 C 130,360 120,340 120,340"
      stroke="url(#mask-ribbon)"
      stroke-width="44"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      d="M 315,122 C 230,105 180,140 175,178 C 170,218 215,245 250,262 C 285,280 305,310 295,348 C 280,380 230,392 170,372"
      stroke="url(#mask-specular)"
      stroke-width="9"
      stroke-linecap="round"
      fill="none"
    />

    <!-- Center Connected Student Nodes & Curved Connection Paths Across S Center -->
    <g>
      <path d="M 180,210 C 210,195 240,200 270,190" stroke="#22D3EE" stroke-width="5" stroke-dasharray="7 5" stroke-linecap="round" />
      <path d="M 270,190 C 300,180 320,205 330,225" stroke="#818CF8" stroke-width="5" stroke-dasharray="7 5" stroke-linecap="round" />
      <path d="M 195,260 C 230,250 260,250 285,275" stroke="#38BDF8" stroke-width="6" stroke-linecap="round" />

      <circle cx="180" cy="210" r="10" fill="#06B6D4" />
      <circle cx="180" cy="210" r="4.5" fill="#FFFFFF" />

      <circle cx="270" cy="190" r="12" fill="#7C3AED" />
      <circle cx="270" cy="190" r="5" fill="#FFFFFF" />

      <circle cx="330" cy="225" r="10" fill="#3B82F6" />
      <circle cx="330" cy="225" r="4" fill="#FFFFFF" />

      <circle cx="285" cy="275" r="14" fill="#4F46E5" />
      <circle cx="285" cy="275" r="8" fill="#06B6D4" />
      <circle cx="285" cy="275" r="4" fill="#FFFFFF" />

      <circle cx="195" cy="260" r="11" fill="#06B6D4" />
      <circle cx="195" cy="260" r="4.5" fill="#FFFFFF" />
    </g>

    <!-- Embedded AI Circuit Traces at Bottom of S -->
    <g>
      <path d="M 185,340 L 220,340 L 245,320 L 295,320" stroke="#22D3EE" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="295" cy="320" r="9" fill="#06B6D4" />
      <circle cx="295" cy="320" r="3.5" fill="#FFFFFF" />

      <path d="M 170,368 L 210,368 L 240,392 L 275,392" stroke="#67E8F9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="275" cy="392" r="8" fill="#38BDF8" />
      <circle cx="275" cy="392" r="3" fill="#FFFFFF" />

      <path d="M 215,340 L 215,368" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="215" cy="340" r="4" fill="#22D3EE" />
      <circle cx="215" cy="368" r="4" fill="#22D3EE" />
    </g>

    <!-- Integrated Academic Graduation Cap at Top of S -->
    <g>
      <polygon points="270,45 365,80 270,115 175,80" fill="#1E1B4B" stroke="#4F46E5" stroke-width="4" />
      <polygon points="270,45 365,80 270,115 175,80" fill="url(#mask-ribbon)" opacity="0.88" />
      <polyline points="175,80 270,45 365,80" stroke="#FFFFFF" stroke-width="5" fill="none" opacity="0.9" />

      <path d="M 215,95 L 270,115 L 325,95 L 325,112 L 270,132 L 215,112 Z" fill="#0F172A" stroke="#3B82F6" stroke-width="2" />
      <ellipse cx="270,80" rx="8" ry="5.5" fill="#FFFFFF" />

      <path d="M 270,80 C 310,82 345,102 355,130 C 360,148 355,168 345,188" stroke="url(#mask-cyan)" stroke-width="6" stroke-linecap="round" fill="none" />
      <circle cx="345" cy="188" r="9" fill="#06B6D4" />
      <circle cx="345" cy="188" r="3.5" fill="#FFFFFF" />
    </g>
  </g>
</svg>`;

async function run() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save base SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), maskableSvg);
  console.log('Wrote SVGs to public/');

  // Generate 512x512 standard
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // Generate 192x192 standard
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // Generate 512x512 maskable
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // Generate 180x180 apple-touch-icon
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Generate 64x64 and 32x32 favicon
  await sharp(Buffer.from(standardSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon-64x64.png'));
  console.log('Generated favicon-64x64.png');

  console.log('All PWA icons generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
