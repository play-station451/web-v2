# <span style="color: #32ae62;">Backend Configuration Options</span>

Terbium's backend is pretty cool and is configurable with the .env file in the root of this directory, alternatively during the setup if your .env file does not exist it will walk you through setting it up.

Now with this being said theres a couple of things that could be confusing, so heres a rundown of the configurations:

- <span style="color: #32ae62;">MASQR</span>: This enables [MASQR](https://github.com/titaniumnetwork-dev/masqr-project) (A Anti Link Leaking System)
- <span style="color: #32ae62;">License Server Url</span>: This is another MASQR Configuration that is the License Server Url where MASQR communicated and validates keys with. If you dont have masqr enabled you do not need to change it.
- <span style="color: #32ae62;">Whitelisted Domains</span>: This is another MASQR Configuration that is the domains MASQR will not apply to.

Also in the backend, is [WispJS](https://github.com/MercuryWorkshop/wisp-client-js/tree/rewrite) pointing to /wisp/, please note that by default on all terbium instances the DNS Servers 1.1.1.3 and 1.0.0.3.
