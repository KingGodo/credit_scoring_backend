const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateCreateModel = [
  body('model_name')
    .notEmpty().withMessage('model_name is required.')
    .isLength({ max: 100 }).withMessage('model_name must be 100 characters or less.'),
  body('model_version')
    .notEmpty().withMessage('model_version is required.')
    .isLength({ max: 50 }).withMessage('model_version must be 50 characters or less.'),
  body('training_dataset')
    .optional()
    .isLength({ max: 150 }).withMessage('training_dataset must be 150 characters or less.'),
  handle,
];

const validateUpdateModel = [
  body('model_name')
    .optional()
    .notEmpty().withMessage('model_name cannot be empty.')
    .isLength({ max: 100 }).withMessage('model_name must be 100 characters or less.'),
  body('model_version')
    .optional()
    .notEmpty().withMessage('model_version cannot be empty.')
    .isLength({ max: 50 }).withMessage('model_version must be 50 characters or less.'),
  body('training_dataset')
    .optional()
    .isLength({ max: 150 }).withMessage('training_dataset must be 150 characters or less.'),
  handle,
];

module.exports = { validateCreateModel, validateUpdateModel };