import React from "react";
import { connect } from "react-redux";
import fetch from "isomorphic-unfetch";
import Signature from "../components/Signature";
import config from "../config";
import { set as setParty } from "../reducers/party";
import { sets as setReliefs } from "../reducers/relief";

function normalize(url) {
  let protocol = (url.match(/(http|https)\:\/\//) || [])[1];
  if (/\:443$/.test(url)) {
    protocol = protocol || "https";
  } else {
    protocol = "http";
  }
  return protocol + "://" + url.replace(/(\:80|\:443)$/, "");
}

const Home = props => (
  <Signature
    title={config.title}
    lead={"SUPER PISS OFF POINT"}
    button={"UPSET"}
    point={props.party.point}
    onChangePoint={point => {
      fetch(`${props.base}/apis/iraira/parties/${props.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          point
        })
      });
    }}
    reliefs={props.reliefs}
    onHelp={relief => {
      fetch("/api/help", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(relief)
      });
    }}
  />
);

const fetchParty = async ({ store, req, base, id }) => {
  const res = await fetch(`${base}/apis/iraira/parties/${id}`).then(res =>
    res.json()
  );
  store.dispatch(setParty(res));
};

const fetchReliefs = async ({ store, req, base, id }) => {
  const res = await fetch(
    `${base}/apis/iraira/reliefs?party=${id}&orderBy=-decrease`
  ).then(res => res.json());
  store.dispatch(setReliefs(res));
};

Home.getInitialProps = async ({ store, req, ...args }) => {
  const base = normalize(`${config.api.host}:${config.api.port}`);
  const id = config.api.id;
  await fetchParty({ store, req, base, id });
  await fetchReliefs({ store, req, base, id });

  return { base, id };
};

export default connect(
  state => ({
    party: state.party.item,
    reliefs: state.relief.items
  }),
  {}
)(Home);
