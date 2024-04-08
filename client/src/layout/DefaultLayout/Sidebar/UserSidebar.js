import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Sidebar.module.scss';
import favicon from '~/assets/images/favicon.png';
import useAuth from '~/hooks/useAuth';

const cx = classNames.bind(style);

function Sidebar() {
    const { auth } = useAuth();

    return (
        <div className={cx('sidebar')}>
            <div className={cx('user-box')}>
                <img src={favicon} alt="logo" />
                <Link to="/">{auth.name}</Link>
            </div>
            <div className={cx('menu')}>
                <ul>
                    <li className={cx('menu-list')}>
                        <Link to="/doi-mat-khau">Đổi mật khẩu</Link>
                    </li>
                    <li className={cx('menu-title')}>HOẠT ĐỘNG</li>
                    <li className={cx('menu-list')}>
                        <Link to="/hoat-dong">Danh sách hoạt động</Link>
                    </li>
                    <li className={cx('menu-list')}>
                        <Link to="/chung-nhan">Chứng nhận tham gia</Link>
                    </li>
                    <li className={cx('menu-list')}>
                        <Link to="/">Hoạt động chủ động</Link>
                    </li>
                    <li className={cx('menu-list')}>
                        <Link to="/">Mô hình, giải pháp</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
