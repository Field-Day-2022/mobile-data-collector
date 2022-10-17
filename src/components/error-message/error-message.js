import React from 'react';
import './error-message.css';

const ErrorMessage = props => {

    return (props.hasErrors ?
            <div>
                <p className='error-class'>
                    <span className='error-text'>
                        {props.children.key === "OTL(mm)" ? "OTL can't be longer than VTL" : "Required"}
                    </span>
                </p>
                {props.children}
            </div>
            :
            {...props.children}
    );
};

export default ErrorMessage;
