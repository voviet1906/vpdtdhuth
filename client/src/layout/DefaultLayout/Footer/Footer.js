import classNames from 'classnames/bind';
import style from './Footer.module.scss';

const cx = classNames.bind(style);

function Footer() {
    return (
        <footer className={cx('footer')}>
            <p>2024 @ Bản quyền thuộc Hội Sinh viên UTH</p>
        </footer>
    );
}

export default Footer;
