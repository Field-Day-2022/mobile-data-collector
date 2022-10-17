import React from 'react';
import NumberIncrementer from "../numer-incrementer/number-incrementer";
import {Container, Row, Col} from "react-bootstrap";

import './animal-counter-with-label.css';
import '../../App.css';


const CounterWithLabel = (props) => {
    return (
        <Container>
            <Row>
                <Col
                    className='counter-with-label form-group'
                >
                    <div className='counter-label'>{props.label}</div>
                    <NumberIncrementer
                        incrementCallBack={(num) => {
                            props.increment(props.label, num);
                        }}
                        decrementCallBack={(num) => {
                            props.decrement(props.label, num);
                        }}
                        field={props.field}
                        label={props.label}
                    />
                </Col>
            </Row>
        </Container>
    )
};

export default CounterWithLabel;