import React from 'react';

import createReactClass from 'create-react-class';
import {Button, Grid, Row, Col} from 'react-bootstrap';

import gatewayLogo from '../assets/cryptogateway.png';
import businessLogo from '../assets/your_business.png';
import bcoinLogo from '../assets/bcoin_diamond.png';
import cosmosLogo from '../assets/cosmos_logo.png';
import bitcoinLogo from '../assets/bitcoin.png';

import WallAnimation from "./WallAnimation";

const Home = createReactClass({

    componentWillMount() {
        this.setState({
            files: [],
            blockFiles: []
        });

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
                        {/*<WallAnimation/>*/}
                    </Col>
                    <Col xs={12} md={3}>
                        <img src={businessLogo} className="business-logo"/>
                        {/*<p>Your Business Website</p>*/}
                    </Col>
                    <Col xs={0} md={1}>
                    </Col>
                </Row>

                <div className="centered">
                    <Button bsStyle="primary" className="create-button" onClick={() => self.getAccount()}>Download the
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
                    <Row className="show-grid">
                        <Col xs={12} md={5}>
                            {/*Column 1 content*/}
                        </Col>
                        <Col xs={12} md={7}>
                            {/*Column 2 content*/}
                        </Col>
                    </Row>
                </Grid>

            </div>
        );
    }
});

export default Home;

