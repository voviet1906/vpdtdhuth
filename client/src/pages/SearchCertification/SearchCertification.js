import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import moment from 'moment';
import classNames from 'classnames/bind';

import Input from '~/components/Input';
import Button from '~/components/Button';
import Select from '~/components/Select';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';
import style from './Search.module.scss';
import logo from '~/assets/images/logo.png';
import inputs from './formSearch.js';

const cx = classNames.bind(style);

function SearchCertification() {
    const axiosPrivate = useAxiosPrivate();

    const captchaRef = useRef();

    const [searchValue, setSearchValue] = useState({});
    const [recaptchaValue, setRecaptchaValue] = useState('');
    const [certifications, setCertifications] = useState([]);
    const [points, setPoints] = useState({});
    const [student, setStudent] = useState({});

    const callbackSet = (props) => setSearchValue({ ...searchValue, hocky: props });
    const handleChange = (e) => setSearchValue({ ...searchValue, [e.target.name]: e.target.value });
    const handleReCaptcha = (value) => setRecaptchaValue(value);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Tra cứu hoạt động tham gia!');
        try {
            const results = await axiosPrivate.post('/certification/search', { searchValue, recaptchaValue });
            setCertifications(results.data.results);
            setPoints(results.data.points);
            setStudent(results.data.checkId);
            toast.dismiss(toastId);
        } catch (err) {
            if (err?.response) {
                toast.update(toastId, {
                    render: err.response.data.msg,
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                });
                setCertifications([]);
                setPoints({});
                setStudent({});
            }
        }
    };

    return (
        <>
            <div className={cx('container')}>
                <div className={cx('logo')}>
                    <img src={logo} alt="logo" />
                </div>
                <div className={cx('page-title')}>
                    <h3>HỆ THỐNG QUẢN LÝ HOẠT ĐỘNG ĐOÀN - HỘI UTH</h3>
                </div>
                <div className={cx('box', 'box-scroll')}>
                    <form method="POST" className="form" onSubmit={handleSubmit}>
                        <div className={cx('input-group')}>
                            {inputs.map((input) => (
                                <Input
                                    className={cx('input-search')}
                                    key={input.id}
                                    {...input}
                                    onChange={handleChange}
                                />
                            ))}
                        </div>
                        <div className={cx('select')}>
                            <Select name="hocky" lable="Học kỳ" link="semester" onSet={callbackSet} />
                        </div>
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_SITE_KEY}
                            onChange={handleReCaptcha}
                            ref={captchaRef}
                        />
                        <Button type="submit" primary large>
                            Tra cứu
                        </Button>
                    </form>
                    {student._id ? (
                        <>
                            <div className={cx('info')}>
                                <hr />
                                <h2 className={cx('primary')}>CHỨNG NHẬN</h2>
                                <p>
                                    Hội viên: <strong className={cx('primary')}>{student.hoten}</strong> ({student._id})
                                </p>
                            </div>
                            {certifications.length !== 0 ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Stt</th>
                                            <th>Tên hoạt động</th>
                                            <th>Đơn vị tổ chức</th>
                                            <th>Thời gian</th>
                                            <th>Mục rèn luyện</th>
                                            <th>Điểm</th>
                                            <th>Ghi chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {certifications.map((certification, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="table-align-left">{certification.tenhd}</td>
                                                <td className="table-align-left">{certification.tochuc}</td>
                                                <td>
                                                    {moment(certification.batdau).format('DD/MM/YYYY')}
                                                    {' - '}
                                                    {moment(certification.ketthuc).format('DD/MM/YYYY')}
                                                </td>
                                                <td>{certification.renluyen}</td>
                                                <td>{certification.diem}</td>
                                                <td></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <>
                                    <p>
                                        Hội viên <strong className={cx('primary')}>chưa tham gia</strong> hoạt động ở
                                        học kỳ này.
                                    </p>
                                    <hr />
                                </>
                            )}

                            <div className={cx('footer-sum')}>
                                <h4 className={cx('primary')}>* Tổng kết:</h4>
                                {points.map((point, index) => (
                                    <p key={index}>
                                        - {point._id}. {point.content}:{' '}
                                        <strong className={cx('primary')}>
                                            {point.diem ? (point.diem > point.point ? point.point : point.diem) : '0'}/
                                            {point.point}{' '}
                                        </strong>
                                        điểm.
                                    </p>
                                ))}
                            </div>
                            <br />
                            <p className={cx('note')}>
                                * Hệ thống chỉ dành cho Hội viên Hội Sinh viên Việt Nam, thực hiện ghi nhận đánh giá
                                tham gia hoạt động do Đoàn - Hội các cấp thuộc UTH tổ chức.
                            </p>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
}

export default SearchCertification;
