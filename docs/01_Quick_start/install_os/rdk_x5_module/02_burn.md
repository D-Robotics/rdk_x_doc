---
sidebar_position: 2
---

# 使用 XBurn 烧录

RDK X5 Module 借助 PC 端工具 **XBurn** 烧录，覆盖两个区域：板载 NAND 上的 `miniboot_flash`（Bootloader 固件）与 TF 卡上的 `sdcard`（系统镜像）。按需选其一：[烧录 Bootloader](#烧录-bootloader) 或 [烧录全镜像](#烧录全镜像)。

## 烧录准备

### 烧录工具

安装 XBurn，见 XBurn 手册 [安装 XBurn](https://developer.d-robotics.cc/xburn_doc/install)。

### 镜像下载

按烧录目标选择对应镜像，下载最新版压缩包并解压待用：

- [Bootloader 固件下载页](https://archive.d-robotics.cc/downloads/miniboot/rdk_x5/)：用于烧录 Bootloader（如 `product 20260408.zip`）。
- [系统镜像下载页](https://archive.d-robotics.cc/downloads/os_images/rdk_x5/)：用于烧录全镜像或指定区域。提供 Ubuntu 22.04 镜像：**desktop** 带桌面可外接屏幕、**server** 无桌面仅串口/网络远程连接，按需选择。

### 硬件连接

- 串口连 PC：Micro-USB（调试串口，用于 XModem 传输与日志）
- 烧录口连 PC：USB Type-C
- 电源：USB Type-C，需 5V/5A 电源适配器

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5_module/nand_insatll_hardware_connection.png" alt="RDK X5 Module XBurn 烧录硬件连接" style={{ width: '100%', height: 'auto', align:'center'}} />

:::warning 供电要求
RDK X5 Module 通过 USB Type-C 供电，须用 5V/5A 电源适配器，勿用电脑 USB 口，否则供电不足导致异常断电、反复重启。Type-C USB 接口仅供电。
:::

### 环境准备

安装驱动与依赖（因操作系统而异，**烧录前必须完成**，否则 XBurn 无法识别设备）。RDK X5 Module 涉及 USB Driver 与 USB to Serial Driver，不涉及 DFU。

- [Windows 环境](https://developer.d-robotics.cc/xburn_doc/environment/windows-setup)
- [Linux 环境](https://developer.d-robotics.cc/xburn_doc/environment/linux-setup)
- [macOS 环境](https://developer.d-robotics.cc/xburn_doc/environment/mac-setup)

## 烧录参数

**产品类型** 选 `RDK X5`，存储介质固定为 `NAND`、固件类型固定为 `secure`。连接类型决定可用下载模式与串口填写位置：

| 连接类型 | 可用下载模式 | 串口/波特率 | 适用场景 |
| -------- | -------- | -------- | -------- |
| `Serial+USB` | `xmodem_fastboot` / `fastboot` | 在 XBurn 界面 **板卡** 处填写 **串口** 和 **波特率** | 串口经 XModem 引导、USB 经 Fastboot 下发；空板或非空板均可，变砖恢复用 |
| `USB` | `fastboot` | 选项不出现，需在 MobaXterm/minicom 看日志 | 要求设备 U-Boot 正常，手动进入 Fastboot（上电后长按空格进 U-Boot，输入 `fastboot 0`） |

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/x5-flash.png" alt="XBurn 烧录参数配置界面" style={{ width: '100%', height: 'auto', align:'center'}} />

## 烧录 Bootloader

将 Miniboot、U-Boot 等 Bootloader 固件写入板载 NAND，负责设备上电后的初始化与引导加载，是系统能否启动的前提。适用于设备无法启动、Bootloader 损坏或升级底层引导程序的场景。

:::warning 烧录说明

设备出厂已预装与硬件匹配的最新固件，严禁降级刷入旧版本，否则可能无法启动。
:::

1. 按照 [烧录参数](#烧录参数) 填写 **基本配置**，**镜像所在目录** 选择 [Bootloader 固件下载](#镜像下载) 中解压出的文件夹。

2. （可选）需同时烧录多台设备时，见 XBurn 手册 [批量烧录](https://developer.d-robotics.cc/xburn_doc/basics/batch-burn)（软件上限 8 台、推荐 ≤4 台；设备越多失败概率越高，稳定性取决于线材、hub、供电等硬件环境，软件不保证）。批量时建议关闭下方 **烧录完成自动重启**，避免单台完成重启影响其他设备。

3. （可选）展开 **高级配置**，勾选 **烧录完成自动重启**，烧录完成后设备自动重启，省去手动断电、改为正常启动模式、重新上电。详见 XBurn 手册 [烧录完成自动重启与启动检查](https://developer.d-robotics.cc/xburn_doc/basics/auto-reboot)。

4. 单击**开始升级**，看到提示后插拔电源；若插拔电源后串口丢失，先不上电，看到提示后再给设备上电。

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/x5-reboot.png" alt="XBurn 提示插拔电源" style={{ width: '100%', height: 'auto', align:'center'}} />

5. 上电后开始升级，等待升级完成。

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/xburn_success.png" alt="XBurn 升级成功" style={{ width: '100%', height: 'auto', align:'center'}} />

6. 启动验证。上电后系统首次启动配置约 45 秒。用 MobaXterm 连接调试串口（**Speed (bps)** `921600`，配置见 XBurn 手册 [各操作系统环境准备](https://developer.d-robotics.cc/xburn_doc/environment/windows-setup)），出现用户名登录界面即启动成功。

   <img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/xburn/x5-boot.png" alt="RDK X5 串口启动日志出现登录界面" style={{ width: '100%', height: 'auto', align:'center'}} />

   :::tip 指示灯说明
   <font color='Green'>绿灯</font> 点亮代表启动中；熄灭或闪烁代表启动完成。
   :::

   若串口 2 分钟以上无输出或日志停住，设备无法启动时，重新烧录 `miniboot_flash` 区域；排查见 XBurn 手册 [启动异常](https://developer.d-robotics.cc/xburn_doc/troubleshooting/boot-issues)。

## 进阶用法

XBurn 除支持烧录 Bootloader 外，还支持烧录全镜像和烧录指定区域（`miniboot_flash`、`sdcard`）。两者共用同一系统镜像，先按 [系统镜像下载](#镜像下载) 完成，再按对应小节操作。

### 烧录全镜像

1. 按照 [烧录参数](#烧录参数) 填写 **基本配置**，**镜像所在目录** 选择 [系统镜像下载](#镜像下载) 中解压出的文件夹。
2. 后续操作参考 [烧录 Bootloader](#烧录-bootloader)。

### 烧录指定区域{#烧录指定区域}

只写入选中的区域，而非完整的全镜像包。RDK X5 Module 支持的区域如下：

| 区域 | 实际存储介质 | 固件内容 |
| -------- | -------- | -------- |
| miniboot_flash | 板载 NAND | Bootloader 固件（Miniboot、U-Boot 等） |
| sdcard | TF 卡 | TF 卡镜像 |

1. 按照 [烧录参数](#烧录参数) 填写 **基本配置**，**镜像所在目录** 选择 [系统镜像下载](#镜像下载) 中解压出的文件夹。
2. 展开 **高级配置**，勾选 **烧录指定区域**，勾选目标区域（如 `miniboot_flash`）。
3. 后续操作参考 [烧录 Bootloader](#烧录-bootloader)。
