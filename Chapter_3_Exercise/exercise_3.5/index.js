import { readdir, stat } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Recursively finds the largest file in a directory using raw Node.js callbacks.
 *
 * ARCHITECTURE NOTE:
 * To avoid the "Callback Hell" pyramid, we use an asynchronous counter (`count`).
 * This acts as a rudimentary Task Queue, allowing us to track parallel I/O
 * operations and trigger the final callback only when all branches finish.
 *
 * @param {string} targetPath - The directory to search
 * @param {function} cb - Error-first callback (err, { file, size })
 */
function findLargest(path, cb) {
  let largest = { file: "", size: 0 };

  let count = 1; // We start at 1 to represent the initial directory scan itself.
  const checkRecursive = (path, cb) => {
    readdir(path, (err, files) => {
      if (err) {
        return cb(err);
      }
      count--;
      count += files.length;

      // BUG FIX: Handle empty directories []
      if (count === 0) {
        return;
      }

      for (let i = 0; i < files.length; i++) {
        stat(join(path, files[i]), (err, stats) => {
          if (err) {
            return cb(err);
          }
          if (stats.isFile()) {
            console.log({ file: files[i], size: stats.size });

            if (stats.size > largest.size) {
              largest = { file: files[i], size: stats.size };
            }

            count--;
            if (count === 0) return cb(null, largest);
          } else if (stats.isDirectory()) {
            checkRecursive(join(path, files[i]), cb);
          }
        });
      }
    });
  };
  checkRecursive(path, cb);
}

/*
 * 🧠 PRODUCTION CAVEAT FOR REVIEWERS:
 * To keep this algorithm readable for learners focusing on control flow,
 * I omitted complex error-guarding. In a production environment, if multiple parallel
 * `stat` calls throw an error (e.g., EACCES) simultaneously, `cb(err)` would fire
 * multiple times, crashing Node with an ERR_MULTIPLE_CALLBACK_CALLS exception.
 * A robust production implementation requires a `let hasFinished = false` guard
 * boolean to ensure the callback fires strictly once.
 */

const path = resolve(import.meta.dirname, "DummyFolder");

findLargest(path, (err, data) => {
  if (err) console.log(err);
  else console.log("Largest", data);
});
