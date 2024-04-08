const { STRING } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const TrainingPoint = sequelize.define('training_point', {
        _id: {
            type: DataTypes.STRING(3),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        point: {
            type: DataTypes.TINYINT(2),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            defaultValue: 0,
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

    return TrainingPoint;
};
