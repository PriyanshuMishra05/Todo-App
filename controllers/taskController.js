// Import necessary modules and models
const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');
const ListModel = require('../models/lists');
const TaskModel = require('../models/task');

// Endpoint to create a task for a user in a specific list
const createTask = async (req, res) => {
    const { userId, listId } = req.params;
    const { description } = req.body;
    try {
        // Check if the user exists
        const user = await UserModel.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the list belongs to the user
        const list = await ListModel.findOne({ where: { ID: listId, UserId: userId } });
        if (!list) {
            return res.status(404).json({ error: 'List not found for this user' });
        }

        // Create a task for the list
        const newTask = await TaskModel.create({ description, ListId: listId });

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};
const updateTaskState = async (req, res) => {
    const { taskId } = req.params;
    try {
        // Find the task by its ID
        const task = await TaskModel.findByPk(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update the state of the task from 0 to 1
        task.state = 1; // Set the state to 1

        // Save the updated task
        await task.save();

        res.status(200).json({ message: 'Task state updated successfully' });
    } catch (error) {
        console.error('Error updating task state:', error);
        res.status(500).json({ error: 'Failed to update task state' });
    }
};

const updateTaskList = async (req, res) => {
    const { taskId, newListId } = req.body; // Assuming taskId and newListId are provided in the request body
    try {
        // Find the task by its ID
        const task = await TaskModel.findByPk(taskId); 

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Assuming the task exists, update its ListId to associate it with the new list
        task.ListId = newListId;

        // Save the updated task with the new ListId
        await task.save();

        res.status(200).json({ message: 'Task updated with new list successfully' });

    } catch (error) {
        console.error('Error updating task with new list:', error);
        res.status(500).json({ error: 'Failed to update task with new list' });
    }
};


module.exports = { createTask, updateTaskState, updateTaskList };
