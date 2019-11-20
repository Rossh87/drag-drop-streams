const { fileReducer } = require("./fileReducer");
const { createStore, combineReducers } = require("./store");

const rootReducer = combineReducers({
    files: fileReducer
});

const store = createStore(rootReducer);

module.exports = store;
