---
sidebar_position: 2
title: "烧录系统镜像"
description: "使用 Rufus、RDK Studio 或 XBurn 将 Ubuntu 系统镜像写入 Micro SD 卡或 eMMC"
---

import DocScope from '@site/src/components/DocScope';

# 烧录系统镜像

<DocScope versions=">=3.5.0" products="RDK X5">

烧录系统镜像是指将 Ubuntu 系统镜像写入 Micro SD 卡，为开发板提供运行环境。

</DocScope>

<DocScope versions=">=3.5.0" products="RDK X5 Module">

烧录系统镜像是指将 Ubuntu 系统镜像写入 Micro SD 卡或 eMMC，为开发板提供运行环境。

</DocScope>

:::warning 注意事项

- 禁止带电时拔插除 USB、HDMI、网线之外的任何设备。
- 开发板的 Type-C USB 接口仅用作供电。
- 选用正规品牌的 USB Type-C 口供电线，否则会出现供电异常，导致系统异常断电的问题。
- 开发板通过 USB Type-C 接口供电，需要使用支持 **5V/5A** 的电源适配器为开发板供电，不要使用电脑 USB 接口为开发板供电，否则会因供电不足造成开发板异常断电、反复重启等异常情况。

<DocScope versions=">=3.5.0" products="RDK X5">

- 更多供电方式参见 [PoE 供电使用](../../07_Advanced_development/01_hardware_development/rdk_x5/POE.md)。

</DocScope>

:::

## 启动介质

<DocScope versions=">=3.5.0" products="RDK X5">

RDK X5 采用 Micro SD 卡作为系统启动介质，烧录时将系统烧录进 SD 卡。

- 准备至少 16GB 容量的 Micro SD 卡，以便满足 Ubuntu 系统、应用功能软件对存储空间的需求。
- SD 读卡器。

</DocScope>

<DocScope versions=">=3.5.0" products="RDK X5 Module">

RDK X5 Module 板载 eMMC，支持 Micro SD 卡和 eMMC 作为系统启动介质，烧录时可选择将系统烧录进 Micro SD 卡或 eMMC。

- 准备至少 16GB 容量的 Micro SD 卡，以便满足 Ubuntu 系统、应用功能软件对存储空间的需求。
- SD 读卡器。

</DocScope>

## 下载镜像

1. [单击此处](https://archive.d-robotics.cc/downloads/os_images/rdk_x5/) 进入 RDK X5 镜像下载目录，选择镜像版本。

    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/rdk_s/system-os.png"
          style={{ width: '100%', height: 'auto', align:'center'}}
    />

2. 进入所选版本目录，选择镜像版本，单击下载。

    :::info 镜像说明

    RDK X5 目前提供 Ubuntu 22.04 系统镜像，支持无桌面 Server 版本系统和带有桌面的 desktop 版本系统：

    - **desktop 版本**：带有桌面的 Ubuntu 系统，可以外接屏幕、鼠标操作。
    - **server 版本**：无桌面的 Ubuntu 系统，可以通过串口、网络远程连接操作。

    <DocScope versions=">=3.5.0" products="RDK X5 Module">

    RDK X5 Module 出厂已经烧录测试版本系统镜像，为确保使用最新版本的系统，建议完成最新版本系统镜像的烧录。RDK X5 Module 只能使用 3.2.0 及其后续版本的系统。

    </DocScope>

    :::

    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/x5_os_download_type.png"
          style={{ width: '100%', height: 'auto', align:'center'}}
    />

3. 下载完成后，解压出 Ubuntu 系统镜像文件夹，如 `rdk-x5-ubuntu22-preinstalled-desktop-3.3.3-arm64.img`。
   
   - 使用 XBurn 烧录时需解压为 `.img` 文件。
   - 使用 RDK Studio 或 Rufus 烧录可直接选择压缩包。

## 烧录步骤

以下三种工具任选其一即可完成烧录。

### 使用 RDK Studio 烧录

RDK Studio 支持 Windows 和 Mac 系统，可在线选择镜像后下载，也可自行下载镜像后本地导入。SD 卡通过读卡器连接 PC 进行烧录。

1. [点此下载](https://developer.d-robotics.cc/rdkstudio) RDK Studio。

2. 安装后，打开 RDK Studio，选择对应设备型号，按向导完成烧录，详细步骤参见 [登录 RDK Studio 并烧录系统](https://developer.d-robotics.cc/rdk_studio_doc/category/2-quick-start)。

### 使用 Rufus 烧录

Rufus 是 Windows 平台的免费开源工具，支持 SD 卡单独烧录和 SD 卡在板烧录。

[单击此处](https://rufus.ie/zh/) 进入 Rufus 官网，根据使用平台选择工具版本。

<img
      src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/rufus_install.png"
      style={{ width: '100%', height: 'auto', align:'center'}}
/>

双击下载的 `.exe` 文件即可打开 Rufus。

#### SD 卡单独烧录 {#solo}

SD 卡单独烧录是指将 SD 卡从开发板取出，通过读卡器连接 PC 进行烧录。

1. 将 SD 卡插入读卡器，将读卡器插入 PC。

2. 打开 Rufus 工具，**设备** 下拉框中会自动识别到 Micro SD 卡。

    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/rufus_select_device.png"
          style={{ width: '50%', height: 'auto', align:'center'}}
    />

3. 单击 **选择** 按钮，选择解压出来的 `.img` 文件作为烧录镜像。

    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/rufus_select_image.png"
          style={{ width: '50%', height: 'auto', align:'center'}}
    />

4. 其他参数保持默认，单击 **开始** 按钮，等待烧录完成。

    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/rufus_start.png"
          style={{ width: '50%', height: 'auto', align:'center'}}
    />

5. 烧录完成后，关闭 Rufus 并取出存储卡。

#### SD 卡在板烧录

SD 卡在板烧录是指 SD 卡插在开发板卡槽内，开发板通过 USB 连接 PC，将 SD 卡映射为 U 盘后由 Rufus 写入。

1. 打开 Rufus 工具。

2. SD 卡插入开发板，USB Type-C 接到 PC 端，按住 Sleep 按键不放，给开发板上电，观察 Rufus **设备** 下拉框，直到出现 Micro SD 卡后松开按键。

    <DocScope versions=">=3.5.0" products="RDK X5">
    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/sleep_key.png"
          style={{ width: '100%', height: 'auto', align:'center'}}
    />
    </DocScope>

    <DocScope versions=">=3.5.0" products="RDK X5 Module">
    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5_module/os_insatll_hardware_connection.png"
          style={{ width: '100%', height: 'auto', align:'center'}}
    />
    </DocScope>

3. 其余步骤与 [SD 卡单独烧录](#solo) 一致，完成镜像烧录。

<DocScope versions=">=3.5.0" products="RDK X5 Module">

#### eMMC 烧录

SD 卡不在板时，开发板通过 USB 连接 PC，eMMC 会被映射为 U 盘，可使用 Rufus 写入。

1. 打开 Rufus 工具。

2. SD 卡不在板时，USB Type-C 接到 PC 端，按住 Sleep 按键不放，给开发板上电，观察 Rufus **设备** 下拉框，直到出现对应盘符后松开按键。开发板自带的 eMMC 会被映射成 U 盘。

    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5_module/os_insatll_hardware_connection.png"
          style={{ width: '100%', height: 'auto', align:'center'}}
    />

3. 其余步骤与 [SD 卡单独烧录](#solo) 一致，完成镜像烧录。

</DocScope>

### 使用 XBurn 烧录

XBurn 也可以烧录系统镜像。硬件连接、环境准备和烧录参数与烧录 miniboot 一致，只需将镜像所在目录选为本文档 [下载镜像](#下载镜像) 中解压出的文件夹即可。详细步骤见 [升级 miniboot](upgrade-miniboot#使用-xburn-烧录)。

<DocScope versions=">=3.5.0" products="RDK X5 Module">

XBurn 还可以烧录 eMMC。SD 卡不在板时，产品类型选 `X5`，存储介质固定为 `eMMC`，连接类型和下载模式与烧录 miniboot 一致，详细步骤见 [升级 miniboot](upgrade-miniboot#使用-xburn-烧录)。

</DocScope>

## 启动验证

系统首次启动时会进行默认环境配置，整个过程持续 45 秒左右。

- **Desktop 版本**：通过 HDMI 连接显示器，出现 Ubuntu 系统桌面即启动成功。
- **Server 版本**：通过调试串口连接开发板，打开 MobaXterm，单击 **Session** > **Serial**，选择 PC 识别到的串口号，**Speed (bps)** 选 `115200`（RDK X5）或 `921600`（RDK X5 Module），单击 **OK**，出现用户名登录界面即启动成功。

<img
    src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/boot_system.png"
    style={{ width: '100%', height: 'auto', align:'center'}}
/>

:::tip 指示灯说明

<font color='Green'>绿色灯</font> 点亮表示供电正常，<font color='Orange'>橙色灯</font> 闪烁表示系统启动完成。

:::

如果开发板上电后长时间没有显示输出（2 分钟以上），说明开发板启动异常，需要通过串口线进行调试，查看开发板是否正常。