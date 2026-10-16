import { readdir, readFile, stat } from "node:fs";
import { basename, join } from "node:path";
import { takeCoverage } from "node:v8";

function recursiveFind(dir, keyword, cb, maxDepth = 1, concurrency = 2) {
  let matches = [];
  let pending = 0;
  let running = 0;
  let queue = [];
  let hasFailed = false;

  const next = () => {
    while (!hasFailed && running < concurrency && queue.length > 0) {
      running++;
      queue.shift()();
    }
  };
  const fail = (err) => {
    if (hasFailed) return;
    hasFailed = true;
    cb(err);
  };
  const taskDone = () => {
    running--;
    pending--;
    if (hasFailed) return;
    if (pending === 0) return cb(null, matches);
    next();
  };
  const addTask = (task) => {
    queue.push(task);
    pending++;
    next();
  };

  function visitEntry(path, depth) {
    if (maxDepth === 0) return taskDone();
    stat(path, (err, file) => {
      if (err) return fail(err);
      if (file.isFile()) {
        return readFile(path, "utf8", (err, content) => {
          if (err) return fail(err);
          if (content.includes(keyword)) {
            matches.push(path);
          }
          taskDone();
        });
      }
      if (file.isDirectory()) {
        if (depth > maxDepth) return taskDone();
        return readdir(path, (err, names) => {
          if (err) return fail(err);
          for (const name of names) {
            addTask(() => visitEntry(join(path, name), maxDepth + 1));
          }
          taskDone();
        });
      }
      taskDone(); //also skip mysterious file
    });
  }
  addTask(() => visitEntry(dir, 0));
}

recursiveFind(join(import.meta.dirname, "Deepfold"), "loige", (err, list) => {
  if (err) {
    console.error(err);
  }
  if (list) console.log(list);
});
