import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Input from '~/components/Input';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function Password() {
    const navigate = useNavigate();

    const axiosPrivate = useAxiosPrivate();
    const [value, setValue] = useState([]);

    const handleChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Thực hiện đổi mật khẩu!');
        try {
            await axiosPrivate.post('/user/change-password', value);
            toast.update(toastId, {
                render: 'Đổi mật khẩu thành công!',
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
            name: 'oldPassword',
            type: 'password',
            placeholder: '*********',
            label: 'Mật khẩu cũ',
            required: true,
        },
        {
            id: 2,
            name: 'newPassword',
            type: 'password',
            placeholder: '*********',
            label: 'Mật khẩu mới',
            required: true,
        },
        {
            id: 3,
            name: 'reNewPassword',
            type: 'password',
            placeholder: '*********',
            label: 'Nhập lại mật khẩu',
            required: true,
        },
    ];

    return (
        <>
            <div className="wrapper">
                <div className="page-title">
                    <h3>ĐỔI MẬT KHẨU</h3>
                </div>
                <div className="box">
                    <form method="POST" className="form" autoComplete="true" onSubmit={handleSubmit}>
                        {inputs.map((input) => (
                            <Input key={input.id} {...input} onChange={handleChange} />
                        ))}
                        <Button primary large>
                            Đổi mật khẩu
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Password;
