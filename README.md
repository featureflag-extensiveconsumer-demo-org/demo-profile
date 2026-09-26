# demo-profile synthetic evaluator

Run `npm install`, set `LD_EVALUATION_SDK_KEY`, then use `npm run evaluate -- --cohort checkout-beta --cluster prod-eu-west-01` for a ten-evaluation one-shot batch or `npm run traffic -- --profile production` for cumulative traffic. One-shot count can be changed with `--evaluations`; `--cluster` selects a fixed synthetic cluster. Only demo-orders Production accepts `--evaluations-per-hour 10..100000` and `--context-pool-size 1..10000`. Stop traffic with Ctrl+C so pending events flush.

## Layout

| Path | What lives there |
| --- | --- |
| `app.mjs` | traffic shape, the SDK client, and one adapter per panel |
| `src/flags/keys.mjs` | every flag key, spelled once |
| `src/flags/client.mjs` | the single `boolVariation` call |
| `src/identity/`, `src/orders/`, `src/preferences/` | the panels, which take a client and return a view |
| `test/` | `node --test`, no network and no SDK |

## Feature flags

| Key | What it decides | Fallback in code |
| --- | --- | --- |
| `demo-identity-passkeys` | the passkey challenge is offered alongside the password form | `false` |
| `demo-order-history-v2` | the order tab pages the list and folds an order's shipments into one row | `false` |
| `demo-profile-preferences` | notification and privacy settings render as one consolidated panel | `false` |

A flag reaches a panel only through `isEnabled` in `src/flags/client.mjs`, so the fallback a page serves
when LaunchDarkly cannot be reached is visible at the call site.

## Tests

```bash
npm test
```

They stub the client, so they need neither a network nor an SDK key. Each panel has a test for both
branches, and one asserting that rendering asks LaunchDarkly exactly once: the traffic counts this
service reports depend on that staying true.
