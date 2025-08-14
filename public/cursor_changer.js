const style = document.createElement("style");
console.log("Cursor Engine Injected");
style.textContent = `
    :root {
        --cursor-normal: url("/cursors/dark/normal.svg") 6 0, default !important; 
        --cursor-pointer: url("/cursors/dark/pointer.svg") 6 0, pointer !important;
        --cursor-text: url("/cursors/dark/text.svg") 10 0, text !important;
        --cursor-crosshair: url("/cursors/dark/crosshair.svg") 0 0, crosshair !important;
        --cursor-wait: url("/cursors/dark/wait.svg") 0 0, wait !important;
        --cursor-nw-resize: url("/cursors/dark/resize-l.svg") 0 0, nw-resize !important;
	    --cursor-ne-resize: url("/cursors/dark/resize-r.svg") 0 0, ne-resize !important;
	    --cursor-sw-resize: url("/cursors/dark/resize-r.svg") 0 0, sw-resize !important;
	    --cursor-se-resize: url("/cursors/dark/resize-l.svg") 0 0, se-resize !important;
	    --cursor-n-resize: url("/cursors/dark/resize-v.svg") 0 0, n-resize !important;
	    --cursor-s-resize: url("/cursors/dark/resize-v.svg") 0 0, s-resize !important;
	    --cursor-e-resize: url("/cursors/dark/resize-h.svg") 0 0, e-resize !important;
	    --cursor-w-resize: url("/cursors/dark/resize-h.svg") 0 0, w-resize !important;
    }
    * {
        cursor: var(--cursor-normal);
    }
    a, a:-webkit-any-link {
        cursor: var(--cursor-pointer) !important;
    }
    input[type="text"], textarea {
        cursor: var(--cursor-text) !important;
    }
    .crosshair {
        cursor: var(--cursor-crosshair) !important;
    }
    .loading {
        cursor: var(--cursor-wait) !important;
    }
    input[disabled], button[disabled] {
        cursor: var(--cursor-normal) !important;
    }
    [contenteditable="true"] {
        cursor: var(--cursor-text) !important;
    }
`;
document.head.appendChild(style);
