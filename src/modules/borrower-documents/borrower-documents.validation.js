const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const VALID_DOCUMENT_TYPES = [
  'national_id',
  'passport',
  'drivers_license',
  'proof_of_address',
  'business_license',
  'selfie_verification',
];

const VALID_STATUSES = ['pending', 'verified', 'rejected'];

const validateUpload = [
  body('borrower_id')
    .isUUID()
    .withMessage('Valid borrower_id (UUID) is required.'),
  body('document_type')
    .isIn(VALID_DOCUMENT_TYPES)
    .withMessage(`document_type must be one of: ${VALID_DOCUMENT_TYPES.join(', ')}.`),
  body('document_url')
    .notEmpty()
    .withMessage('document_url is required.')
    .isURL()
    .withMessage('document_url must be a valid URL.'),
  handle,
];

const validateVerify = [
  body('verification_status')
    .isIn(VALID_STATUSES)
    .withMessage(`verification_status must be one of: ${VALID_STATUSES.join(', ')}.`),
  handle,
];

module.exports = { validateUpload, validateVerify };