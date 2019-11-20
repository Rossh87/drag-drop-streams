// delete all child nodes of node
function removeChildren(node) {
    let child = node.firstChild;
    while (child) {
        child.remove();
        child = node.firstChild;
    }
}

exports.handleDrop = function handleDrop(e) {
    e.preventDefault();
    // NB: files is instance of browser's FileList constructor, not
    // a true array
    var files = e.dataTransfer.files;
    this._fileManager.addFiles(files);
};

// Callback that will be passed to store's 'connect' fn.
// UI updater that automatically triggers when store data changes.
exports.updateFileInputDisplay = function updateFileInputDisplay(node, files) {
    removeChildren(node);
    files.forEach((file) => {
        const li = document.createElement("li");
        const fileName = document.createTextNode(file.name);
        li.appendChild(fileName);
        node.appendChild(li);
    });
};

// util for passing dispatch function into event handlers
// possibly this should be moved into store
exports.makeDispatchableHandler = function makeDispatchableHandler(
    dispatch,
    handler
) {
    return function dispatchableHandler(e) {
        handler(e, dispatch);
    };
};
