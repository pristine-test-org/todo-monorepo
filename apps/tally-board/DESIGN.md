---
name: Tally Board
description: The shared to-do list as a two-column board of cards, To do and Done
colors:
  canvas: "#EEF1F8"
  topbar: "#1B2340"
  topbar-ink: "#F4F6FC"
  column: "#E1E6F2"
  card: "#FFFFFF"
  ink: "#172036"
  ink-soft: "#5A6481"
  line: "#CCD3E4"
  accent: "#4F46E5"
  accent-hover: "#4338CA"
  accent-ink: "#FFFFFF"
  done: "#0F8A6A"
  danger: "#C2372B"
  danger-tint: "#FDE8E5"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "14px"
  pill: "999px"
spacing:
  container: "64rem"
  gutter: "1.5rem"
  gutter-mobile: "1rem"
components:
  topbar:
    backgroundColor: "{colors.topbar}"
    textColor: "{colors.topbar-ink}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.sm}"
  column:
    backgroundColor: "{colors.column}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.sm}"
    shadow: "0 1px 2px rgb(23 32 54 / 0.08), 0 2px 8px rgb(23 32 54 / 0.06)"
---

## Overview

Tally Board shows the same shared list as a small kanban board: a dark navy top bar, then a wide
canvas with two columns, **To do** and **Done**. Each item is a white card. It should feel like a
team tool, crisp and a little busier than Tally, but still one board and one primary action.

## Colors

- **Topbar** navy carries the wordmark and the open/done counts.
- **Canvas** is the page; **column** is the slightly darker tray each column sits in.
- **Accent** (indigo) is the Add card button, focus rings and the To do column dot.
- **Done** (green) is the Done column dot and the left edge of finished cards. It is never a button fill.
- **Danger** and its tint are only for the error notice and the Remove hover.

## Typography

- **Space Grotesk** 700 for the wordmark, column titles (uppercase, tracked) and the empty-state title.
- **DM Sans** for everything else at 15px.

## Layout

- Full-width top bar; content in a centered `64rem` container with a `1.5rem` gutter.
- Order: add bar → notice (if any) → board or state.
- Two equal columns side by side; under 640px they stack, To do first.

## Elevation & Depth

- Cards carry a soft two-layer shadow. Columns and the top bar are flat.

## Shapes

- Cards, inputs and buttons use `8px`; columns and the empty state `14px`; count badges and card
  actions are pills.

## Components

- **Add bar:** input plus the indigo **Add card** button, dimmed until there is text.
- **Card:** title, then a pill **Mark done** / **Reopen** button and a quiet **Remove** on the right.
  Finished cards get a green left edge and a struck-through title.
- **Column empty:** one line of ink-soft text inside the tray.
- **States:** loading and empty sit in a column-coloured tray; errors are a tinted notice with a red
  left edge and **Try again** when reloading can help.

## Do's and Don'ts

**Do**
- Keep exactly two columns.
- Move a card by toggling it; no drag and drop.

**Don't**
- Add more columns, labels, due dates or avatars.
- Use the done green for anything but finished work.
