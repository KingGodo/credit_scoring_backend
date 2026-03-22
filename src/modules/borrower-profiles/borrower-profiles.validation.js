const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateProfile = [
  body('first_name').notEmpty().withMessage('First name is required.'),
  body('last_name').notEmpty().withMessage('Last name is required.'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other.'),
  body('date_of_birth')
    .optional()
    .isDate()
    .withMessage('Date of birth must be a valid date (YYYY-MM-DD).'),
  body('monthly_income')
    .optional()
    .isNumeric()
    .withMessage('Monthly income must be a number.'),
  body('years_in_business')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years in business must be a non-negative integer.'),
  handle,
];

const validateProfileUpdate = [
  body('first_name').optional().notEmpty().withMessage('First name cannot be empty.'),
  body('last_name').optional().notEmpty().withMessage('Last name cannot be empty.'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other.'),
  body('date_of_birth')
    .optional()
    .isDate()
    .withMessage('Date of birth must be a valid date (YYYY-MM-DD).'),
  body('monthly_income')
    .optional()
    .isNumeric()
    .withMessage('Monthly income must be a number.'),
  body('years_in_business')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years in business must be a non-negative integer.'),
  handle,
];

module.exports = { validateProfile, validateProfileUpdate };