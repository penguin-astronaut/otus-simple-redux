export function combineReducers(reducers: Record<string, any>) {
  return function(state: any, action: any) {
    return Object.keys(reducers).reduce((prev: any, key: string) => {
      prev[key] = reducers[key](state ? state[key] : undefined, action);
      return prev;
    }, {});
  }
}