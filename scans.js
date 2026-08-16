const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// POST /api/scans - log a new scan (called right after MobileNetV2 predicts a breed)
// Body: { predicted_breed_name, confidence, latitude, longitude, state, scanned_by, flagged_health_issue, health_notes, image_ref }
router.post('/', async (req, res) => {
  try {
    const {
      predicted_breed_name, confidence, latitude, longitude, state,
      scanned_by, flagged_health_issue, health_notes, image_ref,
    } = req.body;

    if (!predicted_breed_name || confidence === undefined) {
      return res.status(400).json({ error: 'predicted_breed_name and confidence are required' });
    }

    // Try to resolve breed_id from the breeds table (denormalized name is stored regardless,
    // so a scan is never lost even if the breed name doesn't match your reference table yet)
    const breedLookup = await pool.query(
      'SELECT id FROM breeds WHERE LOWER(name) = LOWER($1)',
      [predicted_breed_name]
    );
    const breedId = breedLookup.rows[0]?.id || null;

    const result = await pool.query(
      `INSERT INTO scans
        (breed_id, predicted_breed_name, confidence, latitude, longitude, state,
         flagged_health_issue, health_notes, scanned_by, image_ref)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [breedId, predicted_breed_name, confidence, latitude, longitude, state,
       flagged_health_issue || false, health_notes || null, scanned_by || null, image_ref || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log scan' });
  }
});

// GET /api/scans - list recent scans (optionally filter by state or breed)
router.get('/', async (req, res) => {
  try {
    const { state, breed, limit } = req.query;
    let query = 'SELECT * FROM scans WHERE 1=1';
    const params = [];

    if (state) {
      params.push(state);
      query += ` AND state = $${params.length}`;
    }
    if (breed) {
      params.push(breed);
      query += ` AND LOWER(predicted_breed_name) = LOWER($${params.length})`;
    }
    query += ' ORDER BY scanned_at DESC';
    if (limit) {
      params.push(parseInt(limit, 10));
      query += ` LIMIT $${params.length}`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
});

// GET /api/scans/heatmap - aggregated counts per state per breed (State-Wise Heatmap)
router.get('/heatmap', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT state, predicted_breed_name AS breed, COUNT(*) AS scan_count
      FROM scans
      WHERE state IS NOT NULL
      GROUP BY state, predicted_breed_name
      ORDER BY state, scan_count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

// GET /api/scans/heatmap/summary - total scans per state only (simpler map layer)
router.get('/heatmap/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT state, COUNT(*) AS total_scans, COUNT(DISTINCT predicted_breed_name) AS breed_diversity
      FROM scans
      WHERE state IS NOT NULL
      GROUP BY state
      ORDER BY total_scans DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch heatmap summary' });
  }
});

module.exports = router;
