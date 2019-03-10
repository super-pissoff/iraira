const GETS_START = "relief/GETS_START";
const GETS_SUCCESS = "relief/GETS_SUCCESS";
const GETS_FAIL = "relief/GETS_FAIL";

const initialState = {
  items: [],
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GETS_START:
      return {
        ...state,
        loading: true
      };
    case GETS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: action.body.items
      };
    case GETS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.err
      };
    default:
      return state;
  }
}

export function sets(body) {
  return { type: GETS_SUCCESS, body };
}
