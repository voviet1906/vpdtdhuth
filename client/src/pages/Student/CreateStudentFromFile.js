/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState } from 'react';
import { toast } from 'react-toastify';

import Modal from '~/components/Modal';
import Input from '~/components/Input';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function CreateStudentFromFile({ onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [file, setFile] = useState();
    const [openModal, setOpenModal] = useState(false);
    const handleToggleModal = () => setOpenModal(false);

    const handleChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        console.log(file);
        console.log(formData);
        const toastId = toast.loading('Thêm hội viên mới!');
        try {
            const response = await axiosPrivate.post('/student/file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.update(toastId, {
                render: `Thêm ${response.data.count} hội viên thành công!`,
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
        title: 'Danh sách hội viên',
        open: openModal,
    };

    return (
        <>
            <h5 onClick={() => setOpenModal(true)}>Nhập excel</h5>
            <div className="popup-root">
                <Modal props={props} enctype="multipart/form-data" onToggle={handleToggleModal}>
                    <form method="POST" className="form" onSubmit={handleSubmit}>
                        <Input id="file" name="file" type="file" required accept=".xlsx" onChange={handleChange} />
                        <Button type="submit" primary large>
                            Thêm
                        </Button>
                    </form>
                </Modal>
            </div>
        </>
    );
}

export default memo(CreateStudentFromFile);
