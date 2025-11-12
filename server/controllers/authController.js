const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const buildAuthResponse = (user) => {
  const role = user.role || 'user';
  const payload = { user: { id: user.id, role } };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role
    }
  };
};

exports.register = async (req, res, next) => {
  const { name, email, password, role: providedRole } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const role = ['admin', 'user'].includes(providedRole) ? providedRole : 'user';

    user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const authPayload = buildAuthResponse(user);
    res.json(authPayload);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const authPayload = buildAuthResponse(user);
    res.json(authPayload);
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};
