export type Reducer<State, Action> = (
  state: State | undefined,
  action: Action
) => State;

type SetCb = Set<() => void>;

export interface Action {
  type: string;
  [key: string]: any;
}

export type Store<State = any> = {
  getState(): State;
  dispatch(action: Action): any;
  subscribe(cb: () => void): () => void;
  replaceReducer(newReducer: Reducer<State, Action>): void;
};

export type ConfigureStore<State> = (
  reducer: Reducer<State, Action>,
  initialState?: State | undefined
) => Store<State>;

export function configureStore<State>(
  reducer: Reducer<State, Action>,
  initialState?: State
): Store {
  let state = initialState;
  const subscribeFunctions: SetCb = new Set();

  return {
    getState(): State {
      return state;
    },

    dispatch(action: Action): void {
      state = reducer(state, action);
      subscribeFunctions?.forEach((cb) => {
        cb();
      });
    },

    subscribe(cb: () => void): () => void {
      subscribeFunctions.add(cb);
      return () => {
        subscribeFunctions.delete(cb);
      };
    },

    replaceReducer(newReducer: Reducer<State, Action>): void {
      reducer = newReducer;
    },
  };
}
