const { log } = require('console');
const express = require('express');
const router = express.Router();

let counter = 11;

let tasks = [
    {
        id: 1,
        title: "Initial Task",
        description: "Sample description",
        completed: false,
        createdAt: new Date(),
        priority: "medium"
    },
    {
        id: 2,
        title: "Initial Task 2",
        description: "Sample description 2",
        completed: false,
        createdAt: new Date(),
        priority: "low"
    },
    {
        id: 3,
        title: "Initial Task 3",
        description: "Sample description 3",
        completed: false,
        createdAt: new Date(),
        priority: "low"
    },
    {
        id: 4,
        title: "Initial Task 4",
        description: "Sample description 4",
        completed: false,
        createdAt: new Date(),
        priority: "low"
    },
    {
        id: 5,
        title: "Initial Task 5",
        description: "Sample description 5",
        completed: false,
        createdAt: new Date(),
        priority: "low"
    },
    {
        id: 6,
        title: "Initial Task 6",
        description: "Sample description 6",
        completed: false,
        createdAt: new Date(),
        priority: "low"
    },
    {
        id: 7,
        title: "Initial Task 7",
        description: "Sample description 7",
        completed: false,
        createdAt: new Date(),
        priority: "low"
    },
    {
        id: 8,
        title: "Initial Task 8",
        description: "Sample description 8",
        completed: false,
        createdAt: new Date(),
        priority: "low"
    },
    {
        id: 9,
        title: "Initial Task 9",
        description: "Sample description 9",
        completed: false,
        createdAt: new Date(),
        priority: "low"
    },
    {
        id: 10,
        title: "Initial Task 10",
        description: "Sample description 10",
        completed: false,
        createdAt: new Date(),
        priority: "low"
    },
    {
        id: 11,
        title: "Initial Task 11",
        description: "Sample description 11",
        completed: true,
        createdAt: new Date(),
        priority: "low"
    },
];

/*
    Task Model:
    {
        id: number,
        title: string,
        description: string,
        completed: boolean,
        createdAt: Date,
        priority: 'low' | 'medium' | 'high'
    }
*/

router.get('/', (req , res) => {
    res.json(tasks);
});

router.post('/', (req, res) => {
    const { title, description, priority } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required"});
    }

    const newTask = {
        id: ++counter,
        title,
        description: description || "",
        completed: false,
        createdAt: new Date(),
        priority: priority || "low"
    }

    tasks.push(newTask);
    res.status(201).json(newTask);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;

    const taskIndex = tasks.findIndex(t => t.id == id);

    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: title ?? tasks[taskIndex].title,
            description: description ?? tasks[taskIndex].description,
            completed: completed ?? tasks[taskIndex].completed,
            priority: priority ?? tasks[taskIndex].priority
        };
        res.status(200).json(tasks[taskIndex]);
    }
    else {
        res.status(404).json({ message: "Task not found"});
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const InitialLength = tasks.length;

    tasks = tasks.filter(t => t.id !== Number(id));

    if (tasks.length < InitialLength) {
        res.status(204).send();
    }
    else {
        res.status(404).json({ message: "Task not found"});
    }
});

router.patch('/:id/toggle', (req, res) => {
    const { id } = req.params;
    const InitialLength = tasks.length;

    const task = tasks.find(t => t.id == id);

    if (tasks) {
        task.completed = !task.completed;
        res.status(200).json(task);
    }
    else {
        res.status(404).json({ message: "Task not found"});
    }
});

module.exports = router;