import { combineReducers } from "./combineReducers";
import { configureStore, Reducer } from "./configureStore";

describe("combineReducers", () => {
  it("returns a reducer based on the config (initial state)", () => {
    const reducer = combineReducers({
      a: (state = 2, action: any) => state,
      b: (state = "hop", action: any) => state,
    });
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      a: 2,
      b: "hop",
    });
  });

  it("calls subreducers with proper values", () => {
    type State = { counter: number; todos: string[]};
    const counterReducer = (state: number, action: {type: string, payload?: number}) => {
      switch(action.type) {
        case "INCREMENT":
          return state + 1;
        default:
          return state;
      }
    }
    const todosReducer = (state: string[], action: {type: string, payload?: string}) => {
      switch(action.type) {
        case "ADD_TODO":
          return state.concat(action.payload);
        default:
          return state;
      }
    }
    const reducer = combineReducers({counter: counterReducer, todos: todosReducer});
    const store = configureStore(reducer, {counter: 0, todos: []})
    store.dispatch({type: 'ADD_TODO', payload: 'test'})
    store.dispatch({type: 'INCREMENT'})
    expect(store.getState()).toEqual({counter: 1, todos: ['test']})
  })
});
