const Task = require("../models/task");
// @desc create new task
// @ POST /api/createTask
// @ access public

const createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const userId = req.user.id;
    if (!title || !description || !deadline) {
      res
        .status(400)
        .json({ success: false, message: "All fields are Mandatory" });
    }
    const newTask = new Task({
      title,
      description,
      deadline,
      userId,
    });
    await newTask.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
};

// @desc get all tasks
// @ POST /api/fetchTasks
// @ access public

const fetchAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ userId });

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: `ERROR: ${error}` });
  }
};

// @desc get a particular task with id
// @ POST /api/fetchTask/:id
// @ access public

const fetchTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = await Task.findById({ _id: taskId, userId });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch task" });
  }
};

// @desc update a particular task wit id
// @ PUT /api/updateTask/:id
// @ access public

const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const taskId = req.params.id;
    const { title, description, deadline } = req.body;
    const createdAt = Date.now();
    const updatedTask = await Task.findByIdAndUpdate(
      { _id: taskId, userId },
      { title, description, deadline, createdAt },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
};

// @desc delete a particular task wit id
// @ DELETE /api/deleteTask/:id
// @ access public

const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete({ _id: taskId, userId });

    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
};

module.exports = {
  createTask,
  fetchAllTasks,
  fetchTaskById,
  updateTask,
  deleteTask,
};
