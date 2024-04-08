import { useState, useEffect } from 'react';
import moment from 'moment';

import CreateYear from './CreateYear';
import DestroyYear from './DestroyYear';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function Year() {
    const axiosPrivate = useAxiosPrivate();

    const [schoolYear, setSchoolYear] = useState([]);
    const [flag, setFlag] = useState(false);

    const handleFlag = () => setFlag(!flag);

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await axiosPrivate.get('/year');
            setSchoolYear(response.data.results);
        }

        fetchMyAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    return (
        <>
            <div className="wrapper">
                <div className="page-title">
                    <h3>QUẢN LÝ NĂM HỌC</h3>
                </div>
                <div className="box">
                    <CreateYear onFlag={handleFlag} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Stt</th>
                                <th>Năm học</th>
                                <th>Thời gian bắt đầu</th>
                                <th>Thời gian kết thúc</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schoolYear.map((training, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="table-align-left">{training.name}</td>
                                    <td>{moment(training.time_start).format('DD/MM/YYYY')}</td>
                                    <td>{moment(training.time_end).format('DD/MM/YYYY')}</td>
                                    <td>
                                        <DestroyYear id={training._id} onFlag={handleFlag} />
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

export default Year;
