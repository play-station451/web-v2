export class Net {
    async request(url: string, options: { method?: string; headers?: Record<string, string>; body?: any } = {}): Promise<Response> {
        const response = await window.tb.libcurl.fetch(url, {
            method: options.method || 'GET',
            headers: options.headers || {},
            body: options.body ? JSON.stringify(options.body) : undefined,
        });
        return response;
    }

    fetch(url: string, options: { method?: string; headers?: Record<string, string>; body?: any } = {}): Promise<Response> {
        return this.request(url, options);
    }

    isOnline() {
        return navigator.onLine
    }
}