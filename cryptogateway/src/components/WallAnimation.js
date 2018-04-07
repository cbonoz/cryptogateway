/**
 * Created by cbuonocore on 4/7/18.
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import {Stage, Layer, Rect, Text} from "react-konva";
import * as Konva from "konva";

const PARTICLE_SIZE = 5;
const PARTICLE_INTERVAL = 600;
const PARTICLE_SPEED = 3;

class ColoredRect extends React.Component {
    //
    // state = {
    //     color: 'green',
    // };

    componentWillMount() {
        this.setState({
            color: Konva.Util.getRandomColor()
        })
    }

    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };

    render() {
        const self = this;
        return (
            <Rect
                x={self.props.x}
                y={self.props.y}
                width={self.props.width}
                height={self.props.height}
                fill={this.state.color}
                shadowBlur={5}
                onClick={this.handleClick}
            />
        );
    }
}

const WallAnimation = createReactClass({

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    createParticle() {
        const self = this;
        const newelement = [0, self.getRandomInt(0, self.state.height)];
        self.setState({
            particles: [...self.state.particles, newelement]
        });
    },

    particleLoop() {
        const self = this;
        let particles = self.state.particles;
        particles = particles.filter((p) => p[0] < self.state.width);
        const newParticles = particles.map((p) => {
            return [p[0] + PARTICLE_SPEED, p[1]]
        });
        self.setState({particles: newParticles});
        console.log('particles: ', newParticles);


        self.updateWallHeight();

    },

    updateWallHeight() {
        const newHeight = Math.min(this.state.wallHeight + 1, this.state.height);
        this.setState({wallHeight: newHeight});
        console.log('wallHeight', this.state.wallHeight, this.state.height)
    },

    componentWillMount() {
        const self = this;
        const width = this.props.width || Math.min(800, window.innerWidth);

        self.setState({
            particles: [],
            height: this.props.height || 300,
            width: width,
            wallPosition: width * .9,
            wallHeight: 0
        });

        setInterval(self.particleLoop, 15);
        setInterval(self.createParticle, PARTICLE_INTERVAL);
    },

    render() {
        const self = this;

        const particles = self.state.particles;
        const height = self.state.height;
        const width = self.state.width;

        return (
            <div className="wall-animation">
                <Stage width={width} height={height}>
                    {particles.map((particle, i) => {
                        return <Layer key={i}>
                            <ColoredRect
                                x={particle[0]}
                                y={particle[1]}
                                width={PARTICLE_SIZE}
                                height={PARTICLE_SIZE}/>
                        </Layer>
                        })}
                    <Layer>
                    <ColoredRect x={self.state.wallPosition} y={0}
                                 width={100}
                                 height={self.state.wallHeight}/>
                    </Layer>

                </Stage>
            </div>
        );
    }
});

export default WallAnimation;

