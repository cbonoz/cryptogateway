import React from 'react';
import createReactClass from 'create-react-class';
import {Button, Modal, OverlayTrigger, Popover, Tooltip} from "react-bootstrap";

const BASE_URL = "http://localhost:3001";
const DEFAULT_BLUR = 5;

const Paywall = createReactClass({

    componentWillMount() {
        this.setState({
            showModal: false,
            blur: true,
            sendPaymentTo: null,
        });

        const excludedUrls = this.props.excludedUrls || [];
        console.log(window.location.pathname, excludedUrls);
        if (!excludedUrls.includes(window.location.pathname)) {
            this.setState({authInterval: setInterval(this.checkAuth, this.props.authInterval || 100000)});
            this.checkAuth();
        }
    },

    checkAuth() {
        const self = this;
        // units in satoshi.
        const amount = self.props.amount || 500;
        const domain = self.props.customerDomain || 'www.example.com'
        const amountUnits = self.props.amountUnits || "Satoshi";
        const url = `${BASE_URL}/validate-pay/${domain}/${amount}`;
        console.log('checkAuth', url);

        fetch(url, {header: {
            'Access-Control-Allow-Origin':'*',
        }}).then(function (response) {
            console.log('response', response);
            return response.json();
        }).catch((error) => {
            console.log('error', error)
        }).then(function (res) {
            console.log('validate success', res);
            // Ok to proceed (remove the blur).
            self.handleClose();
        }).catch((err) => {
            console.error('validate failure', err);
            const status = err.response ? err.response.status : 500;
            const data = err.response ? err.response.data : {'sendPaymentTo': '<FAKE ADDRESS>'};
            console.log('status', status);
            switch (status) {
                case 500:
                case 404:
                case 400:
                case 403:
                    // Error from payment server, show the dialog.
                    const sendPaymentTo = data['sendPaymentTo'];
                    self.setState({sendPaymentTo: sendPaymentTo});
                    setTimeout(self.handleShow, 1000);
                    break;
                default:
                    // Close the dialog.
                    self.handleClose();
                    break;
            }
        });
    },

    handleClose() {
        this.setState({blur: 0, showModal: false})
    },

    handleShow() {
        this.setState({blur: this.props.blur || DEFAULT_BLUR, showModal: true})
    },

    render() {
        const self = this;
        const popover = (
            <Popover id="modal-popover" title="popover">
                very popover. such engagement
            </Popover>
        );
        const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;

        const blur = this.state.blur;

        return (
            <div>
                <div style={{WebkitFilter: `blur(${blur}px) saturate(2)`}}>
                    {this.props.children}
                </div>

                <Modal show={this.state.showModal}
                    // onHide={this.handleClose}
                >
                    <Modal.Header>
                        <Modal.Title><b>Producing Quality Content Costs Money.</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <p>Support quality journalism - no subscription necessary.</p>

                        <p>Send <b>{self.props.amount}</b> {self.props.amountUnits} to address:</p>

                        <h3>{self.state.sendPaymentTo}</h3>

                        <p>to continue reading.</p>

                        <Button bsStyle="success" className="wallet-button" onClick={() => {
                            self.handleClose()
                        }}>Go to Wallet</Button>

                        <hr />

                        {/*<h4>Popover in a modal</h4>*/}
                        {/*<p>*/}
                        {/*there is a{' '}*/}
                        {/*<OverlayTrigger overlay={popover}>*/}
                        {/*<a href="#popover">popover</a>*/}
                        {/*</OverlayTrigger>{' '}*/}
                        {/*here*/}
                        {/*</p>*/}

                        {/*<h4>Tooltips in a modal</h4>*/}
                        {/*<p>*/}
                        {/*there is a{' '}*/}
                        {/*<OverlayTrigger overlay={tooltip}>*/}
                        {/*<a href="#tooltip">tooltip</a>*/}
                        {/*</OverlayTrigger>{' '}*/}
                        {/*here*/}
                        {/*</p>*/}


                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <p className="centered">Powered by <b>CryptoGateway &copy;2018</b></p>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
});

export default Paywall;
