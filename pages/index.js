import React from "react";
import { connect } from "react-redux";
import fetch from "isomorphic-unfetch";
import Signature from "../components/Signature";
import config from "../config";
import { parse } from "url";
import { set as setLang } from "../reducers/lang";
import { set as setParty } from "../reducers/party";
import { sets as setReliefs } from "../reducers/relief";

const Home = props => (
  <Signature
    title={config.title}
    lead={props.lang.lead}
    button={props.lang.button}
    point={props.party.point}
    onChangePoint={point => {
      fetch(`${config.api.base}/apis/iraira/parties/${props.id}`, {
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

const fetchLang = async ({ store, req, lang }) => {
  const defaults = {
    lead: "SUPER PISS OFF POINT",
    button: "UPSET"
  };
  const res = await fetch(`${config.origin}/api/lang?lang=${lang}`).then(
    res => (res.ok ? res.json() : defaults),
    () => defaults
  );
  store.dispatch(setLang(res));
};

const fetchParty = async ({ store, req, id }) => {
  const res = await fetch(`${config.api.base}/apis/iraira/parties/${id}`).then(
    res => res.json()
  );
  store.dispatch(setParty(res));
};

const fetchReliefs = async ({ store, req, id }) => {
  const res = await fetch(
    `${config.api.base}/apis/iraira/reliefs?party=${id}&orderBy=-decrease`
  ).then(res => res.json());
  store.dispatch(setReliefs(res));
};

Home.getInitialProps = async ({ store, req, query: { lang }, ...args }) => {
  const id = config.api.id;
  await fetchLang({ store, req, lang });
  await fetchParty({ store, req, id });
  await fetchReliefs({ store, req, id });

  return { id };
};

export default connect(
  state => ({
    lang: state.lang.item,
    party: state.party.item,
    reliefs: state.relief.items
  }),
  {}
)(Home);
