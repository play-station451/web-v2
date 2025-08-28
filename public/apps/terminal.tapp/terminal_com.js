const tb = parent.window.tb;
const tb_island = tb.window.island;
const _tb_window = tb.window;
const _tb_context_menu = tb.context_menu;
const _tb_dialog = tb.dialog;

tb_island.addControl({
	text: "Help",
	appname: "Terminal",
	id: "terminal-help",
	click: async () => {
		term.write("help");
		await handleCommand("help");
	},
});
