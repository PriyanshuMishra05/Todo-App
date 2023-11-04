const UserModel = require('../models/users');
const ListModel = require('../models/lists');


const createList = (req, res) => {
    const { userId, title } = req.body;
 
    UserModel.findByPk(userId)
        .then(user => {
            if (!user) {
                res.status(404).json({ error: 'User not found' });
            } else {
                // Check if a list with the same title already exists for the user
                ListModel.findOne({ where: { UserId: userId, title } })
                    .then(existingList => {
                        if (existingList) {
                            res.status(400).json({ error: 'List with the same name already exists for this user' });
                        } else {
                            // Create the new list
                            ListModel.create({ title, UserId: userId }) // Assuming UserId is the foreign key
                                .then(newList => {
                                    res.status(201).json({ message: 'List created successfully', list: newList });
                                }) 
                                .catch(error => {
                                    console.error('Error creating list:', error);
                                    res.status(500).json({ error: 'Failed to create list' });
                                });
                        }
                    })
                    .catch(error => { 
                        console.error('Error checking for existing list:', error);
                        res.status(500).json({ error: 'Failed to create list' });
                    });
            }
        })
        .catch(error => {
            console.error('Error finding user:', error);
            res.status(500).json({ error: 'Failed to create list' });
        });
};

const removeList = (req, res) => {
    const { listId } = req.params;
  
    // Find the list by its ID and delete it
    ListModel.findByPk(listId)
      .then(list => {
        if (!list) {
          res.status(404).json({ error: 'List not found' });
        } else {
          list.destroy()
            .then(() => {
              res.status(200).json({ message: 'List removed successfully' });
            })
            .catch(error => {
              console.error('Error removing list:', error);
              res.status(500).json({ error: 'Failed to remove list' });
            });
        }
      })
      .catch(error => {
        console.error('Error finding list:', error);
        res.status(500).json({ error: 'Failed to remove list' });
      });
  };

  
module.exports = { createList,removeList };
