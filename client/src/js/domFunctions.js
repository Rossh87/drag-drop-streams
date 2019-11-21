const { makeConnect } = require("./store");

exports.connectToFiles = makeConnect("files");

// Callback that will be passed to store's 'connect' fn.
// UI updater that automatically triggers when store data changes.
// TODO: curry this out so the updater and connector fn can be combined
// into a fn that accepts only a node
exports.updateFileInputDisplay = function updateFileInputDisplay(node, files) {
    removeChildren(node);
    files.forEach((file) => {
        const li = document.createElement("li");
        const fileName = document.createTextNode(file.name);
        li.appendChild(fileName);
        node.appendChild(li);
    });
};

// delete all child nodes of node
function removeChildren(node) {
    let child = node.firstChild;
    while (child) {
        child.remove();
        child = node.firstChild;
    }
}
