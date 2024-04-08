/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState } from 'react';
import { toast } from 'react-toastify';

import Modal from '~/components/Modal';
import Input from '~/components/Input';
import Textarea from '~/components/Textarea';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';
import inputs from './formCreate.js';

function CreateActivity({ onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [value, setValue] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => setOpenModal(false);
    const handleChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Thêm mới hoạt động!');
        try {
            await axiosPrivate.post('/activities', value);
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
        title: 'Hoạt động',
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

export default memo(CreateActivity);
