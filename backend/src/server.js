import cors from 'cors';
import express from 'express';
import { randomUUID } from 'crypto';
import { getDb, mapRiskRows } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const parsePositiveInt = (value, fallback) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
};

app.get('/api/health', async (_req, res) => {
  try {
    await getDb();
    res.json({
      ok: true,
      database: 'sqlite',
      message: 'Backend psicosocial online',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/risk-management/summary', async (_req, res) => {
  try {
    const db = await getDb();
    const totals = await db.get(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN probability * severity >= 15 THEN 1 ELSE 0 END) AS critical,
        SUM(CASE WHEN type = 'Psicossocial' THEN 1 ELSE 0 END) AS psychosocial,
        SUM(CASE WHEN status = 'Vencido' THEN 1 ELSE 0 END) AS expired
      FROM risks
    `);

    res.json({
      totalRisks: totals.total || 0,
      criticalRisks: totals.critical || 0,
      psychosocialRisks: totals.psychosocial || 0,
      expiredReviews: totals.expired || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/risk-management/risks', async (req, res) => {
  try {
    const db = await getDb();
    const { q = '', type = '', status = '' } = req.query;

    const rows = await db.all(
      `SELECT * FROM risks
       WHERE description LIKE ?
         AND (? = '' OR type = ?)
         AND (? = '' OR status = ?)
       ORDER BY created_at DESC`,
      [`%${q}%`, String(type), String(type), String(status), String(status)]
    );

    const controls = await db.all('SELECT risk_id, control FROM risk_controls');
    res.json(mapRiskRows(rows, controls));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/risk-management/risks', async (req, res) => {
  try {
    const db = await getDb();
    const {
      type,
      description,
      source,
      unit,
      sector,
      probability,
      severity,
      initialScore,
      controls = [],
      lastReview = null,
      validUntil = null,
      status = 'Em Dia',
    } = req.body;

    if (!type || !description || !source || !unit || !sector) {
      return res.status(400).json({ error: 'Campos obrigatórios: type, description, source, unit, sector.' });
    }

    const riskId = randomUUID();

    await db.run(
      `INSERT INTO risks (
        id, type, description, source, unit, sector, probability, severity, initial_score, last_review, valid_until, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        riskId,
        type,
        description,
        source,
        unit,
        sector,
        parsePositiveInt(probability, 1),
        parsePositiveInt(severity, 1),
        parsePositiveInt(initialScore, parsePositiveInt(probability, 1) * parsePositiveInt(severity, 1)),
        lastReview,
        validUntil,
        status,
      ]
    );

    for (const control of controls) {
      if (typeof control === 'string' && control.trim()) {
        await db.run('INSERT INTO risk_controls (risk_id, control) VALUES (?, ?)', [riskId, control.trim()]);
      }
    }

    const created = await db.get('SELECT * FROM risks WHERE id = ?', [riskId]);
    const controlsRows = await db.all('SELECT risk_id, control FROM risk_controls WHERE risk_id = ?', [riskId]);

    return res.status(201).json(mapRiskRows([created], controlsRows)[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/risk-management/actions', async (_req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM actions ORDER BY due_date ASC');

    const actions = rows.map((row) => ({
      id: row.id,
      title: row.title,
      responsible: row.responsible,
      dueDate: row.due_date,
      status: row.status,
      desc: row.description,
      riskId: row.risk_id,
      riskName: row.risk_name,
      riskCategory: row.risk_category,
      riskLevel: row.risk_level,
      actionType: row.action_type,
      expectedImpact: row.expected_impact,
      evidenceCount: row.evidence_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/risk-management/actions', async (req, res) => {
  try {
    const db = await getDb();
    const {
      title,
      responsible,
      dueDate,
      status = 'Pendente',
      desc,
      riskId,
      riskName,
      riskCategory,
      riskLevel,
      actionType,
      expectedImpact,
      evidenceCount = 0,
    } = req.body;

    if (!title || !responsible || !dueDate || !desc || !riskId || !riskName || !riskCategory || !riskLevel || !actionType || !expectedImpact) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes para criar ação.' });
    }

    const actionId = randomUUID();

    await db.run(
      `INSERT INTO actions (
        id, title, responsible, due_date, status, description,
        risk_id, risk_name, risk_category, risk_level, action_type, expected_impact, evidence_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        actionId,
        title,
        responsible,
        dueDate,
        status,
        desc,
        riskId,
        riskName,
        riskCategory,
        riskLevel,
        actionType,
        expectedImpact,
        parsePositiveInt(evidenceCount, 0),
      ]
    );

    const created = await db.get('SELECT * FROM actions WHERE id = ?', [actionId]);
    return res.status(201).json({
      id: created.id,
      title: created.title,
      responsible: created.responsible,
      dueDate: created.due_date,
      status: created.status,
      desc: created.description,
      riskId: created.risk_id,
      riskName: created.risk_name,
      riskCategory: created.risk_category,
      riskLevel: created.risk_level,
      actionType: created.action_type,
      expectedImpact: created.expected_impact,
      evidenceCount: created.evidence_count,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  try {
    await getDb();
    console.log(`Backend running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to initialize SQLite:', error.message);
    process.exit(1);
  }
});
