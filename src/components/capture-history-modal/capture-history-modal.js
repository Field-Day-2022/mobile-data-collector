import React from 'react';
import { Button, Container, Modal, Table } from 'react-bootstrap';
import './capture-history-modal.css';

const CaptureHistory = (props) => {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Recapture History</Modal.Title>
            </Modal.Header>
            <Modal.Body id="capture-history-modal">
                <Container>
                    <div>
                        <div>
                            Current Site:
                            <b>{props.currentSite}</b>
                        </div>
                        <div>
                            Current Species:
                            <b>{props.currentSpecies}</b>
                        </div>
                        <div>
                            Current ToeClipCode:
                            <b>{props.currentToeClipCode}</b>
                        </div>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                            {['Date', 'Array', 'Recapture', 'SVL(mm)', 'VTL(mm)', 'Regen Tail?', 'OTL(mm)', 'Hatchling?', 'Mass(g)', 'Sex', 'Dead?'].map(ttl => (<th>{ttl}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {props.captureHistory.map((history, index) => {
                                return index < 5 ? (
                                    <tr className={'recapture-history-modal-rows'} key={index}>
                                        <td>{history['Date']}</td>
                                        <td>{history['Array']}</td>
                                        <td>{history['Recapture'].toString().toUpperCase()}</td>
                                        <td>{history['SVL(mm)']}</td>
                                        <td>{history['VTL(mm)']}</td>
                                        <td>{history['Regen Tail?'].toString().toUpperCase()}</td>
                                        <td>{history['OTL(mm)']}</td>
                                        <td>{history['Hatchling?'].toString().toUpperCase()}</td>
                                        <td>{history['Mass(g)']}</td>
                                        <td>{history['Sex']}</td>
                                        <td>{history['Dead?'].toString().toUpperCase()}</td>
                                    </tr>
                                ) : (
                                    ''
                                );
                            })}
                        </tbody>
                    </Table>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className="toe-clip-close-button"
                    variant="secondary"
                    onClick={props.onHide}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CaptureHistory;
