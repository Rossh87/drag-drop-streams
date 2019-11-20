const actions = require("./actions");

exports.fileReducer = function fileReducer(state = [], action) {
    switch (action.type) {
        case actions.ADD_FILES:
            return [...state, ...action.payload].filter(
                makeCacheFilter("name")
            );

        case actions.CLEAR_FILES:
            return [];

        default:
            return state;
    }
};

function makeCacheFilter(uniqueKey) {
    const cache = new Set();

    return function constructedFilter(el, idx, inputArr) {
        if (cache.has(el[uniqueKey])) {
            return false;
        }

        cache.add(el[uniqueKey]);
        return true;
    };
}
