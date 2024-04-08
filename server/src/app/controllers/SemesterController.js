const db = require('../../models');

class SemesterController {
    // [POST] /semester
    create = async (req, res) => {
        try {
            const data = req.body;
            if (!data) return res.status(400).json({ msg: 'Bắt buộc nhập thông tin' });

            await db.semester.create({
                name: data.name,
                time_start: data.time_start,
                time_end: data.time_end,
            });
            res.status(201).json({ msg: 'Tạo học kỳ thành công' });
        } catch (err) {
            res.json(err.meaagae);
        }
    };

    // [DELETE] /semester/:id
    destroy = async (req, res) => {
        try {
            const year_id = req.params.id;
            const checkId = await db.semester.findOne({
                where: { _id: year_id },
                raw: true,
            });
            if (!checkId) return res.status(400).json({ msg: 'Không tìm thấy học kỳ' });

            await db.semester.destroy({
                where: { _id: year_id },
            });
            res.status(200).json({ msg: 'Xoá học kỳ thành công' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /semester
    index = async (req, res) => {
        try {
            const results = await db.semester.findAll({
                order: [['time_start', 'DESC']],
                raw: true,
            });
            res.status(200).json({ msg: 'Successfully', results });
        } catch (err) {
            res.json(err.message);
        }
    };
}

module.exports = new SemesterController();
