export type Store<State = any, Action = { type: string }> = {
  getState(): State;
  dispatch(action: Action): any;
  subscribe(cb: () => void): () => void;
};

export type Reducer<State, Action> = (
  state: State | undefined,
  action: Action
) => State;
export type ConfigureStore<State, Action> = (
  reducer: Reducer<State, Action>,
  initialState?: State | undefined
) => Store<State, Action>;

type ArrayCb = (() => void)[];

export function configureStore<State, Action>(
  reducer: Reducer<State, Action>,
  initialState?: State
) {
  let state = initialState;
  let subscribeFunctions: ArrayCb = [];

  return {
    getState(): State {
      return state;
    },

    dispatch(action: Action): void {
      state = reducer(state, action);
      subscribeFunctions.forEach((cb) => {
        cb();
      });
    },

    subscribe(cb: () => void): () => void {
      subscribeFunctions.push(cb);
      return () => {
        subscribeFunctions = subscribeFunctions.filter((cbEx) => cbEx !== cb);
      };
    },

    replaceReducer(newReducer: Reducer<State, Action>): void {
      reducer = newReducer;
    },
  };
}
