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

    clearFiles() {
        this.fileList = [];
        this.fileCache.clear();
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

    setClearFiles(selector) {
        const el = this.DOMselector(selector);

        const clear = this.clearFiles.bind(this);

        el.addEventListener("click", clear);
    }
}

module.exports = FileList;
