const UserModel = require('../models/users');
const ListModel = require('../models/lists');
const TaskModel = require('../models/task');

const signUp = (req, res) => {
    const { username, password } = req.body;

    UserModel.findOne({ where: { username } })
        .then(existingUser => {
            if (existingUser) {
                // User with the given username already exists
                res.status(400).json({ error: 'Username already exists' });
            } else {
                // Create the new user
                UserModel.create({ username, password })
                    .then(newUser => {
                        console.log('User created:', newUser);
                        res.status(201).json({ message: 'User created successfully', user: newUser });
                    })
                    .catch(error => {
                        console.error('Error creating user:', error);
                        res.status(500).json({ error: 'Failed to create user' });
                    });
            }
        })
        .catch(error => {
            console.error('Error checking for existing user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        });
};

const login = (req, res) => {
    const { username, password } = req.body;

    UserModel.findOne({ where: { username } })
        .then(user => {
            if (!user) {
                res.status(404).json({ error: 'User not found' });
            } else if (user.password !== password) {
                res.status(401).json({ error: 'Invalid password' });
            } else {
                res.status(200).json({ message: 'Login successful', user });
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Login failed' });
        });
};
// API endpoint to get all lists and their tasks for a particular user
const getAllDataOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UserModel.findByPk(userId, {
            include: [
                {
                    model: ListModel,
                    include: {
                        model: TaskModel,
                        where: {
                            state: 0
                        },
                        required: false // Ensure tasks are not mandatory
                    }
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Process the user data to ensure all lists are present even if they have no tasks with state 0
        const processedLists = user.Lists.map(list => {
            if (!list.Tasks) {
                list.Tasks = []; // If there are no tasks, set an empty array
            }
            return list;
        });

        res.json({ user: { Lists: processedLists } });
    } catch (error) {
        console.error('Error fetching user lists and tasks:', error);
        res.status(500).json({ error: 'Failed to fetch user lists and tasks' });
    }
};


module.exports = { signUp, login, getAllDataOfUser };
