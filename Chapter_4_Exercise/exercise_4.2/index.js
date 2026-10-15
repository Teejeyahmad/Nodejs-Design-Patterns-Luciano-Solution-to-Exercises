import { readdir, stat } from "node:fs";
import { basename, join } from "node:path";

const list = [];

function listNestedFiles(dir, maxDepth, cb) {
  if (maxDepth === 0) return process.nextTick(() => cb(null, list));

  readdir(dir, (err, entries) => {
    if (err) {
      return cb(err);
    }
    function iterate(indx) {
      if (indx === entries.length) return cb(null, list);

      visitEntry(join(dir, entries[indx]), maxDepth, (err) => {
        if (err) return cb(err);
        iterate(indx + 1);
      });
    }

    iterate(0);
  });
}

function visitEntry(entry, maxDepth, cb) {
  stat(entry, (err, childFiles) => {
    if (err) return cb(err);

    if (childFiles.isFile()) {
      list.push(basename(entry));
      return cb(null);
    }

    if (childFiles.isDirectory())
      return listNestedFiles(entry, maxDepth - 1, cb);

    return cb(null); // just skip the mysterious entry (file or folder)
  });
}

listNestedFiles(join(import.meta.dirname, "Deepfold"), 5, (err, list) => {
  if (err) {
    console.error(err);
  }
  if (list) console.log(list);
});
