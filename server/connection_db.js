const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('manager_activities', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const connectionDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection database successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

connectionDatabase();
