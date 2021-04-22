import ModalContainer from 'components/ModalContainer/ModalContainer';
import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { copyToClipboard, friendlyAddress } from '../../utils/helpers';
import { Trans } from 'react-i18next';

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
        return <div className="info-modal__timer info-modal__timer-text"><Trans i18nKey="timeOver"/></div>;
    }

    return (
        <div className="info-modal__timer">
            <Trans i18nKey="remainingTime" values={{remainingTime}}
               components={[
                   <div className="info-modal__timer-text" />,
                   <div className="info-modal__timer-value" />,
                   <div className="info-modal__timer-text" />  ,
               ]}
            />
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
                    <Trans i18nKey="clickToCopy"/>
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
                        <Trans i18nKey="infoContent1"
                               values={{amount: `${value} ${coin}`, address:formattedAddress}}
                               components={[
                                   <span
                                        onClick={() => copyToClipboard(value)}
                                        className="info-modal__text--bold info-modal__text--pointer"
                                    />,
                                    <span
                                        onClick={() => copyToClipboard(address)}
                                        className="info-modal__text--bold info-modal__text--pointer"
                                    />,
                                ]}/>
                    </p>
                    <p className="info-modal__text">
                        <Trans i18nKey="infoContent2" />
                    </p>
                </div>
            </div>
        </ModalContainer>
    );
};

export default InfoModal;
