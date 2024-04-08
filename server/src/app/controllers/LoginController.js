const db = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class ApiController {
    // [POST] /login
    login = async (req, res) => {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.json({ Error: 'Error' });
        } else {
            const response = await db.user.findOne({
                where: {
                    _id: userName,
                },
                raw: true,
            });

            if (!response) {
                return res.json({ Error: 'Error' });
            }

            const isChecked = response && bcrypt.compareSync(password, response.password);
            if (isChecked) {
                const accessToken = jwt.sign(
                    { _id: response._id, unit_id: response.unit_id },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '5d' },
                );

                const refreshToken = jwt.sign(
                    { _id: response._id, unit_id: response.unit_id },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '5d' },
                );

                await db.user.update(
                    {
                        refreshToken: refreshToken,
                    },
                    {
                        where: { _id: userName },
                    },
                );

                res.cookie('token', accessToken, {
                    httpOnly: true,
                });

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 2 * 60 * 1000,
                });

                return res.json({ Status: 'Success' });
            } else {
                return res.json({ Error: 'Error' });
            }
        }
    };
}

module.exports = new ApiController();
