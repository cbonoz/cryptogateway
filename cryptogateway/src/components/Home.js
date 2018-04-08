import React from 'react';

import createReactClass from 'create-react-class';
import {Button, Grid, Row, Col, Modal} from 'react-bootstrap';

import gatewayLogo from '../assets/cryptogateway.png';
import businessLogo from '../assets/your_business.png';
import bcoinLogo from '../assets/bcoin_diamond.png';
import cosmosLogo from '../assets/cosmos_logo.png';
import bitcoinLogo from '../assets/bitcoin.png';

import WallAnimation from "./WallAnimation";

const Home = createReactClass({

    componentWillMount() {
        this.setState({
            showModal: false,
        });
    },

    handleShow() {
        this.setState({showModal: true});
    },

    handleClose() {
        this.setState({showModal: false});
    },

    getAccount() {
        console.log('getAccount');
    },

    render() {
        const self = this;
        return (
            <div className="home-page">
                <div className="banner-area">
                    <img src={gatewayLogo} className="centered header-logo"/>

                    <p className="header-text-h2">
                        Crypto-powered Website <span className="neo-green">Paywalls</span> for <b>Everyone.</b>
                    </p>
                    <p className="header-text-h3">
                        <b>No</b> programming experience required.
                    </p>
                </div>

                <Row className="show-grid wall-animation">
                    <Col xs={0} md={1}>
                    </Col>
                    <Col xs={12} md={7}>
                        {/*TODO: readd*/}
                        <WallAnimation/>
                    </Col>
                    <Col xs={12} md={3}>
                        <img src={businessLogo} className="business-logo"/>
                        {/*<p>Your Business Website</p>*/}
                    </Col>
                    <Col xs={0} md={1}>
                    </Col>
                </Row>

                <div className="centered">
                    <Button bsStyle="primary" className="create-button" onClick={() => self.handleShow()}>Download the
                        plugin</Button>
                </div>

                <hr/>

                <Grid>
                    <Row className="show-grid coin-row">
                        <Col xs={2} md={2}></Col>
                        <Col xs={8} md={2}>
                            <img className="img-responsive centered" src={bitcoinLogo}/>
                        </Col>
                        <Col xs={0} md={1}></Col>
                        <Col xs={8} md={2}>
                            <img className="img-responsive centered" src={bcoinLogo}/>
                        </Col>
                        <Col xs={0} md={1}></Col>
                        <Col xs={8} md={2}>
                            <img className="img-responsive centered" src={cosmosLogo}/>
                        </Col>
                        <Col xs={2} md={2}></Col>
                    </Row>
                </Grid>

                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title><b>Create a new Cryptogateway account</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>All you need is a username and password <br/>and we'll take care of the rest.</h4>

                        <p>An account will automatically be generated for you which will store any funds sent to you
                            by your website visitors. Each customer will be mapped to a unique address which is used to
                            verify
                            whether they have paid for website access or not.</p>
                        <hr/>
                    </Modal.Body>

                    <Modal.Footer>
                        <div>
                            <Button bsStyle="success" onClick={() => {
                                self.handleClose()
                            }}>Submit</Button>
                        </div>
                    </Modal.Footer>
                </Modal>


            </div>
        );
    }
});

export default Home;

