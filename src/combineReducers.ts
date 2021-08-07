import { Reducer } from "./configureStore";

interface State {
  [key: string]: any;
}

export function combineReducers<Action>(
  reducers: Record<string, Reducer<State, Action>>
): (state: State, action: Action) => State {
  return function inner(state: State, action: Action) {
    return Object.keys(reducers).reduce((prev: Partial<State>, key: string) => {
      prev[key] = reducers[key](state ? state[key] : undefined, action);
      return prev;
    }, {});
  };
}
