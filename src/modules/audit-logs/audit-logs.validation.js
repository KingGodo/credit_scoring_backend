const { body, validationResult } = require('express-validator');
const { VALID_ACTIONS, VALID_ENTITIES } = require('./audit-logs.service');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateCreateLog = [
  body('user_id')
    .isUUID().withMessage('Valid user_id (UUID) is required.'),
  body('action')
    .notEmpty().withMessage('action is required.')
    .isIn(VALID_ACTIONS)
    .withMessage(`action must be one of the defined system actions.`),
  body('entity')
    .notEmpty().withMessage('entity is required.')
    .isIn(VALID_ENTITIES)
    .withMessage(`entity must be one of: ${VALID_ENTITIES.join(', ')}.`),
  body('entity_id')
    .isUUID().withMessage('Valid entity_id (UUID) is required.'),
  handle,
];

module.exports = { validateCreateLog };