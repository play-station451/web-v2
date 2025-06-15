import { Nodebox } from "@codesandbox/nodebox";

import mirrorNodeFSWithFiler from "./nodeFSIntegration";

const nodeBoxFrame = document.createElement("iframe");
nodeBoxFrame.sandbox = "allow-scripts";

const runtime = new Nodebox({
	iframe: nodeBoxFrame,
});

await runtime.connect();
mirrorNodeFSWithFiler(runtime);
