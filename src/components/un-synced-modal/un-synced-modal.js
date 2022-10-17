import React from 'react';
import {Button, Container, Modal, Table} from "react-bootstrap";
import _ from 'lodash';

const UnsyncedModal = props => {
    const {entry_json} = props.dataHistoryObject;

    const generateTableHeaders = (json) => {
        if (json) {
            const jsonArray = [...json];

            // Loop through entry_json array, which is an array of objects
            const tableHeaders = jsonArray.map(el => {

                // Since we are ensured that the objects are single key / value pairs,
                // each object will only have one single key
                const keys = Object.keys(el);
                return keys[0];
            });

            // Generate the th tags with the appropriate labels
            return tableHeaders.map((key, index) => <th key={`${key}-${index}`}>{_.startCase(_.toLower(key))}</th>)
        }
    }

    const generateTableData = (json) => {
        // Very similar to generateTable Headers, except we are getting the values here
        if (json) {
            const jsonArray = [...json];
            const tableValues = jsonArray.map(val => Object.values(val)[0]);

            return tableValues.map((val, index) => <td key={`${index}-val-${val}`}>{val}</td>);
        }
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title>Unsync'ed History</Modal.Title>
            </Modal.Header>
            <Modal.Body
                id='unsynced-history-modal'
            >
                <Container>
                    <Table>
                        <thead>
                        <tr>
                            {
                                generateTableHeaders(entry_json)
                            }
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            {
                                generateTableData(entry_json)
                            }
                        </tr>
                        </tbody>
                    </Table>
                </Container>
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

export default UnsyncedModal;
