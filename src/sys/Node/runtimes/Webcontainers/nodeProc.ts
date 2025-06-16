import { WebContainer } from "@webcontainer/api";
import getFileTree from "./util/getFileTree";

/**
 * Initialize and boot WebContainer with mounted file tree mirrored from Terbium's FS
 * @returns Promise resolving to WebContainer instance
 */
export async function initializeWebContainer(): Promise<WebContainer> {
	const webContainer = await WebContainer.boot();

	// Start the Nodebox runtime and setup FS mirroring from Terbium's FS on it
	const fileTree = await getFileTree();
	await webContainer.mount(fileTree);

	console.log("WebContainer has been initialized!");

	return webContainer;
}
