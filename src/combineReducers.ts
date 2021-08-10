import { Action, Reducer } from "./configureStore";

export function combineReducers(
  reducers: Record<string, Reducer<any, Action>>
) {
  return function combine(state: any, action: Action): Record<string, any> {
    return Object.keys(reducers).reduce((combineStore: any, key: string) => {
      combineStore[key] = reducers[key](state ? state[key] : undefined, action);
      return combineStore;
    }, {});
  };
}
