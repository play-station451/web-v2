/**
 * @module getFileTree
 * A WebContainers-compatible version that adapts the generic file tree used in the Nodebox implementation
 * @see https://webcontainers.io/guides/working-with-the-file-system
 */

import getFileTreeGeneric from "../../util/getFileTree";
import type {
    FileSystemTree,
    DirectoryNode,
    FileNode,
} from "@webcontainer/api";

/**
 * Converts a flat file tree (path -> contents) to WebContainer's FileSystemTree format
 * @param flatTree - Flat tree with full paths as keys and file contents as values
 * @returns FileSystemTree object compatible with WebContainers
 */
function convertToWebContainerTree(
    flatTree: Record<string, string>,
): FileSystemTree {
    const tree: FileSystemTree = {};

    for (const [path, contents] of Object.entries(flatTree)) {
        const pathParts = path.replace(/^\//, "").split("/").filter(Boolean);

        if (pathParts.length === 0) continue;

        let currentLevel = tree;

        for (let i = 0; i < pathParts.length - 1; i++) {
            const dirName = pathParts[i];

            if (!currentLevel[dirName]) {
                // Create a new directory node
                currentLevel[dirName] = {
                    directory: {},
                } as DirectoryNode;
            }

            // Advance to the next level
            currentLevel = (currentLevel[dirName] as DirectoryNode).directory;
        }

        // Attach the file contents to the final level
        const fileName = pathParts[pathParts.length - 1];
        currentLevel[fileName] = {
            file: {
                contents,
            },
        } as FileNode;
    }

    return tree;
}

/**
 * Builds a file tree-compatible with WebContainers by adapting the generic file tree
 * @param path The path to build the tree from
 * @returns FileSystemTree An object representing the file tree for WebContainers
 */
export default async function getFileTree(
    path = "/",
): Promise<FileSystemTree> {
    // Get the flat file tree from the generic function
    const flatTree = await getFileTreeGeneric(path);

    // Convert to the WebContainers format
    const webContainerTree = convertToWebContainerTree(flatTree);

    if (path !== "/" && path !== "") {
        const pathParts = path.replace(/^\//, "").split("/").filter(Boolean);
        let subtree = webContainerTree;

        // Navigate to the requested path
        for (const part of pathParts) {
            if (subtree[part] && "directory" in subtree[part]) {
                // Navigate
                subtree = (subtree[part] as DirectoryNode).directory;
            } else {
                return {};
            }
        }

        return subtree;
    }

    return webContainerTree;
}
