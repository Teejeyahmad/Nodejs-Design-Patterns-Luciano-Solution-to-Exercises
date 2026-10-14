import { appendFile, readFile } from "node:fs";
import { join } from "node:path";

function concatFiles(...args) {
	if (typeof args.at(-1) !== "function") {
		throw new TypeError("Callback not a function");
	}
	const cb = args.at(-1);
	const dest = args.at(-2);
	const iterate = (index) => {
		if (index === args.length - 2) return cb();
		readFile(args[index], (err, content) => {
			if (err) return cb(err);
			appendFile(dest, `File ${index + 1}:\n${content}\n`, (err) => {
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
