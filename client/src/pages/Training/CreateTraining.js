/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState } from 'react';
import { toast } from 'react-toastify';

import Modal from '~/components/Modal';
import Input from '~/components/Input';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';
import inputs from './formCreate.js';

function CreateTraining({ onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [value, setValue] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => setOpenModal(false);
    const handleChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Thêm mới danh mục điểm rèn luyện!');
        try {
            await axiosPrivate.post('/training-point', value);
            toast.update(toastId, {
                render: 'Thêm mới thành công!',
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
            <Button primary small onClick={() => setOpenModal(true)}>
                Thêm mới
            </Button>
            <div className="popup-root">
                <Modal props={props} onToggle={handleToggleModal}>
                    <form method="POST" className="form" onSubmit={handleSubmit}>
                        {inputs.map((input) => (
                            <Input key={input.id} {...input} onChange={handleChange} />
                        ))}
                        <Button type="submit" primary large>
                            Tạo
                        </Button>
                    </form>
                </Modal>
            </div>
        </>
    );
}

export default memo(CreateTraining);
