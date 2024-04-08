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

function UpdateStudent({ id, onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [student, setStudent] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => setOpenModal(false);

    const fecthstudentById = async () => {
        try {
            const res = await axiosPrivate.get(`/student/${id}`);
            setStudent(res.data.result);
            setOpenModal(true);
        } catch (err) {
            toast.error(err.response.data.msg, {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    const handleChange = (e) => setStudent({ ...student, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Chỉnh sửa thông tin hội viên!');
        try {
            await axiosPrivate.put(`/student/${id}`, student);
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
        title: 'Chỉnh sửa thông tin',
        open: openModal,
    };

    return (
        <>
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => fecthstudentById()} />
            <Modal props={props} onToggle={handleToggleModal}>
                <form method="POST" className="form" onSubmit={handleSubmit}>
                    {inputs.map((input) =>
                        input.type === 'radio' ? (
                            <Input
                                key={input.id}
                                {...input}
                                // eslint-disable-next-line eqeqeq
                                checked={input.value == student[input.name]}
                                onChange={handleChange}
                            />
                        ) : (
                            <Input key={input.id} {...input} value={student[input.name]} onChange={handleChange} />
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

export default memo(UpdateStudent);
