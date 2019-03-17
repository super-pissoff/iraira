const GET_START = "lang/GET_START";
const GET_SUCCESS = "lang/GET_SUCCESS";
const GET_FAIL = "lang/GET_FAIL";

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
