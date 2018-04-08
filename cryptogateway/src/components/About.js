/**
 * Created by cbuonocore on 3/16/18.
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

const About = createReactClass({
    render() {
        return (
            <div className="centered about-page">

                <div className="about-section centered">
                    <h1>How it Works</h1>

                    <p>
                        CryptoGateway is a freewebsite plugin that allows you to wrap your sensitive website content around a
                        crypto-based paywall.
                    </p>

                    <p>
                        A master account will automatically be generated for you which will store any funds sent
                        by your website visitors. Each customer will be mapped to a unique address which is used to
                        verify whether they have paid for website access or not. Authorization for paid visitors will
                        automatically be granted. Simply add the plugin and you are ready to go.
                    </p>

                </div>

            </div>
        );
    }
});

export default About;

