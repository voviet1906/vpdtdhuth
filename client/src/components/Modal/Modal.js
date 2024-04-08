import React from 'react';
import Popup from 'reactjs-popup';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import style from './Modal.module.scss';

const cx = classNames.bind(style);

function Modal({ props, onToggle, children }) {
    return (
        <Popup open={props.open} closeOnDocumentClick={false} onClose={onToggle}>
            <div className={cx('modal')}>
                <FontAwesomeIcon icon={faCircleXmark} onClick={onToggle} className={cx('close')} />
                <h3 className={cx('header')}>{props.title}</h3>
                {children}
            </div>
        </Popup>
    );
}

export default Modal;
