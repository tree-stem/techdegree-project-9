'use strict';

const bcrypt = require('bcrypt');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model { }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A firstName is required.',
        },
        notEmpty: {
          msg: 'Please provide a value for "firstName".',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A lastName is required.',
        },
        notEmpty: {
          msg: 'Please provide a value for "lastName".'
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Sorry! The email address you provided is already in use.',
      },
      validate: {
        notNull: {
          msg: 'An email is required.',
        },
        isEmail: {
          msg: 'Please provide a value for "emailAddress".',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (value.length < 8 || value.length > 20) {
          throw new Error('Password must be between 8 and 20 characters in length.');
        } else {
          const hashedPassword = bcrypt.hashSync(value, 10);
          this.setDataValue('password', hashedPassword);
        }
      },
      validate: {
        notNull: {
          msg: 'A password is required.'
        },
        notEmpty: {
          msg: 'Please provide a value for "password".',
        },
      },
    },
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
      }
    })
  }

  return User;
};