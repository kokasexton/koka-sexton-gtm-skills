# Ads outbound sync — worked example

`before.txt` messages everyone who saw an ad and says so. `after.txt` follows the skill: only real engagement counts as a signal, ads are scored with a second signal, the SDR gets context, and the message talks about the topic, not the tracking.

No statistics are used.

- Combine signals → `skills/multi-signal`
- Pinned by `tests/outbound-sync-examples.test.mjs`
