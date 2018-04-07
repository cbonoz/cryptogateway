import React, {Component} from 'react';
import Home from './components/Home';
import About from './components/About';
import Footer from './components/Footer';
import {Navbar, NavItem, NavDropdown, Nav, MenuItem} from 'react-bootstrap';

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'


import './App.css';

import gatewayLogo from './assets/cryptogateway.png';

import Paywall from './components/Paywall';

class App extends Component {

    componentWillMount() {

    }

    render() {
        const self = this;

        return (
            <div className="App">

                <Navbar collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            {/*<a href="#brand">Rekeyed</a>*/}
                            <img src={gatewayLogo} className="header-bar-logo"/>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem eventKey={1} href="/">
                                Create an Account
                            </NavItem>
                            {/*<NavItem eventKey={2} href="/files">*/}
                                {/*Search Files*/}
                            {/*</NavItem>*/}
                            <NavItem eventKey={2} href="/about">
                                About Us
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Router>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/about" component={About}/>
                    </div>
                </Router>

                <Footer/>

                {/*All the user needs to add*/}
                <Paywall/>
            </div>
        );
    }
}

export default App;
