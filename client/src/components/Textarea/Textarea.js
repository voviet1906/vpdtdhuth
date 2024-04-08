import classNames from 'classnames/bind';
import style from './Input.module.scss';

const cx = classNames.bind(style);

function Input({ onChange, ...props }) {
    return (
        <div className={cx('form-group')}>
            <label htmlFor={props.id} className={cx('form-label')}>
                {props.label}
            </label>
            <textarea className={cx('form-input')} {...props} onChange={onChange} rows={10} cols={40} />
            <span className={cx('message')}></span>
        </div>
    );
}

export default Input;
