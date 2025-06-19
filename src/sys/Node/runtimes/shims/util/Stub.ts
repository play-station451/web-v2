export default class NotImplementedError extends Error {
	public readonly methodName?: string;

	constructor(methodName: string, packageName: string) {
		super(`${methodName}() from ${packageName} is not implemented yet`);

		this.name = "NotImplementedError";
		this.methodName = methodName;

		Object.setPrototypeOf(this, NotImplementedError.prototype);
	}
}
