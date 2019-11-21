const { addFilesAction, clearFilesAction } = require("./store/actions");
const { dispatch } = require("./store");

exports.handleDrop = makeDispatchableHandler(dispatch, handleDrop);

exports.handleDragOver = (e) => {
    e.preventDefault();
};

exports.handleFileInputChange = makeDispatchableHandler(
    dispatch,
    handleFileInputChange
);

exports.clearSelectedFiles = makeDispatchableHandler(
    dispatch,
    clearSelectedFiles
);

function handleFileInputChange(e, dispatch) {
    e.preventDefault();
    const { files } = e.target;
    dispatch(addFilesAction(files));
}

function handleDrop(e, dispatch) {
    debugger;
    e.preventDefault();
    const { files } = e.dataTransfer;
    dispatch(addFilesAction(files));
}

function clearSelectedFiles(e, dispatch) {
    e.preventDefault();
    dispatch(clearFilesAction());
}

// util for passing dispatch function into event handlers
function makeDispatchableHandler(dispatch, handler) {
    return function dispatchableHandler(e) {
        handler(e, dispatch);
    };
}
