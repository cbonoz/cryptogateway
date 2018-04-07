/**
 * Created by cbuonocore on 3/16/18.
 */

import React from 'react';
import createReactClass from 'create-react-class';
import cosmosLogo from '../assets/cosmos.png'

const Footer = createReactClass({
    render() {
        return (
            <div>
                <p className="centered footer">Powered by the
                    <span className="cosmos-green">
                        <img src={cosmosLogo} className="cosmos-logo"/>
                    </span>
                    Blockchain</p>
            </div>
        );
    }
});

export default Footer;

