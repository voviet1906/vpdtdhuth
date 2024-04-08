/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState } from 'react';
import { toast } from 'react-toastify';

import Modal from '~/components/Modal';
import Input from '~/components/Input';
import Textarea from '~/components/Textarea';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';
import inputs from './formCreate.js';

function CreateUser({ onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [user, setUser] = useState({
        _id: '',
        name: '',
        role: '',
    });
    const [openModal, setOpenModal] = useState(false);
    const handleToggleModal = () => setOpenModal(false);

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Tạo tài khoản mới!');
        try {
            await axiosPrivate.post('/user', user);
            toast.update(toastId, {
                render: 'Tạo tài khoản thành công!',
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
            onFlag();
            handleToggleModal();
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

    const props = {
        title: 'Tài khoản mới',
        open: openModal,
    };

    return (
        <>
            <Button primary small onClick={() => setOpenModal(true)}>
                Tài khoản mới
            </Button>
            <div className="popup-root">
                <Modal props={props} onToggle={handleToggleModal}>
                    <form method="POST" className="form" onSubmit={handleSubmit}>
                        {inputs.map((input) =>
                            !input.classify ? (
                                <Input key={input.id} {...input} onChange={handleChange} />
                            ) : (
                                <Textarea key={input.id} {...input} onChange={handleChange} />
                            ),
                        )}
                        <Button type="submit" primary large>
                            Tạo
                        </Button>
                    </form>
                </Modal>
            </div>
        </>
    );
}

export default memo(CreateUser);
