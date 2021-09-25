import React from 'react';

type Props = {
    children: [React.ReactNode, React.ReactNode]
}

export const Title = (props: Props) => {
    const {
        children: [title, subtitle]
    } = props;

    return (
        <div className="top-section">
            <h2 className="top-section__title">
                {title}
            </h2>
            <p className="top-section__paragraph">
                {subtitle}
            </p>
        </div>
    )
};
