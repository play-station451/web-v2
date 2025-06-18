function echo(args) {
	const message = args.join(" ");
	displayOutput(message);
	createNewCommandInput();
}

echo(args);
