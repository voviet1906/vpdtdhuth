import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '~/api/axios';
import classNames from 'classnames/bind';
import useAuth from '~/hooks/useAuth';

import Button from '~/components/Button';
import Input from '~/components/Input';
import logo from '~/assets/images/logo.png';
import style from './Login.module.scss';

const cx = classNames.bind(style);

function Login() {
    const navigate = useNavigate();

    const { setAuth } = useAuth();
    const [value, setValue] = useState({});

    const handleChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Thực hiện đăng nhập!');
        try {
            const response = await axios.post('/auth/login', JSON.stringify(value), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            const name = response?.data?.name;
            const role = response?.data?.role;
            const accessToken = response?.data?.accessToken;
            setAuth({ name, role, accessToken });
            localStorage.setItem('auth', JSON.stringify({ name: name, role: role, accessToken: accessToken }));
            setValue([]);
            toast.update(toastId, {
                render: 'Đăng nhập thành công!',
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
            navigate('/');
        } catch (err) {
            if (err?.response) {
                toast.update(toastId, {
                    render: err.response.data.msg,
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                });
            }
        }
    };

    const inputs = [
        {
            id: 1,
            name: 'user_id',
            type: 'text',
            placeholder: 'vpdtdhuth',
            label: 'Tài khoản',
            required: true,
        },
        {
            id: 2,
            name: 'password',
            type: 'password',
            placeholder: '*********',
            label: 'Mật khẩu',
            required: true,
        },
    ];

    return (
        <>
            <div className={cx('container')}>
                <div className={cx('logo')}>
                    <img src={logo} alt="logo" />
                </div>
                <div className={cx('box')}>
                    <div className={cx('content-heading')}>
                        <h2 className={cx('title')}>VĂN PHÒNG ĐIỆN TỬ</h2>
                        <h2 className={cx('sub-title')}>ĐOÀN - HỘI UTH</h2>
                    </div>
                    <form method="POST" className={cx('form')} autoComplete="true" onSubmit={handleSubmit}>
                        {inputs.map((input) => (
                            <Input key={input.id} {...input} onChange={handleChange} />
                        ))}
                        <Button primary large>
                            Đăng nhập
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
