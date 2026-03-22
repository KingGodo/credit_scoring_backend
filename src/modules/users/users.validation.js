const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateUpdateUser = [
  body('email').optional().isEmail().withMessage('Valid email is required.'),
  body('role').optional().isIn(['borrower', 'loan_officer', 'admin']).withMessage('Invalid role.'),
  handle,
];

const validateChangePassword = [
  body('current_password').notEmpty().withMessage('Current password is required.'),
  body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
  handle,
];

module.exports = { validateUpdateUser, validateChangePassword };