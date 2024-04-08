/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

import Modal from '~/components/Modal';
import Input from '~/components/Input';
import Textarea from '~/components/Textarea';
import Button from '~/components/Button';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';
import inputs from './formReport.js';

function ReportActivity({ id, name, onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [value, setValue] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => setOpenModal(false);
    const handleChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });

    const fecthActivityById = async () => {
        try {
            const response = await axiosPrivate.get(`/activities/${id}/report`);
            setValue(response.data.activity);
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
        const toastId = toast.loading('Báo cáo thực hiện hoạt động!');
        try {
            await axiosPrivate.patch(`/activities/${id}/report`, value);
            toast.update(toastId, {
                render: 'Báo cáo thành công!',
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
        title: name,
        open: openModal,
    };

    return (
        <>
            <FontAwesomeIcon icon={faBookmark} onClick={() => fecthActivityById()} />
            <div className="popup-root">
                <Modal props={props} onToggle={handleToggleModal}>
                    <form method="POST" className="form" onSubmit={handleSubmit}>
                        {inputs.map((input) =>
                            !input.classify ? (
                                <Input key={input.id} {...input} value={value[input.name]} onChange={handleChange} />
                            ) : (
                                <Textarea key={input.id} {...input} value={value[input.name]} onChange={handleChange} />
                            ),
                        )}
                        <Button type="submit" primary large>
                            Báo cáo
                        </Button>
                    </form>
                </Modal>
            </div>
        </>
    );
}

export default memo(ReportActivity);
