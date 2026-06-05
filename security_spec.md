# Security Specification Model - RAMS Shared Web Space

## 1. Data Invariants
- Any visitor (third-party client) can read bulletin board notes and physical records photo albums.
- Correctly formatted payloads (fitting within strict size bounds to prevent resource exhaustion and data-poisoning) are required for notes and photo uploads.
- Custom/ghost keys outside of the defined schemas for Note and Photo objects are blocked.

## 2. Invalid Payload Vectors (Negative Tests)
1. Injecting jumbo script or extremely long strings into `noteId` or `photoId`.
2. Missing required visual properties such as `color` or `text` on Note drafts.
3. Note position coordinates `x` or `y` using invalid strings instead of numbers.
4. Sending photo objects with absent image `url` records.
5. Injected properties/fields (Ghost Keys) in Note drafts.
6. Downloads statistic using negative integers.
7. Title field on Photos using an invalid list/array type.

## 3. Production Hardened Rules Definition
All requests are validated model-by-model at the database firewall layer.
