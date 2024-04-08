const db = require('../../models');
const { Op } = require('@sequelize/core');
const reader = require('xlsx');
const fs = require('fs');

class ApproveController {
    // [PATCH] /approve/:id
    update = async (req, res) => {
        try {
            const activityId = req.params.id;
            const data = req.body;
            const checkId = await db.activities.findOne({
                where: {
                    _id: activityId,
                },
                raw: true,
            });
            if (!data || !checkId) return res.status(400).json({ msg: 'Không tìm thấy hoạt động' });

            await db.activities.update(
                {
                    nhanxet: data.nhanxet,
                    renluyen: data.renluyen,
                    diem: data.diem,
                    ketluan: data.ketluan,
                    trangthai: data.trangthai,
                },
                {
                    where: { _id: activityId },
                },
            );
            res.status(200).json({ msg: 'Duyệt hoạt động thành công' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /approve/:id
    detail = async (req, res) => {
        const activityId = req.params.id;
        const checkId = await db.activities.findOne({
            where: {
                _id: activityId,
            },
            raw: true,
        });
        if (!checkId) return res.status(400).json({ msg: 'Không tìm thấy hoạt động' });

        const result = await db.activities.findOne({
            where: {
                _id: activityId,
            },
            attributes: ['nhanxet', 'renluyen', 'diem', 'ketluan', 'trangthai'],
            raw: true,
        });
        result.trangthai = result.trangthai === 1 ? true : false;
        res.status(200).json({ msg: 'Successfully', result });
    };
}

module.exports = new ApproveController();
