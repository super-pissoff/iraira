import { combineReducers } from "redux";
import relief from "./relief";
import party from "./party";
import lang from "./lang";

export default combineReducers({
  party,
  relief,
  lang
});
