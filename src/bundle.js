(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
class FileDisplayManager extends EventTarget {
    constructor(DOMSelector) {
        super();
        this.DOMSelector = DOMSelector;
        const updateDOM = this.updateDOMOnDataEvent.bind(this);
        this.addEventListener("UIFileListUpdate", updateDOM);
        this.displayElement = null;
    }

    removeChildren() {
        let child = this.displayElement.firstChild;

        while (child) {
            child.remove();
            child = this.displayElement.firstChild;
        }
    }

    updateDOMOnDataEvent(e) {
        if (!this.displayElement) {
            throw new Error(
                "Must select display element before adding files to DOM"
            );
        }

        this.removeChildren();

        const files = e.detail;

        files.forEach((file) => {
            this.displayElement.appendChild(createFileListItem(file));
        });

        function createFileListItem(file) {
            const fileEl = document.createElement("li");
            fileEl.textContent = `${file.name}`;
            return fileEl;
        }
    }

    subscribe(publisher) {
        publisher.addSubscriber(this);
    }

    setFileDisplayElement(selector) {
        this.displayElement = this.DOMSelector(selector);
    }
}

module.exports = FileDisplayManager;

},{}],3:[function(require,module,exports){
class FileList {
    constructor(DOMselector) {
        this.fileList = [];
        this.fileCache = new Set();
        this.subscribers = [];
        this.sources = [];
        this.DOMselector = DOMselector;
    }

    // param accepted here is of type FileList, not true array
    addFiles(files) {
        if (!files.length || files.length === "undefined") {
            throw new Error("fn bound in wrong position");
        }

        let newFile;

        if (files.length < 2) {
            newFile = files.item(0);
            console.log(newFile);
            if (this.isNotDuplicate(newFile)) {
                this.addFile(newFile);
            }
        } else {
            for (let i = 0; i < files.length; i++) {
                newFile = files.item(i);
                if (this.isNotDuplicate(newFile)) {
                    this.addFile(newFile);
                }
            }
        }

        this.publish();
    }

    isNotDuplicate(file) {
        const { name } = file;
        return !this.fileCache.has(name);
    }

    addFile(newFile) {
        this.fileList.push(newFile);
        this.fileCache.add(newFile.name);
    }

    addSubscriber(sub) {
        this.subscribers.push(sub);
    }

    publish() {
        const publishToSub = function(sub) {
            const dataEvent = new CustomEvent("UIFileListUpdate", {
                detail: this.fileList
            });

            sub.dispatchEvent(dataEvent);
        }.bind(this);

        this.subscribers.forEach(publishToSub);
    }

    // select an input or inputs from which to read data on selected files
    setFileInputSources(...selectors) {
        const elementSelectors = [...selectors];

        const getElementFromSelector = (s) => {
            const el = this.DOMselector(s);
            if (!el) {
                throw new Error("Invalid file input selected");
            }
            return el;
        };

        this.sources = elementSelectors.map(getElementFromSelector);

        // TODO: GET THIS FILTER WORKING
        // .filter(isUsableFileInput);

        this.sources.forEach((src) =>
            src.addEventListener("change", (e) => this.addFiles(e.target.files))
        );

        function isUsableFileInput(el) {
            return el.files && el.files instanceof FileList;
        }
    }
}

module.exports = FileList;

},{}],4:[function(require,module,exports){
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
    dropManager.setDropTarget(".dropzone");

    // select inputs on page to listen to for selected files
    fileList.setFileInputSources(".file-input");

    // select display element for selected files
    fileDisplayManager.setFileDisplayElement(".file-list");
}

const initArrow = () => init(document.querySelector.bind(document));

if (document.readyState != "loading") initArrow();
// modern browsers
else if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", initArrow);
// IE <= 8
else
    document.attachEvent("onreadystatechange", function() {
        if (document.readyState == "complete") initArrow();
    });

},{"./DropManager":1,"./FileDisplayManager":2,"./FileList":3}]},{},[4]);
