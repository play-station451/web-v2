import type { Nodebox, FileWatchEvent } from "@codesandbox/nodebox";

/**
 * `FileWatchEvent` type gymnastics don't work unfortuantely, so we need to patch the original type
 */
type CompleteFileWatchEvent = FileWatchEvent & {
	/**
	 * Used in the `create`, `change`, and `remove` events
	 */
	path: string;
	/** Used in the `rename` event */
	newPath: string;
	/** Used in the `rename` event */
	oldPath: string;
};

/**
 * Mirrors Nodebox's FS to Filer's on Terbium in a bidirectional manner
 * @param runtime
 */
export default async function mirrorNodeFSWithFiler(
	runtime: Nodebox,
): Promise<void> {
	const Filer = window.Filer;

	// Initialize Nodebox with the current Filer filesystem state
	await runtime.fs.init(await getFileTree());

	// Sync the changes from Nodebox's FS to Filer's
	// Note: the Node FS Watcher API is out of date compared to the official docs, so don't reference that for `runtime.fs.watch`
	runtime.fs.watch(["*"], [], async (event: FileWatchEvent | undefined) => {
		if (!event) return;

		const ev = event as CompleteFileWatchEvent;

		try {
			switch (event.type) {
				case "create":
					if (ev.path) {
						let content: string;
						try {
							content = await runtime.fs.readFile(ev.path, "utf-8");
						} catch (error) {
							console.error(
								`Failed to read file content from ${ev.path} as a reference, while syncing Nodebox's FS to Filer's for a write: ${error}`,
							);
							break;
						}
						try {
							await Filer.fs.promises.writeFile(ev.path, content);
						} catch (error) {
							console.error(
								`Failed to write to ${ev.path}, while syncing Nodebox's FS to Filer's: ${error}`,
							);
						}
					}
					break;
				case "change":
					if (ev.path) {
						let content: string;
						try {
							content = await runtime.fs.readFile(ev.path, "utf-8");
						} catch (error) {
							console.error(
								`Failed to read file content from ${ev.path} as a reference, while syncing Nodebox's FS to Filer's for a file change: ${error}`,
							);
							break;
						}
						try {
							await Filer.fs.promises.writeFile(ev.path, content);
						} catch (error) {
							console.error(
								`Failed to write file changes in ${ev.path}, while syncing Nodebox's FS to Filer's: ${error}`,
							);
						}
					}
					break;
				case "rename":
					if (ev.oldPath && ev.path) {
						try {
							await Filer.fs.promises.rename(ev.oldPath, ev.path);
						} catch (error) {
							console.error(
								`Failed to rename file ${ev.oldPath} to ${ev.path} while syncing Nodebox's FS to Filer's: ${error}`,
							);
						}
					}
					break;
				case "remove":
					if (ev.path) {
						try {
							const stat = await Filer.fs.promises.stat(ev.path);
							if (stat.isDirectory()) {
								await Filer.fs.promises.rmdir(ev.path);
							} else {
								await Filer.fs.promises.unlink(ev.path);
							}
						} catch (error) {
							console.error(
								`Failed to remove file ${ev.path} while syncing Nodebox's FS to Filer's: ${error}`,
							);
						}
					}
					break;
			}
		} catch (error) {
			console.error(
				`Failed to sync the ${event.type} event while syncing Nodebox's FS to Filer's: `,
				error,
			);
		}
	});

	// Sync the changes from Filer's FS to Nodebox's
	Filer.fs.watch(
		"/",
		async (event: string, filename: string) => {
			switch (event) {
				case "rename":
					// TODO: Implement (this will be hard since we won't have access to the old filename)
					// This will likely require proxifying methods from Filer globally in Terbium
					break;
				case "change": {
					const content = await Filer.fs.promises.readFile(filename, "utf8");
					await runtime.fs.writeFile(filename, content);
				}
			}
		},
		{ recursive: true },
	);
}

/**
 * Builds a full file tree for Terbium's Filer FS
 * @param path
 * @returns
 */
async function getFileTree(path = "/") {
	const tree: Record<string, string> = {};

	async function traverse(path: string): Promise<void> {
		const stat = await Filer.fs.promises.stat(path);

		if (stat.isDirectory()) {
			const entries = await Filer.fs.promises.readdir(path);
			for (const entry of entries) {
				if (entry === "." || entry === "..") continue;

				const newPath = path.endsWith("/")
					? `${path}${entry}`
					: `${path}/${entry}`;
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
