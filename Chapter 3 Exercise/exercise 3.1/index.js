import { EventEmitter } from "node:events";
import { readFile } from "node:fs";

class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    //  S  O  L  U  T  I  O  N  (START)
    const currentFiles = [...this.files];
    process.nextTick(() => this.emit("starts", currentFiles));
    // (END)
    // beware of Zalgo!, using "process.nextTick" makes sure the method stays asynchronous
    //You'll be able to add listener to the "starts" event after the function invocation, else
    for (const file of this.files) {
      readFile(file, "utf8", (err, content) => {
        if (err) {
          return this.emit("error", err);
        }

        this.emit("fileread", file);

        const match = content.match(this.regex);
        if (match) {
          for (const elem of match) {
            this.emit("found", file, elem);
          }
        }
      });
    }
    return this;
  }
}

const findRegexInstance = new FindRegex(/hello [\w.]+/);
findRegexInstance
  .addFile(new URL("fileA.txt", import.meta.url))
  .addFile(new URL("fileB.json", import.meta.url))
  .find()
  .on("starts", (files) => console.log(`Browsing ${files.join(", ")}`))
  .on("found", (file, match) =>
    console.log(`Matched "${match}" in file ${file}`),
  )
  .on("error", (err) => console.error(`Error emitted ${err.message}`));
