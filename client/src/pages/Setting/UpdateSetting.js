/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from 'react-toastify';

import { memo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import Modal from '~/components/Modal';
import Input from '~/components/Input';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function UpdateSetting({ id, onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [value, setValue] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => setOpenModal(false);

    const fecthValue = async () => {
        try {
            const res = await axiosPrivate.get(`/setting/${id}`);
            setValue(res.data.result[0]);
            setOpenModal(true);
        } catch (err) {
            toast.error(err.response.data.msg, {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    const handleChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Thực hiện chỉnh sửa!');
        try {
            await axiosPrivate.patch(`/setting`, value);
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
        title: 'Cài đặt',
        open: openModal,
    };

    return (
        <>
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => fecthValue()} />
            <Modal props={props} onToggle={handleToggleModal}>
                <form method="POST" className="form" onSubmit={handleSubmit}>
                    <Input
                        name="content"
                        type="text"
                        label="Nội dung"
                        value={value.content}
                        required
                        onChange={handleChange}
                    />
                    <Input
                        name="value"
                        type="number"
                        label="Giá trị"
                        value={value.value}
                        required
                        onChange={handleChange}
                    />
                    <Button type="submit" primary large>
                        Lưu
                    </Button>
                </form>
            </Modal>
        </>
    );
}

export default memo(UpdateSetting);
