/**
 * @enum DoHProvider
 * @constant `google` @see https://developers.google.com/speed/public-dns/docs/doh/json
 * @constant `cf` @see https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/
 */
export enum DohProvider {
  google = "google",
  cf = "cf",
}

/**
 * In order for the RR Type to be listed here, they must be supported by both Google and CF
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
  PTR = 12,
  /**
   * IPv6 address record
   * Defined by RFC 3596
   */
  AAAA = 28,
}
export enum Rcode {
  /**
   * No Error
   * @see https://www.iana.org/go/rfc1035
   */
  NOERROR = 0,
  /**
   * Format Error
   * @see https://www.iana.org/go/rfc1035
   */
  FORMERR = 1,
  /**
   * Server Failure
   * @see https://www.iana.org/go/rfc1035
   */
  SERVFAIL = 2,
  /**
   * Non-Existent Domain
   * @see https://www.iana.org/go/rfc1035
   */
  NXDOMAIN = 3,
  /**
   * Not Implemented
   * @see https://www.iana.org/go/rfc1035
   */
  NOTIMP = 4,
  /**
   * Query Refused
   * @see https://www.iana.org/go/rfc1035
   */
  REFUSED = 5,
  /**
   * Name Exists when it should not
   * @see https://www.iana.org/go/rfc2136
   * @see https://www.iana.org/go/rfc6672
   */
  YXDOMAIN = 6,
  /**
   * RR Set Exists when it should not
   * @see https://www.iana.org/go/rfc2136
   */
  YXRRSET = 7,
  /**
   * RR Set that should exist does not
   * @see https://www.iana.org/go/rfc2136
   */
  NXRRSET = 8,
  /**
   * Server Not Authoritative for zone / Not Authorized
   * @see https://www.iana.org/go/rfc2136
   * @see https://www.iana.org/go/rfc8945
   */
  NOTAUTH = 9,
  /**
   * Name not contained in zone
   * @see https://www.iana.org/go/rfc2136
   */
  NOTZONE = 10,
  /**
   * DSO-TYPE Not Implemented
   * @see https://www.iana.org/go/rfc8490
   */
  DSOTYPENI = 11,
  // 12-15 are Unassigned
  /**
   * Bad OPT Version / TSIG Signature Failure
   * @see https://www.iana.org/go/rfc6891
   * @see https://www.iana.org/go/rfc8945
   */
  BADVERS = 16,
  /**
   * Key not recognized
   * @see https://www.iana.org/go/rfc8945
   */
  BADKEY = 17,
  /**
   * Signature out of time window
   * @see https://www.iana.org/go/rfc8945
   */
  BADTIME = 18,
  /**
   * Bad TKEY Mode
   * @see https://www.iana.org/go/rfc2930
   */
  BADMODE = 19,
  /**
   * Duplicate key name
   * @see https://www.iana.org/go/rfc2930
   */
  BADNAME = 20,
  /**
   * Algorithm not supported
   * @see https://www.iana.org/go/rfc2930
   */
  BADALG = 21,
  /**
   * Bad Truncation
   * @see https://www.iana.org/go/rfc8945
   */
  BADTRUNC = 22,
  /**
   * Bad/missing Server Cookie
   * @see https://www.iana.org/go/rfc7873
   */
  BADCOOKIE = 23,
  // 24-3840 are Unassigned
  // 3841-4095 are Reserved for Private Use (RFC6895)
  // 4096-65534 are Unassigned
  // 65535 is Reserved, can be allocated by Standards Action (RFC6895)
}

/**
 * @see https://developers.google.com/speed/public-dns/docs/doh/json
 */
export interface ResolveOpts {
  name: string;
  type: RrType;
  cd: boolean;
  ct: string;
  do: false;
  edns_client_subnet: string;
  random_padding: string;
}
export interface ResolveJsonRes {
  /** Whether the response is truncated */
  TC: boolean;
  /** Always true for Google Public DNS */
  RD: boolean;
  /** Always true for Google Public DNS */
  RA: boolean;
  /** Whether all response data was validated with DNSSEC */
  AD: boolean;
  /** Whether the client asked to disable DNSSEC */
  CD: boolean;
  Question: {
    name: string;
    type: Rcode;
  }[];
}
