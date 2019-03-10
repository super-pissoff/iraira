/* eslint-disable react/no-danger, no-mixed-operators, no-param-reassign, no-new, func-names */
import React, { Component } from "react";
import styled from "styled-components";

class Explode extends Component {
  componentDidMount() {
    const power = this.props.power * 10;
    const p5 = window.p5;
    const sketch = function(p) {
      class Particle {
        constructor(pos, v) {
          this.pos = pos;
          this.vel = v;
          this.weight = 4;
        }

        step() {
          this.vel.add(this.vel.x / 10, this.vel.y / 10);
          this.pos.add(this.vel);
          this.weight -= 0.005;
        }

        draw() {
          p.point(this.pos.x, this.pos.y);
          p.strokeWeight(this.weight);
        }
      }

      let particles;

      p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(0);
        p.ellipseMode(p.RADIUS);
        p.stroke(218, 49, 75);
        p.strokeWeight(5);
        p.noFill();

        particles = [];
        for (let i = 0; i < power; i += 1) {
          particles.push(
            new Particle(
              p.createVector(p.width * 0.5, p.height * 0.35),
              p5.Vector.random2D().mult(p.random(6))
            )
          );
        }
      };

      p.draw = function() {
        p.background(0);
        particles.forEach(_p => _p.step());
        particles.forEach(_p => _p.draw());
      };
    };
    new p5(sketch, "explode");
  }

  render() {
    return <Container id="explode" />;
  }
}

const Container = styled.div.attrs({
  id: "explode"
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: fadeout 3s;
  animation-fill-mode: forwards;

  @keyframes fadeout {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export default Explode;
