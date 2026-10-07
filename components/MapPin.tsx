// Static map: a 3x3 grid of OSM tiles with the pin at the exact point. No JS map library,
// ~9 small images, lazy-loaded. Swap TILE_URL for a paid/self-hosted provider before real traffic
// (OSM's public tile servers are for light use only).
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const Z = 17;

function project(lat: number, lng: number) {
  const n = 2 ** Z;
  const x = ((lng + 180) / 360) * n;
  const rad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
  return { x, y };
}

export default function MapPin({ lat, lng }: { lat: number; lng: number }) {
  const { x, y } = project(lat, lng);
  const cx = Math.floor(x);
  const cy = Math.floor(y);
  const px = (x - (cx - 1)) * 256; // pin position inside the 768px grid
  const py = (y - (cy - 1)) * 256;

  const tiles = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++)
      tiles.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${dx},${dy}`}
          src={TILE_URL.replace("{z}", String(Z)).replace("{x}", String(cx + dx)).replace("{y}", String(cy + dy))}
          width={256}
          height={256}
          alt=""
          loading="lazy"
          className="block h-[256px] w-[256px]"
        />
      );

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-neutral-200" aria-label="Map showing the pin">
      <div
        className="absolute grid grid-cols-3"
        style={{ width: 768, height: 768, left: "50%", top: "50%", marginLeft: -px, marginTop: -py }}
      >
        {tiles}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-3xl drop-shadow">📍</div>
    </div>
  );
}
