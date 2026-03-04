import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'psicosocial.sqlite');

const RISK_SEED = [
  {
    id: 'r1',
    type: 'Físico',
    description: 'Ruído excessivo em compressor principal',
    source: 'Máquina de compressão de ar',
    unit: 'Planta Norte',
    sector: 'Manutenção',
    probability: 3,
    severity: 4,
    initialScore: 20,
    controls: ['Protetor auricular', 'Enclausuramento'],
    lastReview: '2023-10-12',
    validUntil: '2024-10-12',
    status: 'Em Dia'
  },
  {
    id: 'r2',
    type: 'Psicossocial',
    description: 'Carga mental elevada por metas comerciais',
    source: 'Pressão por resultados / Jornada',
    unit: 'Escritório Central',
    sector: 'Vendas',
    probability: 4,
    severity: 4,
    initialScore: 25,
    controls: ['Pesquisas trimestrais', 'Canal de Escuta'],
    lastReview: '2023-11-05',
    validUntil: '2024-05-05',
    status: 'Em Dia'
  },
  {
    id: 'r3',
    type: 'Ergonômico',
    description: 'Postura inadequada prolongada',
    source: 'Mobiliário não ajustável',
    unit: 'Escritório Central',
    sector: 'RH',
    probability: 2,
    severity: 2,
    initialScore: 8,
    controls: ['Cadeiras NR-17', 'Treinamento'],
    lastReview: '2023-11-20',
    validUntil: '2024-11-20',
    status: 'Em Dia'
  },
  {
    id: 'r4',
    type: 'Químico',
    description: 'Inalação de vapores orgânicos',
    source: 'Solventes de limpeza de bicos',
    unit: 'Planta Norte',
    sector: 'Produção',
    probability: 3,
    severity: 5,
    initialScore: 25,
    controls: ['Exaustão localizada', 'EPI Respiratório'],
    lastReview: '2023-09-15',
    validUntil: '2024-03-15',
    status: 'Vencido'
  }
];

const ACTION_SEED = [
  {
    id: 'a1',
    title: 'Workshop Preventivo: Saude Mental',
    responsible: 'Ana RH',
    dueDate: '2024-05-20',
    status: 'Pendente',
    desc: 'Treinamento obrigatorio para gestores sobre prevencao ao burnout e assedio.',
    riskId: 'r2',
    riskName: 'Carga Mental Elevada',
    riskCategory: 'Psicossocial',
    riskLevel: 'Crítico',
    actionType: 'Treinamento',
    expectedImpact: 'Redução de severidade Crítico -> Moderado',
    evidenceCount: 0
  },
  {
    id: 'a2',
    title: 'Troca de Filtros Exaustao Pintura',
    responsible: 'Carlos Manutencao',
    dueDate: '2023-10-15',
    status: 'Pendente',
    desc: 'Substituicao periodica obrigatoria conforme cronograma de manutencao.',
    riskId: 'r4',
    riskName: 'Inalação de Solventes',
    riskCategory: 'Químico',
    riskLevel: 'Crítico',
    actionType: 'Engenharia',
    expectedImpact: 'Controle na fonte / blindagem fiscal',
    evidenceCount: 1
  },
  {
    id: 'a3',
    title: 'Substituicao Mobiliario Ergonomico',
    responsible: 'Patrimonio',
    dueDate: '2024-12-05',
    status: 'Em Andamento',
    desc: 'Troca de cadeiras no faturamento conforme laudo ergonomico.',
    riskId: 'r3',
    riskName: 'Postura Inadequada',
    riskCategory: 'Ergonômico',
    riskLevel: 'Moderado',
    actionType: 'Administrativa',
    expectedImpact: 'Prevencao de afastamentos',
    evidenceCount: 2
  },
  {
    id: 'a4',
    title: 'Implantação Canal de Ouvidoria',
    responsible: 'Dr. Roberto Santos',
    dueDate: '2023-09-30',
    status: 'Concluído',
    desc: 'Sistema de relatos anonimos para gestao de riscos interpessoais.',
    riskId: 'r2',
    riskName: 'Conflitos Lideranca',
    riskCategory: 'Psicossocial',
    riskLevel: 'Moderado',
    actionType: 'Administrativa',
    expectedImpact: 'Rastreabilidade e compliance NR-01',
    evidenceCount: 3
  }
];

let dbInstance;

const calcRiskLevel = (probability, severity) => {
  const score = probability * severity;
  if (score >= 15) return 'Crítico';
  if (score >= 8) return 'Moderado';
  return 'Tolerável';
};

const seedDatabase = async (db) => {
  const existingRisks = await db.get('SELECT COUNT(*) AS total FROM risks');
  if (existingRisks.total > 0) return;

  for (const risk of RISK_SEED) {
    await db.run(
      `INSERT INTO risks (
        id, type, description, source, unit, sector, probability, severity,
        initial_score, last_review, valid_until, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        risk.id,
        risk.type,
        risk.description,
        risk.source,
        risk.unit,
        risk.sector,
        risk.probability,
        risk.severity,
        risk.initialScore,
        risk.lastReview,
        risk.validUntil,
        risk.status
      ]
    );

    for (const control of risk.controls) {
      await db.run('INSERT INTO risk_controls (risk_id, control) VALUES (?, ?)', [risk.id, control]);
    }
  }

  for (const action of ACTION_SEED) {
    await db.run(
      `INSERT INTO actions (
        id, title, responsible, due_date, status, description,
        risk_id, risk_name, risk_category, risk_level, action_type, expected_impact, evidence_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        action.id,
        action.title,
        action.responsible,
        action.dueDate,
        action.status,
        action.desc,
        action.riskId,
        action.riskName,
        action.riskCategory,
        action.riskLevel,
        action.actionType,
        action.expectedImpact,
        action.evidenceCount
      ]
    );
  }
};

export const getDb = async () => {
  if (dbInstance) return dbInstance;

  fs.mkdirSync(DATA_DIR, { recursive: true });

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS risks (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      source TEXT NOT NULL,
      unit TEXT NOT NULL,
      sector TEXT NOT NULL,
      probability INTEGER NOT NULL,
      severity INTEGER NOT NULL,
      initial_score INTEGER NOT NULL,
      last_review TEXT,
      valid_until TEXT,
      status TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS risk_controls (
      risk_id TEXT NOT NULL,
      control TEXT NOT NULL,
      PRIMARY KEY (risk_id, control),
      FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS actions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      responsible TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      risk_id TEXT NOT NULL,
      risk_name TEXT NOT NULL,
      risk_category TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      action_type TEXT NOT NULL,
      expected_impact TEXT NOT NULL,
      evidence_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await seedDatabase(db);

  dbInstance = db;
  return db;
};

export const mapRiskRows = (riskRows, controlsRows) => {
  const controlsMap = new Map();
  for (const row of controlsRows) {
    const list = controlsMap.get(row.risk_id) || [];
    list.push(row.control);
    controlsMap.set(row.risk_id, list);
  }

  return riskRows.map((row) => {
    const score = row.probability * row.severity;
    return {
      id: row.id,
      type: row.type,
      description: row.description,
      source: row.source,
      unit: row.unit,
      sector: row.sector,
      probability: row.probability,
      severity: row.severity,
      initialScore: row.initial_score,
      currentScore: score,
      level: calcRiskLevel(row.probability, row.severity),
      controls: controlsMap.get(row.id) || [],
      lastReview: row.last_review,
      validUntil: row.valid_until,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  });
};

