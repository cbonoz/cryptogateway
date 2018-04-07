/**
 * Created by cbuonocore on 3/16/18.
 */

import React from 'react';

import createReactClass from 'create-react-class';
import {Jumbotron, Button, Grid, Row, Col} from 'react-bootstrap';


import gatewayLogo from '../assets/cryptogateway.png';
import businessLogo from '../assets/your_business.png';

import api from '../helpers/api';
import WallAnimation from "./WallAnimation";

const MAX_BLOCKS = 15;

const Home = createReactClass({

    componentWillMount() {
        console.log(api.BASE_URL);
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
                        Crypto-powered Website Paywalls for <b>Everyone.</b>
                    </p>
                    <p className="header-text-h3">
                        <b>No</b> programming experience required.
                    </p>
                </div>

                <Row className="show-grid wall-animation">
                    <Col xs={0} md={1}>
                    </Col>
                    <Col xs={12} md={8}>
                        {/*TODO: readd*/}
                        {/*<WallAnimation/>*/}
                    </Col>
                    <Col xs={12} md={2}>
                        <img src={businessLogo} className="business-logo"/>
                    </Col>
                    <Col xs={0} md={1}>
                    </Col>
                </Row>


                <p>
                    <Button bsStyle="primary" className="create-button" onClick={() => self.getAccount()}>Download the plugin</Button>
                </p>


                <Grid>
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

