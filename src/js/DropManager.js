// handlers and convenience methods to setting up file drag-and-drop
// in the DOM
class DropManager {
    // accepts instance of UIFileList as param
    constructor(fileManager, DOMSelector) {
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this._fileManager = fileManager;
        this.DOMSelector = DOMSelector;
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        // NB: files is instance of browser's FileList constructor, not
        // a true array
        var files = e.dataTransfer.files;
        this._fileManager.addFiles(files);
    }

    setDropTarget(selector) {
        const dropTarget = this.DOMSelector(selector);
        dropTarget.ondrop = this.handleDrop;
        dropTarget.ondragover = this.handleDragOver;
    }
}

module.exports = DropManager;
