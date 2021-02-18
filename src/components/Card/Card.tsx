import React from 'react';

interface Props {
    title?: string;
    children?: React.ReactNode;
}

const Card = ({ title, children }: Props) => {
    return (
        <div className="card">
            <h3 className="card__title">{title}</h3>
            {children}
        </div>
    );
};

export default Card;
