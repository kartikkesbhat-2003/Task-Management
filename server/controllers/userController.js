const User = require('../models/User');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('name email role');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Update user (change role)
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Prevent user from changing their own role
    if (id === req.user.id) {
      return res.status(400).json({ msg: 'You cannot change your own role' });
    }

    // Validate role
    if (role && !['admin', 'user'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('name email role');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent user from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ msg: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
