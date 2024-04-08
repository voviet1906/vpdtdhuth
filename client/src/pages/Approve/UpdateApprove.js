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
import inputs from './formReport.js';
import Select from '~/components/Select/Select.js';

function UpdateApprove({ id, onFlag }) {
    const axiosPrivate = useAxiosPrivate();

    const [approve, setApprove] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => setOpenModal(false);
    const callbackSet = (props) => setApprove({ ...approve, renluyen: props });
    const handleChange = (e) => setApprove({ ...approve, [e.target.name]: e.target.value });

    const fecthTrainingById = async () => {
        try {
            const response = await axiosPrivate.get(`/approve/${id}`);
            setApprove(response.data.result);
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
        const toastId = toast.loading('Duyệt hoạt động');
        try {
            await axiosPrivate.patch(`/approve/${id}`, approve);
            toast.update(toastId, {
                render: 'Duyệt thành công',
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
        title: 'Duyệt hoạt động',
        open: openModal,
    };

    return (
        <>
            <FontAwesomeIcon icon={faPenToSquare} onClick={() => fecthTrainingById()} />
            <Modal props={props} onToggle={handleToggleModal}>
                <form method="POST" className="form" onSubmit={handleSubmit}>
                    {inputs.map((input) =>
                        !input.classify ? (
                            input.type === 'radio' ? (
                                <Input
                                    key={input.id}
                                    {...input}
                                    // eslint-disable-next-line eqeqeq
                                    checked={input.value == approve[input.name]}
                                    onChange={handleChange}
                                />
                            ) : (
                                <Input key={input.id} {...input} value={approve[input.name]} onChange={handleChange} />
                            )
                        ) : input.classify === 'textarea' ? (
                            <Textarea key={input.id} {...input} value={approve[input.name]} onChange={handleChange} />
                        ) : (
                            <Select key={input.id} {...input} value={approve[input.name]} onSet={callbackSet} />
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

export default memo(UpdateApprove);
