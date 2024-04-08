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
                    <li className={cx('menu-title')}>CHỨC NĂNG</li>
                    <li className={cx('menu-list')}>
                        <Link to="/duyet-hoat-dong">Duyệt hoạt động</Link>
                    </li>
                    <li className={cx('menu-list')}>
                        <Link to="/">Duyệt khen thưởng</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
