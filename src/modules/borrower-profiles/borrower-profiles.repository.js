const pool = require('../../config/db');

const createProfile = async ({
  profile_id, borrower_id, first_name, last_name, gender,
  date_of_birth, occupation, business_type, monthly_income,
  years_in_business, address,
}) => {
  const result = await pool.query(
    `INSERT INTO borrower_profiles (
       profile_id, borrower_id, first_name, last_name, gender,
       date_of_birth, occupation, business_type, monthly_income,
       years_in_business, address
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      profile_id, borrower_id, first_name, last_name, gender,
      date_of_birth, occupation, business_type, monthly_income,
      years_in_business, address,
    ]
  );
  return result.rows[0];
};

const getProfileByBorrowerId = async (borrower_id) => {
  const result = await pool.query(
    `SELECT bp.*, b.phone, b.national_id, u.email
     FROM borrower_profiles bp
     JOIN borrowers b ON bp.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     WHERE bp.borrower_id = $1`,
    [borrower_id]
  );
  return result.rows[0];
};

const getProfileById = async (profile_id) => {
  const result = await pool.query(
    `SELECT bp.*, b.phone, b.national_id, u.email
     FROM borrower_profiles bp
     JOIN borrowers b ON bp.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     WHERE bp.profile_id = $1`,
    [profile_id]
  );
  return result.rows[0];
};

const getAllProfiles = async () => {
  const result = await pool.query(
    `SELECT bp.*, b.phone, b.national_id, u.email
     FROM borrower_profiles bp
     JOIN borrowers b ON bp.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     ORDER BY bp.created_at DESC`
  );
  return result.rows;
};

const updateProfile = async (profile_id, {
  first_name, last_name, gender, date_of_birth,
  occupation, business_type, monthly_income,
  years_in_business, address,
}) => {
  const result = await pool.query(
    `UPDATE borrower_profiles SET
       first_name = $1, last_name = $2, gender = $3,
       date_of_birth = $4, occupation = $5, business_type = $6,
       monthly_income = $7, years_in_business = $8, address = $9
     WHERE profile_id = $10
     RETURNING *`,
    [
      first_name, last_name, gender, date_of_birth,
      occupation, business_type, monthly_income,
      years_in_business, address, profile_id,
    ]
  );
  return result.rows[0];
};

const deleteProfile = async (profile_id) => {
  await pool.query('DELETE FROM borrower_profiles WHERE profile_id = $1', [profile_id]);
};

module.exports = {
  createProfile, getProfileByBorrowerId, getProfileById,
  getAllProfiles, updateProfile, deleteProfile,
};