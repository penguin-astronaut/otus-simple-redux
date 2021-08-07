export type Reducer<State, Action> = (
  state: State | undefined,
  action: Action
) => State;
export type Store<State = any, Action = any> = {
  getState(): State;
  dispatch(action: Action): any;
  subscribe(cb: () => void): () => void;
  replaceReducer(newReducer: Reducer<State, Action>): void;
};
export type ConfigureStore<State, Action> = (
  reducer: Reducer<State, Action>,
  initialState?: State | undefined
) => Store<State, Action>;

type ArrayCb = (() => void)[];

export function configureStore<State, Action>(
  reducer: Reducer<State, Action>,
  initialState?: State
): Store {
  let state = initialState;
  let subscribeFunctions: ArrayCb = [];

  return {
    getState(): State {
      return state;
    },

    dispatch(action: Action): any {
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
