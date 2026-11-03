# SECURITY

This repository is **public** and contains **no credentials**. Nothing in it should ever be a secret.

## Rules

- **No secrets in the repo.** No API keys, tokens, passwords, private keys, or `.env` files — ever. If a skill needs a credential to run, it is referenced by *name* (an environment variable), never by value.
- **Scan before every push.** `node scripts/scan-secrets.mjs` runs in CI and is part of the daily improvement loop's test gate. It exits non-zero on any detected credential or sensitive filename, which blocks the push.
- **Keep personal data out.** No private contact lists, no customer data, no raw PII. Engagement data referenced in skills is aggregate and public.

## If a secret ever lands here

1. Treat it as compromised the moment it's pushed — rotation first, cleanup second.
2. Rotate the key at the provider immediately.
3. Purge it from history (`git filter-repo`), then force-push.
4. Add the pattern to `scripts/scan-secrets.mjs` so it can't recur.

## Reporting

Found something exposed? Contact Koka Sexton (kokasexton.com) directly. Do not open a public issue with the secret in it.
