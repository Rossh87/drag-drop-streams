const { updateFileInputDisplay, connectToFiles } = require("./domFunctions");

const {
    handleDrop,
    handleDrag,
    handleFileInputChange,
    clearSelectedFiles
} = require("./eventHandlers");

function init(select) {
    // get needed DOM nodes
    const dropzone = select(".file-input__display");
    const fileInputDisplayList = select(".file-input__file-list");
    const fileInputSelector = select(".file-input__select");
    const clearButton = select(".file-input__clear");

    // add drag-and-drop handlers to drop area
    dropzone.ondrop = handleDrop;
    dropzone.ondrag = (e) => e.preventDefault();

    // subscribe file input display to automatically update DOM content
    // on changes to 'files' property of store
    connectToFiles(fileInputDisplayList, updateFileInputDisplay);

    // dispatch a new file list whenever the contents of the file input
    // change
    fileInputSelector.addEventListener("change", handleFileInputChange);

    // clear all selected files when 'clear' button is clicked
    clearButton.addEventListener("click", clearSelectedFiles);
}

document.addEventListener("DOMContentLoaded", () =>
    init(document.querySelector.bind(document))
);
