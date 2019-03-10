/* eslint-disable react/no-danger, no-mixed-operators */
import React, { Component } from "react";
import styled, { keyframes } from "styled-components";

class Smoke extends Component {
  componentDidMount() {
    const { Application, Graphics, Filter } = window.PIXI;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const app = new Application({
      width,
      height,
      antialias: true,
      resolution: 1
    });

    document.getElementById("smoke").appendChild(app.view);

    const stage = app.stage;

    const smokeShader = new Filter(
      // Vertex Shader Text
      null,
      // Fragment Shader Text
      document.getElementById("fragShader").innerHTML,
      // Uniforms
      {
        u_resolution: { type: "v2", value: [width, height] },
        u_time: { type: "1f", value: 0 }
      }
    );

    const shape = new Graphics();
    shape
      .beginFill(0xffffff)
      .drawRect(0, 0, width, height)
      .endFill();

    shape.width = width;
    shape.height = height;
    shape.filters = [smokeShader];
    stage.addChild(shape);

    app.ticker.add(() => {
      smokeShader.uniforms.u_time += this.props.point / 100000 + 0.01;
    });
  }

  render() {
    return (
      <Container>
        <script
          id="fragShader"
          type="shader-code"
          dangerouslySetInnerHTML={{
            __html: `
            precision mediump float;
            uniform vec2 u_resolution;
            uniform float u_time;

            float rand(vec2 n) {
              return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }

            float noise(vec2 n) {
              const vec2 d = vec2(0.0, 1.0);
              vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
              return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
            }

            float fbm(vec2 n) {
              float total = 0.0, amplitude = 1.0;
              for (int i = 0; i < 4; i++) {
                total += noise(n) * amplitude;
                n += n;
                amplitude *= 0.5;
              }
              return total;
            }

            void main() {
              const vec3 c1 = vec3(124.0/255.0, 0.0/255.0, 0.0/255.0);
              const vec3 c2 = vec3(173.0/255.0, 0.0/255.0, 0.0/255.0);
              const vec3 c3 = vec3(2.2, 0.0, 0.0);
              const vec3 c4 = vec3(164.0/255.0, 1.0/255.0, 0.0/255.0);
              const vec3 c5 = vec3(0.1);
              const vec3 c6 = vec3(0.9);

              vec2 speed = vec2(0.1, 0.4);
              float shift = 1.6;

              vec2 p = gl_FragCoord.xy * 8.0 / u_resolution.xx;
              float q = fbm(p - u_time * 0.1);
              vec2 r = vec2(fbm(p + q + u_time * speed.x - p.x - p.y), fbm(p + q - u_time * speed.y));
              vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
              float grad = gl_FragCoord.y / u_resolution.y;

              gl_FragColor = vec4(c * cos(shift * gl_FragCoord.y / u_resolution.y), 1.0);
              gl_FragColor.xyz *= 1.0-grad;
            }
          `
          }}
        />
        <Bg id="smoke" />
      </Container>
    );
  }
}

const fadein = keyframes`
from {
  opacity: 0;
}
to {
  opacity: 0.7;
}
`;
const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: ${fadein} 5s;
  animation-fill-mode: forwards;
`;
const Bg = styled.div.attrs({
  id: "smoke"
})`
  width: 100%;
  height: 100%;
`;

export default Smoke;
