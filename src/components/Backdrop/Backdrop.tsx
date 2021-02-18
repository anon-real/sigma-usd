import React, { MouseEvent, useCallback, ReactElement } from 'react';
import withDefaults from 'utils/withDefaults';
import useCurrentState from 'hooks/useCurrentState';
import cn from 'classnames';
import CssTransition from '../CssTransition/CssTransition';
import styles from './Backdrop.module.scss';

interface Props {
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    visible?: boolean;
    children?: ReactElement;
    className?: string;
}

const defaultProps = {
    onClick: () => {},
    visible: false,
};

export type BackdropProps = Props & typeof defaultProps;

const Backdrop: React.FC<React.PropsWithChildren<BackdropProps>> = React.memo(
    ({ children, onClick, visible, className }: BackdropProps) => {
        const [, setIsContentMouseDown, IsContentMouseDownRef] = useCurrentState(false);
        const clickHandler = (event: MouseEvent<HTMLElement>) => {
            if (IsContentMouseDownRef.current) return;
            if (onClick) {
                onClick(event);
            }
        };
        const childrenClickHandler = useCallback((event: MouseEvent<HTMLElement>) => {
            event.stopPropagation();
        }, []);
        const mouseUpHandler = () => {
            if (!IsContentMouseDownRef.current) return;
            const timer = setTimeout(() => {
                setIsContentMouseDown(false);
                clearTimeout(timer);
            }, 0);
        };

        return (
            <CssTransition visible={visible} clearTime={300}>
                <div className={styles.backdrop} onClick={clickHandler} onMouseUp={mouseUpHandler}>
                    <div className={styles.layer} />
                    <div
                        onClick={childrenClickHandler}
                        className={cn(styles.content, className)}
                        onMouseDown={() => setIsContentMouseDown(true)}
                    >
                        {children}
                    </div>
                </div>
            </CssTransition>
        );
    },
);

export default withDefaults(Backdrop, defaultProps);
