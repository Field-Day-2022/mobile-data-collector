import React from 'react';
import {Button, Image, Modal} from "react-bootstrap";

import './toe-clip-modal.css';

const ToeClipModal = (props) => {

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title>Toe Clip Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input name='toeClipModalInput'
                       type='text'
                       maxLength={4}
                       value={props.toeClipCode}
                       onChange={(e) => {
                           props.updateToeClipCode(e.target.value);
                       }}
                />
                <Image
                    className='toe-clip-image'
                    src={props.ToeClipExampleImage}
                    alt='An image that displays the various toe clip possibilities.'
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='toe-clip-close-button'
                    variant="secondary"
                    onClick={props.onHide}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ToeClipModal;
