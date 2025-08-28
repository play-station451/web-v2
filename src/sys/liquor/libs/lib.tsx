// @ts-nocheck
export class Lib {
	icon: string;
	package: string;
	name: string;
	versions: { [key: string]: any } = {};
	latestVersion: string;
	async getImport(_version: string): Promise<any> {}
}
