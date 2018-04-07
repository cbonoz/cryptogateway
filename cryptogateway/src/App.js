import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import plugin from './plugin'
import Home from "./components/Home";

class App extends Component {

    componentWillMount() {
        plugin.setup();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <Home/>
            </div>
        );
    }
}

export default App;
