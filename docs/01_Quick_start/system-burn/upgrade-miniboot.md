---
sidebar_position: 3
title: "升级 miniboot"
description: "使用 rdk-miniboot-update 命令或 XBurn 工具升级 miniboot 底层固件"
---

import DocScope from '@site/src/components/DocScope';

# 升级 miniboot

miniboot 是 RDK 硬件的最小启动镜像，包含 miniboot、U-Boot 等底层固件，负责设备上电后的初始化与引导加载。设备出厂已预装与硬件匹配的最新固件，严禁降级刷入旧版本，否则可能无法启动。

升级 miniboot 有两种方式：

- 系统能正常启动且已联网，使用 **rdk-miniboot-update** 命令（更便捷）。
- 系统无法正常启动，或想通过 PC 工具烧录，使用 **XBurn**。

两种方式均可升级 miniboot，根据设备状态选择。

## 使用 rdk-miniboot-update 命令

**前提**：系统正常运行且已连接网络。

常用命令：

- 更新为最新版本：`sudo rdk-miniboot-update`
- 使用指定镜像文件：`sudo rdk-miniboot-update -f /userdata/miniboot.img`
- 查看当前使用的镜像文件：`rdk-miniboot-update -l`

更多信息见 [rdk-miniboot-update 命令参考](../../09_Appendix/rdk-command-manual/cmd_rdk-miniboot-update.md)。

## 使用 XBurn 烧录

XBurn 是 PC 端烧录工具，通过 USB 和串口连接开发板，将 miniboot 固件写入板载 NAND。系统能否启动均可使用。

### 环境准备

安装驱动与依赖（因操作系统而异，**烧录前必须完成**，否则 XBurn 无法识别设备）。

- [Windows 环境](https://developer.d-robotics.cc/xburn_doc/environment/windows-setup)
- [Linux 环境](https://developer.d-robotics.cc/xburn_doc/environment/linux-setup)
- [macOS 环境](https://developer.d-robotics.cc/xburn_doc/environment/mac-setup)

### 固件下载

[单击此处](https://archive.d-robotics.cc/downloads/miniboot/rdk_x5/) 进入 miniboot 固件下载目录，下载最新版压缩包（如 `product 20260408.zip`），解压待用。

### 硬件连接

<DocScope versions=">=3.5.0" products="RDK X5">

- 串口连 PC：Micro-USB（调试串口，用于 Xmodem 传输与日志）
- 烧录口连 PC：USB Type-C
- 电源：USB Type-C，需 5V/5A 电源适配器

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/xburn_hardware_connect.png" alt="RDK X5 XBurn 烧录硬件连接" style={{ width: '100%', height: 'auto', align:'center'}} />

</DocScope>

<DocScope versions=">=3.5.0" products="RDK X5 Module">

- 串口连 PC：Micro-USB（调试串口，用于 Xmodem 传输与日志）
- 烧录口连 PC：USB Type-C
- 电源：USB Type-C，需 5V/5A 电源适配器

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5_module/nand_insatll_hardware_connection.png" alt="RDK X5 Module XBurn 烧录硬件连接" style={{ width: '100%', height: 'auto', align:'center'}} />

</DocScope>

:::warning 供电要求

开发板通过 USB Type-C 供电，须用 5V/5A 电源适配器，勿用电脑 USB 口，否则供电不足导致异常断电、反复重启。Type-C USB 接口仅供电。

:::

### 烧录参数

**产品类型** 选 `RDK X5`，存储介质固定为 `NAND`、固件类型固定为 `secure`。连接类型决定可用下载模式与串口填写位置：

| 连接类型 | 可用下载模式 | 串口/波特率 | 适用场景 |
|:---|:---|:---|:---|
| `Serial+USB` | `xmodem_fastboot` / `fastboot` | 在 XBurn 界面 **板卡** 处填写 **串口** 和 **波特率**（RDK X5: `115200`，RDK X5 Module: `921600`） | 串口经 Xmodem 引导、USB 经 Fastboot 下发。空板或非空板均可，设备无法正常启动时使用 |
| `USB` | `fastboot` | 选项不出现，需在 MobaXterm/minicom 看日志 | 要求设备 U-Boot 正常，手动进入 Fastboot（上电后长按空格进 U-Boot，输入 `fastboot 0`） |

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/x5-flash.png" alt="XBurn 烧录参数配置界面" style={{ width: '100%', height: 'auto', align:'center'}} />

### 烧录 Bootloader

将 miniboot、U-Boot 等 Bootloader 固件写入板载 NAND。适用于设备无法正常启动、Bootloader 损坏或升级底层引导程序的场景。

1. 按照 [烧录参数](#烧录参数) 填写 **基本配置**，**镜像所在目录** 选择 [固件下载](#固件下载) 中解压出的文件夹。

2. （可选）需同时烧录多台设备时，见 XBurn 手册 [批量烧录](https://developer.d-robotics.cc/xburn_doc/basics/batch-burn)（软件上限 8 台、推荐 ≤4 台。设备越多失败概率越高，稳定性取决于线材、hub、供电等硬件环境，软件不保证）。批量时建议关闭下方 **烧录完成自动重启**，避免单台完成重启影响其他设备。

3. （可选）展开 **高级配置**，勾选 **烧录完成自动重启**，烧录完成后设备自动重启，省去手动断电、改为正常启动模式、重新上电。详见 XBurn 手册 [烧录完成自动重启与启动检查](https://developer.d-robotics.cc/xburn_doc/basics/auto-reboot)。

4. 单击 **开始升级**，看到提示后插拔电源；若插拔电源后串口丢失，先不上电，看到提示后再给设备上电。

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/x5-reboot.png" alt="XBurn 提示插拔电源" style={{ width: '100%', height: 'auto', align:'center'}} />

5. 上电后开始升级，等待升级完成。

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/xburn_success.png" alt="XBurn 升级成功" style={{ width: '100%', height: 'auto', align:'center'}} />

### 启动验证

系统首次启动时会进行默认环境配置，整个过程持续 45 秒左右。

- **Desktop 版本**：通过 HDMI 连接显示器，出现 Ubuntu 系统桌面即启动成功。
- **Server 版本**：通过调试串口连接开发板，打开 MobaXterm，单击 **Session** > **Serial**，选择 PC 识别到的串口号，单击 **OK**，出现用户名登录界面即启动成功。

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/x5-boot.png" alt="RDK X5 串口启动日志出现登录界面" style={{ width: '100%', height: 'auto', align:'center'}} />

:::tip 指示灯说明

<font color='Green'>绿色灯</font> 点亮表示供电正常，<font color='Orange'>橙色灯</font> 闪烁表示系统启动完成。

:::

若串口 2 分钟以上无输出或日志停住，设备无法启动时，重新烧录；排查见 XBurn 手册 [启动异常](https://developer.d-robotics.cc/xburn_doc/troubleshooting/boot-issues)。