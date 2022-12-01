import React from 'react';
import './error-message.css';

export default props => (props.hasErrors ? 
    (
        <div>
            <p className="error-class">
                <span className="error-text">Toe Clip Code In Use</span>
            </p>
            {props.children}
        </div>
    ) : (
        { ...props.children }
    )
);