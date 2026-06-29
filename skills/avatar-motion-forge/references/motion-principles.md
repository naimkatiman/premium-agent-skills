# Motion principles, premium restraint

Premium reads as *restraint*, not ornament. The mascot communicates system state,
not cartoon emotion. One silhouette, one structural accent, low facial detail,
motion that resolves cleanly.

## Premium state model

| State | Duration | Visual behavior |
|---|---|---|
| idle | 2200–2800 ms loop | slow breathing, minimal drift, occasional blink or halo shimmer |
| hover | 120–180 ms in / out | slight lift, brighten accent, 3–5% scale increase |
| active | 180–260 ms looped accent pulse | forward focus, tighter motion, confidence, not panic |
| success | 280–420 ms | upward ease, ring resolve, brief micro-spark |
| error | 220–320 ms | short recoil or tilt, brief desaturation or warning pulse |

Default `timings_ms`:

```json
{ "idle_loop": 2400, "hover_in": 160, "active_pulse": 220, "success": 360, "error": 280 }
```

## Format guidance

| Format | Best first use | Notes |
|---|---|---|
| SVG | static badge + source of truth | hand-tunable, scales cleanly, diff-able |
| Lottie JSON | OSS web/mobile motion | open vector format, broad player support; ship this first |
| dotLottie | packaged Lottie delivery | can bundle interactivity; player-specific tooling |
| Rive | premium interactive | strong state machines and runtime inputs; `.riv` export is a paid-plan feature |

**Rollout:** ship SVG + Lottie in v0.1, add Rive state machines in v0.2 when you
want richer interactivity and accept the export-plan constraint.

## Rive state machine blueprint

Inputs:

| Input | Type | Use |
|---|---|---|
| `isHover` | boolean | hover lift and accent brighten |
| `isActive` | boolean | active pulse / focus |
| `hasSuccess` | trigger | quick resolve animation |
| `hasError` | trigger | short recoil / warning |
| `intensity` | number | glow / pulse amplitude |

Transitions:

- `idle -> hover` when `isHover == true`
- `hover -> idle` when `isHover == false`
- `idle|hover -> active` when `isActive == true`
- `active -> idle` when `isActive == false`
- `* -> success` on `hasSuccess`, then `success -> idle` on completion
- `* -> error` on `hasError`, then `error -> idle` on completion

## Design budget by size

- **32×32**, silhouette + one accent only. No facial micro-detail; it disappears.
- **128×128**, silhouette, accent, eyes/beak, one motion-ready highlight layer.
- Keep stroke widths proportional; test the smallest target first.
