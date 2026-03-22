const pool = require('../../config/db');

const createModelVersion = async ({ model_id, model_name, model_version, training_dataset }) => {
  const result = await pool.query(
    `INSERT INTO model_versions (model_id, model_name, model_version, training_dataset)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [model_id, model_name, model_version, training_dataset]
  );
  return result.rows[0];
};

const getAllModelVersions = async () => {
  const result = await pool.query(
    `SELECT * FROM model_versions ORDER BY created_at DESC`
  );
  return result.rows;
};

const getModelVersionById = async (model_id) => {
  const result = await pool.query(
    `SELECT * FROM model_versions WHERE model_id = $1`,
    [model_id]
  );
  return result.rows[0];
};

const getModelVersionsByName = async (model_name) => {
  const result = await pool.query(
    `SELECT * FROM model_versions
     WHERE model_name ILIKE $1
     ORDER BY created_at DESC`,
    [`%${model_name}%`]
  );
  return result.rows;
};

const checkDuplicate = async (model_name, model_version) => {
  const result = await pool.query(
    `SELECT * FROM model_versions
     WHERE model_name = $1 AND model_version = $2`,
    [model_name, model_version]
  );
  return result.rows[0];
};

const updateModelVersion = async (model_id, { model_name, model_version, training_dataset }) => {
  const result = await pool.query(
    `UPDATE model_versions
     SET model_name = $1, model_version = $2, training_dataset = $3
     WHERE model_id = $4
     RETURNING *`,
    [model_name, model_version, training_dataset, model_id]
  );
  return result.rows[0];
};

const deleteModelVersion = async (model_id) => {
  await pool.query('DELETE FROM model_versions WHERE model_id = $1', [model_id]);
};

module.exports = {
  createModelVersion, getAllModelVersions, getModelVersionById,
  getModelVersionsByName, checkDuplicate,
  updateModelVersion, deleteModelVersion,
};