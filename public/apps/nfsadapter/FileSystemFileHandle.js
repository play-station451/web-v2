const kAdapter$1 = Symbol('adapter');

/**
 * @typedef {Object} FileSystemHandlePermissionDescriptor
 * @property {('read'|'readwrite')} [mode='read']
 */
class FileSystemHandle {
  /** @type {FileSystemHandle} */
  [kAdapter$1]

  /** @type {string} */
  name
  /** @type {('file'|'directory')} */
  kind

  /** @param {FileSystemHandle & {writable}} adapter */
  constructor (adapter) {
    this.kind = adapter.kind;
    this.name = adapter.name;
    this[kAdapter$1] = adapter;
  }

  /** @param {FileSystemHandlePermissionDescriptor} descriptor */
  async queryPermission (descriptor = {}) {
    const { mode = 'read' } = descriptor;
    const handle = this[kAdapter$1];

    if (handle.queryPermission) {
      return handle.queryPermission({mode})
    }

    if (mode === 'read') {
      return 'granted'
    } else if (mode === 'readwrite') {
      return handle.writable ? 'granted' : 'denied'
    } else {
      throw new TypeError(`Mode ${mode} must be 'read' or 'readwrite'`)
    }
  }

  async requestPermission ({mode = 'read'} = {}) {
    const handle = this[kAdapter$1];
    if (handle.requestPermission) {
      return handle.requestPermission({mode})
    }

    if (mode === 'read') {
      return 'granted'
    } else if (mode === 'readwrite') {
      return handle.writable ? 'granted' : 'denied'
    } else {
      throw new TypeError(`Mode ${mode} must be 'read' or 'readwrite'`)
    }
  }

  /**
   * Attempts to remove the entry represented by handle from the underlying file system.
   *
   * @param {object} options
   * @param {boolean} [options.recursive=false]
   */
  async remove (options = {}) {
    await this[kAdapter$1].remove(options);
  }

  /**
   * @param {FileSystemHandle} other
   */
  async isSameEntry (other) {
    if (this === other) return true
    if (
      (!other) ||
      (typeof other !== 'object') ||
      (this.kind !== other.kind) ||
      (!other[kAdapter$1])
    ) return false
    return this[kAdapter$1].isSameEntry(other[kAdapter$1])
  }
}

Object.defineProperty(FileSystemHandle.prototype, Symbol.toStringTag, {
  value: 'FileSystemHandle',
  writable: false,
  enumerable: false,
  configurable: true
});

// Safari safari doesn't support writable streams yet.
if (globalThis.FileSystemHandle) {
  globalThis.FileSystemHandle.prototype.queryPermission ??= function (descriptor) {
    return 'granted'
  };
}

const config = {
  ReadableStream: globalThis.ReadableStream,
  WritableStream: globalThis.WritableStream,
  TransformStream: globalThis.TransformStream,
  DOMException: globalThis.DOMException,
  Blob: globalThis.Blob,
  File: globalThis.File,
};

const { WritableStream } = config;

class FileSystemWritableFileStream extends WritableStream {
  #writer
  constructor (writer) {
    super(writer);
    this.#writer = writer;
    // Stupid Safari hack to extend native classes
    // https://bugs.webkit.org/show_bug.cgi?id=226201
    Object.setPrototypeOf(this, FileSystemWritableFileStream.prototype);

    /** @private */
    this._closed = false;
  }

  async close () {
    this._closed = true;
    const w = this.getWriter();
    const p = w.close();
    w.releaseLock();
    return p
    // return super.close ? super.close() : this.getWriter().close()
  }

  /** @param {number} position */
  seek (position) {
    return this.write({ type: 'seek', position })
  }

  /** @param {number} size */
  truncate (size) {
    return this.write({ type: 'truncate', size })
  }

  // The write(data) method steps are:
  write (data) {
    if (this._closed) {
      return Promise.reject(new TypeError('Cannot write to a CLOSED writable stream'))
    }

    // 1. Let writer be the result of getting a writer for this.
    const writer = this.getWriter();

    // 2. Let result be the result of writing a chunk to writer given data.
    const result = writer.write(data);

    // 3. Release writer.
    writer.releaseLock();

    // 4. Return result.
    return result
  }
}

Object.defineProperty(FileSystemWritableFileStream.prototype, Symbol.toStringTag, {
  value: 'FileSystemWritableFileStream',
  writable: false,
  enumerable: false,
  configurable: true
});

Object.defineProperties(FileSystemWritableFileStream.prototype, {
  close: { enumerable: true },
  seek: { enumerable: true },
  truncate: { enumerable: true },
  write: { enumerable: true }
});

// Safari safari doesn't support writable streams yet.
if (
  globalThis.FileSystemFileHandle &&
  !globalThis.FileSystemFileHandle.prototype.createWritable &&
  !globalThis.FileSystemWritableFileStream
) {
  globalThis.FileSystemWritableFileStream = FileSystemWritableFileStream;
}

const errors = {
  INVALID: ['seeking position failed.', 'InvalidStateError'],
  GONE: ['A requested file or directory could not be found at the time an operation was processed.', 'NotFoundError'],
  MISMATCH: ['The path supplied exists, but was not an entry of requested type.', 'TypeMismatchError'],
  MOD_ERR: ['The object can not be modified in this way.', 'InvalidModificationError'],
  SYNTAX: m => [`Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. ${m}`, 'SyntaxError'],
  SECURITY: ['It was determined that certain files are unsafe for access within a Web application, or that too many calls are being made on file resources.', 'SecurityError'],
  DISALLOWED: ['The request is not allowed by the user agent or the platform in the current context.', 'NotAllowedError']
};

const { INVALID, SYNTAX, GONE } = errors;

const kAdapter = Symbol('adapter');

class FileSystemFileHandle extends FileSystemHandle {
  /** @type {FileSystemFileHandle} */
  [kAdapter]

  constructor (adapter) {
    super(adapter);
    this[kAdapter] = adapter;
  }

  /**
   * @param  {Object} [options={}]
   * @param  {boolean} [options.keepExistingData]
   * @returns {Promise<FileSystemWritableFileStream>}
   */
  async createWritable (options = {}) {
    return new FileSystemWritableFileStream(
      await this[kAdapter].createWritable(options)
    )
  }

  /**
   * @returns {Promise<File>}
   */
  async getFile () {
    return this[kAdapter].getFile()
  }
}

Object.defineProperty(FileSystemFileHandle.prototype, Symbol.toStringTag, {
  value: 'FileSystemFileHandle',
  writable: false,
  enumerable: false,
  configurable: true
});

Object.defineProperties(FileSystemFileHandle.prototype, {
  createWritable: { enumerable: true },
  getFile: { enumerable: true }
});

// Safari doesn't support async createWritable streams yet.
if (
  globalThis.FileSystemFileHandle &&
  !globalThis.FileSystemFileHandle.prototype.createWritable
) {
  const wm = new WeakMap();

  let workerUrl;

  // Worker code that should be inlined (can't use any external functions)
  const code = () => {
    let fileHandle, handle;

    onmessage = async evt => {
      const port = evt.ports[0];
      const cmd = evt.data;
      switch (cmd.type) {
        case 'open':
          const file = cmd.name;

          let dir = await navigator.storage.getDirectory();

          for (const folder of cmd.path) {
            dir = await dir.getDirectoryHandle(folder);
          }

          fileHandle = await dir.getFileHandle(file);
          handle = await fileHandle.createSyncAccessHandle();
          break
        case 'write':
          handle.write(cmd.data, { at: cmd.position });
          handle.flush();
          break
        case 'truncate':
          handle.truncate(cmd.size);
          break
        case 'abort':
        case 'close':
          handle.close();
          break
      }

      port.postMessage(0);
    };
  };


  globalThis.FileSystemFileHandle.prototype.createWritable = async function (options) {
    // Safari only support writing data in a worker with sync access handle.
    if (!workerUrl) {
      const stringCode = `(${code.toString()})()`;
      const blob = new Blob([stringCode], {
        type: 'text/javascript'
      });
      workerUrl = URL.createObjectURL(blob);
    }
    const worker = new Worker(workerUrl, { type: 'module' });

    let position = 0;
    const textEncoder = new TextEncoder();
    let size = await this.getFile().then(file => file.size);

    const send = message => new Promise((resolve, reject) => {
      const mc = new MessageChannel();
      mc.port1.onmessage = evt => {
        if (evt.data instanceof Error) reject(evt.data);
        else resolve(evt.data);
        mc.port1.close();
        mc.port2.close();
        mc.port1.onmessage = null;
      };
      worker.postMessage(message, [mc.port2]);
    });

    // Safari also don't support transferable file system handles.
    // So we need to pass the path to the worker. This is a bit hacky and ugly.
    const root = await navigator.storage.getDirectory();
    const parent = await wm.get(this);
    const path = await root.resolve(parent);

    // Should likely never happen, but just in case...
    if (path === null) throw new DOMException(...GONE)
    await send({ type: 'open', path, name: this.name });

    if (options?.keepExistingData === false) {
      await send({ type: 'truncate', size: 0 });
      size = 0;
    }

    const ws = new FileSystemWritableFileStream({
      start: ctrl => {
      },
      async write(chunk) {
        const isPlainObject = chunk?.constructor === Object;

        if (isPlainObject) {
          chunk = { ...chunk };
        } else {
          chunk = { type: 'write', data: chunk, position };
        }

        if (chunk.type === 'write') {
          if (!('data' in chunk)) {
            await send({ type: 'close' });
            throw new DOMException(...SYNTAX('write requires a data argument'))
          }

          chunk.position ??= position;

          if (typeof chunk.data === 'string') {
            chunk.data = textEncoder.encode(chunk.data);
          }

          else if (chunk.data instanceof ArrayBuffer) {
            chunk.data = new Uint8Array(chunk.data);
          }

          else if (!(chunk.data instanceof Uint8Array) && ArrayBuffer.isView(chunk.data)) {
            chunk.data = new Uint8Array(chunk.data.buffer, chunk.data.byteOffset, chunk.data.byteLength);
          }

          else if (!(chunk.data instanceof Uint8Array)) {
            const ab = await new Response(chunk.data).arrayBuffer();
            chunk.data = new Uint8Array(ab);
          }

          if (Number.isInteger(chunk.position) && chunk.position >= 0) {
            position = chunk.position;
          }
          position += chunk.data.byteLength;
          size += chunk.data.byteLength;
        } else if (chunk.type === 'seek') {
          if (Number.isInteger(chunk.position) && chunk.position >= 0) {
            if (size < chunk.position) {
              throw new DOMException(...INVALID)
            }
            console.log('seeking', chunk);
            position = chunk.position;
            return // Don't need to enqueue seek...
          } else {
            await send({ type: 'close' });
            throw new DOMException(...SYNTAX('seek requires a position argument'))
          }
        } else if (chunk.type === 'truncate') {
          if (Number.isInteger(chunk.size) && chunk.size >= 0) {
            size = chunk.size;
            if (position > size) { position = size; }
          } else {
            await send({ type: 'close' });
            throw new DOMException(...SYNTAX('truncate requires a size argument'))
          }
        }

        await send(chunk);
      },
      async close () {
        await send({ type: 'close' });
        worker.terminate();
      },
      async abort (reason) {
        await send({ type: 'abort', reason });
        worker.terminate();
      },
    });

    return ws
  };

  const orig = FileSystemDirectoryHandle.prototype.getFileHandle;
  FileSystemDirectoryHandle.prototype.getFileHandle = async function (...args) {
    const handle = await orig.call(this, ...args);
    wm.set(handle, this);
    return handle
  };
}

export { FileSystemFileHandle, FileSystemFileHandle as default };
