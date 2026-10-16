import { readdir, stat } from "node:fs";
import { join, resolve } from "node:path";

function findLargest(path, cb) {
  let largest = { file: "", size: 0 };
  let pending = 1; // We start at 1 to represent the initial directory scan itself.
  let finished = false;

  const finish = (err) => {
    if (finished) return;
    finished = true;
    if (err) return cb(err);
    cb(null, largest);
  };
  const entryDone = () => {
    pending--;
    if (pending === 0) finish();
  };

  const checkRecursive = (path, cb) => {
    readdir(path, (err, files) => {
      if (err) return finish(err);
      pending += files.length;

      for (let i = 0; i < files.length; i++) {
        const full = join(path, files[i]);
        stat(full, (err, stats) => {
          if (err) return finish(err);

          if (stats.isFile()) {
            console.log({ file: files[i], size: stats.size });
            if (stats.size > largest.size) {
              largest = { file: full, size: stats.size };
            }
          } else if (stats.isDirectory()) {
            return checkRecursive(join(path, files[i]), cb);
          }
          entryDone();
        });
      }
      entryDone();
    });
  };
  checkRecursive(path, cb);
}

const path = resolve(import.meta.dirname, "DummyFolder");

findLargest(path, (err, data) => {
  if (err) console.log(err);
  else console.log("Largest", data);
});
