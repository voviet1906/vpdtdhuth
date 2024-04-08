'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
    .filter((file) => {
        db.sequelize = sequelize;
        return (
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Mặc định tạo tài khoản admin
const bcrypt = require('bcryptjs');
db.user.findOrCreate({
    where: {
        _id: 'admin',
    },
    defaults: {
        _id: 'admin',
        name: 'Quản trị',
        password: bcrypt.hashSync('uth@hsv09011950', bcrypt.genSaltSync(8)),
        role: 'A',
    },
});

db.student.hasMany(db.certification, {
    foreignKey: {
        name: 'student_id',
    },
});
db.certification.belongsTo(db.student, {
    foreignKey: {
        name: 'student_id',
    },
});

db.activities.hasMany(db.certification, {
    foreignKey: {
        name: 'activity_id',
    },
});
db.certification.belongsTo(db.activities, {
    foreignKey: {
        name: 'activity_id',
    },
});

module.exports = db;
