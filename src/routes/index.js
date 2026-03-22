const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/users.routes');
const lenderRoutes = require('../modules/lenders/lenders.routes');
const lenderStaffRoutes = require('../modules/lender-staff/lender-staff.routes');
const borrowerRoutes = require('../modules/borrowers/borrowers.routes');
const borrowerProfileRoutes = require('../modules/borrower-profiles/borrower-profiles.routes');
const borrowerDocumentRoutes = require('../modules/borrower-documents/borrower-documents.routes');
const loanProductRoutes = require('../modules/loan-products/loan-products.routes');
const loanApplicationRoutes = require('../modules/loan-applications/loan-applications.routes');
const loanRoutes = require('../modules/loans/loans.routes');
const repaymentScheduleRoutes = require('../modules/repayment-schedules/repayment-schedules.routes');
const repaymentRoutes = require('../modules/repayments/repayments.routes');
const modelVersionRoutes = require('../modules/model-versions/model-versions.routes');
const predictionRunRoutes = require('../modules/prediction-runs/prediction-runs.routes');
const auditLogRoutes = require('../modules/audit-logs/audit-logs.routes');

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running.' });
});

// ─── Mount all module routes ──────────────────────────────────
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/lenders', lenderRoutes);
router.use('/lender-staff', lenderStaffRoutes);
router.use('/borrowers', borrowerRoutes);
router.use('/borrower-profiles', borrowerProfileRoutes);
router.use('/borrower-documents', borrowerDocumentRoutes);
router.use('/loan-products', loanProductRoutes);
router.use('/loan-applications', loanApplicationRoutes);
router.use('/loans', loanRoutes);
router.use('/repayment-schedules', repaymentScheduleRoutes);
router.use('/repayments', repaymentRoutes);
router.use('/model-versions', modelVersionRoutes);
router.use('/prediction-runs', predictionRunRoutes);
router.use('/audit-logs', auditLogRoutes);

module.exports = router;