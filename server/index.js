const express = require("express");
const app = express();
const through2 = require("through2");

function capitalize(chunk, enc, next) {
    chunk = chunk.toString().toUpperCase();

    // this.push("automatically appended!");
    // this.push(chunk + "\n");

    next(null, chunk + "\n");
}

const capitalizer = through2(capitalize);

app.post("/", (req, res) => {
    req.pipe(capitalizer).pipe(res);
});

app.listen(3001, () => console.log("listening on 3001"));
