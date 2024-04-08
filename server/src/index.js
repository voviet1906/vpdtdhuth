const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cors = require('cors');
const db = require('./models');
require('../connection_db');

const app = express();
const port = process.env.PORT || 3001;

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
);
app.use(express.static(path.join(__dirname, '/public')));
app.use(morgan('combined'));
app.use(cookieParser('SecretStringForCookies'));
app.use(
    session({
        secret: 'SecretStringForCookies',
        cookie: {},
        resave: true,
        saveUninitialized: true,
    }),
);
app.use(methodOverride('_method'));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

const route = require('./routers');
route(app);

db.sequelize.sync({ alter: true }).then((req) => {
    app.listen(port, () => {
        console.log(`App listening on http://localhost: ${port}`);
    });
});
