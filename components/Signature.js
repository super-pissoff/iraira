/* eslint-disable no-mixed-operators */
import React, { Component } from "react";
import styled, { keyframes, css } from "styled-components";
import Head from "next/head";
import Smoke from "./Smoke";
import Explode from "./Explode";

const DEFAULT_RELIEF = {
  decrease: 0
};

class Signature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      point: props.point,
      shaking: false,
      helping: false,
      exploded: false,
      open: false,
      power: 0,
      reliefs: props.reliefs.filter(relief => props.point >= relief.decrease),
      relief:
        props.reliefs.find(relief => props.point >= relief.decrease) ||
        DEFAULT_RELIEF
    };
    this.keepPress = this.keepPress.bind(this);
    this.help = this.help.bind(this);
    this.select = this.select.bind(this);
    this.toggle = this.toggle.bind(this);
    this.resetHelp = this.resetHelp.bind(this);
    this.leavePress = this.leavePress.bind(this);
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  select(relief) {
    this.setState({
      relief
    });
  }

  help() {
    const point = this.state.point - this.state.relief.decrease;
    const relief = this.state.relief;
    const reliefs = this.props.reliefs.filter(
      relief => point >= relief.decrease
    ) || [DEFAULT_RELIEF];

    this.setState(
      {
        helping: true,
        point,
        reliefs,
        relief:
          reliefs.find(_relief => this.state.relief.id === _relief.id) ||
          reliefs[0] ||
          DEFAULT_RELIEF
      },
      () => {
        this.props.onChangePoint(point);
        if (relief.place) {
          this.props.onHelp(relief);
        }
      }
    );
  }

  resetHelp() {
    this.setState({ helping: false });
  }

  keepPress() {
    this.setState({
      shaking: true,
      power: 0
    });
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.setState({
        point: this.state.point + 1 + Math.round(this.state.power / 20),
        power: this.state.power + 1
      });
    }, 50);
  }

  leavePress() {
    clearInterval(this.interval);
    this.interval = undefined;
    const point = this.state.point + this.state.power * 2;
    const reliefs = this.props.reliefs.filter(
      relief => point >= relief.decrease
    ) || [DEFAULT_RELIEF];

    this.setState(
      {
        shaking: false,
        exploded: true,
        point,
        reliefs,
        relief:
          reliefs.find(relief => this.state.relief.id === relief.id) ||
          reliefs[0] ||
          DEFAULT_RELIEF
      },
      () => {
        this.props.onChangePoint(this.state.point);
      }
    );
  }

  render() {
    return (
      <Container>
        <Head>
          <title>{this.props.title}</title>
        </Head>
        <Smoke
          point={
            this.state.shaking ? 10000 + this.state.point : this.state.point
          }
        />
        {!this.state.shaking && this.state.exploded ? (
          <Explode power={this.state.power} />
        ) : null}
        <Bg />
        <Main>
          <div className={this.state.shaking ? "shake-hard" : ""}>
            <Button
              shaking={this.state.shaking}
              onMouseDown={this.keepPress}
              onTouchStart={this.keepPress}
              onMouseUp={this.leavePress}
              onTouchEnd={this.leavePress}
            >
              {this.props.button}
            </Button>
          </div>
          <Point>{this.state.point}</Point>
          <Lead>{this.props.lead}</Lead>
        </Main>
        <div>
          <Places onClick={this.toggle}>
            <Place open>
              <Option>
                {this.state.relief.place}
                {this.state.relief.place ? (
                  <i className="fa fa-caret-down" />
                ) : null}
              </Option>
            </Place>
            {this.state.reliefs
              .filter(relief => relief.id !== this.state.relief.id)
              .map((relief, index) => (
                <Place key={relief.id} open={this.state.open} index={index}>
                  <Option onClick={() => this.select(relief)}>
                    {relief.place}
                  </Option>
                </Place>
              ))}
          </Places>
          <Ambulance
            helping={this.state.helping}
            onClick={this.help}
            onAnimationEnd={this.resetHelp}
          >
            <i className="fa fa-ambulance" />
          </Ambulance>
        </div>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Main = styled.div`
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 80%;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const fadein = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 0.1;
  }
`;

const Bg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: ${fadein} 5s;
  animation-fill-mode: forwards;
`;

const shaking = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.8);
  }
`;

const explode = keyframes`
  0% {
    transform: scale(0.5);
  }
  80% {
    transform: scale(1.5);
  }
  90% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
`;

const wave = keyframes`
  0% {
    box-shadow: 0 0 10px #ff0808;
  }
  50% {
    box-shadow: 0 0 30px #ff0808;
  }
  100% {
    box-shadow: 0 0 10px #ff0808;
  }
`;

const Button = styled.button`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  color: #f5f5f5c2;
  text-shadow: 0px 0px 10px #ffffff;
  border: none;
  background-color: #da314b;
  font-size: 50px;
  outline: none;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${wave} 5s infinite;
  transition-property: transform;
  transition-duration: 0.5s;
  transform: scale(1);
  box-shadow: 0 0 30px #ff0808;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  animation: ${props =>
    props.shaking
      ? css`
          ${shaking} 1s forwards
        `
      : css`
          ${explode} 0.4s forwards
        `};
`;
const Point = styled.h1`
  color: #f5f5f5c2;
  text-shadow: 0px 0px 10px #ffffff;
  text-align: center;
`;
const Lead = styled.h2`
  color: #f5f5f5c2;
  text-shadow: 0px 0px 10px #ffffff;
  text-align: center;
`;

const help = keyframes`
0% {
  transform: translateX(0);
}
50% {
  transform: translateX(10px) scale(0.7);
  color: #ff0808;
  text-shadow: 0 0 5px #ff0808;
}
80% {
  transform: translateX(-100vw);
  color: #ff0808;
  text-shadow: 0 0 5px #ff0808;
}
80.1% {
  transform: translateX(100px);
  color: #ff0808;
  text-shadow: 0 0 5px #ff0808;
}
95% {
  transform: translateX(100px);
  color: #ff0808;
  text-shadow: 0 0 5px #ff0808;
}
100% {
  transform: translateX(0);
}`;

const Ambulance = styled.button`
  color: #f5f5f5c2;
  text-shadow: 0px 0px 10px #ffffff;
  text-align: center;

  position: absolute;
  top: 60px;
  right: 20px;
  outline: none;
  background: none;
  border: none;
  font-size: 30px;
  color: #f5f5f5c2;
  text-shadow: 0px 0px 5px #ffffff;
  animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
  animation: ${props =>
    props.helping
      ? css`
          ${help} 5s forwards
        `
      : ""};
`;

const Places = styled.ul`
  position: absolute;
  top: 20px;
  right: 20px;
  list-style-type: none;
  z-index: 1;
`;

const Place = styled.li`
  font-size: 20px;
  color: #f5f5f5c2;
  text-shadow: 0px 0px 5px #ffffff;
  cursor: pointer;
  display: ${props => (props.open ? "block" : "none")};
  background: #000000c0;
  transform: rotateY(90deg);
  animation: ${props =>
    props.open
      ? css`
          ${screw} 0.2s forwards
        `
      : ""};
  animation-delay: ${props => props.index * 0.1}s;
`;

const screw = keyframes`
  0% {
    transform: rotateY(90deg);
    opacity: 0;
  }
  100% {
    transform: rotateY(360deg);
    opacity: 1;
  }
`;

const Option = styled.a``;

export default Signature;
