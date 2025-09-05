import type { controller } from "@mercuryworkshop/scramjet";

declare global {
	// TODO: Make this the options passed into the SJ Controller
	var scramjetTb: any;
	var scramjet: controller;
}
