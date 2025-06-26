import path from "path-browserify";

export interface FileStats {
	name: (path: string) => Promise<string>;
	ext: (path: string) => Promise<string>;
	type: (path: string) => Promise<string>;
	size: (path: string) => Promise<string>;
	cTime: (path: string) => Promise<string>;
	mTime: (path: string) => Promise<string>;
	isFile: (path: string) => Promise<boolean>;
	isDir: (path: string) => Promise<boolean>;
	dir: (path: string) => Promise<string>;
}

export const extensionToNameMap: Record<string, string> = {
	html: "HTML",
	htm: "HTML",
	css: "CSS",
	js: "JavaScript",
	jsx: "JavaScript (JSX)",
	ts: "TypeScript",
	tsx: "TypeScript (TSX)",
	json: "JSON",
	xml: "XML",
	yml: "YAML",
	yaml: "YAML",
	php: "PHP",
	asp: "ASP",
	aspx: "ASP.NET",
	vue: "Vue.js",
	svelte: "Svelte",
	ejs: "Embedded JavaScript (EJS)",
	handlebars: "Handlebars",
	mustache: "Mustache",

	java: "Java",
	py: "Python",
	pyc: "Compiled Python",
	rb: "Ruby",
	pl: "Perl",
	swift: "Swift",
	go: "Go",
	rs: "Rust",
	c: "C",
	h: "C Header",
	cpp: "C++",
	cxx: "C++",
	cc: "C++",
	cs: "C#",
	kotlin: "Kotlin",
	kt: "Kotlin",
	scala: "Scala",
	dart: "Dart",
	lua: "Lua",
	r: "R",
	sh: "Shell Script",
	bash: "Bash Script",
	zsh: "Zsh Script",
	bat: "Batch File",
	ps1: "PowerShell Script",
	sql: "SQL",
	ini: "INI Config",
	toml: "TOML Config",
	cfg: "Config File",
	env: "Environment Config",

	csv: "CSV",
	tsv: "TSV",
	md: "Markdown",
	rst: "reStructuredText",
	latex: "LaTeX",
	tex: "TeX",
	bib: "BibTeX",
	log: "Log File",

	png: "PNG Image",
	jpg: "JPEG Image",
	jpeg: "JPEG Image",
	gif: "GIF Image",
	bmp: "Bitmap Image",
	svg: "SVG Vector Image",
	webp: "WebP Image",
	ico: "Icon File",
	tiff: "TIFF Image",
	heic: "HEIC Image",

	mp4: "MPEG-4 Video",
	mov: "QuickTime Video",
	avi: "AVI Video",
	webm: "WebM Video",
	mkv: "Matroska Video",
	flv: "Flash Video",
	m4v: "MPEG-4 Video",
	"3gp": "3GP Video",

	mp3: "MP3 Audio",
	wav: "WAV Audio",
	ogg: "OGG Audio",
	flac: "FLAC Audio",
	aac: "AAC Audio",
	m4a: "MPEG-4 Audio",
	wma: "Windows Media Audio",
	opus: "Opus Audio",

	zip: "ZIP Archive",
	rar: "RAR Archive",
	"7z": "7-Zip Archive",
	tar: "TAR Archive",
	gz: "Gzip Archive",
	bz2: "Bzip2 Archive",
	xz: "XZ Archive",
	tgz: "Tarball Gzip Archive",
	"tar.gz": "Tarball Gzip Archive",

	pdf: "PDF Document",
	doc: "Microsoft Word Document",
	docx: "Microsoft Word (OpenXML)",
	xls: "Microsoft Excel Spreadsheet",
	xlsx: "Microsoft Excel (OpenXML)",
	ppt: "Microsoft PowerPoint",
	pptx: "Microsoft PowerPoint (OpenXML)",
	odt: "OpenDocument Text",
	ods: "OpenDocument Spreadsheet",
	odp: "OpenDocument Presentation",
	rtf: "Rich Text Format",
	txt: "Plain Text",

	ttf: "TrueType Font",
	otf: "OpenType Font",
	woff: "Web Open Font Format",
	woff2: "Web Open Font Format 2",

	exe: "Windows Executable",
	dll: "Dynamic Link Library",
	deb: "Debian Package",
	rpm: "Red Hat Package Manager",
	dmg: "macOS Disk Image",
	iso: "ISO Disk Image",
	app: "macOS App Package",
	bin: "Binary File",

	jar: "Java Archive",
	war: "Web Application Archive",
	class: "Java Class File",
	wasm: "WebAssembly",
	node: "Node.js Binary",

	lock: "Lock File",
	bak: "Backup File",
	tmp: "Temporary File",
	crt: "Certificate File",
	pem: "PEM Certificate",
	key: "Private Key File",
	pub: "Public Key File",
	sig: "Signature File",
	dat: "Data File",
};

export const nameToExtensionMap: Record<string, string> = Object.entries(extensionToNameMap).reduce((acc: Record<string, string>, [ext, name]) => {
	const key = name.toLowerCase();
	if (!acc[key]) acc[key] = ext;
	return acc;
}, {});

/**
 * Get a human-readable file type name from a file extension.
 * @param ext The file extension (e.g., "js", "pdf").
 * @returns A human-readable name or "Unknown" if not found.
 */
export function getNameFromExtension(ext: string): string {
	return extensionToNameMap[ext.toLowerCase()] || "Unknown";
}

/**
 * Get a typical file extension for a human-readable file type name.
 * @param name The human-readable name (e.g., "JavaScript").
 * @returns A file extension or "unknown" if not found.
 */
export function getExtensionFromName(name: string): string {
	return nameToExtensionMap[name.toLowerCase()] || "unknown";
}

/**
 * Check if a string is a valid file path (contains a file name and extension).
 * @param str The string to check.
 * @returns True if it's a valid file path, false otherwise.
 */
export const isFilePathString = (str: string): boolean => {
	const last = str.split("/").pop();
	return !!last && /\.[a-zA-Z0-9]+$/.test(last); // checks for an extension
};

export const fileStat: FileStats = {
	name: async (file: string): Promise<string> => {
		const stats = await Filer.fs.promises.stat(file);
		if (stats.type.toLowerCase() === "file") {
			const name = path.basename(stats.name);
			return name;
		}
		return "unknown";
	},
	ext: async (file: string): Promise<string> => {
		const stats = await Filer.fs.promises.stat(file);
		if (stats.type.toLowerCase() === "file") {
			const ext = path.extname(stats.name).replace(".", "").toLowerCase();
			return ext;
		}
		return "unknown";
	},
	type: async (file: string): Promise<string> => {
		const stats = await Filer.fs.promises.stat(file);
		if (stats.type.toLowerCase() === "file") {
			const ext = path.extname(stats.name).replace(".", "").toLowerCase();
			const type = getNameFromExtension(ext);
			return type;
		}
		return "unknown";
	},
	size: async (file: string): Promise<string> => {
		const stats = await Filer.fs.promises.stat(file);
		if (stats.type.toLowerCase() === "file") {
			const size = stats.size;
			const units = ["B", "KB", "MB", "GB", "TB"];
			let i = 0;
			let sizeInUnits = size;

			while (sizeInUnits >= 1024 && i < units.length - 1) {
				sizeInUnits /= 1024;
				i++;
			}
			return `${sizeInUnits.toFixed(2)} ${units[i]}`;
		}
		return "0 B";
	},
	cTime: async (file: string): Promise<string> => {
		const stats = await Filer.fs.promises.stat(file);
		if (stats.type.toLowerCase() === "file") {
			const cTime = new Date(stats.ctime).toLocaleString("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			});
			return cTime;
		}
		return "unknown";
	},
	mTime: async (file: string): Promise<string> => {
		const stats = await Filer.fs.promises.stat(file);
		if (stats.type.toLowerCase() === "file") {
			const mTime = new Date(stats.mtime).toLocaleString("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			});
			return mTime;
		}

		return "unknown";
	},
	isFile: async (file: string): Promise<boolean> => {
		const stats = await Filer.fs.promises.stat(file);
		if (stats.type.toLowerCase() === "file") {
			return true;
		}
		return false;
	},
	isDir: async (file: string): Promise<boolean> => {
		const stats = await Filer.fs.promises.stat(file);
		if (stats.type.toLowerCase() === "directory") {
			return true;
		}
		return false;
	},
	dir: async (file: string): Promise<string> => {
		const stats = await Filer.fs.promises.stat(file);
		if (stats.type.toLowerCase() === "file") {
			return path.dirname(file);
		}
		return "unknown";
	},
};

export const validPath = async (str: string) => {
	if (typeof str !== "string") return false;
	if (!str.includes("/")) return false;
	if (/[<>:"|?*\x00-\x1F]/.test(str)) return false;

	const segments = str.split("/").filter(Boolean);
	if (segments.length === 0) return false;

	await Filer.fs.promises.access(str, Filer.fs.constants.F_OK);
};
