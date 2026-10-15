import { readdir, readFile, stat } from "node:fs";
import { basename, join } from "node:path";

function recursiveFind(dir, keyword, maxDepth, cb) {
  const list = [];
  let hasError = false;
  let concurrency = 2;

  function visitEntry(entry, maxDepth, cb) {
    stat(entry, (err, childFile) => {
      if (hasError) return;
      if (err) {
        hasError = true;
        return cb(err);
      }
      if (childFile.isFile()) {
        readFile(entry, "utf8", (err, content) => {
          if (err) return cb(err);
          const match = content.includes(keyword);
          if (match) list.push(basename(entry));
          return cb(null);
        });
        return;
      }
      if (childFile.isDirectory()) {
        return checkRecursive(entry, maxDepth - 1, cb);
      }
      return cb(null); // just skip the mysterious entry (file or folder)
    });
  }

  function checkRecursive(dir, maxDepth, cb) {
    if (maxDepth === 0) return process.nextTick(() => cb(null, list));

    readdir(dir, (err, entries) => {
      if (err) {
        hasError = true;
        return cb(err);
      }
      if (hasError) return;
      if (entries.length === 0) return cb(null, list);

      let running = 0;
      let completed = 0;
      let nextIndex = 0;
      let tasks = [];

      const next = () => {
        while (running < concurrency && nextIndex < tasks.length) {
          let task = tasks[nextIndex++];
          task((err) => {
            if (hasError) {
              return;
            }
            if (err) {
              hasError = true;
              return cb(err);
            }
            if (++completed === entries.length && !hasError) {
              return cb(null, list);
            }
            running--;
            next();
          });
          running++;
        }
      };

      for (const entry of entries) {
        tasks.push((done) => {
          visitEntry(join(dir, entry), maxDepth, done);
        });
      }
      next();
    });
  }
  //////////  S   T  A   R   T   S
  checkRecursive(dir, maxDepth, cb);
}

recursiveFind(
  join(import.meta.dirname, "Deepfold"),
  "loige",
  5,
  (err, list) => {
    if (err) {
      console.error(err);
    }
    if (list) console.log(list);
  },
);
