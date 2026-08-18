---
sidebar_position: 2
title: "Flash system image"
description: "Use Rufus, RDK Studio, or XBurn to write an Ubuntu system image to a microSD card or eMMC"
---

import DocScope from '@site/src/components/DocScope';

# Flash system image

<DocScope versions=">=3.5.0" products="RDK X5">

Flashing a system image means writing an Ubuntu system image to a microSD card to provide a runtime environment for the development board.

</DocScope>

<DocScope versions=">=3.5.0" products="RDK X5 Module">

Flashing a system image means writing an Ubuntu system image to a microSD card or eMMC to provide a runtime environment for the development board.

</DocScope>

:::warning Important

- Do not hot-plug any devices other than USB, HDMI, and Ethernet cables.
- The Type-C USB port on the development board is for power only.
- Use a branded USB Type-C power cable. A poor-quality cable may cause power anomalies and unexpected system shutdowns.
- The development board is powered via the USB Type-C port. Use a power adapter that supports **5V/5A**. Do not power the board from a computer USB port, as insufficient power may cause unexpected shutdowns, repeated reboots, and other issues.

<DocScope versions=">=3.5.0" products="RDK X5">

- For additional power options, see [PoE power supply](../../07_Advanced_development/01_hardware_development/rdk_x5/POE.md).

</DocScope>

:::

## Boot media

<DocScope versions=">=3.5.0" products="RDK X5">

The RDK X5 uses a microSD card as the system boot medium. During flashing, the system is written to the SD card.

- Prepare a microSD card with at least 16 GB of capacity to meet the storage requirements of the Ubuntu system and application software.
- SD card reader.

</DocScope>

<DocScope versions=">=3.5.0" products="RDK X5 Module">

The RDK X5 Module has onboard eMMC and supports both microSD cards and eMMC as system boot media. During flashing, you can choose to write the system to the microSD card or eMMC.

- Prepare a microSD card with at least 16 GB of capacity to meet the storage requirements of the Ubuntu system and application software.
- SD card reader.

</DocScope>

## Download the image

1. [Click here](https://archive.d-robotics.cc/downloads/os_images/rdk_x5/) to go to the RDK X5 image download directory and select an image version.

    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/x5_os_download.png"
          style={{ width: '100%', height: 'auto', align:'center'}}
    />

2. Enter the selected version directory, choose an image version, and click Download.

    :::info Image types

    RDK X5 currently provides Ubuntu 22.04 system images, supporting both a headless Server version and a Desktop version with a GUI:

    - **desktop version**: Ubuntu system with a desktop, supports external display and mouse operation.
    - **server version**: Headless Ubuntu system, accessible via serial console or remote network connection.

    <DocScope versions=">=3.5.0" products="RDK X5 Module">

    The RDK X5 Module ships with a test system image pre-installed. To ensure you are using the latest version, it is recommended to flash the latest system image. The RDK X5 Module can only use version 3.2.0 and later.

    </DocScope>

    :::

    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/x5_os_download_type.png"
          style={{ width: '100%', height: 'auto', align:'center'}}
    />

3. After downloading, extract the Ubuntu system image files. For example: `rdk-x5-ubuntu22-preinstalled-desktop-3.3.3-arm64.img`. 
   
   - When using XBurn, you must extract the `.img` file. 
   - When using RDK Studio or Rufus, you can select the compressed archive directly.

## Flashing steps

Choose one of the three tools below to complete the flashing.

### Use RDK Studio

RDK Studio supports Windows and Mac. You can select and download the image online, or download it manually and import it locally. The SD card is flashed through a card reader connected to the PC.

1. [Click here to download](https://developer.d-robotics.cc/rdkstudio) RDK Studio.

2. After installation, open RDK Studio, select the corresponding device model, and follow the wizard to complete the flashing. For detailed steps, see [Log in to RDK Studio and flash the system](https://developer.d-robotics.cc/rdk_studio_doc/en/category/2-quick-start).

### Use Rufus

Rufus is a free, open-source tool for Windows. It supports both solo microSD card flashing and in-board microSD card flashing.

1. [Click here](https://rufus.ie/en/) to go to the Rufus official website and select the tool version for your platform.

2. Double-click the downloaded `.exe` file to open Rufus.

#### Solo microSD card flashing {#solo}

Solo microSD card flashing means removing the SD card from the development board and flashing it through a card reader connected to the PC.

1. Insert the SD card into the card reader, then plug the reader into the PC.

2. Open Rufus. The microSD card is automatically detected in the **Device** dropdown.

    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/en/x5/rufus_x5_install_finish-en.png"
          alt="Rufus device detection"
          style={{ width: '50%', height: 'auto', align:'center'}}
    />

3. Click **SELECT** and choose the extracted `.img` file as the image to flash.

4. Keep the other parameters at their defaults and click **START**. Wait for the flashing to complete.

5. After flashing is complete, close Rufus and remove the storage card.

#### In-board microSD card flashing

In-board microSD card flashing means the SD card is inserted in the board's card slot. The board is connected to the PC via USB, and the SD card is mapped as a USB drive for Rufus to write to.

1. Open Rufus.

2. Insert the SD card into the development board. Connect the USB Type-C port to the PC. Press and hold the Sleep button, then power on the board. Watch the Rufus **Device** dropdown, and release the button once the microSD card appears.

    <DocScope versions=">=3.5.0" products="RDK X5">
    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/en/x5/sleep_key.png"
          style={{ width: '100%', height: 'auto', align:'center'}}
    />
    </DocScope>

    <DocScope versions=">=3.5.0" products="RDK X5 Module">
    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5_module/os_insatll_hardware_connection.png"
          style={{ width: '100%', height: 'auto', align:'center'}}
    />
    </DocScope>

3. The remaining steps are the same as [Solo microSD card flashing](#solo). Complete the image flashing.

<DocScope versions=">=3.5.0" products="RDK X5 Module">

#### eMMC flashing

When no SD card is inserted, the development board is connected to the PC via USB, and the eMMC is mapped as a USB drive for Rufus to write to.

1. Open Rufus.

2. Without an SD card, connect the USB Type-C port to the PC. Press and hold the Sleep button, then power on the board. Watch the Rufus **Device** dropdown, and release the button once the corresponding drive letter appears. The onboard eMMC is mapped as a USB drive on the development board.

    <img
          src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5_module/os_insatll_hardware_connection.png"
          style={{ width: '100%', height: 'auto', align:'center'}}
    />

3. The remaining steps are the same as [Solo microSD card flashing](#solo). Complete the image flashing.

</DocScope>

### Use XBurn

XBurn can also flash the system image. The hardware connection, environment setup, and flashing parameters are the same as for flashing miniboot. The only difference is selecting the folder extracted in [Download the image](#download-the-image) as the image directory. For detailed steps, see [Upgrade miniboot](upgrade-miniboot#use-xburn).

<DocScope versions=">=3.5.0" products="RDK X5 Module">

XBurn can also flash eMMC. When no SD card is inserted, select `X5` as the product type. The storage medium is fixed to `eMMC`. The connection type and download mode are the same as for flashing miniboot. For detailed steps, see [Upgrade miniboot](upgrade-miniboot#use-xburn).

</DocScope>

## Boot verification

The system performs its default environment configuration on first boot, which takes about 45 seconds.

- **Desktop version**: Connect to a display via HDMI. The Ubuntu system desktop indicates a successful boot.
- **Server version**: Connect to the development board via the debug serial port. Open MobaXterm, click **Session** > **Serial**, select the serial port detected by the PC, set **Speed (bps)** to `115200` (RDK X5) or `921600` (RDK X5 Module), and click **OK**. The username login prompt indicates a successful boot.

<img
    src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/install_os/install_os_260408/zh/x5/boot_system.png"
    style={{ width: '100%', height: 'auto', align:'center'}}
/>

:::tip LED indicator

<font color='Green'>Green LED</font> on: power is normal. <font color='Orange'>Orange LED</font> blinking: system boot is complete.

:::

If the development board shows no output for an extended period after power-on (more than 2 minutes), the board has failed to boot normally. Use a serial cable for debugging to check whether the board is functioning correctly.