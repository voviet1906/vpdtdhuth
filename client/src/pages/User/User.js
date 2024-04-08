import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function User() {
    const axiosPrivate = useAxiosPrivate();

    const [users, setUsers] = useState([]);
    const [flag, setFlag] = useState(false);

    const handleFlag = () => setFlag(!flag);
    const handleClickReset = async (id) => {
        const toastId = toast.loading('Khôi phục mật khẩu!');
        try {
            await axiosPrivate.patch(`/user/${id}/reset-password`);
            toast.update(toastId, {
                render: 'Khôi phục mật khẩu thành công!',
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
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

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await axiosPrivate.get('/user');
            setUsers(response.data.results);
        }

        fetchMyAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    return (
        <>
            <div className="wrapper">
                <div className="page-title">
                    <h3>QUẢN LÝ TÀI KHOẢN</h3>
                </div>
                <div className="box">
                    <CreateUser onFlag={handleFlag} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Stt</th>
                                <th>Tài khoản</th>
                                <th>Tên đơn vị</th>
                                <th>Phân quyền</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user._id}</td>
                                    <td className="table-align-left">{user.name}</td>
                                    <td>{user.role === 'M' ? 'Quản lý' : 'Người dùng'}</td>
                                    <td>
                                        <FontAwesomeIcon icon={faKey} onClick={() => handleClickReset(user._id)} />
                                        <UpdateUser id={user._id} onFlag={handleFlag} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default User;
