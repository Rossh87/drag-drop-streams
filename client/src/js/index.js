// class for DOM node wrapper that subscribes it to changes to selected files
const FileDisplayManager = require("./FileDisplayManager");

// class for data structure that manages list of currently-selected files
const FileList = require("./FileList");

const DropManager = require("./DropManager");

function init(selector) {
    const fileDisplayManager = new FileDisplayManager(selector);
    const fileList = new FileList(selector);
    const dropManager = new DropManager(fileList, selector);

    // Display manager subscribes to updates from fileList data structure
    fileDisplayManager.subscribe(fileList);

    // setup the drop zone for drag-and-drop functionality
    dropManager.setDropTarget(".file-input__display");

    // select inputs on page to listen to for selected files
    fileList.setFileInputSources(".file-input__select");

    // select element on page to clear selected files
    fileList.setClearFiles(".file-input__clear");

    // select display element for selected files
    fileDisplayManager.setFileDisplayElement(".file-input__file-list");
}

document.addEventListener("DOMContentLoaded", () =>
    init(document.querySelector.bind(document))
);
