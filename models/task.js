const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ListModel = require('../models/lists'); // Import the List model

const TaskModel = sequelize.define('Task', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    state: {
        type: DataTypes.INTEGER, // Adjust the data type as per your schema
        allowNull: false,
        defaultValue: 0 // Setting the default value to 0
    },
    ListId: {
        type: DataTypes.INTEGER, // Adjust the data type as per your schema
        allowNull: false
    }
}, {
    tableName: 'tasks',
    timestamps: false
});

TaskModel.belongsTo(ListModel, { foreignKey: 'ListId', onDelete: 'CASCADE'  }); // Task belongs to a List
ListModel.hasMany(TaskModel, { foreignKey: 'ListId', onDelete: 'CASCADE', hooks: true });
module.exports = TaskModel;
