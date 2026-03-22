const { body, validationResult } = require('express-validator');

const validateStaff = [
  body('user_id').isUUID().withMessage('Valid user_id (UUID) is required.'),
  body('lender_id').isUUID().withMessage('Valid lender_id (UUID) is required.'),
  body('full_name').notEmpty().withMessage('Full name is required.'),
  body('position').notEmpty().withMessage('Position is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateStaffUpdate = [
  body('full_name').notEmpty().withMessage('Full name is required.'),
  body('position').notEmpty().withMessage('Position is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateStaff, validateStaffUpdate };