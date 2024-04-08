const db = require('../../models');
const { Op } = require('@sequelize/core');
const { literal, QueryTypes } = require('sequelize');
const fs = require('fs');
const axios = require('axios');

class CertificationController {
    // [DELETE] /certification
    destroyByActivity = async (req, res) => {
        try {
            const activityId = req.query.activity;
            const studentId = req.query.student;

            if (!activityId) return res.status(400).json({ msg: 'Không có mã hoạt động' });

            const checkId = await db.certification.count({
                where: {
                    student_id: studentId,
                    activity_id: activityId,
                },
            });
            if (checkId === 0) return res.status(400).json({ msg: 'Không có hội viên tham gia' });

            db.certification.destroy({
                where: {
                    student_id: studentId,
                    activity_id: activityId,
                },
            });

            res.status(200).json({ msg: 'Successfully' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [POST] /certification
    createCertification = async (req, res) => {
        try {
            const activityId = req.query.activity;
            const studentId = req.query.student;
            if (!activityId || !studentId) return res.status(400).json({ msg: 'Không có hoạt động' });

            const time = await db.setting.findOne({
                where: {
                    content: 'deadlineActivity',
                },
                raw: true,
            });

            const endDay = new Date(new Date().getTime() + time.value * 24 * 60 * 60 * 1000);
            const activity = await db.activities.findOne({
                where: {
                    _id: activityId,
                    user: req.user._id,
                    trangthai: 1,
                    ngayketthuc: { [Op.lte]: endDay },
                },
            });
            if (!activity) return res.status(400).json({ msg: 'Hoạt động không đủ điều kiện cấp chứng nhận' });

            const checkId = await db.student.count({
                where: {
                    _id: studentId,
                },
            });
            if (checkId === 0) return res.status(400).json({ msg: 'Mã số hội viên không tồn tại' });

            const checkCertification = await db.certification.count({
                where: {
                    student_id: studentId,
                    activity_id: activityId,
                },
            });
            if (checkCertification > 0) return res.status(400).json({ msg: 'Đã cấp chứng nhận' });

            db.certification.create({
                student_id: studentId,
                activity_id: activityId,
            });

            res.status(200).json({ msg: 'Successfully' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [POST] /certification/search
    getByStudentId = async (req, res) => {
        try {
            const value = req.body.searchValue;
            if (!value) return res.status(400).json({ msg: 'Không có dữ liệu tìm kiếm' });

            axios({
                url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.recaptchaValue}`,
                method: 'POST',
            })
                .then(async ({ data }) => {
                    if (data.success) {
                        const page = parseInt(req.query.page) || 1;
                        const pageSize = 200;
                        const skip = (page - 1) * pageSize;

                        const checkId = await db.student.findOne({
                            where: {
                                _id: value.mssv,
                                hoten: value.hoten,
                                ngaysinh: value.ngaysinh,
                                chihoi: value.chihoi,
                            },
                            attributes: ['_id', 'hoten', 'chihoi', 'donvi'],
                            raw: true,
                        });
                        if (!checkId)
                            return res.status(400).json({ msg: 'Thông tin không chính xác hoặc chưa là hội viên!' });

                        const time = await db.semester.findOne({
                            where: {
                                _id: value.hocky,
                            },
                            raw: true,
                        });

                        const { count, rows } = await db.certification.findAndCountAll({
                            where: {
                                student_id: value.mssv,
                                '$activity.ngaybatdau$': {
                                    [Op.between]: [time.time_start, time.time_end],
                                },
                            },
                            include: [
                                {
                                    model: db.activities,
                                    attributes: [],
                                },
                            ],
                            attributes: [
                                [literal('activity.name'), 'tenhd'],
                                [literal('activity.tochuc'), 'tochuc'],
                                [literal('activity.ngaybatdau'), 'batdau'],
                                [literal('activity.ngayketthuc'), 'ketthuc'],
                                [literal('activity.renluyen'), 'renluyen'],
                                [literal('activity.diem'), 'diem'],
                            ],
                            offset: skip,
                            limit: pageSize,
                            order: [
                                ['renluyen', 'ASC'],
                                ['batdau', 'DESC'],
                            ],
                            raw: true,
                        });

                        const points = await db.sequelize.query(
                            `SELECT A.*, tmp.diem FROM training_points A LEFT JOIN (SELECT B.renluyen, SUM(B.diem) as 'diem' FROM certifications A, activities B WHERE A.student_id = ${checkId._id} AND A.activity_id = B._id AND B.ngaybatdau BETWEEN '${time.time_start}' AND '${time.time_end}' GROUP BY B.renluyen) AS tmp ON A._id = tmp.renluyen`,
                            {
                                type: QueryTypes.SELECT,
                            },
                        );

                        const total = count;
                        const results = rows;
                        const pages = Math.ceil(total / pageSize);

                        if (pages === 0)
                            return res
                                .status(200)
                                .json({ msg: 'Successfully', results: [], points, checkId, page, pages: 1 });
                        if (page > pages) {
                            return res.status(404).json({
                                status: 'fail',
                                message: 'No page found',
                            });
                        }

                        res.status(200).json({ msg: 'Successfully', results, points, checkId, page, pages });
                    } else {
                        res.status(400).json({ message: 'Recaptcha verification failed!' });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(400).json({ message: 'Invalid Recaptcha' });
                });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /certification/:id
    getByActivity = async (req, res) => {
        try {
            const activityId = req.params.id;
            if (!activityId) return res.status(400).json({ msg: 'Không có mã hoạt động' });

            const page = parseInt(req.query.page) || 1;
            const pageSize = 50;
            const skip = (page - 1) * pageSize;
            const search = req.query.search || '';

            const total = await db.certification.count({
                where: {
                    activity_id: activityId,
                },
            });

            const pages = Math.ceil(total / pageSize);

            if (pages === 0) return res.status(200).json({ msg: 'Successfully', results: [], page, pages: 1 });
            if (page > pages) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No page found',
                });
            }

            const results = await db.certification.findAll({
                where: {
                    activity_id: activityId,
                    '$student.hoten$': {
                        [Op.or]: {
                            [Op.startsWith]: search,
                            [Op.endsWith]: search,
                            [Op.substring]: search,
                        },
                    },
                },
                include: [
                    {
                        model: db.student,
                        attributes: [],
                    },
                ],
                attributes: [
                    ['student_id', 'id'],
                    [literal('student.hoten'), 'hoten'],
                    [literal('student.donvi'), 'donvi'],
                ],
                offset: skip,
                limit: pageSize,
                order: [['student_id', 'DESC']],
                raw: true,
            });
            res.status(200).json({ msg: 'Successfully', results, page, pages });
        } catch (err) {
            res.json(err.message);
        }
    };
}

module.exports = new CertificationController();
