const pool = require('../../config/db');

const createSchedules = async (schedules) => {
  // Bulk insert all installments at once
  const values = schedules.map((s, i) => {
    const offset = i * 5;
    return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`;
  }).join(', ');

  const params = schedules.flatMap(s => [
    s.schedule_id, s.loan_id, s.installment_number, s.due_date, s.amount_due,
  ]);

  const result = await pool.query(
    `INSERT INTO repayment_schedules (schedule_id, loan_id, installment_number, due_date, amount_due)
     VALUES ${values} RETURNING *`,
    params
  );
  return result.rows;
};

const getSchedulesByLoanId = async (loan_id) => {
  const result = await pool.query(
    `SELECT * FROM repayment_schedules
     WHERE loan_id = $1
     ORDER BY installment_number ASC`,
    [loan_id]
  );
  return result.rows;
};

const getScheduleById = async (schedule_id) => {
  const result = await pool.query(
    `SELECT rs.*, lo.borrower_id, lo.principal_amount, lo.interest_rate
     FROM repayment_schedules rs
     JOIN loans lo ON rs.loan_id = lo.loan_id
     WHERE rs.schedule_id = $1`,
    [schedule_id]
  );
  return result.rows[0];
};

const getPendingSchedulesByLoanId = async (loan_id) => {
  const result = await pool.query(
    `SELECT * FROM repayment_schedules
     WHERE loan_id = $1 AND status = 'pending'
     ORDER BY installment_number ASC`,
    [loan_id]
  );
  return result.rows;
};

const getOverdueSchedules = async () => {
  const result = await pool.query(
    `SELECT rs.*, lo.borrower_id,
            bp.first_name, bp.last_name,
            u.email AS borrower_email
     FROM repayment_schedules rs
     JOIN loans lo ON rs.loan_id = lo.loan_id
     JOIN borrowers b ON lo.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     WHERE rs.status = 'pending' AND rs.due_date < CURRENT_DATE
     ORDER BY rs.due_date ASC`
  );
  return result.rows;
};

const updateScheduleStatus = async (schedule_id, status) => {
  const result = await pool.query(
    `UPDATE repayment_schedules SET status = $1
     WHERE schedule_id = $2
     RETURNING *`,
    [status, schedule_id]
  );
  return result.rows[0];
};

const deleteSchedulesByLoanId = async (loan_id) => {
  await pool.query('DELETE FROM repayment_schedules WHERE loan_id = $1', [loan_id]);
};

module.exports = {
  createSchedules, getSchedulesByLoanId, getScheduleById,
  getPendingSchedulesByLoanId, getOverdueSchedules,
  updateScheduleStatus, deleteSchedulesByLoanId,
};