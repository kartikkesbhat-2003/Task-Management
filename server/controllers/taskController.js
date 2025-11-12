const Task = require('../models/Task');
const User = require('../models/User');

const populateTask = (query) =>
  query
    .populate('assignedTo', 'name email role')
    .populate('owner', 'name email role');

// Create task
exports.createTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Only admins can create tasks' });

    const { title, description, dueDate, priority, assignedTo } = req.body;

    if (!assignedTo) return res.status(400).json({ msg: 'Assigned user is required' });

    const assignee = await User.findById(assignedTo).select('_id');
    if (!assignee) return res.status(400).json({ msg: 'Assignee not found' });

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      owner: req.user.id,
      assignedTo: assignee._id
    });
    await task.save();

    await task.populate([
      { path: 'assignedTo', select: 'name email role' },
      { path: 'owner', select: 'name email role' }
    ]);

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// Get tasks with pagination and optional priority filter
exports.getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const priority = req.query.priority;
    const filter = req.user.role === 'admin' ? { owner: req.user.id } : { assignedTo: req.user.id };
    if (priority) filter.priority = priority;

    const tasks = await populateTask(
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
    );

    const total = await Task.countDocuments(filter);
    res.json({ tasks, page, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// Get single task
exports.getTask = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role === 'admin') filter.owner = req.user.id;
    else filter.assignedTo = req.user.id;

    const task = await populateTask(Task.findOne(filter));
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const allowedFields = isAdmin
      ? ['title', 'description', 'dueDate', 'priority', 'status', 'assignedTo']
      : ['status'];

    const invalidFields = Object.keys(req.body).filter((field) => !allowedFields.includes(field));
    if (invalidFields.length) return res.status(403).json({ msg: 'You are not allowed to modify these fields' });

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (isAdmin && Object.prototype.hasOwnProperty.call(updates, 'assignedTo')) {
      if (!updates.assignedTo) return res.status(400).json({ msg: 'Assigned user is required' });
      const assignee = await User.findById(updates.assignedTo).select('_id');
      if (!assignee) return res.status(400).json({ msg: 'Assignee not found' });
      updates.assignedTo = assignee._id;
    }

    const filter = { _id: req.params.id };
    if (isAdmin) filter.owner = req.user.id;
    else filter.assignedTo = req.user.id;

    const task = await populateTask(Task.findOneAndUpdate(filter, updates, { new: true }));
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Only admins can delete tasks' });

    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
