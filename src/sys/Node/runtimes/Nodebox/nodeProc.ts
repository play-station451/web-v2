/**
 * @module nodeProc
 */

import { Nodebox } from "@codesandbox/nodebox";
import mirrorNodeFSWithFiler from "./nodeFSIntegration";

/**
 * Initialize Nodebox runtime with filesystem integration
 * @returns The Nodebox runtime instance
 */
export async function initializeNodebox(): Promise<Nodebox> {
	const nodeBoxFrame = document.createElement("iframe");
	nodeBoxFrame.style.display = "none";
	nodeBoxFrame.sandbox = "allow-scripts";
	
	document.body.appendChild(nodeBoxFrame);

	// Initialize Nodebox
	const runtime = new Nodebox({
		iframe: nodeBoxFrame,
	});

	// Start the Nodebox runtime and setup FS mirroring from Terbium's FS on it
	await runtime.connect();
	mirrorNodeFSWithFiler(runtime);

	console.log("Nodebox initialized");

	return runtime;
}
