# Changelog

## Unreleased

Additive API cleanup intended for a minor release after v0.3.0; no package rename or version bump is included.

- Added `simple-input`, explicit native-control props, stable label IDs for unnamed inputs, and reactive/native input types. `simple-*` is the replacement naming used by this package for input and button components.
- Retained `hrb-input` only as a compatibility adapter for one migration window (at least one compatibility release after v0.3.0). It now renders `hrb-input > simple-input > input`; see the [migration guide](readme.md#migrating-from-hrb-input) for CSS and event-listener considerations.
- Intentionally fixed the deprecated `hrb-input` to forward types outside its legacy presets (such as `password`, `tel`, and `url`) to the native input instead of coercing them to `text`, and to generate IDs for unnamed inputs without an explicit `id-input`.

The npm package name and loader paths remain stable. Package-wide rebranding, starter-example removal, and legacy-tag removal require separate migrations; removing the legacy tag requires a separately announced breaking release.
