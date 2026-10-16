import { readdir, stat } from "node:fs";
import { join } from "node:path";

function listNestedFiles(dir, maxDepth, cb) {
  const list = [];
  const visitEntry = (entry, maxDepth, cb) => {
    stat(entry, (err, childFiles) => {
      if (err) return cb(err);

      if (childFiles.isFile()) {
        list.push(entry);
      }

      if (childFiles.isDirectory()) return nestedFiles(entry, maxDepth - 1, cb);

      return cb(null); // also skip the mysterious entry (file or folder)
    });
  };
  const nestedFiles = (dir, maxDepth, cb) => {
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
  };

  nestedFiles(dir, maxDepth, cb);
}

listNestedFiles(join(import.meta.dirname, "Deepfold"), 5, (err, list) => {
  if (err) {
    console.error(err);
  }
  if (list) console.log(list);
});
