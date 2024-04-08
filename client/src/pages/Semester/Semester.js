import { useState, useEffect } from 'react';
import moment from 'moment';

import CreateYear from './CreateSemester';
import DestroyYear from './DestroySemester';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function Semester() {
    const axiosPrivate = useAxiosPrivate();

    const [semesters, setSemesters] = useState([]);
    const [flag, setFlag] = useState(false);

    const handleFlag = () => setFlag(!flag);

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await axiosPrivate.get('/semester');
            setSemesters(response.data.results);
        }

        fetchMyAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    return (
        <>
            <div className="wrapper">
                <div className="page-title">
                    <h3>QUẢN LÝ HỌC KỲ</h3>
                </div>
                <div className="box">
                    <CreateYear onFlag={handleFlag} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Stt</th>
                                <th>Học kỳ</th>
                                <th>Thời gian bắt đầu</th>
                                <th>Thời gian kết thúc</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {semesters.map((semester, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="table-align-left">{semester.name}</td>
                                    <td>{moment(semester.time_start).format('DD/MM/YYYY')}</td>
                                    <td>{moment(semester.time_end).format('DD/MM/YYYY')}</td>
                                    <td>
                                        <DestroyYear id={semester._id} onFlag={handleFlag} />
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

export default Semester;
