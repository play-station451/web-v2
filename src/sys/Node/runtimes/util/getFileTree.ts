/**
 * @module getFileTree
 */

/**
 * Builds a full file tree for Terbium's Filer FS
 * @param path The path to start at
 * @returns The flat file tree
 */
export default async function getFileTree(path = "/") {
	const tree: Record<string, string> = {};

	async function traverse(path: string): Promise<void> {
		const stat = await Filer.fs.promises.stat(path);

		if (stat.isDirectory()) {
			const entries = await Filer.fs.promises.readdir(path);
			for (const entry of entries) {
				if (entry === "." || entry === "..") continue;

				const newPath = path.endsWith("/") ? `${path}${entry}` : `${path}/${entry}`;
				await traverse(newPath);
			}
		} else if (stat.isFile()) {
			const contents = await Filer.fs.promises.readFile(path, "utf8");
			tree[path] = contents;
		}
	}

	await traverse(path);

	return tree;
}
