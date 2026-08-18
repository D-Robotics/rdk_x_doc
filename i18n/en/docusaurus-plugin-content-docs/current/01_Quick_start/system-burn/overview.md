---
sidebar_position: 1
title: "Flashing overview"
description: "An overview of two flashing scenarios, tool selection, and entry points for RDK X5 and RDK X5 Module"
---

import DocScope from '@site/src/components/DocScope';

# Flashing overview

Flashing is the process of writing a system image or firmware to a storage medium. There are two types of operations:

| Operation | What is written | Storage medium | Primary scenarios |
|:---|:---|:---|:---|
| [Flash system image](./burn-sd-card.md) | Ubuntu system image | microSD card (or eMMC) | First-time use, system upgrade, switching systems |
| [Upgrade miniboot](./upgrade-miniboot.md) | miniboot, U-Boot, and other low-level firmware | Onboard NAND | Routine upgrade, device fails to boot normally |

## Tool selection

<DocScope versions=">=3.5.0" products="RDK X5">

| Tool | Flash system image | Upgrade miniboot | Description |
|:---|:---|:---|:---|
| Rufus | ✅ | ❌ | Windows tool, supports solo microSD card flashing and in-board microSD card flashing |
| RDK Studio | ✅ | ❌ | Supports Windows / Mac, can download images online or import locally |
| XBurn | ✅ | ✅ | Supports Windows / Linux / macOS, can flash system images and miniboot |
| rdk-miniboot-update | ❌ | ✅ | Command-line tool, requires the system to be running normally and connected to the network |

</DocScope>

<DocScope versions=">=3.5.0" products="RDK X5 Module">

| Tool | Flash system image | Upgrade miniboot | Description |
|:---|:---|:---|:---|
| Rufus | ✅ | ❌ | Windows tool, supports solo microSD card flashing, in-board microSD card flashing, and eMMC flashing |
| RDK Studio | ✅ | ❌ | Supports Windows / Mac, can download images online or import locally |
| XBurn | ✅ | ✅ | Supports Windows / Linux / macOS, can flash system images and miniboot |
| rdk-miniboot-update | ❌ | ✅ | Command-line tool, requires the system to be running normally and connected to the network |

</DocScope>