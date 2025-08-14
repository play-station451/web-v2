import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import { createServer } from "node:http";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
// @ts-expect-error types
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import config from "dotenv";

export function TServer() {
	config.config();
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	console.log("Starting Terbium...");
	const app = new Hono();

	const masqrCheck = process.env.MASQR && process.env.MASQR.toLowerCase() === "true";
	if (masqrCheck) {
		console.log(`Masqr is Enabled`);
	} else {
		console.log(`Masqr is Disabled`);
	}

	async function MasqFail(c) {
		const host = c.req.header("host");
		if (!host) {
			return;
		}
		const unsafeSuffix = host + ".html";
		const safeSuffix = path.normalize(unsafeSuffix).replace(/^(\.\.(\/|\\|$))+/, "");
		const safeJoin = path.join(process.cwd() + "/Masqrd", safeSuffix);
		try {
			await fs.promises.access(safeJoin);
			const failureFileLocal = await fs.promises.readFile(safeJoin, "utf8");
			return c.html(failureFileLocal);
		} catch (e) {
			return c.html(fs.readFileSync("fail.html", "utf8"));
		}
	}

	if (masqrCheck) {
		app.use(async (c, next) => {
			const host = c.req.header("host");
			// @ts-expect-error stfu
			if (host && process.env.WHITELISTED_DOMAINS.includes(host)) {
				await next();
				return;
			}
			if (c.req.url.includes("/bare")) {
				await next();
				return;
			}
			const authheader = c.req.header("authorization");
			if (getCookie(c, "authcheck")) {
				await next();
				return;
			}
			if (getCookie(c, "refreshcheck") != "true") {
				setCookie(c, "refreshcheck", "true", { maxAge: 10 });
				return MasqFail(c);
			}
			if (!authheader) {
				c.header("WWW-Authenticate", "Basic");
				c.status(401);
				return MasqFail(c);
			}

			const auth = Buffer.from(authheader.split(" ")[1], "base64").toString().split(":");
			const user = auth[0];
			const pass = auth[1];
			const licenseCheck = (await (await fetch(process.env.LICENSE_SERVER_URL + pass + "&host=" + host)).json())["status"];
			console.log(`\x1b[0m${process.env.LICENSE_SERVER_URL}${pass}&host=${host} ` + `returned: ${licenseCheck}`);
			if (licenseCheck == "License valid") {
				setCookie(c, "authcheck", "true", { expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) });
				return c.html(`<script> window.location.href = window.location.href </script>`);
			}
			return MasqFail(c);
		});
	}

	app.use(
		"*",
		serveStatic({
			root: "./dist",
			onNotFound: (path, c) => {},
		}),
	);

	app.use("*", async (c, next) => {
		await next();
		if (c.req.url.endsWith(".cjs")) {
			c.header("Content-Type", "text/javascript");
		}
	});

	app.use("/libcurl/*", serveStatic({ root: libcurlPath }));
	app.use("/baremux/*", serveStatic({ root: baremuxPath }));
	app.use("/epoxy/*", serveStatic({ root: epoxyPath }));

	wisp.options.dns_method = "resolve";
	wisp.options.dns_servers = ["1.1.1.3", "1.0.0.3"];
	wisp.options.dns_result_order = "ipv4first";

	const port = parseInt(process.env.PORT || "8080");

	// Configure CORS
	app.use(
		"/*",
		cors({
			origin: `http://localhost:${port}`,
			allowMethods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
			credentials: true,
		}),
	);

	const server = serve({
		fetch: app.fetch,
		port,
		createServer: () => {
			const httpServer = createServer();

			httpServer.on("upgrade", (req, socket, head) => {
				if (req.url?.endsWith("/wisp/")) {
					wisp.routeRequest(req, socket, head);
				}
			});

			return httpServer;
		},
	});

	const manifest = fs.readFileSync(path.join(__dirname, "package.json"), "utf-8");
	const { version } = JSON.parse(manifest);
	console.log(`
  \x1b[38;2;50;174;98m@@@@@@@@@@@@@@~ B@@@@@@@@#G?.
  \x1b[38;2;50;174;98mB###&@@@@&####^ #@@@&PPPB@@@G.
  \x1b[38;2;50;174;98m .. ~@@@@J ..  .#@@@P   ~&@@@^      \x1b[38;2;60;195;240mWelcome to Terbium React v${version}
      \x1b[38;2;50;174;98m^@@@@?     .#@@@@###&@@&7
      \x1b[38;2;50;174;98m^@@@@?     .#@@@#555P&@@B7      \x1b[38;2;182;182;182mTerbium is running on ${port}
      \x1b[38;2;50;174;98m^@@@@?     .#@@@P    G@@@@      \x1b[38;2;182;182;182mAny problems you encounter let us know!
      \x1b[38;2;50;174;98m^@@@@?     .#@@@&GGG#@@@@Y
      \x1b[38;2;50;174;98m^&@@@?      B@@@@@@@@&B5~
    `);

	process.on("SIGINT", () => {
		console.log("\x1b[0m");
		process.exit();
	});
}
