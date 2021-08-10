import { Action, configureStore } from "./configureStore";

describe("configureStore", () => {
  describe("public interface", () => {
    it("generates store with reducer", () => {
      const state = 2;
      const store = configureStore(() => state);
      expect(store.getState).toBeInstanceOf(Function);

      expect(store.dispatch).toBeInstanceOf(Function);
      expect(store.subscribe).toBeInstanceOf(Function);
      expect(store.subscribe(jest.fn())).toBeInstanceOf(Function);
    });
  });

  describe("functional interface", () => {
    it("returns state based on initial state", () => {
      const state = { name: "Bob" };
      expect(configureStore(() => null).getState()).toBe(undefined);
      expect(configureStore(() => null, state).getState()).toBe(state);
    });

    it("calculates new state with reducer call", () => {
      type State = { counter: number };
      const reducer = (state: State, action: Action) => {
        switch (action.type) {
          case "INCREMENT":
            return {
              ...state,
              counter: state.counter + 1,
            };
          case "DECREMENT":
            return {
              ...state,
              counter: state.counter - 1,
            };
          case "SET":
            return {
              ...state,
              counter: action.payload,
            };
          case "RESET":
            return {
              ...state,
              counter: 0,
            };
          default:
            return state;
        }
      };
      const store = configureStore(reducer, { counter: 0 });
      store.dispatch({ type: "INCREMENT" });
      expect(store.getState().counter).toBe(1);
      store.dispatch({ type: "INCREMENT" });
      expect(store.getState().counter).toBe(2);
      store.dispatch({ type: "DECREMENT" });
      expect(store.getState().counter).toBe(1);
      store.dispatch({ type: "SET", payload: 12 });
      expect(store.getState().counter).toBe(12);
      store.dispatch({ type: "RESET" });
      expect(store.getState().counter).toBe(0);
    });

    it("notifies listeners about updates", () => {
      const action1 = { type: "xxx" };
      const action2 = { type: "yyyy" };
      const reducer = jest.fn((state = 1) => state + 1);
      const store = configureStore(reducer);
      const spy = jest.fn();
      store.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();
      store.dispatch(action1);
      expect(spy).toHaveBeenCalled();
      store.dispatch(action2);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("allows to unsubscribe from the events", () => {
      const action1 = { type: "xxx" };
      const action2 = { type: "yyyy" };
      const reducer = jest.fn((state = 1) => state + 1);
      const store = configureStore(reducer);
      const spy = jest.fn();
      const unsubscribe = store.subscribe(spy);
      expect(spy).not.toHaveBeenCalled();
      store.dispatch(action1);
      expect(spy).toHaveBeenCalled();
      unsubscribe();
      store.dispatch(action2);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("replace reducer", () => {
      type State = { counter: number };
      const reducer = (state: State, action: Action) => {
        switch (action.type) {
          case "INCREMENT":
            return {
              ...state,
              counter: state.counter + 1,
            };
          default:
            return state;
        }
      };

      const reducer2 = (state: State, action: Action) => {
        switch (action.type) {
          case "INCREMENT":
            return {
              ...state,
              counter: state.counter + 2,
            };
          default:
            return state;
        }
      };

      const store = configureStore(reducer, { counter: 0 });
      store.dispatch({ type: "INCREMENT" });
      expect(store.getState().counter).toBe(1);
      store.replaceReducer(reducer2);
      store.dispatch({ type: "INCREMENT" });
      expect(store.getState().counter).toBe(3);
    });
  });
});
