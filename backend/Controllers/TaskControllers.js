import taskModel from "../models/TaskModel.js";

// 1. CREATE TASK (Admin Only)
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, priority } = req.body;

    if (!title || !description || !assignedTo || !deadline) {
      return res.status(400).json({ message: "Title, description, assignedTo, and deadline are required" });
    }

    const task = await taskModel.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id, // Auth Middleware se auto-assign
      deadline,
      priority: priority || "medium",
    });

    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    return res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// 2. GET ALL TASKS (Admin View)
const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskModel
      .find()
      .populate("assignedTo", "name email department")
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: "Tasks retrieved successfully", tasks });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving tasks", error: error.message });
  }
};

// 3. GET MY TASKS (Staff View)
const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await taskModel
      .find({ assignedTo: userId })
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: "My tasks retrieved successfully", tasks });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving my tasks", error: error.message });
  }
};

// 4. UPDATE TASK STATUS (Staff / Admin)
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "in-progress", "completed"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Valid status is required ('pending', 'in-progress', 'completed')" });
    }

    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Security Check: Agar Admin nahi hai to sirf apna task update kar sake
    if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    return res.status(500).json({ message: "Error updating task status", error: error.message });
  }
};

// 5. DELETE TASK (Admin Only)
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await taskModel.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

export { createTask, getAllTasks, getMyTasks, updateTaskStatus, deleteTask };