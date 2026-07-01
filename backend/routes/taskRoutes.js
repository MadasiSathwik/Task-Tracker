const express = require("express");
const router = express.Router();

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const validateObjectId = require("../middleware/validateObjectId");

router.get("/", getTasks);
router.get("/:id", validateObjectId, getTaskById);
router.post("/", createTask);
router.put("/:id", validateObjectId, updateTask);
router.delete("/:id", validateObjectId, deleteTask);

module.exports = router;