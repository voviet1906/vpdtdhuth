const db = require('../../models');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class UserController {
    // [POST] /user
    create = async (req, res) => {
        try {
            const data = req.body;
            if (!data) return res.status(400).json({ msg: 'Bắt buộc nhập thông tin!' });

            const countUser = await db.user.count({
                where: {
                    _id: data._id,
                },
            });

            if (countUser > 0) return res.status(400).json({ msg: 'Tài khoản đã tồn tại!' });

            await db.user.create({
                _id: data._id,
                password: bcrypt.hashSync('123123123', bcrypt.genSaltSync(8)),
                name: data.name,
                role: data.role,
            });
            res.status(201).json({ msg: 'Tạo tài khoản thành công!' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [PATCH] /user/:id/reset-password
    resetPassword = async (req, res) => {
        try {
            const user_id = req.params.id;
            const checkId = await db.user.count({
                where: { _id: user_id },
            });
            if (!user_id || checkId === 0) return res.status(400).json({ msg: 'Tài khoản không tồn tại' });

            await db.user.update(
                {
                    password: bcrypt.hashSync('uth@0901', bcrypt.genSaltSync(8)),
                },
                {
                    where: { _id: user_id },
                },
            );
            res.status(200).json({ msg: 'Reset password thành công' });
        } catch (err) {
            res.status(400).json({ msg: 'Reset password không thành công' });
        }
    };

    // [PATCH] /user/change-password
    changePassword = async (req, res) => {
        try {
            const data = req.body;
            const user_id = req.user._id;
            if (!user_id) return res.status(400).json({ msg: 'Tài khoản không tồn tại' });

            const response = await db.user.findOne({
                where: { _id: user_id },
            });
            const isChecked = response && bcrypt.compareSync(data.oldPassword, response.password);
            if (!isChecked) return res.status(400).json({ msg: 'Mật khẩu không đúng' });

            if (!data || data.newPassword !== data.reNewPassword)
                return res.status(400).json({ msg: 'Bắt buộc nhập dữ liệu' });

            await db.user.update(
                {
                    password: bcrypt.hashSync(data.newPassword, bcrypt.genSaltSync(8)),
                },
                {
                    where: { _id: user_id },
                },
            );
            res.status(200).json({ msg: 'Đổi mật khẩu thành công' });
        } catch (err) {
            res.status(400).json({ msg: 'Đổi mật khẩu không thành công' });
        }
    };

    // [PATCH] /user/:id
    update = async (req, res) => {
        try {
            const data = req.body;
            const user_id = req.params.id;
            if (!data || !user_id) return res.status(400).json({ msg: 'Bắt buộc nhập thông tin' });

            await db.user.update(
                {
                    name: data.name,
                    role: data.role,
                },
                {
                    where: { _id: user_id },
                },
            );
            res.status(200).json({ msg: 'Cập nhật thành công' });
        } catch (err) {
            res.status(400).json({ msg: 'Cập nhật không thành công' });
        }
    };

    // [GET] /user/:id
    detail = async (req, res) => {
        try {
            const user_id = req.params.id;

            const result = await db.user.findOne({
                where: { _id: user_id },
                attributes: ['name', 'role'],
                raw: true,
            });

            if (!result) return res.status(400).json({ msg: 'Không tồn tại tài khoản' });
            res.status(200).json({ msg: 'Successfully', result });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /user
    getManagerOrUser = async (req, res) => {
        try {
            const results = await db.user.findAll({
                where: {
                    role: ['M', 'U'],
                },
                order: [['role', 'ASC']],
                attributes: { exclude: ['password'] },
            });
            res.status(200).json({ msg: 'Successfully', results });
        } catch (err) {
            res.json(err.messgae);
        }
    };

    // [GET] /user
    getUser = async (req, res) => {
        try {
            const results = await db.user.findAll({
                where: {
                    role: 'U',
                },
                order: [['role', 'ASC']],
                attributes: { exclude: ['password'] },
            });
            res.status(200).json({ msg: 'Successfully', results });
        } catch (err) {
            res.json(err.messgae);
        }
    };
}

module.exports = new UserController();
