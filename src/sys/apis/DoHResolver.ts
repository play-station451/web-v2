/**
 * @module
 * 
 * This will be defined on `window.tb.DohResolver` for any apps to use
 * There will also be a cli command, which will be API-compatible with `dig`
 * This will also be used for providing the `net.resolveHost` API in Lemonade
 * While wisp has a backend for dig on the host server, this is compatible with every proxy transport
 */

/**
 * @enum DoHProvider
 * @constant `google` @see https://developers.google.com/speed/public-dns/docs/doh/json
 * @constant `cf` @see https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/
 */
export enum DohProvider {
    google,
    cf
}

/**
 * @see https://en.wikipedia.org/wiki/List_of_DNS_record_types
 * @see http://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/#ip-address-resolution
 */
export enum RrType {
    /**
     * Address record
     * Defined by RFC 1035
     */
    A = 1,
    /**
     * Canonical name record
     * Defined by RFC 1035
     */
    CNAME = 5,
    /**
     * Pointer record
     * Defined by RFC 1035
     */
    PTR = 12
    /**
     * IPv6 address record
     * Defined by RFC 3596
     */
    AAAA = 28,
    /**
     * DNS Key record
     * Defined by RFC 4034
     */
    DNSKEY = 48
}
/**
 * @see https://developers.google.com/speed/public-dns/docs/doh/json
 */
export interface ResolveOpts {
    name: string
    type: RrType;
    cd: boolean;
    ct: string;
    do: false;
    edns_client_subnet: string;
    random_padding: string
}

/**
 * 
 */
export class DohResolver {
    /**
     * The current selected provider
     */
    provider: DohProvider

    constructor(options: {
        provider: DohProvider
    }) {
        this.provider = options.provider;
    }

    switchProvider(provider: DohProvider) {
        this.provider = provider
    }

    /**
     * Resolves a DNS query over DoH
     * Basically serves as an SDK to this JSON API @see https://developers.google.com/speed/public-dns/docs/doh/json#supported_parameters
     * 
     * @param name The hostname
     * @param type The DNS RR type (e.g AAAA, A, CNAME, etc...) @see https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/#ip-address-resolution
     * @param 
     * 
     */
    async resolveDoh(opts: ResolveOpts) {
        let penis
        switch (this.provider) {
            case DohProvider.cf:
                penis = "https://cloudflare-dns.com/dns-query"
                break
            case DohProvider.google:
                
                break
        }
        // opts.name
        const res = await window.tb.libcurl.fetch(penis, {
            headers: {
                Accept: "application/dns-json",
            }
        });
        const resolved = await res.json()
        const ans = resolved.Answear.filter((ans: any) => ans.type === 1) ?? []
        return ans.map((ans: any) => ans.data);
    }

    // TODO: Implement (to some poor soul who wants to read C and the dig manual)
    /*
    /**
     * @see https://linux.die.net/man/1/dig
     * @see https://users.isc.org/~each/doxygen/bind9/dig_8c-source.html
     *\/
    async digResolve(digCmd: string) {
    }
    */
}