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
