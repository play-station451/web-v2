// @ts-expect-error stfu
import { SHA256 } from "crypto-js";

export default class pwd {
	harden(password: string) {
		const hash = SHA256(password).toString();
		return hash;
	}
}
