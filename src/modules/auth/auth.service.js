const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { findUserByEmail, createUser } = require('./auth.repository');

const register = async ({ email, password, role }) => {
  const existing = await findUserByEmail(email);
  if (existing) throw { statusCode: 409, message: 'Email already registered.' };

  const password_hash = await bcrypt.hash(password, 10);
  const user_id = uuidv4();

  const user = await createUser({ user_id, email, password_hash, role });
  return user;
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) throw { statusCode: 401, message: 'Invalid email or password.' };

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw { statusCode: 401, message: 'Invalid email or password.' };

  if (!user.is_active) throw { statusCode: 403, message: 'Account is deactivated.' };

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token, user: { user_id: user.user_id, email: user.email, role: user.role } };
};

module.exports = { register, login };