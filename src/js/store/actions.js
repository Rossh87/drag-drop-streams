const ADD_FILES = "ADD_FILES";
const CLEAR_FILES = "CLEAR_FILES";

exports.ADD_FILES = ADD_FILES;

exports.CLEAR_FILES = CLEAR_FILES;

exports.addFilesAction = function addFilesAction(files) {
    return {
        type: ADD_FILES,
        payload: files
    };
};

exports.clearFilesAction = function clearFilesAction() {
    return {
        type: CLEAR_FILES
    };
};
