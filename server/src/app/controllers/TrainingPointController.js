const db = require('../../models');

class YearController {
    // [POST] /training-point
    create = async (req, res) => {
        try {
            const data = req.body;
            if (!data) return res.status(400).json({ msg: 'Bắt buộc nhập thông tin!' });

            const check = await db.training_point.count({
                where: {
                    _id: data._id,
                },
            });
            if (check > 0) return res.status(400).json({ msg: 'Mã số rèn luyện đã tồn tại!' });

            await db.training_point.create({
                _id: data._id,
                content: data.content,
                point: data.point,
            });

            res.status(201).json({ msg: 'Tạo mục rèn luyện thành công!' });
        } catch (err) {
            res.status(400).json({ msg: 'Tạo mục rèn luyện không thành công' });
        }
    };

    // [PATCH] /training-point/:id
    update = async (req, res) => {
        try {
            const trainingId = req.params.id;

            const data = req.body;
            if (!data) return res.status(400).json({ msg: 'Bắt buộc nhập thông tin!' });

            const check = await db.training_point.count({
                where: {
                    _id: trainingId,
                },
            });
            if (check === 0) return res.status(400).json({ msg: 'Mã số rèn luyện không tồn tại!' });

            await db.training_point.update(
                {
                    content: data.content,
                    point: data.point,
                },
                {
                    where: { _id: trainingId },
                },
            );

            res.status(201).json({ msg: 'Cập nhật thành công!' });
        } catch (err) {
            res.status(400).json({ msg: 'Cập nhật không thành công' });
        }
    };

    // [GET] /training-point/:id
    getTrainingPoint = async (req, res) => {
        try {
            const trainingId = req.params.id;
            const checkId = await db.training_point.findOne({
                where: { _id: trainingId },
                raw: true,
            });
            if (!checkId) return res.status(400).json({ msg: 'Id không phù hợp' });

            const result = await db.training_point.findOne({
                where: { _id: trainingId },
                order: [['_id', 'ASC']],
                raw: true,
            });

            res.status(200).json({ msg: 'Successfully', result });
        } catch (err) {
            res.json(err.messgae);
        }
    };

    // [GET] /training-point
    getAll = async (req, res, next) => {
        try {
            const results = await db.training_point.findAll({
                order: [['_id', 'ASC']],
                raw: true,
            });

            res.status(200).json({ msg: 'Successfully', results });
        } catch (err) {
            res.json(err.messgae);
        }
    };
}

module.exports = new YearController();
