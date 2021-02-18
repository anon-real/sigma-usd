import React from 'react';
import './Loader.scss';

const Loader = () => {
    return (
        <div className="loader triangle">
            <svg viewBox="0 0 86 80">
                <polygon points="43 8 79 72 7 72"></polygon>
            </svg>
        </div>
    );
};

export default Loader;
