const db = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class ApiController {
    // [POST] /auth/login
    login = async (req, res) => {
        const { user_id, password } = req.body;
        if (!user_id || !password) return res.status(401).json({ msg: 'Hãy nhập tài khoản và mật khẩu' });

        const response = await db.user.findOne({
            where: {
                _id: user_id,
            },
            raw: true,
        });
        const isChecked = response && bcrypt.compareSync(password, response.password);
        if (!isChecked) return res.status(401).json({ msg: 'Tài khoản hoặc mật khẩu không đúng' });

        const accessToken = jwt.sign(
            { _id: response._id, name: response.name, role: response.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10m' },
        );
        if (!accessToken) return res.status(401).json({ msg: 'Đăng nhập không thành công' });

        const refreshToken = jwt.sign(
            { _id: response._id, name: response.name, role: response.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '4h' },
        );
        const date = new Date();
        const expireTime = new Date(date.setTime(date.getTime() + 4 * 60 * 60 * 1000));
        await db.token.create({ refreshToken: refreshToken, expireTime: expireTime });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        return res.status(200).json({
            msg: 'Đăng nhập thành công',
            name: response.name,
            role: response.role,
            accessToken,
        });
    };

    // [GET] /auth/refresh-token
    refreshToken = async (req, res) => {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) return res.status(401).json({ msg: 'No refresh token' });

        const foundUser = await db.token.findOne({
            where: {
                refreshToken: refreshToken,
            },
        });
        if (!foundUser) {
            res.clearCookie('refreshToken');
            return res.status(403).json({ msg: 'No refresh token' });
        }
        await db.token.destroy({
            where: {
                refreshToken: refreshToken,
            },
        });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ msg: 'Error verify refresh token' });

            const date = new Date();
            const expireTime = new Date(foundUser.expireTime);
            if (expireTime.getTime() - date.getTime() <= 0) {
                return res.status(403).json({ msg: 'Refresh token expired' });
            }

            const accessToken = jwt.sign(
                { _id: decoded._id, name: decoded.name, role: decoded.role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' },
            );
            const newRefreshToken = jwt.sign(
                { _id: decoded._id, name: decoded.name, role: decoded.role },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '4h' },
            );
            await db.token.create({ refreshToken: newRefreshToken, expireTime: foundUser.expireTime });

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });

            return res.status(200).json({
                msg: 'Refresh token successfully',
                accessToken,
            });
        });
    };

    // [DELETE] /auth/logout
    logout = async (req, res) => {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) return res.sendStatus(401);
        res.clearCookie('refreshToken');
        await db.token.destroy({
            where: {
                refreshToken: refreshToken,
            },
        });
        return res.status(200).json({ msg: 'Đăng xuất thành công' });
    };
}

module.exports = new ApiController();
