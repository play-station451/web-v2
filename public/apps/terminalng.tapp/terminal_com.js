const tb = parent.window.tb
const tb_island = tb.window.island;
const tb_window = tb.window;
const tb_context_menu = tb.context_menu;
const tb_dialog = tb.dialog;

tb_island.addControl({
    text: "Help",
    appname: "TerminalNG",
    id: "terminal-ng",
    click: () => {
        inputElement.value = "help";
        executeCommand("help");
    }
})