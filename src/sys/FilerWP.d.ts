interface TStats {
	node: string; // internal node id (unique)
	dev: string; // file system name
	name: string; // the entry's name (basename)
	size: number; // file size in bytes
	nlinks: number; // number of links
	atime: Date; // last access time as JS Date Object
	mtime: Date; // last modification time as JS Date Object
	ctime: Date; // creation time as JS Date Object
	atimeMs: number; // last access time as Unix Timestamp
	mtimeMs: number; // last modification time as Unix Timestamp
	ctimeMs: number; // creation time as Unix Timestamp
	type: string; // file type (FILE, DIRECTORY, SYMLINK)
	gid: number; // group name
	uid: number; // owner name
	mode: number; // permission
	version: number; // version of the node

	isFile(): boolean; // Returns true if the node is a file.
	isDirectory(): boolean; // Returns true if the node is a directory.
	isBlockDevice(): boolean; // Not implemented, returns false.
	isCharacterDevice(): boolean; // Not implemented, returns false.
	isSymbolicLink(): boolean; // Returns true if the node is a symbolic link.
	isFIFO(): boolean; // Not implemented, returns false.
	isSocket(): boolean; // Not implemented, returns false;
}

interface IAccessModes {
	F_OK: boolean; // Test for existence of file.
	R_OK: boolean; // Test whether the file exists and grants read permission.
	W_OK: boolean; // Test whether the file exists and grants write permission.
	X_OK: boolean; // Test whether the file exists and grants execute permission.
}

declare namespace Filer {
	namespace fs {
		namespace promises {
			function rename(oldPath: string, newPath: string): Promise<void>;
			function ftruncate(fd: number, len: number): Promise<void>;
			function truncate(fd: number, len: number): Promise<void>;
			function stat(path: string): TStats;
			function fstat(fd: number): TStats;
			function lstat(path: string): TStats;
			function exists(path: string): boolean;
			function link(srcPath: string, dstPath: string): Promise<void>;
			function symlink(srcPath: string, dstPath: string): Promise<void>;
			function readlink(srcPath: string): string;
			function unlink(path: string): Promise<void>;
			function mknod(path: string, mode: "FILE" | "DIRECTORY" | string): Promise<void>;
			function rmdir(path: string): Promise<void>;
			function mkdir(path: string, mode?: number): Promise<void>;
			function access(path: string, mode: IAccessModes): Promise<void>;
			function mkdtemp(path: string): string;
			function readdir(path: string, options?: { encoding: string; withFileTypes: boolean } | string): string[];
			function close(fd: number): void;
			function open(path: string, flags: "r" | "r+" | "w" | "w+" | "a" | "a+", mode?: number): number;
			function utimes(path: string, atime: number | Date, mtime: number | Date): Promise<void>;
			function futimes(fd: number, atime: number | Date, mtime: number | Date): Promise<void>;
			function chown(path: string, uid: number, gid: number): Promise<void>;
			function fchown(fd: number, uid: number, gid: number): Promise<void>;
			function chmod(path: string, mode: number | string): Promise<void>;
			function fchmod(fd: number, mode: number | string): Promise<void>;
			function fsync(fd: number): Promise<void>;
			function write(fd: number, buffer: Uint8Array, offset: number, length: number, position: number | null): number;
			function read(fd: number, buffer: Uint8Array, offset: number, length: number, position: number | null): number;
			function readFile(path: string, options?: { encoding: string; flag: "r" | "r+" | "w" | "w+" | "a" | "a+" } | string): Uint8Array;
			function writeFile(path: string, data: Uint8Array | string, options?: { encoding: string; flag: "r" | "r+" | "w" | "w+" | "a" | "a+" } | string): Promise<void>;
			function appendFile(filename: string, data: Uint8Array | string, options?: { encoding: string; flag: "r" | "r+" | "w" | "w+" | "a" | "a+" } | string): Promise<void>;
			function setxattr(path: string, name: string, value: string | object, flag?: "XATTR_CREATE" | "XATTR_REPLACE" | string): Promise<void>;
			function fsetxattr(fd: number, name: string, value: string | object, flag?: "XATTR_CREATE" | "XATTR_REPLACE" | string): Promise<void>;
			function getxattr(path: string, name: string): string | object;
			function fgetxattr(fd: number, name: string): string | object;
			function removexattr(path: string, name: string): Promise<void>;
			function fremovexattr(fd: number, name: string): Promise<void>;
		}
		/**
		 * Renames the file at `oldPath` to `newPath`. Asynchronous [rename(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/rename.html). Callback gets no additional arguments.
		 * @see [fs.rename](https://github.com/filerjs/filer?tab=readme-ov-file#rename)
		 */
		function rename(oldPath: string, newPath: string, callback: (err: Error | null) => void): void;

		/**
         * Change the size of the file represented by the open file descriptor `fd` to be length `len` bytes.

         * Asynchronous [ftruncate(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/ftruncate.html). If the file is larger than `len`, the extra bytes will be discarded;
         * if smaller, its size will be increased, and the extended area will appear as if it were zero-filled.
         *
         * @see [fs.ftruncate](https://github.com/filerjs/filer?tab=readme-ov-file#ftruncate)
         * @see also [fs.truncate()](https://github.com/filerjs/filer?tab=readme-ov-file#truncate)
        */
		function ftruncate(fd: number, len: number, callback: (err: Error | null, fd: number) => void): void;

		/**
         * Change the size of the file at `path` to be length `len` bytes.

         * Asynchronous [truncate(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/truncate.html). If the file is larger than `len`, the extra bytes will be discarded;
         * if smaller, its size will be increased, and the extended area will appear as if it were zero-filled.
         * @see [fs.truncate](https://github.com/filerjs/filer?tab=readme-ov-file#truncate)
         * @see also [fs.ftruncate](https://github.com/filerjs/filer?tab=readme-ov-file#ftruncate)
         */
		function truncate(fd: number, len: number, callback: (err: Error | null) => void): void;

		/**
         * Obtain file status about the file at `path`. Asynchronous [stat(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/stat.html). Callback gets `(error, stats)`, where `stats` is an object with the following properties:
            * - `node` internal node id (unique)
            * - `dev` file system name
            * - `name` the entry's name (basename)
            * - `size` file size in bytes
            * - `nlinks` number of links
            * - `atime` last access time as JS Date Object
            * - `mtime` last modification time as JS Date Object
            * - `ctime` creation time as JS Date Object
            * - `atimeMs` last access time as Unix Timestamp
            * - `mtimeMs` last modification time as Unix Timestamp
            * - `ctimeMs` creation time as Unix Timestamp
            * - `type` file type (FILE, DIRECTORY, SYMLINK)
            * - `gid` group name
            * - `uid` owner name
            * - `mode` permission
            * - `version` version of the node

            * The following convenience methods are also present on the callback's `stats`:
            * - `isFile()` Returns true if the node is a file.
            * - `isDirectory()` Returns true if the node is a directory.
            * - `isBlockDevice()` Not implemented, returns false.
            * - `isCharacterDevice()` Not implemented, returns false.
            * - `isSymbolicLink()` Returns true if the node is a symbolic link.
            * - `isFIFO()` Not implemented, returns false.
            * - `isSocket()` Not implemented, returns false.

         * If the file at `path` is a symbolic link, the file to which it links will be used instead. To get the status of a symbolic link file, use [fs.lstat()](https://github.com/filerjs/filer?tab=readme-ov-file#lstat) instead.
         * @see [fs.stat](https://github.com/filerjs/filer?tab=readme-ov-file#stat)
         * @see also [fs.lstat](https://github.com/filerjs/filer?tab=readme-ov-file#stat)
         */
		function stat(path: string, callback: (err: Error | null, stats: TStats) => void): void;

		/**
         * Obtain information about the open file known by the file descriptor `fd`.

         * Asynchronous [fstat(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/fstat.html). Callback gets `(error, stats)`. `fstat()` is identical to `stat()`, except that the file to be stat-ed is specified by the open file descriptor `fd` instead of a path.
         * @see [fs.fstat](https://github.com/filerjs/filer?tab=readme-ov-file#fstat)
         * @see also [fs.stat](https://github.com/filerjs/filer?tab=readme-ov-file#stat)
         */
		function fstat(fd: number, callback: (err: Error | null, stats: TStats) => void): void;

		/**
         * Obtain information about the file at `path` (i.e., the symbolic link file itself) vs. the destination file to which it links.

         * Asynchronous [lstat(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/lstat.html). Callback gets `(error, stats)`.
         * @see [fs.lstat](https://github.com/filerjs/filer?tab=readme-ov-file#lstat)
         * @see also [fs.stat](https://github.com/filerjs/filer?tab=readme-ov-file#stat)
         */
		function lstat(path: string, callback: (err: Error | null, stats: TStats) => void): void;

		/**
		 * Test whether or not the given path exists by checking with the file system. Then call the callback argument with either true or false.
		 * @deprecated `fs.exists()` is an anachronism and exists only for historical reasons. There should almost never be a reason to use it in your own code.
		 * @see [fs.exists](https://github.com/filerjs/filer?tab=readme-ov-file#exists)
		 */
		function exists(path: string, callback: (exists: boolean) => void): void;

		/**
         * Create a (hard) link to the file at `srcPath` named `dstPath`.

         * Asynchronous [link(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/link.html). Callback gets no additional arguments. Links are directory entries that point to the same file node.
         * @see [fs.link](https://github.com/filerjs/filer?tab=readme-ov-file#link)
         */
		function link(srcPath: string, dstPath: string, callback: (err: Error | null) => void): void;

		/**
         * Create a symbolic link to the file at `dstPath` containing the path `srcPath`.

         * Asynchronous [symlink(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/symlink.html). Callback gets no additional arguments. Symbolic links are files that point to other paths.
         * NOTE: Filer allows for, but ignores the optional `type` parameter used in node.js. The `srcPath` may be a relative path, which will be resolved relative to `dstPath`.
         * @see [fs.symlink](https://github.com/filerjs/filer?tab=readme-ov-file#symlink)
         */
		function symlink(srcPath: string, dstPath: string, callback: (err: Error | null) => void): void;

		/**
         * Reads the contents of a symbolic link.

         * Asynchronous [readlink(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/readlink.html). Callback gets `(error, linkContents)`, where `linkContents` is a string containing the symbolic link's link path.
         * If the original `srcPath` given to `symlink()` was a relative path, it will be fully resolved relative to `dstPath` when returned by `readlink()`.
         * @see [fs.readlink](https://github.com/filerjs/filer?tab=readme-ov-file#readlink)
         */
		function readlink(srcPath: string, callback: (err: Error | null, linkContents: string) => void): void;

		/**
         * Removes the directory entry located at `path`.

         * Asynchronous [unlink(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/unlink.html). Callback gets no additional arguments. If `path` names a symbolic link, the symbolic link will be removed (i.e., not the linked file). Otherwise, the filed named by `path` will be removed (i.e., deleted).
         * @see [fs.unlink](https://github.com/filerjs/filer?tab=readme-ov-file#unlink)
         */
		function unlink(path: string, callback: (err: Error | null) => void): void;

		/**
         * Creates a node at `path` based on the mode passed which is either `FILE` or `DIRECTORY`.

         * Asynchronous [mknod(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/mknod.html). Callback gets no additional arguments.
         * @see [fs.mknod](https://github.com/filerjs/filer?tab=readme-ov-file#mknod)
         */
		function mknod(path: string, mode: "FILE" | "DIRECTORY" | string, callback: (err: Error | null) => void): void;

		/**
         * Removes the directory at `path`.

         * Asynchronous [rmdir(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/rmdir.html). Callback gets no additional arguments. The operation will fail if the directory at `path` is not empty.
         * @see [fs.rmdir](https://github.com/filerjs/filer?tab=readme-ov-file#rmdir)
         */
		function rmdir(path: string, callback: (err: Error | null) => void): void;

		/**
         * Makes a directory with name supplied in `path` argument.

         * Asynchronous [mkdir(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/mkdir.html). Callback gets no additional arguments.

         * NOTE: Filer allows for, but ignores the optional `mode` argument used in node.js.
         * @see [fs.mkdir](https://github.com/filerjs/filer?tab=readme-ov-file#mkdir)
         */
		function mkdir(path: string, mode?: number, callback: (err: Error | null) => void): void;

		/**
         * Tests a user's permissions for the file or directory supplied in `path` argument.

         * Asynchronous [access(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/access.html). Callback gets no additional arguments. The `mode` argument can be one of the following (constants are available on `fs.constants` and `fs`):

            * - `F_OK`: Test for existence of file.
            * - `R_OK`: Test whether the file exists and grants read permission.
            * - `W_OK`: Test whether the file exists and grants write permission.
            * - `X_OK`: Test whether the file exists and grants execute permission.

         * NOTE: you can also create a mask consisting of the bitwise OR of two or more values (e.g. `fs.constants.W_OK | fs.constants.R_OK`).
         * @see [fs.access](https://github.com/filerjs/filer?tab=readme-ov-file#access)
         */
		function access(path: string, mode: IAccessModes, callback: (err: Error | null) => void): void;

		/**
         * Makes a temporary directory with prefix supplied in `path` argument. Method will append six random characters directly to the prefix. Asynchronous. Callback gets `(error, path)`, where path is the path to the created directory.

         * NOTE: Filer allows for, but ignores the `optional` options argument used in node.js.
         * @see [fs.mkdtemp](https://github.com/filerjs/filer?tab=readme-ov-file#mkdtemp)
         */
		function mkdtemp(path: string, callback: (err: Error | null, path: string) => void): void;

		/**
         * Reads the contents of a directory.

         * Asynchronous [readdir(3)](http://pubs.opengroup.org/onlinepubs/009695399/functions/readdir.html). Callback gets `(error, files)`, where `files` is an array containing the names of each directory entry (i.e., file, directory, link) in the directory, excluding `.` and `..`.

         * Optionally accepts an options parameter, which can be either an encoding (e.g. "utf8") or an object with optional properties `encoding` and `withFileTypes`.

         * The `encoding` property is a `string` which will determine the character encoding to use for the names of each directory entry. The `withFileTypes` property is a `boolean` which defaults to `false`. If `true`, this method will return an array of [fs.Dirent](https://nodejs.org/api/fs.html#fs_class_fs_dirent) objects.

         * The `name` property on the [fs.Dirent](https://nodejs.org/api/fs.html#fs_class_fs_dirent) objects will be encoded using the specified character encoding.
         * @see [fs.readdir](https://github.com/filerjs/filer?tab=readme-ov-file#readdir)
         */
		function readdir(path: string, options?: { encoding: string; withFileTypes: boolean } | string, callback: (err: Error | null, files: string[]) => void): void;

		/**
         * Closes a file descriptor.

         * Asynchronous [close(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/close.html). Callback gets no additional arguments.
         * @see [fs.close](https://github.com/filerjs/filer?tab=readme-ov-file#close)
         */
		function close(fd: number, callback: (err: Error | null) => void): void;

		/**
         * Opens a file.

         * Asynchronous [open(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html). Callback gets `(error, fd)`, where `fd` is the file descriptor. The `flags` argument can be:

            * - `'r'`: Open file for reading. An exception occurs if the file does not exist.
            * - `'r'`: Open file for reading. An exception occurs if the file does not exist.
            * - `'r+'`: Open file for reading and writing. An exception occurs if the file does not exist.
            * - `'w'`: Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
            * - `'w+'`: Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
            * - `'a'`: Open file for appending. The file is created if it does not exist.
            * - `'a+'`: Open file for reading and appending. The file is created if it does not exist.

         * NOTE: Filer allows for, but ignores the optional `mode` argument used in node.js.
         * @see [fs.open](https://github.com/filerjs/filer?tab=readme-ov-file#open)
         */
		function open(path: string, flags: "r" | "r+" | "w" | "w+" | "a" | "a+", mode?: number, callback: (err: Error | null, fd: number) => void): void;

		/**
         * Changes the file timestamps for the file given at path `path`.

         * Asynchronous [utimes(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/utimes.html). Callback gets no additional arguments. Both `atime` (access time) and `mtime` (modified time) arguments should be a JavaScript Date or Number.
         * @see [fs.utimes](https://github.com/filerjs/filer?tab=readme-ov-file#utimes)
         */
		function utimes(path: string, atime: number | Date, mtime: number | Date, callback: (err: Error | null) => void): void;

		/**
         * Changes the file timestamps for the open file represented by the file descriptor `fd`.

         * Asynchronous [utimes(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/utimes.html). Callback gets no additional arguments. Both `atime` (access time) and `mtime` (modified time) arguments should be a JavaScript Date or Number.
         * @see [fs.futimes](https://github.com/filerjs/filer?tab=readme-ov-file#futimes)
         */
		function futimes(fd: number, atime: number | Date, mtime: number | Date, callback: (err: Error | null) => void): void;

		/**
         * Changes the owner and group of a file.

         * Asynchronous [chown(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/chown.html). Callback gets no additional arguments. Both `uid` (user id) and `gid` (group id) arguments should be a JavaScript Number. By default, `0x0` is used (i.e., `root:root` ownership).
         * @see [fs.chown](https://github.com/filerjs/filer?tab=readme-ov-file#chown)
         */
		function chown(path: string, uid: number, gid: number, callback: (err: Error | null) => void): void;

		/**
         * Changes the owner and group of a file.

         * Asynchronous [chown(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/chown.html). Callback gets no additional arguments. Both `uid` (user id) and `gid` (group id) arguments should be a JavaScript Number. By default, `0x0` is used (i.e., `root:root` ownership).
         * @see [fs.fchown](https://github.com/filerjs/filer?tab=readme-ov-file#fchown)
         */
		function fchown(fd: number, uid: number, gid: number, callback: (err: Error | null) => void): void;

		/**
         * Changes the mode of a file.

         * Asynchronous [chmod(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/chmod.html). Callback gets no additional arguments. The `mode` argument should be a JavaScript Number, which combines file type and permission information. Here are a list of common values useful for setting the `mode`:
            * - File type `S_IFREG=0x8000`
            * - Dir type `S_IFDIR=0x4000`
            * - Link type `S_IFLNK=0xA000`
            * - Permissions `755=0x1ED`
            * - Permissions `644=0x1A4`
            * - Permissions `777=0x1FF`
            * - Permissions `666=0x1B6`

            * By default, directories use `(0x4000 | 0x1ED)` and files use `(0x8000 | 0x1A4)`.
         * @see [fs.chmod](https://github.com/filerjs/filer?tab=readme-ov-file#chmod)
         */
		function chmod(path: string, mode: number | string, callback: (err: Error | null) => void): void;

		/**
         * Changes the mode of a file.

         * Asynchronous [chmod(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/chmod.html). Callback gets no additional arguments. The `mode` argument should be a JavaScript Number, which combines file type and permission information. By default, `755` (dir) and `644` (file) are used.
         * @see [fs.fchmod](https://github.com/filerjs/filer?tab=readme-ov-file#fchmod)
         */
		function fchmod(fd: number, mode: number | string, callback: (err: Error | null) => void): void;

		/**
         * Synchronize the data and metadata for the file referred to by `fd` to disk.

         * Asynchronous [fsync(2)](http://man7.org/linux/man-pages/man2/fsync.2.html). The callback gets `(error)`.
         * @see [fs.fsync](https://github.com/filerjs/filer?tab=readme-ov-file#fsync)
         */
		function fsync(fd: number, callback: (err: Error | null) => void): void;

		/**
         * Writes bytes from `buffer` to the file specified by `fd`.

         * Asynchronous [write(2), pwrite(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/write.html). The `offset` and `length` arguments describe the part of the buffer to be written. The `position` refers to the offset from the beginning of the file where this data should be written. If `position` is `null`, the data will be written at the current position. The callback gets `(error, nbytes)`, where `nbytes` is the number of bytes written.

         * NOTE: Filer currently writes the entire buffer in a single operation. However, future versions may do it in chunks.
         * @see [fs.write](https://github.com/filerjs/filer?tab=readme-ov-file#write)
         */
		function write(fd: number, buffer: Uint8Array, offset: number, length: number, position: number | null, callback: (err: Error | null, nbytes: number) => void): void;

		/**
         * Read bytes from the file specified by `fd` into `buffer`.

         * Asynchronous [read(2), pread(2)](http://pubs.opengroup.org/onlinepubs/009695399/functions/read.html). The `offset` and `length` arguments describe the part of the buffer to be used. The `position` refers to the offset from the beginning of the file where this data should be read. If `position` is `null`, the data will be written at the current position. The callback gets `(error, nbytes)`, where `nbytes` is the number of bytes read.

         * NOTE: Filer currently reads into the buffer in a single operation. However, future versions may do it in chunks.
         * @see [fs.read](https://github.com/filerjs/filer?tab=readme-ov-file#read)
         */
		function read(fd: number, buffer: Uint8Array, offset: number, length: number, position: number | null, callback: (err: Error | null, nbytes: number, buffer: Uint8Array) => void): void;

		/**
		 * Reads the entire contents of a file. The `options` argument is optional, and can take the form `"utf8"` (i.e., an encoding) or be an object literal: `{ encoding: "utf8", flag: "r" }`. If no encoding is specified, the raw binary buffer is returned via the callback. The callback gets `(error, data)`, where data is the contents of the file.
		 * @see [fs.readFile](https://github.com/filerjs/filer?tab=readme-ov-file#readfile)
		 */
		function readFile(path: string, options?: { encoding: string; flag: "r" | "r+" | "w" | "w+" | "a" | "a+" } | string, callback: (err: Error | null, data: Uint8Array) => void): void;

		/**
		 * Writes data to a file. `data` can be a string or `Buffer`, in which case any encoding option is ignored. The `options` argument is optional, and can take the form `"utf8"` (i.e., an encoding) or be an object literal: `{ encoding: "utf8", flag: "w" }`. If no encoding is specified, and `data` is a string, the encoding defaults to `'utf8'`. The callback gets `(error)`.
		 * @see [fs.writeFile](https://github.com/filerjs/filer?tab=readme-ov-file#writefile)
		 */
		function writeFile(path: string, data: Uint8Array | string, options?: { encoding: string; flag: "r" | "r+" | "w" | "w+" | "a" | "a+" } | string, callback: (err: Error | null) => void): void;

		/**
		 * Writes data to the end of a file. `data` can be a string or a `Buffer`, in which case any encoding option is ignored. The `options` argument is optional, and can take the form `"utf8"` (i.e., an encoding) or be an object literal: `{ encoding: "utf8", flag: "w" }`. If no encoding is specified, and `data` is a string, the encoding defaults to `'utf8'`. The callback gets `(error)`.
		 * @see [fs.appendFile](https://github.com/filerjs/filer?tab=readme-ov-file#appendfile)
		 */
		function appendFile(filename: string, data: Uint8Array | string, options?: { encoding: string; flag: "r" | "r+" | "w" | "w+" | "a" | "a+" } | string, callback: (err: Error | null) => void): void;

		/**
         * Sets an extended attribute of a file or directory named `path`.

         * Asynchronous [setxattr(2)](http://man7.org/linux/man-pages/man2/setxattr.2.html). The optional `flag` parameter can be set to the following:

            * - `XATTR_CREATE`: ensures that the extended attribute with the given name will be new and not previously set. If an attribute with the given name already exists, it will return an `EExists` error to the callback.
            * - `XATTR_REPLACE`: ensures that an extended attribute with the given name already exists. If an attribute with the given name does not exist, it will return an `ENoAttr` error to the callback.

         * Callback gets no additional arguments.
         * @see [fs.setxattr](https://github.com/filerjs/filer?tab=readme-ov-file#setxattr)
         */
		function setxattr(path: string, name: string, value: string | object, flag?: "XATTR_CREATE" | "XATTR_REPLACE" | string, callback: (err: Error | null) => void): void;

		/**
         * Sets an extended attribute of the file represented by the open file descriptor `fd`.

         * Asynchronous [setxattr(2)](http://man7.org/linux/man-pages/man2/setxattr.2.html). See `fs.setxattr` for more details. Callback gets no additional arguments.
         * @see [fs.fsetxattr](https://github.com/filerjs/filer?tab=readme-ov-file#fsetxattr)
         */
		function fsetxattr(fd: number, name: string, value: string | object, flag?: "XATTR_CREATE" | "XATTR_REPLACE" | string, callback: (err: Error | null) => void): void;

		/**
         * Gets an extended attribute value for a file or directory.

         * Asynchronous [getxattr(2)](http://man7.org/linux/man-pages/man2/getxattr.2.html). Callback gets `(error, value)`, where `value` is the value for the extended attribute named `name`.
         * @see [fs.getxattr](https://github.com/filerjs/filer?tab=readme-ov-file#getxattr)
         */
		function getxattr(path: string, name: string, callback: (err: Error | null, value: string | object) => void): void;

		/**
         * Gets an extended attribute value for the file represented by the open file descriptor `fd`.

         * Asynchronous [getxattr(2)](http://man7.org/linux/man-pages/man2/getxattr.2.html). See `fs.getxattr` for more details. Callback gets `(error, value)`, where `value` is the value for the extended attribute named `name`.
         * @see [fs.fgetxattr](https://github.com/filerjs/filer?tab=readme-ov-file#fgetxattr)
         */
		function fgetxattr(fd: number, name: string, callback: (err: Error | null, value: string | object) => void): void;

		/**
         * Removes the extended attribute identified by `name` for the file given at `path`.

         * Asynchronous [removexattr(2)](http://man7.org/linux/man-pages/man2/removexattr.2.html). Callback gets no additional arguments.
         * @see [fs.removexattr](https://github.com/filerjs/filer?tab=readme-ov-file#removexattr)
         */
		function removexattr(path: string, name: string, callback: (err: Error | null) => void): void;

		/**
         * Removes the extended attribute identified by `name` for the file represented by the open file descriptor `fd`.

         * Asynchronous [removexattr(2)](http://man7.org/linux/man-pages/man2/removexattr.2.html). See `fs.removexattr` for more details. Callback gets no additional arguments.
         * @see [fs.fremovexattr](https://github.com/filerjs/filer?tab=readme-ov-file#fremovexattr)
         */
		function fremovexattr(fd: number, name: string, callback: (err: Error | null) => void): void;

		/**
         * Watch for changes to a file or directory at filename. The object returned is an FSWatcher, which is an [`EventEmitter`](http://nodejs.org/api/events.html)` with the following additional method:

            * - `close()` - stops listening for changes, and removes all listeners from this instance. Use this to stop watching a file or directory after calling `fs.watch()`.

         * The only supported option is `recursive`, which if `true` will cause a watch to be placed on a directory, and all sub-directories and files beneath it.

         * The `listener` callback gets two arguments `(event, filename)`. `event` is either `'rename'` or `'change'`, (currenty only `'rename'` is supported) and `filename` is the name of the file/dir which triggered the event.

         * Unlike node.js, all watch events return a path. Also, all returned paths are absolute from the root vs. just a relative filename.
         * @see [fs.watch](https://github.com/filerjs/filer?tab=readme-ov-file#watch)
         */
		function watch(filename: string, options?: { recursive: boolean } | string, listener: (event: string, filename: string) => void): void;
	}
}
