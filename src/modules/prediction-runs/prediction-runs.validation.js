const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const VALID_PREDICTION_TYPES = ['application_risk', 'borrower_monitoring', 'portfolio_analysis'];
const VALID_RISK_LEVELS = ['low', 'medium', 'high', 'very_high'];

const validateCreatePrediction = [
  body('borrower_id')
    .isUUID().withMessage('Valid borrower_id (UUID) is required.'),
  body('model_id')
    .isUUID().withMessage('Valid model_id (UUID) is required.'),
  body('loan_id')
    .optional()
    .isUUID().withMessage('loan_id must be a valid UUID.'),
  body('application_id')
    .optional()
    .isUUID().withMessage('application_id must be a valid UUID.'),
  body('default_probability')
    .isNumeric().withMessage('default_probability must be a number.')
    .custom((val) => val >= 0 && val <= 1)
    .withMessage('default_probability must be between 0 and 1.'),
  body('credit_score')
    .isInt({ min: 0, max: 1000 })
    .withMessage('credit_score must be an integer between 0 and 1000.'),
  body('risk_level')
    .isIn(VALID_RISK_LEVELS)
    .withMessage(`risk_level must be one of: ${VALID_RISK_LEVELS.join(', ')}.`),
  body('prediction_type')
    .isIn(VALID_PREDICTION_TYPES)
    .withMessage(`prediction_type must be one of: ${VALID_PREDICTION_TYPES.join(', ')}.`),
  handle,
];

module.exports = { validateCreatePrediction };