/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import Modal from '~/components/Modal';
import Input from '~/components/Input';
import Textarea from '~/components/Textarea';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';
import inputs from './formCreate.js';

function UpdateActivity({ id, onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [activity, setActivity] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => setOpenModal(false);
    const handleChange = (e) => setActivity({ ...activity, [e.target.name]: e.target.value });

    const fecthTrainingById = async () => {
        try {
            const response = await axiosPrivate.get(`/activities/${id}`);
            setActivity(response.data.activity);
            setOpenModal(true);
        } catch (err) {
            toast.error(err.response.data.msg, {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Cập nhật hoạt động');
        try {
            await axiosPrivate.patch(`/activities/${id}`, activity);
            toast.update(toastId, {
                render: 'Cập nhật thành công',
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
        title: 'Hoạt động',
        open: openModal,
    };

    return (
        <>
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => fecthTrainingById()} />
            <Modal props={props} onToggle={handleToggleModal}>
                <form method="POST" className="form" onSubmit={handleSubmit}>
                    {inputs.map((input) =>
                        !input.classify ? (
                            <Input key={input.id} {...input} value={activity[input.name]} onChange={handleChange} />
                        ) : (
                            <Textarea key={input.id} {...input} value={activity[input.name]} onChange={handleChange} />
                        ),
                    )}
                    <Button type="submit" primary large>
                        Lưu
                    </Button>
                </form>
            </Modal>
        </>
    );
}

export default memo(UpdateActivity);
