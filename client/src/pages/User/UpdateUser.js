/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from 'react-toastify';

import { memo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import Modal from '~/components/Modal';
import Input from '~/components/Input';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';
import inputs from './formUpdate.js';

function UpdateYear({ id, onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [user, setUser] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const handleToggleModal = () => setOpenModal(false);

    const fecthUserById = async () => {
        try {
            const res = await axiosPrivate.get(`/user/${id}`);
            setUser(res.data.result);
            setOpenModal(true);
        } catch (err) {
            toast.error(err.response.data.msg, {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Thực hiện chỉnh sửa!');
        try {
            await axiosPrivate.patch(`/user/${id}`, user);
            toast.update(toastId, {
                render: 'Chỉnh sửa thành công!',
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
        title: 'Tài khoản',
        open: openModal,
    };

    return (
        <>
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => fecthUserById()} />
            <Modal props={props} onToggle={handleToggleModal}>
                <form method="POST" className="form" onSubmit={handleSubmit}>
                    {inputs.map((input) =>
                        input.type === 'text' ? (
                            <Input key={input.id} {...input} value={user[input.name]} onChange={handleChange} />
                        ) : (
                            <Input
                                key={input.id}
                                {...input}
                                checked={input.value === user.role}
                                onChange={handleChange}
                            />
                        ),
                    )}
                    <Button type="submit" primary large>
                        Tạo
                    </Button>
                </form>
            </Modal>
        </>
    );
}

export default memo(UpdateYear);
