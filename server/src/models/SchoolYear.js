const { STRING } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const SchoolYear = sequelize.define('school_year', {
        _id: {
            type: DataTypes.TINYINT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        time_start: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        time_end: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        createdAt: {
            type: 'TIMESTAMP',
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: 'TIMESTAMP',
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
    });

    return SchoolYear;
};
