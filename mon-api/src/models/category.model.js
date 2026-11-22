const pool = require('../config/db');

/**
 * Find all categories (sorted alphabetically)
 */
const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  return rows;
};

/**
 * Find a single category by id
 */
const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
};

/**
 * Create a new category
 */
const create = async ({ name }) => {
  const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
  return findById(result.insertId);
};

/**
 * Update a category name
 */
const update = async (id, { name }) => {
  await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
  return findById(id);
};

/**
 * Delete a category by id
 */
const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = { findAll, findById, create, update, remove };