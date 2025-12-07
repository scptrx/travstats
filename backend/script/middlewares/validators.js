import { body, param, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array() 
    });
  }
  next();
};

export const validateAddCountry = [
  body('country_iso_code')
    .isString().withMessage('Country ISO code must be a string')
    .isLength({ min: 2, max: 3 }).withMessage('Country ISO code must be 2 or 3 characters long'),
    body('country_name')
    .isString().withMessage('Country name must be a string')
    .isLength({ min: 1, max: 100 }).withMessage('Country name must be between 1 and 100 characters long'),
  handleValidationErrors
];

export const validateAddSubdivision = [
  body('subdivision_iso_code')
    .isString().withMessage('Subdivision ISO code must be a string')
    .isLength({ min: 2, max: 10 }).withMessage('Subdivision ISO code must be between 2 and 10 characters long'),
    body('subdivision_name')
    .isString().withMessage('Subdivision name must be a string')
    .isLength({ min: 1, max: 100 }).withMessage('Subdivision name must be between 1 and 100 characters long'),
  handleValidationErrors
];

export const validateAddVisit = [
  body('subdivision_iso_code')
    .isString().withMessage('Subdivision ISO code must be a string')
    .isLength({ min: 2, max: 10 }).withMessage('Subdivision ISO code must be between 2 and 10 characters long'),
  handleValidationErrors
];

export const validateDeleteVisit = [
  param('id')
    .isInt({ gt: 0 }).withMessage('Visit ID must be a positive integer'),
  handleValidationErrors
];

export const validateRegister = [
  body('username')
    .isString().withMessage('Username must be a string')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters long'),
  body('email')
    .isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail().withMessage('Invalid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

export const validateUpdateProfile = [
  body('username')
    .optional()
    .isString().withMessage('Username must be a string')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters long'),
  body('avatarUrl')
    .optional()
    .isURL().withMessage('Avatar URL must be a valid URL'),
  handleValidationErrors
];