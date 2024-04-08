const db = require('../../models');
const { Op } = require('@sequelize/core');
const reader = require('xlsx');
const fs = require('fs');

class StudentController {
    // [POST] /student/file
    addFromFile = async (req, res) => {
        try {
            const path = `src/public/uploads/${req.file.filename}`;

            let count = 0;
            const file = reader.readFile(path);
            const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

            for (let i = 0; i < temp.length; i++) {
                const data = temp[i];
                const checkId = await db.student.count({
                    where: {
                        _id: data.mssv,
                    },
                });

                if (checkId === 0) {
                    count++;
                    await db.student.create({
                        _id: data.mssv,
                        hoten: data.hoten,
                        ngaysinh: data.ngaysinh,
                        gioitinh: data.gioitinh === 'Nam' ? '0' : '1',
                        dantoc: data.dantoc,
                        tongiao: data.tongiao,
                        dienthoai: data.dienthoai,
                        quequan: data.quequan,
                        chihoi: data.chihoi,
                        donvi: data.donvi,
                    });
                }
            }

            fs.unlink(path, (err) => {
                if (err) console.error(err);
            });

            return res.status(200).json({ msg: 'Successfully', count });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [DELETE] /student/:id
    delete = async (req, res) => {
        try {
            const studentId = req.params.id;
            if (!studentId) return res.status(400).json({ msg: 'Không có mã hội viên' });

            const checkId = await db.student.count({
                where: {
                    _id: studentId,
                },
            });
            if (checkId === 0) return res.status(400).json({ msg: 'Mã hội viên không tồn tại' });
            const checkActivity = await db.certification.count({
                where: {
                    student_id: studentId,
                },
            });
            if (checkActivity > 0)
                return res.status(400).json({ msg: 'Hội viên có tham gia hoạt động, không thể xóa' });
            await db.student.destroy({
                where: {
                    _id: studentId,
                },
            });
            res.status(204).json({ msg: 'Xoá hội viên thành công' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [PUT] /student/:id
    update = async (req, res, next) => {
        try {
            const studentId = req.params.id;
            const data = req.body;
            if (!studentId) return res.status(400).json({ msg: 'Không có mã hội viên' });

            const checkId = await db.student.count({
                where: {
                    _id: studentId,
                },
            });
            if (checkId === 0) return res.status(400).json({ msg: 'Mã hội viên không tồn tại' });

            if (data._id !== studentId) {
                const checkNewId = await db.student.count({
                    where: {
                        _id: data._id,
                    },
                });
                if (checkNewId > 0) return res.status(400).json({ msg: 'Mã hội viên mới đã tồn tại' });
            }

            await db.student.update(
                {
                    _id: data._id,
                    hoten: data.hoten,
                    ngaysinh: data.ngaysinh,
                    gioitinh: data.gioitinh,
                    dantoc: data.dantoc,
                    tongiao: data.tongiao,
                    dienthoai: data.dienthoai,
                    quequan: data.quequan,
                    chihoi: data.chihoi,
                    donvi: data.donvi,
                },
                {
                    where: { _id: studentId },
                },
            );
            res.status(201).json({ msg: 'Cập nhật thông tin thành công' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /student/certification/:id
    getBasicById = async (req, res) => {
        try {
            const studentId = req.params.id;
            if (!studentId) return res.status(400).json({ msg: 'Không có mã hội viên' });

            const checkId = await db.student.count({
                where: {
                    _id: studentId,
                },
            });
            if (checkId === 0) return res.status(400).json({ msg: 'Mã hội viên không tồn tại' });

            const result = await db.student.findOne({
                where: {
                    _id: studentId,
                },
                attributes: ['_id', 'hoten', 'donvi'],
                raw: true,
            });

            res.status(200).json({ msg: 'Successfully', result });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /student/:id
    getById = async (req, res) => {
        try {
            const studentId = req.params.id;
            console.log(studentId);
            if (!studentId) return res.status(400).json({ msg: 'Không có mã hội viên' });

            const checkId = await db.student.count({
                where: {
                    _id: studentId,
                },
            });
            if (checkId === 0) return res.status(400).json({ msg: 'Mã hội viên không tồn tại' });

            const result = await db.student.findOne({
                where: {
                    _id: studentId,
                },
                raw: true,
            });

            res.status(200).json({ msg: 'Successfully', result });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [POST] /student
    add = async (req, res) => {
        try {
            const data = req.body;
            if (!data) return res.status(400).json({ mgs: 'Không có dữ liệu' });

            const checkId = await db.student.count({
                where: {
                    _id: data._id,
                },
            });
            if (checkId > 0) return res.status(400).json({ msg: 'Mã số sinh viên đã tồn tại' });

            await db.student.create({
                _id: data._id,
                hoten: data.hoten,
                ngaysinh: data.ngaysinh,
                gioitinh: data.gioitinh,
                dantoc: data.dantoc,
                tongiao: data.tongiao,
                dienthoai: data.dienthoai,
                quequan: data.quequan,
                chihoi: data.chihoi,
                donvi: data.donvi,
            });

            res.status(201).json({ msg: 'Thêm sinh viên thành công' });
        } catch (err) {
            res.json(err.message);
        }
    };

    // [GET] /student
    get = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = 50;
            const skip = (page - 1) * pageSize;
            const search = req.query.search || '';

            const total = await db.student.count();
            const pages = Math.ceil(total / pageSize);

            if (pages === 0) return res.status(200).json({ msg: 'Successfully', students: [], page, pages: 1 });
            if (page > pages) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No page found',
                });
            }

            const results = await db.student.findAll({
                where: {
                    hoten: {
                        [Op.or]: {
                            [Op.startsWith]: search,
                            [Op.endsWith]: search,
                            [Op.substring]: search,
                        },
                    },
                },
                offset: skip,
                limit: pageSize,
                order: [['ngaysinh', 'DESC']],
                raw: true,
            });

            res.status(200).json({ msg: 'Successfully', results, page, pages });
        } catch (err) {
            res.json(err.message);
        }
    };
}

module.exports = new StudentController();
