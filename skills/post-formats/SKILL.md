---
name: post-formats
description: Choose the right LinkedIn post format — image, document/carousel, text, video, or link — using the 2026 medians and comment shares, and keep links out of the post body. Use when deciding how a post should be packaged. Do not use for ad formats.
when_to_use: "Use when choosing a format for an idea, or diagnosing why a format underperformed."
not_for: "Paid formats — use skills/ads-creative."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Numbers come from `skills/linkedin-algorithm`.

# Post Formats

The platform wants people to stay on the platform. Native formats travel; links get buried.

## The data

| Format | Signal from the report | Use it for |
|---|---|---|
| **Image** | Median 70 vs 25 for link/article (**2.8×**). Comment share 22.5%. 78% of top-1% posts are image-based. | One idea, one chart, one before/after |
| **Document (carousel)** | Comment share 21.7% | Frameworks, step-by-steps, teardowns |
| **Text** | Comment share 21.4% | Stories and lessons; add an image to lift reach |
| **Video** | Comment share 14.7% | A face explaining one idea; subtitles always |
| **Link / article** | Median 25; comment share 12.6% | Avoid in the body. Put the link in the first comment. |

## Rules

1. **Lead with image or document** for anything you want to travel.
2. **Keep links out of the body.** Share the link in the first comment, or put the content in the document itself.
3. **Match format to idea:** a framework wants a document, and a single number wants an image.
4. **Make the image teach.** A chart or a framework, not a stock photo.

## Routing

- Gate (checks for body links) → `skills/content-evaluation`
- Repurpose one idea into several formats → `skills/repurposing`
