const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserModel = require('../models/users');

const ListModel = sequelize.define('List', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER, // Adjust the data type as per your schema
        allowNull: false
    }
}, {
    tableName: 'lists',
    timestamps: false
}); 

 

UserModel.hasMany(ListModel,{ foreignKey: 'UserId' });
ListModel.belongsTo(UserModel,{ foreignKey: 'UserId' }); // Ensure the association is correctly defined

module.exports = ListModel;
