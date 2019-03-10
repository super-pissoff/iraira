const GET_START = "party/GET_START";
const GET_SUCCESS = "party/GET_SUCCESS";
const GET_FAIL = "party/GET_FAIL";

const initialState = {
  item: {},
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_START:
      return {
        ...state,
        loading: true
      };
    case GET_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.body
      };
    case GET_FAIL:
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

export function set(body) {
  return {
    type: GET_SUCCESS,
    body
  };
}
