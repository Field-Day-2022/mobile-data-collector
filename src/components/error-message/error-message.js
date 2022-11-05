import React from 'react';
import './error-message.css';

export default (props) => (
    props.hasErrors ? (
        <div>
            <p className="error-class">
                <span className="error-text">
                    {props.children.key === 'OTL(mm)' ? "OTL can't be longer than VTL" : 'Required'}
                </span>
            </p>
            {props.children}
        </div>
    ) : (
        { ...props.children }
    )
);
