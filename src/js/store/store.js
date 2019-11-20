exports.createStore = function createStore(reducer, initState = null) {
    let store = {};
    let connected = [];

    store = reducer(store, { type: "__INIT__" });

    return {
        dispatch(action) {
            store = reducer(store, action);
            connected.forEach((fn) => fn(store));
        },

        makeConnect(storeKey) {
            return function connect(node, updater) {
                connected.push(function runOnUpdate(store) {
                    updater(node, store[storeKey]);
                });
            };
        }
    };
};

exports.combineReducers = function combineReducers(reducers = {}) {
    return function(store, action) {
        const storeKeys = Object.keys(reducers);
        return storeKeys.reduce((newStore, storeKey) => {
            const currentStoreValue = store[storeKey];
            const reducer = reducers[storeKey];

            newStore[storeKey] = reducer(currentStoreValue, action);

            return newStore;
        }, {});
    };
};
