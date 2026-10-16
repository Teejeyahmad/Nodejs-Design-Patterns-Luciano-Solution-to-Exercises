import { appendFile, readFile, writeFile } from "node:fs";
import { join } from "node:path";

function concatFiles(...args) {
  if (typeof args.at(-1) !== "function") {
    throw new TypeError("Callback not a function");
  }
  const cb = args.pop();
  const dest = args.pop();

  if (!dest || args.length === 0)
    throw new Error("Must provide at least one source file and a destination");

  const iterate = (index) => {
    if (index === args.length) return cb();

    readFile(args[index], (err, content) => {
      if (err) return cb(err);

      const write = index === 0 ? writeFile : appendFile;
      write(dest, `File ${index + 1}:\n${content}\n`, (err) => {
        if (err) return cb(err);
        iterate(index + 1);
      });
    });
  };

  iterate(0);
}

concatFiles(
  join(import.meta.dirname, "src.txt"),
  join(import.meta.dirname, "src2.txt"),
  join(import.meta.dirname, "src3.txt"),
  join(import.meta.dirname, "dest.txt"),

  (err) => {
    if (err) return console.log(err);
    console.log("success");
  },
);
