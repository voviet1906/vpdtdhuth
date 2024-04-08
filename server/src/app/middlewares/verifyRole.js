const db = require('../../models');

class Role {
    isAdmin = async (req, res, next) => {
        const { _id } = req.user;
        const result = await db.user.findOne({
            where: { _id },
        });

        if (result.role !== 'A') return res.sendStatus(403);
        next();
    };

    isAdminOrManager = async (req, res, next) => {
        const { _id } = req.user;
        const result = await db.user.findOne({
            where: { _id },
        });

        if (result.role === 'U') return res.sendStatus(403);
        next();
    };

    isManagerOrUser = async (req, res, next) => {
        const { _id } = req.user;
        const result = await db.user.findOne({
            where: { _id },
        });

        if (result.role === 'A') return res.sendStatus(403);
        next();
    };

    isManager = async (req, res, next) => {
        const { _id } = req.user;
        const result = await db.user.findOne({
            where: { _id },
        });

        if (result.role !== 'M') return res.sendStatus(403);
        next();
    };

    isUser = async (req, res, next) => {
        const { _id } = req.user;
        const result = await db.user.findOne({
            where: { _id },
        });

        if (result.role !== 'U') return res.sendStatus(403);
        next();
    };
}

module.exports = new Role();
