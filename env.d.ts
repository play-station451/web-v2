declare namespace NodeJS {
	interface ProcessEnv {
		port: number;
		masqr: boolean;
		licensingURL: string | any;
		whitelistedDomains: string[];
	}
}
