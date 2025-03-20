'use strict';

const express = require('express');
const router = express.Router();
const User = require('./models').User;
const Course = require('./models').Course;
const { authenticateUser } = require('./auth-user');

const asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            next(error);
        }
    }
};

// Send GET request to READ the users
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json(users);
}));

// Send POST request to CREATE new user
router.post('/users', authenticateUser, asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.location('/'); // Set the location header
        res.status(201).json({ message: 'Account successfully created!' });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// Send GET request to READ the courses
router.get('/courses', authenticateUser, asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    res.json(courses);
}));

// Send GET request to READ individual course
router.get('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        res.json(course);
    } else {
        res.sendStatus(404);
    }
}));

// Send POST request to CREATE a course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.location('/courses/' + course.id); // Set the location header
        res.status(201).json({ message: 'Course successfully created!' });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// Send PUT request to UPDATE a course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    let course;
    try {
        course = await Course.findByPk(req.params.id);
        if (course) {
            await course.update(req.body);
            res.status(204).end();
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError" || error.name === 'SequelizeUniqueConstraintError') {
            course = await Course.build(req.body);
            course.id = req.params.id;
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// Send a DELETE request to DELETE a course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy();
        res.status(204).end();
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router; 
