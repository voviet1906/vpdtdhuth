/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import style from './Certification.module.scss';

import Modal from '~/components/Modal';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

const cx = classNames.bind(style);

function CreateCertification({ activityId, onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [value, setValue] = useState('');
    const [student, setStudent] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => setOpenModal(false);
    const handleChange = (e) => setValue(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Kiểm tra thông tin!');
        try {
            const checkAccout = await axiosPrivate.get(`/student/certification/${value}`);
            setStudent(checkAccout.data.result);
            setOpenModal(true);
            toast.dismiss(toastId);
        } catch (err) {
            if (err?.response) {
                toast.update(toastId, {
                    render: `${value} không chính xác hoặc chưa là Hội viên!`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                });
            }
        }
    };

    const handleCreateCertification = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Thêm mới chứng nhận!');
        try {
            await axiosPrivate.post(`/certification?activity=${activityId}&student=${value}`);
            toast.update(toastId, {
                render: 'Chứng nhận thành công!',
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
            onFlag();
            setValue('');
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
            handleToggleModal();
        }
    };

    const props = {
        title: 'Thông tin hội viên',
        open: openModal,
    };

    return (
        <>
            <form method="POST" className={cx('form')} onSubmit={handleSubmit}>
                <input
                    className={cx('input')}
                    value={value}
                    name="_id"
                    type="text"
                    placeholder="Mã hội viên"
                    required
                    onChange={handleChange}
                />
                <Button type="submit" primary small>
                    Thêm
                </Button>
            </form>
            <Modal props={props} onToggle={handleToggleModal}>
                <p>- Mã hội viên: {student._id}</p>
                <p>- Họ và tên: {student.hoten}</p>
                <p>- Liên chi hội: {student.donvi}</p>
                <br />
                <Button type="submit" primary large onClick={handleCreateCertification}>
                    Chứng nhận
                </Button>
            </Modal>
        </>
    );
}

export default memo(CreateCertification);
