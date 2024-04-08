import { useState, useEffect } from 'react';
import moment from 'moment';

import Search from '~/components/Search';
import Pagination from '~/components/Pagination';
import CreateUser from './CreateStudent';
import CreateStudentFromFile from './CreateStudentFromFile';
import UpdateStudent from './UpdateStudent';
import DestroyStudent from './DestroyStudent';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function Student() {
    const axiosPrivate = useAxiosPrivate();

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');

    const [students, setStudents] = useState([]);
    const [flag, setFlag] = useState(false);

    const handleFlag = () => setFlag(!flag);

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await axiosPrivate.get(`/student?page=${page}&search=${search}`);
            setStudents(response.data.results);
            setPage(response.data.page);
            setPages(response.data.pages);
        }

        fetchMyAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, page, search]);

    return (
        <>
            <div className="wrapper">
                <div className="page-title">
                    <h3>QUẢN LÝ HỘI VIÊN</h3>
                </div>
                <div className="box box-scroll">
                    <div className="box-action">
                        <CreateUser onFlag={handleFlag} />
                        <Search onSearch={setSearch} />
                    </div>
                    <CreateStudentFromFile onFlag={handleFlag} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Stt</th>
                                <th>Mã hội viên</th>
                                <th>Họ và tên</th>
                                <th>Ngày sinh</th>
                                <th>Chi hội</th>
                                <th>Liên chi hội</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{student._id}</td>
                                    <td className="table-align-left">{student.hoten}</td>
                                    <td>{moment(student.ngaysinh).format('DD/MM/YYYY')}</td>
                                    <td>{student.chihoi}</td>
                                    <td>{student.donvi}</td>
                                    <td>
                                        <UpdateStudent id={student._id} onFlag={handleFlag} />
                                        <DestroyStudent id={student._id} onFlag={handleFlag} />
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

export default Student;
