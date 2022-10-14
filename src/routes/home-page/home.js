import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Image, Container, Row, Col, Modal, Button, FormControl, Form} from "react-bootstrap";
import aboutUs from '../../img/about-us.png';
import collectData from '../../img/collect-data.png';
import syncData from '../../img/sync data.png';
import unsyncHistory from '../../img/unsync-history.png';
import * as CONSTANTS from '../../constants';
import './home.css';
import '../../App.css';

const Home = props => {
    // Local State
    const [showLoginModal, setShowLoginModal] = useState(true);
    const [showSyncErrorModal, setShowSyncErrorModal] = useState(false);
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // Redux
    const currentLocation = useSelector(state => state.Location_Info.location);

    const handleLogin = (username, password) => {
        if ((username.trim() === CONSTANTS.USER_NAME
            && password.trim() === CONSTANTS.PASS_WORD)
            || (username.trim() === CONSTANTS.USER_NAME_INS
                && password.trim() === CONSTANTS.PASS_WORD_INS)) {
            setShowLoginModal(false);
            sessionStorage.setItem('username', username);
        }
    };

    return (
        <div className='home-page-backing'>
            <div className="header">
                <h1><span className='spacer'>FieldDay</span></h1>
            </div>
            <div className='center-column'>
                <Container className={'button-container'}>
                    <Row>
                        <Col xs={6} md={6}>
                            <button
                                className="button-style"
                                aria-label='Button to navigate to Collect Data.'
                            >
                                <Image
                                    className={'image-style'}
                                    src={collectData}
                                    alt={''}
                                    onClick={() => {
                                        if (currentLocation !== '') {
                                            props.history.push('/Session');
                                        } else {
                                            setShowSyncErrorModal(true);
                                        }
                                    }}
                                    fluid
                                />
                                <p className={'buttonlabel'}>Collect Data</p>
                            </button>
                        </Col>
                        <Col xs={6} md={6}>
                            <button
                                className="button-style"
                                aria-label='Button to navigate to Un-synced History.'
                                onClick={() => props.history.push('/new-data')}
                            >
                                <Image
                                    className={'image-style'}
                                    src={unsyncHistory}
                                    alt={''}
                                    fluid
                                />
                                <p className={'buttonlabel'}>Un-Sync History</p>
                            </button>
                        </Col>
                        <Col xs={6} md={6}>
                            <button
                                className="button-style">
                                <img
                                    className={'image-style'}
                                    src={aboutUs}
                                    alt={''}
                                    onClick={() => props.history.push('/aboutus')}
                                />
                                <p className={'buttonlabel'}>About Us</p>
                            </button>
                        </Col>
                        <Col xs={6} md={6}>
                            <button className="button-style">
                                <img
                                    className={'image-style'}
                                    src={syncData}
                                    alt={''}
                                    onClick={() => props.history.push('/sync-data')}
                                />
                                <p className={'buttonlabel'}>Sync Data</p>
                            </button>
                        </Col>
                    </Row>
                </Container>

                <Modal
                    show={
                        showLoginModal
                        &&
                        (!sessionStorage.getItem('username') || sessionStorage.getItem('username') === '')
                    }
                >
                    <Modal.Header>
                        <Modal.Title>Please log in</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form
                            className='login-form'
                            onSubmit={() => handleLogin(username, password)}
                        >
                            <FormControl
                                className='login-modal'
                                placeholder='username'
                                aria-label='username'
                                aria-describedby='username'
                                onChange={e => setUserName(e.target.value)}
                                required={true}
                            />
                            <FormControl
                                className='login-modal'
                                placeholder='password'
                                aria-label='password'
                                aria-describedby='password'
                                type='password'
                                onChange={e => setPassword(e.target.value)}
                                required={true}
                            />
                            <Button
                                className='login-modal'
                                type="submit"
                            >
                                Submit
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={showSyncErrorModal}>
                    <Modal.Header>
                        <Modal.Title>Did you forget something?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Please Sync Data First</p>
                        <Button
                            className='login-modal'
                            variant="primary"
                            onClick={() => setShowSyncErrorModal(false)}
                        >
                            Ok
                        </Button>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default Home;
