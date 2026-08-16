const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/breeds - list all breeds (Central Breed Database)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query; // optional filter: cattle | buffalo
    const query = type
      ? 'SELECT * FROM breeds WHERE animal_type = $1 ORDER BY name'
      : 'SELECT * FROM breeds ORDER BY name';
    const params = type ? [type] : [];
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch breeds' });
  }
});

// GET /api/breeds/:name - lookup a single breed by name (used by Live Scanning
// right after the TF.js model predicts a breed, to pull traits for display)
router.get('/:name', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM breeds WHERE LOWER(name) = LOWER($1)',
      [req.params.name]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Breed not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch breed' });
  }
});

// POST /api/breeds - add a new breed (for expanding your 50+ breed list over time)
router.post('/', async (req, res) => {
  try {
    const {
      name, animal_type, origin_state, milk_yield_liters_per_day,
      adaptability_score, disease_resistance, coat_color, horn_type,
      body_size, notes, image_ref,
    } = req.body;

    if (!name || !animal_type) {
      return res.status(400).json({ error: 'name and animal_type are required' });
    }

    const result = await pool.query(
      `INSERT INTO breeds
        (name, animal_type, origin_state, milk_yield_liters_per_day, adaptability_score,
         disease_resistance, coat_color, horn_type, body_size, notes, image_ref)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (name) DO UPDATE SET
         animal_type = EXCLUDED.animal_type,
         origin_state = EXCLUDED.origin_state,
         milk_yield_liters_per_day = EXCLUDED.milk_yield_liters_per_day,
         adaptability_score = EXCLUDED.adaptability_score,
         disease_resistance = EXCLUDED.disease_resistance,
         coat_color = EXCLUDED.coat_color,
         horn_type = EXCLUDED.horn_type,
         body_size = EXCLUDED.body_size,
         notes = EXCLUDED.notes,
         image_ref = EXCLUDED.image_ref
       RETURNING *`,
      [name, animal_type, origin_state, milk_yield_liters_per_day, adaptability_score,
       disease_resistance, coat_color, horn_type, body_size, notes, image_ref]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add breed' });
  }
});

module.exports = router;
