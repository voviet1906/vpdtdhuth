import { useState, useEffect } from 'react';

import CreateSetting from './CreateSetting';
import UpdateSetting from './UpdateSetting';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function Setting() {
    const axiosPrivate = useAxiosPrivate();

    const [settings, setSettings] = useState([]);
    const [flag, setFlag] = useState(false);

    const handleFlag = () => setFlag(!flag);

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await axiosPrivate.get('/setting');
            setSettings(response.data.results);
        }

        fetchMyAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    return (
        <>
            <div className="wrapper">
                <div className="page-title">
                    <h3>CÀI ĐẶT HỆ THỐNG</h3>
                </div>
                <div className="box">
                    <CreateSetting onFlag={handleFlag} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Stt</th>
                                <th>Nội dung</th>
                                <th>Giá trị</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {settings.map((setting, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="table-align-left">{setting.content}</td>
                                    <td>{setting.value}</td>
                                    <td>
                                        <UpdateSetting id={setting._id} onFlag={handleFlag} />
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

export default Setting;
