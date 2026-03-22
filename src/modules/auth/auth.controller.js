const { register, login } = require('./auth.service');
const { sendSuccess, sendError } = require('../../utils/response');

const registerUser = async (req, res, next) => {
  try {
    const user = await register(req.body);
    return sendSuccess(res, user, 'User registered successfully.', 201);
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const result = await login(req.body);
    return sendSuccess(res, result, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser };