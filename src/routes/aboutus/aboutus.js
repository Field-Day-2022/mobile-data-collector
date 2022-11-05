import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import './aboutus.css';

let arrChunk = (arr,chunkSz) => arr.map((val,n) => ({val, grpN: ~~(n / chunkSz)})).reduce((grps, el) => (grps[el.grpN] ??= []).push(el.val) && grps, []);

let genDevJSX = devNames => arrChunk(devNames, 3).map(grp => (<tr>{grp.map(devName => (<td className="developer">{devName}</td>))}</tr>));

let AboutUs = (props) => (
    <div className="home-page-backing">
        <div className="header">
            <h1>About FieldDay</h1>
        </div>

        <div className="center-column">
            <h2 className="about-us-header">Wildlife Data Collection & Query</h2>

            <p className="about-text">2022-2023 Developers:</p>
            <Container fluid>
                <Row>
                    <Col xs={6} className="developer-table">
                        <table>
                            {genDevJSX(['Ian Skelskey', 'Isaiah Lathem', 'Jack Norman', 'Zachary Jacobson', 'Dennis Grassl'])}
                        </table>
                    </Col>
                </Row>
            </Container>

            <p className="about-text">2020-2021 Developers:</p>
            <Container fluid>
                <Row>
                    <Col xs={6} className="developer-table">
                        <table>
                            {genDevJSX(['Brent Garcia', 'Alexander Mack', 'Amy Kiely', 'Phil McElroy', 'Carlo Pelosi'])}
                        </table>
                    </Col>
                </Row>
            </Container>

            <p className="about-text">2019-2020 Developers:</p>
            <Container fluid>
                <Row>
                    <Col xs={6} className="developer-table">
                        <table>
                            {genDevJSX(['Colton Wiethorn', 'Kevin Shelley', 'Kimberlee Gentry', 'Marcella Sellers', 'Taryn Betz'])}
                        </table>
                    </Col>
                </Row>
            </Container>

            <p className="about-text">2018-2019 Developers:</p>
            <Container fluid>
                <Row>
                    <Col xs={6} className="developer-table">
                        <table>
                            {genDevJSX(['Ashley Giamona', 'Edward Woelke', 'Joshua Owczarek', 'Matt Kharrl', 'Phil Soucheray'])}
                        </table>
                    </Col>
                </Row>
            </Container>
            <Button
                className="next-button"
                aria-label="Navigate to Home"
                onClick={() => props.history.push('/')}
            >
                Return Home
            </Button>
        </div>
    </div>
);

export default AboutUs;
