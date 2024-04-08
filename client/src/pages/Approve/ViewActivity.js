/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';

import Modal from '~/components/Modal';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

function ViewActivity({ id, tenhd }) {
    const axiosPrivate = useAxiosPrivate();

    const [activity, setActivity] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleToggleModal = () => setOpenModal(false);

    const fecthTrainingById = async () => {
        try {
            const response = await axiosPrivate.get(`/activities/${id}`);
            setActivity(response.data.activity);
            setOpenModal(true);
        } catch (err) {
            toast.error(err.response.data.msg, {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    const props = {
        title: tenhd,
        open: openModal,
    };

    return (
        <>
            <p onClick={() => fecthTrainingById()}>{tenhd}</p>
            <Modal props={props} onToggle={handleToggleModal}>
                <h3>Thông tin hoạt động</h3>
                <p>- Đơn vị phối hợp: {activity.tochuc}</p>
                <p>- Đơn vị phối hợp: {activity.phoihop}</p>
                <p>- Thời gian bắt đầu: {moment(activity.ngaybatdau).format('DD/MM/YYYY')}</p>
                <p>- Thời gian kết thúc: {moment(activity.ngayketthuc).format('DD/MM/YYYY')}</p>
                <p>- Địa điểm: {activity.diadiem}</p>
                <p>- Link văn bản: {activity.vanban}</p>
                <p>- Nội dung thực hiện: {activity.noidung}</p>
                <br />
                {activity.trangthai === 0 ? (
                    <>
                        <h3>Nhận xét của cấp Trường</h3>
                        <p>- Ý kiến nhận xét: {activity.nhanxet}</p>
                        <p>- Mục rèn luyện: {activity.renluyen}</p>
                        <p>- Điểm rèn luyện: {activity.diem}</p>
                        <p>- Kết luận: {activity.ketluan}</p>
                    </>
                ) : (
                    <>
                        <h3>Báo cáo kết quả</h3>
                        <p>- Kết quả đạt được: {activity.ketqua}</p>
                        <p>- Số lượng tham gia: {activity.soluong}</p>
                        <p>- Kinh phí tổ chức: {activity.kinhphi}</p>
                        <p>- Link minh chứng: {activity.minhchung}</p>
                        <br />
                        <h3>Nhận xét của cấp Trường</h3>
                        <p>- Ý kiến nhận xét: {activity.nhanxet}</p>
                        <p>- Mục rèn luyện: {activity.renluyen}</p>
                        <p>- Điểm rèn luyện: {activity.diem}</p>
                        <p>- Kết luận: {activity.ketluan}</p>
                    </>
                )}
            </Modal>
        </>
    );
}

export default memo(ViewActivity);
