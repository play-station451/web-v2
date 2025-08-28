/**
 * The JSDoc is taken from Node itself
 */

import type * as NodeChildProcess from "node:child_process";
import type { ObjectEncodingOptions as NodeObjectEncodingOptions } from "node:fs";
import type { Readable, Writable } from "node:stream";

// Re-export the types from Node
export type {
	ChildProcess,
	ChildProcessWithoutNullStreams,
	ChildProcessByStdio,
	ExecOptions,
	ExecException,
	ExecFileOptions,
	ExecFileException,
	ExecFileOptionsWithBufferEncoding,
	ExecFileOptionsWithStringEncoding,
	ExecFileOptionsWithOtherEncoding,
	ExecSyncOptions,
	ExecSyncOptionsWithStringEncoding,
	ExecSyncOptionsWithBufferEncoding,
	ExecFileSyncOptions,
	ExecFileSyncOptionsWithStringEncoding,
	ExecFileSyncOptionsWithBufferEncoding,
	SpawnOptions,
	SpawnOptionsWithoutStdio,
	SpawnOptionsWithStdioTuple,
	SpawnSyncOptions,
	SpawnSyncOptionsWithStringEncoding,
	SpawnSyncOptionsWithBufferEncoding,
	SpawnSyncReturns,
	ForkOptions,
	PromiseWithChild,
	StdioPipe,
	StdioNull,
} from "node:child_process";

/**
 * Spawns a shell then executes the `command` within that shell, buffering any
 * generated output. The `command` string passed to the exec function is processed
 * directly by the shell and special characters (vary based on [shell](https://en.wikipedia.org/wiki/List_of_command-line_interpreters))
 * need to be dealt with accordingly:
 *
 * ```js
 * import { exec } from 'node:child_process';
 *
 * exec('"/path/to/test file/test.sh" arg1 arg2');
 * // Double quotes are used so that the space in the path is not interpreted as
 * // a delimiter of multiple arguments.
 *
 * exec('echo "The \\$HOME variable is $HOME"');
 * // The $HOME variable is escaped in the first instance, but not in the second.
 * ```
 *
 * **Never pass unsanitized user input to this function. Any input containing shell**
 * **metacharacters may be used to trigger arbitrary command execution.**
 *
 * If a `callback` function is provided, it is called with the arguments `(error, stdout, stderr)`. On success, `error` will be `null`. On error, `error` will be an instance of `Error`. The
 * `error.code` property will be
 * the exit code of the process. By convention, any exit code other than `0` indicates an error. `error.signal` will be the signal that terminated the
 * process.
 *
 * The `stdout` and `stderr` arguments passed to the callback will contain the
 * stdout and stderr output of the child process. By default, Node.js will decode
 * the output as UTF-8 and pass strings to the callback. The `encoding` option
 * can be used to specify the character encoding used to decode the stdout and
 * stderr output. If `encoding` is `'buffer'`, or an unrecognized character
 * encoding, `Buffer` objects will be passed to the callback instead.
 *
 * ```js
 * import { exec } from 'node:child_process';
 * exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
 *   if (error) {
 *     console.error(`exec error: ${error}`);
 *     return;
 *   }
 *   console.log(`stdout: ${stdout}`);
 *   console.error(`stderr: ${stderr}`);
 * });
 * ```
 *
 * If `timeout` is greater than `0`, the parent will send the signal
 * identified by the `killSignal` property (the default is `'SIGTERM'`) if the
 * child runs longer than `timeout` milliseconds.
 *
 * Unlike the [`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3.html) POSIX system call, `child_process.exec()` does not replace
 * the existing process and uses a shell to execute the command.
 *
 * If this method is invoked as its `util.promisify()` ed version, it returns
 * a `Promise` for an `Object` with `stdout` and `stderr` properties. The returned `ChildProcess` instance is attached to the `Promise` as a `child` property. In
 * case of an error (including any error resulting in an exit code other than 0), a
 * rejected promise is returned, with the same `error` object given in the
 * callback, but with two additional properties `stdout` and `stderr`.
 *
 * ```js
 * import util from 'node:util';
 * import child_process from 'node:child_process';
 * const exec = util.promisify(child_process.exec);
 *
 * async function lsExample() {
 *   const { stdout, stderr } = await exec('ls');
 *   console.log('stdout:', stdout);
 *   console.error('stderr:', stderr);
 * }
 * lsExample();
 * ```
 *
 * If the `signal` option is enabled, calling `.abort()` on the corresponding `AbortController` is similar to calling `.kill()` on the child process except
 * the error passed to the callback will be an `AbortError`:
 *
 * ```js
 * import { exec } from 'node:child_process';
 * const controller = new AbortController();
 * const { signal } = controller;
 * const child = exec('grep ssh', { signal }, (error) => {
 *   console.error(error); // an AbortError
 * });
 * controller.abort();
 * ```
 * @since v0.1.90
 * @param command The command to run, with space-separated arguments.
 * @param callback called with the output when process terminates.
 */
export function exec(command: string, callback?: (error: NodeChildProcess.ExecException | null, stdout: string, stderr: string) => void): NodeChildProcess.ChildProcess;
export function exec(
	command: string,
	options: {
		encoding: "buffer" | null;
	} & NodeChildProcess.ExecOptions,
	callback?: (error: NodeChildProcess.ExecException | null, stdout: Buffer, stderr: Buffer) => void,
): NodeChildProcess.ChildProcess;
export function exec(
	command: string,
	options: {
		encoding: BufferEncoding;
	} & NodeChildProcess.ExecOptions,
	callback?: (error: NodeChildProcess.ExecException | null, stdout: string, stderr: string) => void,
): NodeChildProcess.ChildProcess;
export function exec(
	command: string,
	options: {
		encoding: BufferEncoding;
	} & NodeChildProcess.ExecOptions,
	callback?: (error: NodeChildProcess.ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void,
): NodeChildProcess.ChildProcess;
export function exec(command: string, options: NodeChildProcess.ExecOptions, callback?: (error: NodeChildProcess.ExecException | null, stdout: string, stderr: string) => void): NodeChildProcess.ChildProcess;
export function exec(command: string, options: (NodeObjectEncodingOptions & NodeChildProcess.ExecOptions) | undefined | null, callback?: (error: NodeChildProcess.ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void): NodeChildProcess.ChildProcess;
export function exec(
	_command: string,
	// biome-ignore lint/suspicious/noExplicitAny: I'll figure this out later
	..._args: any[]
): NodeChildProcess.ChildProcess {
	// TODO: Implement this stub
	throw new Error("execFileSync is not yet implemented");
}

export function execFile(file: string): NodeChildProcess.ChildProcess;
export function execFile(file: string, options: (NodeObjectEncodingOptions & NodeChildProcess.ExecFileOptions) | undefined | null): NodeChildProcess.ChildProcess;
export function execFile(file: string, args?: readonly string[] | null): NodeChildProcess.ChildProcess;
export function execFile(file: string, args: readonly string[] | undefined | null, options: (NodeObjectEncodingOptions & NodeChildProcess.ExecFileOptions) | undefined | null): NodeChildProcess.ChildProcess;
export function execFile(file: string, callback: (error: NodeChildProcess.ExecFileException | null, stdout: string, stderr: string) => void): NodeChildProcess.ChildProcess;
export function execFile(file: string, args: readonly string[] | undefined | null, callback: (error: NodeChildProcess.ExecFileException | null, stdout: string, stderr: string) => void): NodeChildProcess.ChildProcess;
export function execFile(file: string, options: NodeChildProcess.ExecFileOptionsWithBufferEncoding, callback: (error: NodeChildProcess.ExecFileException | null, stdout: Buffer, stderr: Buffer) => void): NodeChildProcess.ChildProcess;
export function execFile(file: string, args: readonly string[] | undefined | null, options: NodeChildProcess.ExecFileOptionsWithBufferEncoding, callback: (error: NodeChildProcess.ExecFileException | null, stdout: Buffer, stderr: Buffer) => void): NodeChildProcess.ChildProcess;
export function execFile(file: string, options: NodeChildProcess.ExecFileOptionsWithStringEncoding, callback: (error: NodeChildProcess.ExecFileException | null, stdout: string, stderr: string) => void): NodeChildProcess.ChildProcess;
export function execFile(file: string, args: readonly string[] | undefined | null, options: NodeChildProcess.ExecFileOptionsWithStringEncoding, callback: (error: NodeChildProcess.ExecFileException | null, stdout: string, stderr: string) => void): NodeChildProcess.ChildProcess;
export function execFile(file: string, options: NodeChildProcess.ExecFileOptionsWithOtherEncoding, callback: (error: NodeChildProcess.ExecFileException | null, stdout: string | Buffer, stderr: string | Buffer) => void): NodeChildProcess.ChildProcess;
export function execFile(file: string, args: readonly string[] | undefined | null, options: NodeChildProcess.ExecFileOptionsWithOtherEncoding, callback: (error: NodeChildProcess.ExecFileException | null, stdout: string | Buffer, stderr: string | Buffer) => void): NodeChildProcess.ChildProcess;
export function execFile(file: string, options: NodeChildProcess.ExecFileOptions, callback: (error: NodeChildProcess.ExecFileException | null, stdout: string, stderr: string) => void): NodeChildProcess.ChildProcess;
export function execFile(file: string, args: readonly string[] | undefined | null, options: NodeChildProcess.ExecFileOptions, callback: (error: NodeChildProcess.ExecFileException | null, stdout: string, stderr: string) => void): NodeChildProcess.ChildProcess;
export function execFile(file: string, options: (NodeObjectEncodingOptions & NodeChildProcess.ExecFileOptions) | undefined | null, callback: ((error: NodeChildProcess.ExecFileException | null, stdout: string | Buffer, stderr: string | Buffer) => void) | undefined | null): NodeChildProcess.ChildProcess;
export function execFile(
	file: string,
	args: readonly string[] | undefined | null,
	options: (NodeObjectEncodingOptions & NodeChildProcess.ExecFileOptions) | undefined | null,
	callback: ((error: NodeChildProcess.ExecFileException | null, stdout: string | Buffer, stderr: string | Buffer) => void) | undefined | null,
): NodeChildProcess.ChildProcess;
export function execFile(
	_file: string,
	// biome-ignore lint/suspicious/noExplicitAny: I'll figure this out later
	..._args: any[]
): NodeChildProcess.ChildProcess {
	// TODO: Implement this stub
	throw new Error("execFile from node:child-process is not yet implemented");
}

// spawn function with all Node.js overloads
export function spawn(command: string, options?: NodeChildProcess.SpawnOptionsWithoutStdio): NodeChildProcess.ChildProcessWithoutNullStreams;
export function spawn(command: string, options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioPipe, NodeChildProcess.StdioPipe, NodeChildProcess.StdioPipe>): NodeChildProcess.ChildProcessByStdio<Writable, Readable, Readable>;
export function spawn(command: string, options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioPipe, NodeChildProcess.StdioPipe, NodeChildProcess.StdioNull>): NodeChildProcess.ChildProcessByStdio<Writable, Readable, null>;
export function spawn(command: string, options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioPipe, NodeChildProcess.StdioNull, NodeChildProcess.StdioPipe>): NodeChildProcess.ChildProcessByStdio<Writable, null, Readable>;
export function spawn(command: string, options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioNull, NodeChildProcess.StdioPipe, NodeChildProcess.StdioPipe>): NodeChildProcess.ChildProcessByStdio<null, Readable, Readable>;
export function spawn(command: string, options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioPipe, NodeChildProcess.StdioNull, NodeChildProcess.StdioNull>): NodeChildProcess.ChildProcessByStdio<Writable, null, null>;
export function spawn(command: string, options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioNull, NodeChildProcess.StdioPipe, NodeChildProcess.StdioNull>): NodeChildProcess.ChildProcessByStdio<null, Readable, null>;
export function spawn(command: string, options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioNull, NodeChildProcess.StdioNull, NodeChildProcess.StdioPipe>): NodeChildProcess.ChildProcessByStdio<null, null, Readable>;
export function spawn(command: string, options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioNull, NodeChildProcess.StdioNull, NodeChildProcess.StdioNull>): NodeChildProcess.ChildProcessByStdio<null, null, null>;
export function spawn(command: string, options: NodeChildProcess.SpawnOptions): NodeChildProcess.ChildProcess;
export function spawn(command: string, args?: readonly string[], options?: NodeChildProcess.SpawnOptionsWithoutStdio): NodeChildProcess.ChildProcessWithoutNullStreams;
export function spawn(command: string, args: readonly string[], options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioPipe, NodeChildProcess.StdioPipe, NodeChildProcess.StdioPipe>): NodeChildProcess.ChildProcessByStdio<Writable, Readable, Readable>;
export function spawn(command: string, args: readonly string[], options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioPipe, NodeChildProcess.StdioPipe, NodeChildProcess.StdioNull>): NodeChildProcess.ChildProcessByStdio<Writable, Readable, null>;
export function spawn(command: string, args: readonly string[], options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioPipe, NodeChildProcess.StdioNull, NodeChildProcess.StdioPipe>): NodeChildProcess.ChildProcessByStdio<Writable, null, Readable>;
export function spawn(command: string, args: readonly string[], options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioNull, NodeChildProcess.StdioPipe, NodeChildProcess.StdioPipe>): NodeChildProcess.ChildProcessByStdio<null, Readable, Readable>;
export function spawn(command: string, args: readonly string[], options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioPipe, NodeChildProcess.StdioNull, NodeChildProcess.StdioNull>): NodeChildProcess.ChildProcessByStdio<Writable, null, null>;
export function spawn(command: string, args: readonly string[], options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioNull, NodeChildProcess.StdioPipe, NodeChildProcess.StdioNull>): NodeChildProcess.ChildProcessByStdio<null, Readable, null>;
export function spawn(command: string, args: readonly string[], options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioNull, NodeChildProcess.StdioNull, NodeChildProcess.StdioPipe>): NodeChildProcess.ChildProcessByStdio<null, null, Readable>;
export function spawn(command: string, args: readonly string[], options: NodeChildProcess.SpawnOptionsWithStdioTuple<NodeChildProcess.StdioNull, NodeChildProcess.StdioNull, NodeChildProcess.StdioNull>): NodeChildProcess.ChildProcessByStdio<null, null, null>;
export function spawn(command: string, args: readonly string[], options: NodeChildProcess.SpawnOptions): NodeChildProcess.ChildProcess;

export function fork(modulePath: string | URL, options?: NodeChildProcess.ForkOptions): NodeChildProcess.ChildProcess;
export function fork(modulePath: string | URL, args?: readonly string[], options?: NodeChildProcess.ForkOptions): NodeChildProcess.ChildProcess;

// execSync function with Node.js signatures
export function execSync(command: string): Buffer;
export function execSync(command: string, options: NodeChildProcess.ExecSyncOptionsWithStringEncoding): string;
export function execSync(command: string, options: NodeChildProcess.ExecSyncOptionsWithBufferEncoding): Buffer;
export function execSync(command: string, options?: NodeChildProcess.ExecSyncOptions): string | Buffer;
export function execSync(command: string, options?: NodeChildProcess.ExecSyncOptions): string | Buffer {
	// TODO: Implement the actual execSync functionality
	throw new Error("execSync is not yet implemented");
}

// execFileSync function with Node.js signatures
export function execFileSync(file: string): Buffer;
export function execFileSync(file: string, options: NodeChildProcess.ExecFileSyncOptionsWithStringEncoding): string;
export function execFileSync(file: string, options: NodeChildProcess.ExecFileSyncOptionsWithBufferEncoding): Buffer;
export function execFileSync(file: string, options?: NodeChildProcess.ExecFileSyncOptions): string | Buffer;
export function execFileSync(file: string, args: readonly string[]): Buffer;
export function execFileSync(file: string, args: readonly string[], options: NodeChildProcess.ExecFileSyncOptionsWithStringEncoding): string;
export function execFileSync(file: string, args: readonly string[], options: NodeChildProcess.ExecFileSyncOptionsWithBufferEncoding): Buffer;
export function execFileSync(file: string, args?: readonly string[], options?: NodeChildProcess.ExecFileSyncOptions): string | Buffer;
export function execFileSync(file: string, ...args: any[]): string | Buffer {
	// TODO: Implement the actual execFileSync functionality
	throw new Error("execFileSync is not yet implemented");
}

// spawnSync function with Node.js signatures
export function spawnSync(command: string): NodeChildProcess.SpawnSyncReturns<Buffer>;
export function spawnSync(command: string, options: NodeChildProcess.SpawnSyncOptionsWithStringEncoding): NodeChildProcess.SpawnSyncReturns<string>;
export function spawnSync(command: string, options: NodeChildProcess.SpawnSyncOptionsWithBufferEncoding): NodeChildProcess.SpawnSyncReturns<Buffer>;
export function spawnSync(command: string, options?: NodeChildProcess.SpawnSyncOptions): NodeChildProcess.SpawnSyncReturns<string | Buffer>;
export function spawnSync(command: string, args: readonly string[]): NodeChildProcess.SpawnSyncReturns<Buffer>;
export function spawnSync(command: string, args: readonly string[], options: NodeChildProcess.SpawnSyncOptionsWithStringEncoding): NodeChildProcess.SpawnSyncReturns<string>;
export function spawnSync(command: string, args: readonly string[], options: NodeChildProcess.SpawnSyncOptionsWithBufferEncoding): NodeChildProcess.SpawnSyncReturns<Buffer>;
export function spawnSync(command: string, args?: readonly string[], options?: NodeChildProcess.SpawnSyncOptions): NodeChildProcess.SpawnSyncReturns<string | Buffer> {}
