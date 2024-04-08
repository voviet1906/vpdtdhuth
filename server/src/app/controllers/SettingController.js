const db = require('../../models');
const { QueryTypes } = require('sequelize');

class SettingController {
    // [POST] /seting
    create = async (req, res) => {
        try {
            const data = req.body;
            if (!data) return res.status(400).json({ msg: 'Bắt buộc nhập thông tin' });
            await db.setting.create({
                content: data.content,
                value: data.value,
            });
            res.status(200).json({ msg: 'Successfully' });
        } catch (err) {
            res.status(400).json({ msg: 'Tạo không thành công' });
        }
    };

    // [PATCH] /seting
    update = async (req, res) => {
        try {
            const data = req.body;
            if (!data) return res.status(400).json({ msg: 'Bắt buộc nhập thông tin' });
            await db.setting.update(
                {
                    value: data.value,
                },
                {
                    where: { content: data.content },
                },
            );
            res.status(200).json({ msg: 'Cập nhật thành công' });
        } catch (err) {
            res.status(400).json({ msg: 'Cập nhật không thành công' });
        }
    };

    // [GET] /setting/:id
    getOne = async (req, res) => {
        try {
            const id = req.params.id;
            const result = await db.setting.findAll({
                where: {
                    _id: id,
                },
            });
            res.status(200).json({ msg: 'Successfully', result });
        } catch (err) {
            res.json(err.messgae);
        }
    };

    // [GET] /setting
    get = async (req, res) => {
        try {
            const results = await db.setting.findAll();
            res.status(200).json({ msg: 'Successfully', results });
        } catch (err) {
            res.json(err.messgae);
        }
    };
}

module.exports = new SettingController();
