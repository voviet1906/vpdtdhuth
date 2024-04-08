import { useState, useEffect } from 'react';
import moment from 'moment';

import Search from '~/components/Search';
import Select from '~/components/Select';
import Pagination from '~/components/Pagination';
import UpdateApprove from './UpdateApprove';
import ViewActivity from './ViewActivity';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function Approve() {
    const axiosPrivate = useAxiosPrivate();

    const [unit, setUnit] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [activities, setActivities] = useState([]);
    const [flag, setFlag] = useState(false);

    const callbackSetUnit = (props) => setUnit(props);
    const handleFlag = () => setFlag(!flag);

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await axiosPrivate.get(`/activities/unit/${unit}?page=${page}&search=${search}`);
            setActivities(response.data.activities);
            setPage(response.data.page);
            setPages(response.data.pages);
        }
        if (unit) {
            fetchMyAPI();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, unit, page, search]);

    return (
        <>
            <div className="wrapper">
                <div className="page-title">
                    <h3>DANH SÁCH HOẠT ĐỘNG CƠ SỞ</h3>
                </div>
                <div className="box">
                    <Select lable="Đơn vị" link="user/get-user" onSet={callbackSetUnit} />
                </div>
                <div className="box box-scroll box-scroll-small">
                    <div className="box-action">
                        <div></div>
                        <Search onSearch={setSearch} />
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Stt</th>
                                <th>Tên hoạt động</th>
                                <th>Đơn vị tổ chức</th>
                                <th>Ngày bắt đầu</th>
                                <th>Trạng thái</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((activity, index) => (
                                <tr
                                    key={index}
                                    className={
                                        activity.trangthai === 0
                                            ? 'tr-black'
                                            : activity.trangthai === 1
                                            ? 'tr-blue'
                                            : 'tr-red'
                                    }
                                >
                                    <td>{index + 1}</td>
                                    <td className="table-align-left">
                                        <ViewActivity id={activity._id} tenhd={activity.name} />
                                    </td>
                                    <td>{activity.tochuc}</td>
                                    <td>{moment(activity.ngaybatdau).format('DD/MM/YYYY')}</td>
                                    <td>
                                        {activity.trangthai === 0
                                            ? 'Chưa duyệt'
                                            : activity.trangthai === 1
                                            ? 'Duyệt'
                                            : 'Không duyệt'}
                                    </td>
                                    <td>
                                        <UpdateApprove id={activity._id} onFlag={handleFlag} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination page={page} pages={pages} changePage={setPage} />
                </div>
            </div>
        </>
    );
}

export default Approve;
