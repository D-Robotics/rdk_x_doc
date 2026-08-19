---
sidebar_position: 1
title: "烧录概述"
description: "介绍 RDK X5 和 RDK X5 Module 的两种烧录场景、工具选型及操作入口"
---

import DocScope from '@site/src/components/DocScope';

# 烧录概述

烧录是指将系统镜像或固件写入存储介质的过程。根据写入内容和场景，分为两种操作：

| 操作 | 写入内容 | 存储介质 | 主要场景 |
|:---|:---|:---|:---|
| [烧录系统镜像](./burn-sd-card.md) | Ubuntu 系统镜像 | Micro SD 卡（或 eMMC） | 首次使用、系统升级、更换系统 |
| [升级 miniboot](./upgrade-miniboot.md) | miniboot、U-Boot 等底层固件 | 板载 NAND | 日常升级、设备无法正常启动 |

## 工具选型

<DocScope versions=">=3.5.0" products="RDK X5">

| 工具 | 烧录系统镜像 | 升级 miniboot | 说明 |
|:---|:---|:---|:---|
| Rufus | ✅ | ❌ | Windows 工具，支持 SD 卡单独烧录和 SD 卡在板烧录 |
| RDK Studio | ✅ | ❌ | 支持 Windows / Mac，可在线下载或本地导入镜像 |
| XBurn | ✅ | ✅ | 支持 Windows / Linux / macOS，可烧录系统镜像和 miniboot |
| rdk-miniboot-update | ❌ | ✅ | 命令行工具，系统正常运行 + 联网时可用 |

</DocScope>

<DocScope versions=">=3.5.0" products="RDK X5 Module">

| 工具 | 烧录系统镜像 | 升级 miniboot | 说明 |
|:---|:---|:---|:---|
| Rufus | ✅ | ❌ | Windows 工具，支持 SD 卡单独烧录、SD 卡在板烧录和 eMMC 烧录 |
| RDK Studio | ✅ | ❌ | 支持 Windows / Mac，可在线下载或本地导入镜像 |
| XBurn | ✅ | ✅ | 支持 Windows / Linux / macOS，可烧录系统镜像和 miniboot |
| rdk-miniboot-update | ❌ | ✅ | 命令行工具，系统正常运行 + 联网时可用 |

</DocScope>