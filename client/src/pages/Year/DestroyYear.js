/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import Modal from '~/components/Modal';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function DestroyYear({ id, onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [openModal, setOpenModal] = useState(false);
    const handleToggleModal = () => setOpenModal(false);

    const handleClickDestroy = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Xóa năm học!');
        try {
            await axiosPrivate.delete(`/year/${id}`);
            toast.update(toastId, {
                render: 'Xóa thành công!',
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
        title: 'Xóa năm học',
        open: openModal,
    };

    return (
        <>
            <FontAwesomeIcon icon={faTrash} onClick={() => setOpenModal(true)} />
            <div className="popup-root">
                <Modal props={props} onToggle={handleToggleModal}>
                    <p>Bạn chắc chắn xóa năm học này?</p>
                    <Button type="submit" destroy small floatRight onClick={handleClickDestroy}>
                        Xóa
                    </Button>
                    <Button type="submit" primary small floatRight onClick={handleToggleModal}>
                        Thoát
                    </Button>
                </Modal>
            </div>
        </>
    );
}

export default memo(DestroyYear);
