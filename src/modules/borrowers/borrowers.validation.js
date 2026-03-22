const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateCreateBorrower = [
  body('user_id').isUUID().withMessage('Valid user_id (UUID) is required.'),
  body('phone').notEmpty().withMessage('Phone number is required.'),
  body('national_id').notEmpty().withMessage('National ID is required.'),
  handle,
];

const validateUpdateBorrower = [
  body('phone').optional().notEmpty().withMessage('Phone number cannot be empty.'),
  body('national_id').optional().notEmpty().withMessage('National ID cannot be empty.'),
  handle,
];

module.exports = { validateCreateBorrower, validateUpdateBorrower };