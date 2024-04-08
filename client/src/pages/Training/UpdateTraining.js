/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import Modal from '~/components/Modal';
import Input from '~/components/Input';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';
import inputs from './formCreate.js';

function UpdateTraining({ id, onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [value, setValue] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => setOpenModal(false);
    const handleChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });

    const fecthTrainingById = async () => {
        try {
            const response = await axiosPrivate.get(`/training-point/${id}`);
            setValue(response.data.result);
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
        const toastId = toast.loading('Cập nhật danh mục điểm rèn luyện!');
        try {
            await axiosPrivate.patch(`/training-point/${id}`, value);
            toast.update(toastId, {
                render: 'Cập nhật thành công!',
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
        title: 'Rèn luyện',
        open: openModal,
    };

    return (
        <>
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => fecthTrainingById()} />
            <div className="popup-root">
                <Modal props={props} onToggle={handleToggleModal}>
                    <form method="POST" className="form" onSubmit={handleSubmit}>
                        {inputs.map((input) => (
                            <Input key={input.id} {...input} value={value[input.name]} onChange={handleChange} />
                        ))}
                        <Button type="submit" primary large>
                            Lưu
                        </Button>
                    </form>
                </Modal>
            </div>
        </>
    );
}

export default memo(UpdateTraining);
