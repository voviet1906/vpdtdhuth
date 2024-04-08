import { useState, useEffect } from 'react';

import Search from '~/components/Search';
import Select from '~/components/Select';
import Pagination from '~/components/Pagination';
import CreateCertification from './CreateCertification';
import DestroyCertification from './DestroyCertification';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function Approve() {
    const axiosPrivate = useAxiosPrivate();

    const [activityId, setActivityId] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [certification, setCertification] = useState([]);
    const [flag, setFlag] = useState(false);

    const callbackSet = (props) => setActivityId(props);
    const handleFlag = () => setFlag(!flag);

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await axiosPrivate.get(`/certification/${activityId}?page=${page}&search=${search}`);
            setCertification(response.data.results);
            setPage(response.data.page);
            setPages(response.data.pages);
        }
        if (activityId) {
            fetchMyAPI();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, activityId, page, search]);

    return (
        <>
            <div className="wrapper">
                <div className="page-title">
                    <h3>CHỨNG NHẬN HOẠT ĐỘNG</h3>
                </div>
                <div className="box">
                    <Select lable="Hoạt động" link="activities/approve" onSet={callbackSet} />
                </div>
                <div className="box box-scroll box-scroll-small">
                    <div className="box-action">
                        {!activityId ? (
                            <div></div>
                        ) : (
                            <CreateCertification activityId={activityId} onFlag={handleFlag} />
                        )}
                        <Search onSearch={setSearch} />
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Stt</th>
                                <th>Họ tên</th>
                                <th>Liên chi hội</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certification.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="table-align-left">{item.hoten}</td>
                                    <td>{item.donvi}</td>
                                    <td>
                                        <DestroyCertification
                                            activityId={activityId}
                                            studentId={item.id}
                                            onFlag={handleFlag}
                                        />
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
