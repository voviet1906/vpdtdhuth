import { useState, useEffect } from 'react';

import CreateTraining from './CreateTraining';
import UpdateTraining from './UpdateTraining';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function Home() {
    const axiosPrivate = useAxiosPrivate();

    const [trainings, setTrainings] = useState([]);
    const [flag, setFlag] = useState(false);

    const handleFlag = () => setFlag(!flag);

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await axiosPrivate.get('/training-point');
            setTrainings(response.data.results);
        }

        fetchMyAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    return (
        <>
            <div className="wrapper">
                <div className="page-title">
                    <h3>DANH MỤC ĐIỂM RÈN LUYỆN</h3>
                </div>
                <div className="box">
                    <CreateTraining onFlag={handleFlag} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Stt</th>
                                <th>Rèn luyện</th>
                                <th>Nội dung</th>
                                <th>Điểm tối đa</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainings.map((training, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{training._id}</td>
                                    <td className="table-align-left">{training.content}</td>
                                    <td>{training.point}</td>
                                    <td>
                                        <UpdateTraining id={training._id} onFlag={handleFlag} />
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

export default Home;
