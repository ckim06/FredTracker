import express from 'express';
import {
  fetchCategorySeries,
  fetchSeriesMetadata,
  fetchSeriesObservations,
  searchSeries
} from '../services/fredService.ts';

const router = express.Router();

/**
 * GET /api/indicators
 * Fetch California indicators (category 27286)
 */
router.get("/indicators", async (req, res) => {
  try {
    const data = await fetchCategorySeries(27286);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/series/:id
 * Metadata for a specific indicator
 */
router.get("/series/:id", async (req, res) => {
  try {
    const data = await fetchSeriesMetadata(req.params.id);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/series/:id/observations
 * Time-series observations for charting + alerts
 */
router.get("/series/:id/observations", async (req, res) => {
  try {
    const data = await fetchSeriesObservations(req.params.id, req.query);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/search?q=unemployment
 */
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    const data = await searchSeries(q as string);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
