---
name: Tally Lite
description: The shared to-do list as plain monospaced text on a dark screen
colors:
  bg: "#101211"
  surface: "#171A18"
  ink: "#D9DDD8"
  ink-soft: "#7D857F"
  line: "#2A2F2C"
  accent: "#F2B33D"
  accent-ink: "#101211"
  danger: "#FF7A66"
typography:
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  mono-strong:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontWeight: 600
rounded:
  none: "0"
spacing:
  container: "44rem"
  gutter: "1.25rem"
  page-top: "3rem"
  page-top-mobile: "1.75rem"
components:
  prompt-input:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.line}"
    focusBorderColor: "{colors.accent}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.none}"
---

## Overview

Tally Lite is the list for people who live in a terminal: dark, one monospaced face, square corners,
amber as the only colour. It reads like a text file with numbered lines. Nothing decorative.

## Colors

- **Bg** is the page; **surface** is the input field and the hover band on a row.
- **Ink** for item text, **ink-soft** for line numbers, finished items, the `rm` action and hints.
- **Accent** (amber) for the `~/` prompt, the `>` caret, `[ ]`/`[x]` boxes, the open count and the
  `[add]` button. Nothing else.
- **Danger** (salmon) is text only: error lines and the `rm` hover.

## Typography

- **IBM Plex Mono** everywhere, 14px, line-height 1.6. 600 weight for the wordmark, counts and buttons.
- Lowercase for the wordmark, placeholders and actions; sentences keep normal case.

## Layout

- One column, `max-width: 44rem`, `1.25rem` gutter, `3rem` from the top (`1.75rem` under 480px).
- Order: `~/tally-lite` with `n/m open` and a hairline → prompt input → error line → numbered list.
- Each row: two-digit line number, `[ ]` box, text, `rm` on the right.

## Elevation & Depth

- None. No shadows, no gradients; one hairline under the heading and around the input.

## Shapes

- Square corners on everything. Checkboxes are drawn as `[ ]` and `[x]` text; the real checkbox is
  visually hidden but keeps keyboard focus.

## Components

- **Prompt input:** `>` caret, borderless input, amber `[add]`. The border turns amber on focus.
- **Row:** numbered via a CSS counter; finished rows go ink-soft and struck through.
- **States:** `loading…`, `-- empty --` and `! message` lines in plain text, `[try again]` when it helps.

## Do's and Don'ts

**Do**
- Keep it text-first: brackets instead of icons.

**Don't**
- Add a second colour, rounded corners or a light theme.
