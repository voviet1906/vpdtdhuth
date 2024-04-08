import { useState, useEffect } from 'react';
import moment from 'moment';

import Search from '~/components/Search';
import Select from '~/components/Select';
import Pagination from '~/components/Pagination';
import CreateActivity from './CreateActivity';
import UpdateActivity from './UpdateActivity';
import DestroyActivity from './DestroyActivity';
import ReportActivity from './ReportActivity';
import ViewActivity from './ViewActivity';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function Activity() {
    const axiosPrivate = useAxiosPrivate();

    const [year, setYear] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [activities, setActivities] = useState([]);
    const [flag, setFlag] = useState(false);

    const callbackSetYear = (props) => {
        setYear(props);
    };
    const handleFlag = () => setFlag(!flag);

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await axiosPrivate.get(`/activities/year/${year}?page=${page}&search=${search}`);
            setActivities(response.data.activities);
            setPage(response.data.page);
            setPages(response.data.pages);
        }
        if (year) {
            fetchMyAPI();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, year, page, search]);

    return (
        <>
            <div className="wrapper">
                <div className="page-title">
                    <h3>DANH SÁCH HOẠT ĐỘNG</h3>
                </div>
                <div className="box">
                    <Select lable="Năm học" link="year" onSet={callbackSetYear} />
                </div>
                <div className="box box-scroll box-scroll-small">
                    <div className="box-action">
                        <CreateActivity onFlag={handleFlag} />
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
                                    {activity.trangthai === 1 ? (
                                        <>
                                            <td>Duyệt</td>
                                            <td>
                                                <ReportActivity
                                                    id={activity._id}
                                                    name={activity.name}
                                                    onFlag={handleFlag}
                                                />
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{activity.trangthai === 0 ? 'Chưa duyệt' : 'Không duyệt'}</td>
                                            <td>
                                                <UpdateActivity id={activity._id} onFlag={handleFlag} />
                                                <DestroyActivity id={activity._id} onFlag={handleFlag} />
                                            </td>
                                        </>
                                    )}
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

export default Activity;
