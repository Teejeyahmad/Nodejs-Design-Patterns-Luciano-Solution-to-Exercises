# 3.4 Disk bloat finder

Create a function that accepts the path to a folder on the local file system
and identifies the largest file within that folder. For extra credit, enhance the function to search
recursively through subfolders.
Hint: you can use the node:fs module for this task, specifically
the stats() function to determine if a path is a directory or file and to get the file size in bytes,
and the readdir() function to list the contents of a directory.

## Run

To run the exercise launch:

```bash
npm run 3.5
```
