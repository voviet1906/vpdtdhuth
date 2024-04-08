const db = require('../../models');

class YearController {
    // [POST] /year
    create = async (req, res) => {
        try {
            const data = req.body;
            if (!data) return res.status(400).json({ msg: 'Bắt buộc nhập thông tin' });

            await db.school_year.create({
                name: data.name,
                time_start: data.time_start,
                time_end: data.time_end,
            });
            res.status(201).json({ msg: 'Tạo năm học thành công' });
        } catch (err) {
            res.json(err.meaagae);
        }
    };

    // [DELETE] /year/:id
    destroy = async (req, res) => {
        try {
            const year_id = req.params.id;
            const checkId = await db.school_year.findOne({
                where: { _id: year_id },
                raw: true,
            });
            if (!checkId) return res.status(400).json({ msg: 'Không tìm thấy năm học' });

            await db.school_year.destroy({
                where: { _id: year_id },
            });
            res.status(200).json({ msg: 'Xoá năm học thành công' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /year
    index = async (req, res) => {
        try {
            const results = await db.school_year.findAll({
                order: [['time_start', 'DESC']],
                raw: true,
            });
            res.status(200).json({ msg: 'Successfully', results });
        } catch (err) {
            res.json(err.message);
        }
    };
}

module.exports = new YearController();
