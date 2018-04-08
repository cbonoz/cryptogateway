import React from 'react';
import createReactClass from 'create-react-class';
import {Button, Modal, OverlayTrigger, Popover, Tooltip} from "react-bootstrap";

const BASE_URL = "http://localhost:3001";
const DEFAULT_BLUR = 5;

const Paywall = createReactClass({

    componentWillMount() {
        this.setState({
            paymentReceived: false,
            showModal: false,
            blur: 0,
            sendPaymentTo: null,
        });

        const onClick = this.props.onClick === true;
        const disabled = this.props.disabled === true;
        const excludedUrls = this.props.excludedUrls || [];
        console.log(window.location.pathname, excludedUrls);
        if (!disabled && !excludedUrls.includes(window.location.pathname)) {
            if (onClick) {
                this.setState({blur: this.props.blur || DEFAULT_BLUR});
            } else {
                this.setState({authInterval: setInterval(this.checkAuth, this.props.authInterval || 100000)});
                this.checkAuth();
            }
        }
    },

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response);
        }
        return response;
    },

    checkAuth() {
        const self = this;
        // units in satoshi.
        const amount = self.props.amount || 0;
        const publisher = self.props.domain.replace(/[\.\/]/g, "_");
        const url = `${BASE_URL}/validate-pay/${publisher}/${amount}`;
        console.log('checkAuth', url);

        fetch(url, {
            credentials: 'include',
            header: {
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then(response =>
                response.json().then(data => ({
                    data: data,
                    status: response.status
                })))
            .then(function (res) {
                console.log('validate success', res);
                const status = res.status;
                const data = res.data;
                console.log('status', status);
                switch (status) {
                    case 500:
                    case 404:
                    case 400:
                    case 403:
                        // Error from payment server, show the dialog.
                        const sendPaymentTo = data['sendPaymentTo'];
                        self.setPaymentNeeded(sendPaymentTo);
                        break;
                    default:
                        self.receivedPayment();
                        break;
                }
            }).catch((err) => {
            console.error('validate failure, allowing user through', JSON.stringify(err));
            self.handleClose();
        });
    },

    // Show payment required.
    setPaymentNeeded(address) {
        const self = this;
        self.setState({sendPaymentTo: address});
        setTimeout(self.handleShow, 1000);
    },

    // Close the dialog.
    receivedPayment() {
        const self = this;
        if (self.state.blur > 0) {
            // Show payment received text.
            self.setState({paymentReceived: true});
        }
        setTimeout(self.handleClose, 1000);
    },

    checkAuthManual() {
        console.log('checkAuthManual');
        if (this.props.onClick === true) {
            this.checkAuth();
        }
    },

    handleClose() {
        this.setState({blur: 0, showModal: false})
    },

    handleShow() {
        this.setState({blur: this.props.blur || DEFAULT_BLUR, showModal: true, paymentReceived: false})
    },

    render() {
        const self = this;
        const popover = (
            <Popover id="modal-popover" title="popover">
                Get automatic access once payment/transaction confirmed.
            </Popover>
        );

        const blur = this.state.blur;

        return (
            <div>
                <div style={{WebkitFilter: `blur(${blur}px) saturate(2)`, cursor: 'pointer'}}
                     onClick={() => self.checkAuthManual()}>
                    {this.props.children}
                </div>

                <Modal show={this.state.showModal} // onHide={this.handleClose}
                >
                    <Modal.Header>
                        <Modal.Title><b>Producing Quality Content Costs Money.</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="centered">
                            <h4>Support quality journalism - no subscription necessary.</h4>
                        </div>

                        <hr/>

                        {self.props.amount > 0 && <div>
                            <p>Send <b>{self.props.amount}</b> {self.props.amountUnits} to address:</p>
                            <OverlayTrigger overlay={popover}>
                                <h3><b>{self.state.sendPaymentTo}</b></h3>
                            </OverlayTrigger>
                            <p>to continue reading.</p>
                        </div>}

                        {self.props.amount == 0 && <p>This page is free to view! Click authorize to continue</p>}

                        <Button
                            bsStyle="success"
                            className="wallet-button"
                            onClick={() => {
                                self.receivedPayment()
                            }}>
                            Authorize Payment of {self.props.amount} {self.props.amountUnits}
                        </Button>
                        <p className="small-text italics">access: {self.props.domain}</p>

                        {this.state.paymentReceived &&
                        <p className="neo-green">Thanks for your Payment! One moment...</p>}
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
