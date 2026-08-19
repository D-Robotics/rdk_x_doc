---
sidebar_position: 4
title: "FAQ"
description: "烧录和首次使用开发板时的常见问题及解决方法"
---

import DocScope from '@site/src/components/DocScope';

# FAQ

## 首次使用开发板时的常见问题

- **<font color='Blue'>上电不开机</font>**：
  - 确保使用推荐的适配器供电；
  <DocScope versions=">=3.5.0" products="RDK X5">
  - 确保开发板的 Micro SD 卡已经烧录过 Ubuntu 系统镜像。
  </DocScope>
  <DocScope versions=">=3.5.0" products="RDK X5 Module">
  - 确保开发板的 Micro SD 卡或 eMMC 已经烧录过 Ubuntu 系统镜像。
  </DocScope>
- **<font color='Blue'>使用中热插拔存储卡</font>**：开发板不支持热插拔 Micro SD 存储卡，如发生误操作请重启开发板。

更多问题，可查阅 [常见问题](../../08_FAQ/01_hardware_and_system.md) 章节，或访问 [D-Robotics 开发者官方论坛](https://developer.d-robotics.cc/forum) 获得帮助。