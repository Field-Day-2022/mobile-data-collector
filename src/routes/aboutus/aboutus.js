import React from "react";
import {
    Button, Col, Container, Row,
} from "react-bootstrap";
import './aboutus.css';

let AboutUs = (props) => {

    return (
        <div className='home-page-backing'>
            <div className="header">
                <h1>About FieldDay</h1>
            </div>

            <div className='center-column'>
                <h2 className='about-us-header'>
                    Wildlife Data Collection & Query
                </h2>

                <p className="about-text">
                    2020-2021 Developers:
                </p>
                <Container fluid>
                    <Row>
                        <Col xs={6} className='developer-table'>
                            <table>
                                <tr>
                                    <td className='developer'>Brent Garcia</td>
                                    <td className='developer'>Alexander Mack</td>
                                    <td className='developer'>Amy Kiely</td>
                                </tr>
                                <tr>
                                    <td className='developer'>Phil McElroy</td>
                                    <td className='developer'>Carlo Pelosi</td>
                                </tr>
                            </table>
                        </Col>
                    </Row>
                </Container>

                <p className="about-text">
                    2019-2020 Developers:
                </p>
                <Container fluid>
                    <Row>
                        <Col xs={6} className='developer-table'>
                            <table>
                                <tr>
                                    <td className='developer'>Colton Wiethorn</td>
                                    <td className='developer'>Kevin Shelley</td>
                                    <td className='developer'>Kimberlee Gentry</td>
                                </tr>
                                <tr>
                                    <td className='developer'>Marcella Sellers</td>
                                    <td className='developer'>Taryn Betz</td>
                                </tr>
                            </table>
                        </Col>
                    </Row>
                </Container>

                <p className="about-text">
                    2018-2019 Developers:
                </p>
                <Container fluid>
                    <Row>
                        <Col xs={6} className='developer-table'>
                            <table>
                                <tr>
                                    <td className='developer'>Ashley Giamona</td>
                                    <td className='developer'>Edward Woelke</td>
                                    <td className='developer'>Joshua Owczarek</td>
                                </tr>
                                <tr>
                                    <td className='developer'>Matt Kharrl</td>
                                    <td className='developer'>Phil Soucheray</td>
                                </tr>
                            </table>
                        </Col>
                    </Row>
                </Container>
                <Button
                    className='next-button'
                    aria-label='Navigate to Home'
                    onClick={() => props.history.push('/')}
                >
                    Return Home
                </Button>
            </div>
        </div>
    );

}


export default AboutUs;
