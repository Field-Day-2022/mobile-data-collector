import React from 'react';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Home from '../../routes/home-page/home';
import './navigation.css';

const Navigation = () => {
    return (
        <Router>
            <Nav className='mainNav'>
                <Navbar expand="lg">
                    <Navbar.Brand href="/">
                        <span className={`nav-title`}>Field Day</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/">
                                <span className='menu-links'>Home</span>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Nav>

            <Switch>
                <Route exact path='/' component={Home}/>
            </ Switch>
        </Router>
    );
};

export default Navigation;
