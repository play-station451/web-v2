export class Processes {
    get procs() {
        return window.tb.process.list()
    }

    set procs(value) {
        console.log(`API Stub, ${value} will not be used`)
        window.tb.process.create()
    }

    remove(pid: number) {
        window.tb.process.kill(String(pid))
    }

    register(proc: Process) {
        console.log(`API Stub, ${proc} will not be used`)
        window.tb.process.create()
    }

    create(proc: any) {
        console.log(`API Stub, ${proc} will not be used`)
        window.tb.process.create()
    }
}

abstract class Process {
    abstract pid: number;
    abstract title: string;
    // @ts-expect-error
    stdout: ReadableStream<Uint8Array>;
    // @ts-expect-error
    stderr: ReadableStream<Uint8Array>;
    // @ts-expect-error
    stdin: WritableStream<Uint8Array>;

    kill() {
        window.tb.process.kill(String(this.pid))
    }
    abstract get alive(): boolean;
}
