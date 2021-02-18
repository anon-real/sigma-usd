import React, { useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import usePortal from 'hooks/usePortal';
import useBodyScroll from 'hooks/useBodyScroll';
import useCurrentState from 'hooks/useCurrentState';
import Backdrop from '../Backdrop/Backdrop';
import { ModalConfig, ModalContext } from './modal-context';
import CssTransition from '../CssTransition/CssTransition';
import { ReactComponent as CloseIcon } from '../../assets/images/Icons/CloseIcon.svg';

interface Props {
    disableBackdropClick?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
    open?: boolean;
    width?: string;
    wrapClassName?: string;
    content?: any;
}

const defaultProps = {
    width: '26rem',
    wrapClassName: '',
    disableBackdropClick: false,
};

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type ModalProps = Props & typeof defaultProps & NativeAttrs;

const ModalContainer: React.FC<React.PropsWithChildren<ModalProps>> = ({
    children,
    disableBackdropClick,
    onClose,
    onOpen,
    open,
}) => {
    const portal = usePortal('modal');
    const [, setBodyHidden] = useBodyScroll(null, { scrollLayer: true });
    const [visible, setVisible, visibleRef] = useCurrentState<boolean>(false);

    const closeModal = useCallback(() => {
        if (onClose) {
            onClose();
        }
        setVisible(false);
        setBodyHidden(false);
    }, [onClose, setVisible, setBodyHidden]);

    useEffect(() => {
        if (open === undefined) return;
        if (open && onOpen) {
            onOpen();
        }
        if (!open && visibleRef.current && onClose) {
            onClose();
        }

        setVisible(open);
        setBodyHidden(open);
    }, [open]);

    const closeFromBackdrop = () => {
        if (disableBackdropClick) return;
        closeModal();
    };

    const modalConfig: ModalConfig = useMemo(
        () => ({
            close: closeModal,
        }),
        [closeModal],
    );

    if (!portal) return null;

    return createPortal(
        <ModalContext.Provider value={modalConfig}>
            <Backdrop onClick={closeFromBackdrop} visible={visible} className="modal-backdrop">
                <CssTransition name="wrapper" visible={visible} clearTime={300}>
                    <div className="modal">
                        <div className="modal__content">{children}</div>
                        <button type="button" className="modal__button--close" onClick={closeModal}>
                            <CloseIcon />
                        </button>

                        <style>{`
                            .wrapper-enter {
                                opacity: 0;
                                transform: translate3d(0px, -40px, 0px);
                            }
                            .wrapper-enter-active {
                                opacity: 1;
                                transform: translate3d(0px, 0px, 0px);
                            }
                            .wrapper-leave {
                                opacity: 1;
                                transform: translate3d(0px, 0px, 0px);
                            }
                            .wrapper-leave-active {
                                opacity: 0;
                                transform: translate3d(0px, -50px, 0px);
                            }
                            .info-modal-backdrop {
                                width: 100px;
                            }
                        `}</style>
                    </div>
                </CssTransition>
            </Backdrop>
        </ModalContext.Provider>,
        portal,
    );
};

type ModalComponent<P = {}> = React.FC<P>;
type ComponentProps = Partial<typeof defaultProps> &
    Omit<Props, keyof typeof defaultProps> &
    NativeAttrs;

ModalContainer.defaultProps = defaultProps;

export default ModalContainer as ModalComponent<ComponentProps>;
