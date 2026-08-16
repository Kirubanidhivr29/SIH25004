# SIH25004 Backend

Backend for the Animal Type Classification project. Powers 3 features:
- **Live Scanning** trait lookup (breed → milk yield / adaptability / disease resistance)
- **State-Wise Heatmap** (aggregated scan counts per state/breed)
- **Geo-Tagging & Timestamping** (every scan stored with lat/lng + time)

## Setup

```bash
npm install
```

Set environment variables (create a `.env` or export directly):

```bash
# Option A: single connection string (use this on Render.com)
DATABASE_URL=postgres://user:password@host:5432/dbname

# Option B: individual vars (useful for local dev)
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=sih25004
```

Initialize the database (creates tables + seeds ~20 starter breeds):

```bash
npm run db:init
# or manually:
psql $DATABASE_URL -f db/schema.sql
psql $DATABASE_URL -f db/seed.sql
```

Run the server:

```bash
npm start        # production
npm run dev       # auto-restart on file change
```

Server starts on `PORT` env var, defaults to `5000`.

## API Reference

### Breeds
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/breeds` | List all breeds. Optional `?type=cattle` or `?type=buffalo` |
| GET | `/api/breeds/:name` | Lookup one breed (used right after model prediction) |
| POST | `/api/breeds` | Add/update a breed (upsert by name) |

### Scans
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/scans` | Log a new scan (breed, confidence, lat/lng, state, etc.) |
| GET | `/api/scans` | List recent scans. Filters: `?state=`, `?breed=`, `?limit=` |
| GET | `/api/scans/heatmap` | Per-state, per-breed scan counts |
| GET | `/api/scans/heatmap/summary` | Per-state total scans + breed diversity |

## Example: logging a scan after model prediction

```js
// After your TF.js MobileNetV2 model returns a prediction client-side:
await fetch('https://your-backend-url/api/scans', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    predicted_breed_name: 'Gir',
    confidence: 92.4,
    latitude: 13.0827,
    longitude: 80.2707,
    state: 'Tamil Nadu',
    scanned_by: 'flw_device_001',
  }),
});
```

## Next steps
- Expand `db/seed.sql` beyond the ~20 starter breeds toward your full 50+ list as your training dataset grows
- Deploy: Render.com free tier works (same as RIVERWATCH) — attach a Postgres instance, set `DATABASE_URL` automatically
- Wire up Leaflet.js on the frontend using `/api/scans/heatmap/summary` for the State-Wise Heatmap
