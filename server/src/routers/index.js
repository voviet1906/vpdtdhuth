const authRouter = require('./auth.js');
const activitiesRouter = require('./activities.js');
const approveRouter = require('./approve.js');
const certificationRouter = require('./certification.js');
const trainingPointRouter = require('./trainingPoint.js');
const userRouter = require('./user.js');
const yearRouter = require('./year.js');
const semesterRouter = require('./semester.js');
const studentRouter = require('./student.js');
const settingRouter = require('./setting.js');

const verify = require('../app/middlewares/verifyToken');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/certification', certificationRouter);
    app.use('/training-point', trainingPointRouter);
    app.use('/semester', semesterRouter);
    app.use('/setting', settingRouter);

    app.use(verify);
    app.use('/activities', activitiesRouter);
    app.use('/approve', approveRouter);
    app.use('/user', userRouter);
    app.use('/student', studentRouter);
    app.use('/year', yearRouter);
}

module.exports = route;
