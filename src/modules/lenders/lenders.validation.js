const { body, validationResult } = require('express-validator');

const validateLender = [
  body('name').notEmpty().withMessage('Lender name is required.'),
  body('contact_email').optional().isEmail().withMessage('Valid email required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateLender };