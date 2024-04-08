const db = require('../../models');
const { Op } = require('@sequelize/core');
const reader = require('xlsx');
const fs = require('fs');

class ActivitiesController {
    // [POST] /activities
    createActivity = async (req, res) => {
        const data = req.body;
        if (!data) return res.status(400).json({ mgs: 'Không có dữ liệu' });

        const day = new Date();
        const startDay = new Date(data.ngaybatdau);
        const endDay = new Date(data.ngayketthuc);
        const gapStart = (startDay - day) / (24 * 60 * 60 * 1000);
        const gapEnd = (endDay.getTime() - startDay.getTime()) / (24 * 60 * 60 * 1000);
        const time = await db.setting.findOne({
            where: {
                content: 'deadlineActivity',
            },
            raw: true,
        });

        try {
            if (gapStart < time.value - 1 && gapEnd < 0)
                return res.status(400).json({ msg: 'Thời gian bắt đầu và thời gian kết thúc không phù hợp' });
            if (gapStart < time.value - 1) return res.status(400).json({ msg: 'Thời gian bắt đầu không phù hợp' });
            if (gapEnd < 0) return res.status(400).json({ msg: 'Thời gian kết thúc không phù hợp' });

            await db.activities.create({
                name: data.name,
                user: req.user._id,
                tochuc: data.tochuc,
                phoihop: data.phoihop,
                ngaybatdau: data.ngaybatdau,
                ngayketthuc: data.ngayketthuc,
                diadiem: data.diadiem,
                vanban: data.vanban,
                noidung: data.noidung,
            });
            res.status(201).json({ msg: 'Activity has been created successfully' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /activities/year/:id
    getActivitiesByYear = async (req, res) => {
        try {
            const yearId = req.params.id;

            let year;
            if (!yearId || yearId == undefined) {
                const date = new Date();
                year = await db.school_year.findOne({
                    where: {
                        time_start: { [Op.lte]: date },
                        time_end: { [Op.gte]: date },
                    },
                    raw: true,
                });
            } else {
                year = await db.school_year.findOne({
                    where: { _id: yearId },
                    raw: true,
                });
            }
            if (!year) return res.status(400).json({ msg: 'Năm học không hợp lệ.' });

            const page = parseInt(req.query.page) || 1;
            const pageSize = 10;
            const skip = (page - 1) * pageSize;
            const search = req.query.search || '';

            const total = await db.activities.count({
                where: {
                    user: req.user._id,
                    ngaybatdau: {
                        [Op.between]: [year.time_start, year.time_end],
                    },
                    name: {
                        [Op.or]: {
                            [Op.startsWith]: search,
                            [Op.endsWith]: search,
                            [Op.substring]: search,
                        },
                    },
                },
            });

            const pages = Math.ceil(total / pageSize);

            if (pages === 0) return res.status(200).json({ msg: 'Successfully', activities: [], page, pages: 1 });
            if (page > pages) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No page found',
                });
            }

            const activities = await db.activities.findAll({
                where: {
                    user: req.user._id,
                    ngaybatdau: {
                        [Op.between]: [year.time_start, year.time_end],
                    },
                    name: {
                        [Op.or]: {
                            [Op.startsWith]: search,
                            [Op.endsWith]: search,
                            [Op.substring]: search,
                        },
                    },
                },
                attributes: ['_id', 'name', 'tochuc', 'ngaybatdau', 'trangthai'],
                offset: skip,
                limit: pageSize,
                order: [['ngaybatdau', 'DESC']],
                raw: true,
            });

            res.status(200).json({ msg: 'Successfully', activities, page, pages });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /activities/unit/:id
    getActivitiesByUnit = async (req, res) => {
        try {
            const unitId = req.params.id;

            const unit = await db.user.findOne({
                where: {
                    _id: unitId,
                },
                attributes: { exclude: ['password'] },
                raw: true,
            });
            if (!unit) return res.status(400).json({ msg: 'Không có đơn vị cần tìm' });

            const page = parseInt(req.query.page) || 1;
            const pageSize = 10;
            const skip = (page - 1) * pageSize;
            const search = req.query.search || '';

            const dayNow = new Date();

            const total = await db.activities.count({
                where: {
                    user: unitId,
                    ngaybatdau: {
                        [Op.gte]: dayNow,
                    },
                    name: {
                        [Op.or]: {
                            [Op.startsWith]: search,
                            [Op.endsWith]: search,
                            [Op.substring]: search,
                        },
                    },
                },
            });
            const pages = Math.ceil(total / pageSize);

            if (pages === 0) return res.status(200).json({ msg: 'Successfully', activities: [], page, pages: 1 });
            if (page > pages) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No page found',
                });
            }

            const activities = await db.activities.findAll({
                where: {
                    user: unitId,
                    ngaybatdau: {
                        [Op.gte]: dayNow,
                    },
                    name: {
                        [Op.or]: {
                            [Op.startsWith]: search,
                            [Op.endsWith]: search,
                            [Op.substring]: search,
                        },
                    },
                },
                offset: skip,
                limit: pageSize,
                pages: pages,
                order: [['ngaybatdau', 'ASC']],
                raw: true,
            });

            res.status(200).json({ msg: 'Successfully', activities, page, pages });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /activities/approve
    getActivitiesApprove = async (req, res) => {
        try {
            const userId = req.user._id;

            const results = await db.activities.findAll({
                where: {
                    user: userId,
                    trangthai: 1,
                },
                attributes: ['_id', 'name'],
            });

            res.status(200).json({ msg: 'Successfully', results });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /activities/:id/report
    getReport = async (req, res) => {
        try {
            const activityId = req.params.id;

            const activity = await db.activities.findOne({
                where: {
                    user: req.user._id,
                    _id: activityId,
                },
                attributes: ['ketqua', 'soluong', 'kinhphi', 'minhchung'],
                raw: true,
            });
            if (!activity) return res.status(400).json({ msg: 'Không tìm thấy hoạt động' });

            if (activity.trangthai === 0)
                return res.status(400).json({ msg: 'Hoạt động chưa được duyệt, không thể báo cáo' });

            res.status(200).json({ msg: 'Successfully', activity });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [PATCH] /activities/:id/report
    reportActivity = async (req, res) => {
        const data = req.body;
        const activityId = req.params.id;

        const activity = await db.activities.findOne({
            where: {
                user: req.user._id,
                _id: activityId,
            },
            raw: true,
        });
        if (!activity) return res.status(400).json({ msg: 'Không tìm thấy hoạt động' });

        try {
            if (activity.trangthai === 0)
                return res.status(400).json({ msg: 'Hoạt động chưa được duyệt, không thể báo cáo' });
            await db.activities.update(
                {
                    ketqua: data.ketqua,
                    soluong: data.soluong,
                    kinhphi: data.kinhphi,
                    minhchung: data.minhchung,
                },
                {
                    where: {
                        user: req.user._id,
                        _id: activityId,
                    },
                },
            );
            res.status(200).json({ msg: 'Báo cáo thành công' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [POST] /activities/:id/add-student
    addStudent = async (req, res) => {
        const path = `./src/public/upload/${req.file.filename}`;
        const activityId = req.params.id;
        const checkApprove = await db.activities.findOne({
            where: { _id: activityId },
            attributes: ['trangthai'],
            raw: true,
        });
        if (checkApprove.trangthai === 0) {
            req.flash('messages', ['message-fail', 'Không được phép cấp chứng nhận!']);
            return res.redirect('/activities/' + activityId);
        }

        const file = reader.readFile(path);
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
        temp.forEach(async (res) => {
            const countIn = await db.student.count({
                where: {
                    _id: res.mssv,
                },
            });
            if (countIn === 1) {
                db.student_activity.create({
                    student_id: res.mssv,
                    activity_id: activityId,
                    role: res.nhiemvu,
                });
            }
        });

        fs.unlink(path, (err) => {
            if (err) {
                console.error(err);
            }
        });
        res.redirect('/activities/' + activityId);
    };

    // [PATCH] /activities/:id
    updateActivity = async (req, res) => {
        const activityId = req.params.id;
        const data = req.body;
        if (!data) return res.status(400).json({ msg: 'Không có dữ liệu' });

        const activity = await db.activities.findOne({
            where: {
                user: req.user._id,
                _id: activityId,
            },
            raw: true,
        });
        if (!activity) return res.status(400).json({ msg: 'Không có hoạt động' });
        if (activity.trangthai === 1)
            return res.status(400).json({ msg: 'Hoạt động đã được duyệt, không thể thay đổi thông tin' });

        const day = new Date(activity.ngaybatdau);
        const startDay = new Date(data.ngaybatdau);
        const endDay = new Date(data.ngayketthuc);
        const gapStart = (startDay.getTime() - day.getTime()) / (24 * 60 * 60 * 1000);
        const gapEnd = (endDay.getTime() - startDay.getTime()) / (24 * 60 * 60 * 1000);

        try {
            if (gapStart < 0) return res.status(400).json({ msg: 'Ngày bắt đầu không phù hợp' });
            if (gapEnd < 0) return res.status(400).json({ msg: 'Ngày kết thúc không phù hợp' });

            await db.activities.update(
                {
                    name: data.name,
                    tochuc: data.tochuc,
                    phoihop: data.phoihop,
                    ngaybatdau: data.ngaybatdau,
                    ngayketthuc: data.ngayketthuc,
                    diadiem: data.diadiem,
                    vanban: data.vanban,
                    noidung: data.noidung,
                },
                {
                    where: { _id: activityId },
                },
            );
            res.status(201).json({ msg: 'Cập nhật hoạt động thành công' });
        } catch (err) {
            res.json(err.messgae);
        }
    };

    // [DELETE] /activities/:id
    deleteActivity = async (req, res) => {
        const activityId = req.params.id;

        const activity = await db.activities.findOne({
            where: { _id: activityId },
            raw: true,
        });
        if (!activity) return res.status(400).json({ msg: 'Không tìm thấy hoạt động' });
        if (activity.trangthai === 1) return res.status(400).json({ msg: 'Hoạt động đã được duyệt, không thể xoá' });

        try {
            await db.activities.destroy({
                where: {
                    user: req.user._id,
                    _id: activityId,
                },
            });
            res.status(204).json({ msg: 'Xoá hoạt động thành công' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /activities/:id
    getActivity = async (req, res) => {
        try {
            const activityId = req.params.id;
            if (req.user.role === 'U') {
                const activity = await db.activities.findOne({
                    where: {
                        user: req.user._id,
                        _id: activityId,
                    },
                    raw: true,
                });
                if (!activity) return res.status(400).json({ msg: 'Không tìm thấy hoạt động' });

                res.status(200).json({ msg: 'Successfully', activity });
            } else if (req.user.role === 'M') {
                const activity = await db.activities.findOne({
                    where: {
                        _id: activityId,
                    },
                    raw: true,
                });
                if (!activity) return res.status(400).json({ msg: 'Không tìm thấy hoạt động' });

                res.status(200).json({ msg: 'Successfully', activity });
            }
        } catch (err) {
            res.json(err.message);
        }
    };
}

module.exports = new ActivitiesController();
