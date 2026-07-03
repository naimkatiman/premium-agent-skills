# Social preview

`social-preview.png` (1280x640) ships here and is used as the README hero.

Composition: the concept-one mascot on a dark field, the "Premium Agent Skills"
wordmark, the two skill names, and the MIT/repo footer.

## Setting it as the repository social preview

GitHub does not expose social-preview upload via the REST API, so this is a
one-time manual step: repository Settings, General, Social preview, upload
`social-preview.png`. The committed file is the source of truth; re-upload it
there whenever it changes.

## Regenerating

The image is rendered from a small HTML design at 1280x640. To refresh it, adjust
the design, screenshot at a 1280x640 viewport, and replace this file.
