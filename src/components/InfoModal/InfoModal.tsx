import ModalContainer from 'components/ModalContainer/ModalContainer';
import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { copyToClipboard, friendlyAddress } from '../../utils/helpers';

interface Props {
    coin: string;
    address: string;
    value: any;
    onClose: () => void;
    open: boolean;
    dueTime?: number;
}

const renderTime = ({ remainingTime }: any) => {
    if (remainingTime === 0) {
        return <div className="info-modal__timer info-modal__timer-text">The time is over</div>;
    }

    return (
        <div className="info-modal__timer">
            <div className="info-modal__timer-text">Remaining</div>
            <div className="info-modal__timer-value">{remainingTime}</div>
            <div className="info-modal__timer-text">seconds</div>
        </div>
    );
};

const InfoModal = ({ open, coin, value, address, onClose, dueTime }: Props) => {
    const formattedAddress = `${friendlyAddress(address)}`;

    return (
        <ModalContainer open={open} onClose={onClose}>
            <div className="info-modal">
                <div className="info-modal__title">
                    <span role="img" aria-label="Warning icon">
                        ⚠️
                    </span>
                    Click on the amount and the address to copy them!
                </div>
                <div className="info-modal__countdown-timer">
                    <CountdownCircleTimer
                        isPlaying
                        size={120}
                        duration={dueTime as number}
                        colors={[
                            [`#004777`, 0.33],
                            [`#F7B801`, 0.33],
                            [`#A30000`, 0],
                        ]}
                    >
                        {renderTime}
                    </CountdownCircleTimer>
                </div>
                <div className="info-modal__content">
                    <p className="info-modal__text">
                        Send exactly{' '}
                        <span
                            onClick={() => copyToClipboard(value)}
                            className="info-modal__text--bold info-modal__text--pointer"
                        >
                            {value} {coin}
                        </span>{' '}
                        to{' '}
                        <span
                            onClick={() => copyToClipboard(address)}
                            className="info-modal__text--bold info-modal__text--pointer"
                        >
                            {formattedAddress}
                        </span>
                        ;<br /> the operation will be done automatically
                        afterward.
                    </p>
                    <p className="info-modal__text">
                        Your funds will be sent back to you in case of any failure. Smart contracts are being used
                        to prevent the intermediate service from cheating!
                    </p>
                </div>
            </div>
        </ModalContainer>
    );
};

export default InfoModal;
