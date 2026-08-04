---
sidebar_position: 1
sidebar_products: RDK X3,RDK X3 Module
sidebar_versions: "3.0.0"
---

# 1.1.1 硬件简介

:::tip 📦 完整硬件资料汇总

相关下载资源请参考：[下载资源汇总](../download.md)

包含规格书、原理图、机械尺寸图、3D 图、参考设计资料等完整硬件资料。

:::

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DocScope from '@site/src/components/DocScope';
```

## 接口总览

<DocScope versions=">=3.0.0" products="RDK X3">

RDK X3 提供了网口、USB、摄像头、LCD、HDMI、40PIN 等功能接口，方便用户进行图像多媒体、深度学习算法等应用的开发和测试。开发板接口布局如下：


![image-20220802160110194](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/hardware_interface/image-20220802160110194.jpg)


| 序号 | 功能 | 序号 | 功能 | 序号 | 功能 |
| -------- | ---------------------------- | -------- | ----------------------- | ----------------------- | ----------------------- |
| 1 | USB Type C 供电接口 | 2 | MIPI CSI 摄像头接口 | 3 | 调试串口 |
| 4 | Micro USB 2.0 接口 | 5 | USB 2.0 Type A 接口两路 | 6 | USB 3.0 Type A 接口 |
| 7 | 千兆以太网口 | 8 | 40PIN 接口 | 9 | HDMI 接口 |
| 10 | 电源和状态 LED 指示灯 | 11 | Wi-Fi 天线接口 | 12 | TF 卡接口（底面） |

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 官方载板提供了以太网口、USB、HDMI、MIPI CSI、MIPI DSI、40PIN 等多种外围接口，方便用户对 RDK X3 Module 进行功能验证、开发测试等工作。接口布局如下：

![image-carrier-board1](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/01_hardware_development/rdk_x3_module/image/rdk_x3_module/image-carrier-board1.jpg)

| 序号 | 接口功能        | 序号 | 接口功能                | 序号 | 接口功能               |
| ---- | --------------- | ---- | ----------------------- | ---- | ---------------------- |
| 1    | 电源接口        | 7    | Micro USB2.0 Device 接口 | 13   | 功能控制 IO header      |
| 2    | HDMI 接口        | 8    | 工作指示灯              | 14   | IO 电平选择 header       |
| 3    | USB3.0 Host 接口 | 9    | 40pin header            | 15   | debug 口，USB 转串口     |
| 4    | RTC 电池接口     | 10   | MIPI DSI 接口            | 16   | CAM2 接口，2lane        |
| 5    | 风扇接口        | 11   | CAM1 接口，4lane         | 17   | CAM0 接口，2lane        |
| 6    | 千兆以太网口    | 12   | 核心模组接口            | 18   | Micro SD 卡接口（背面） |

</DocScope>


## 核心模组接口

<DocScope versions=">=3.0.0" products="RDK X3">

全板载设计， 无核心模组。

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 载板提供一组 200pin 板板连接器，用于核心模组的安装。安装时需要首先确认正确的方向和定位，避免对核心模组、载板的连接器造成损伤。

![image-x3-md-setup](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/01_hardware_development/rdk_x3_module/image/rdk_x3_module/image-x3-md-setup.jpg)

模组安装方法如下：

1. 对照核心模组上主芯片、DDR、Wi-Fi 模组与载板三个丝印的左右顺序，确认安装方向正确。
2. 将核心模组放于载板正上方，并确认周围四个定位孔位置对齐。
3. 从核心模组中心向下按压，当模组发出咔哒的声响后，表示安装到位。

</DocScope>


## 电源接口

<DocScope versions=">=3.0.0" products="RDK X3">

开发板提供一路 USB Type C 接口(接口 1)，作为供电接口，需要使用支持**5V/3A**的电源适配器为开发板供电。将电源适配器接入开发板后，**开发板<font color='Red'>红色</font>电源指示灯亮起**，说明开发板供电正常。

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 载板通过 DC 接口供电，推荐使用认证配件清单中推荐的**12V/2A**适配器。接入电源后，如<font color='Red'>红色</font>电源指示灯正常点亮（接口 8），说明设备供电正常。

</DocScope>

:::caution

请不要使用电脑 USB 接口为开发板供电，否则会因供电不足造成开发板**异常断电、反复重启**等情况。

:::



## 调试串口{#debug_uart}

<DocScope versions=">=3.0.0" products="RDK X3">

开发板提供一路调试串口(接口 3)，以实现串口登录、调试功能。电脑串口工具的参数配置如下：

- 波特率（Baud rate）：921600
- 数据位（Data bits）：8
- 奇偶校验（Parity）：None
- 停止位（Stop bits）：1
- 流控（Flow Control）：无

串口连接时，需要将杜邦线接入开发板接口 3，串口 USB 转接板接入电脑。连接完成后如下图：
![debug_uart_x3](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/hardware_interface/debug_uart_x3.jpg)

在内核启动阶段，波特率的配置位于 `/boot/boot.cmd` 文件中；

修正串口配置后，需要重新生成 boot.scr 文件，命令如下：`mkimage -C none -A arm -T script -d boot.cmd boot.scr`。

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 载板提供一路调试（接口 15），硬件上通过`CH340`芯片将核心模组调试串口转换为 USB 接口，用户可使用该接口进行各种调试工作。电脑串口工具的参数需按如下方式配置：

- 波特率（Baud rate）：921600
- 数据位（Data bits）：8
- 奇偶校验（Parity）：None
- 停止位（Stop bits）：1
- 流控（Flow Control）：无

通常情况下，用户第一次使用该接口时需要在电脑上安装 CH340 驱动，用户可搜索`CH340串口驱动`关键字进行下载、安装。

在内核启动阶段，波特率的配置位于 `/boot/boot.cmd` 文件中；

修正串口配置后，需要重新生成 boot.scr 文件，命令如下：`mkimage -C none -A arm -T script -d boot.cmd boot.scr`。

</DocScope>






## 有线网口

<DocScope versions=">=3.0.0" products="RDK X3">

开发板提供一路千兆以太网接口(接口 7)，支持 1000BASE-T、100BASE-T 标准，默认采用静态 IP 模式，IP 地址`192.168.1.10`, 3.0.0 及以后系统的默认 IP 调整为`192.168.127.10` 。如需确认开发板 IP 地址，可通过串口登录设备，并用`ifconfig`命令进行查看 `eth0`网口的配置.

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

开发板提供一路千兆以太网接口(接口 6)，支持 1000BASE-T、100BASE-T 标准，默认采用静态 IP 模式，IP 地址`192.168.1.10`， 3.0.0 及以后系统的默认 IP 调整为`192.168.127.10` 。如需确认开发板 IP 地址，可通过串口登录设备，并用`ifconfig`命令进行查看 `eth0`网口的配置。


</DocScope>





## HDMI 接口{#hdmi_interface}

<DocScope versions=">=3.0.0" products="RDK X3">

开发板提供一路 HDMI(接口 9)显示接口，最高支持 1080P 分辨率。开发板通过 HDMI 接口在显示器输出 Ubuntu 系统桌面(Ubuntu Server 版本显示 logo 图标)。此外，HDMI 接口还支持实时显示摄像头、网络流画面功能。

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 载板提供一路 HDMI 显示接口（接口 2），最高支持 1080P 分辨率。开发板通过 HDMI 接口在显示器输出 Ubuntu 系统桌面(Ubuntu Server 版本显示 logo 图标)。此外，HDMI 接口还支持实时显示摄像头、网络流画面功能。

</DocScope>


## USB 接口

<DocScope versions=">=3.0.0" products="RDK X3">

由于 X3 芯片只提供一路 USB 接口，开发板通过硬件电路实现了多路 USB 接口扩展，满足用户对多路 USB 设备接入的需求，接口描述如下：

| 接口类型       | 接口序号 | 接口数量 | 接口描述                                                 |
| -------------- | -------- | -------- | -------------------------------------------------------- |
| Micro USB 2.0  | 接口 4    | 1 路      | USB Device 模式，用于连接主机实现 ADB、Fastboot、UVC 等功能 |
| USB 2.0 Type A | 接口 5    | 2 路      | USB Host 模式，用于接入 USB 2.0 外设                        |
| USB 3.0 Type A | 接口 6    | 1 路      | USB Host 模式，用于接入 USB 3.0 外设                        |

USB 主从模式切换完全由硬件电路实现，用户只需按照上表的逻辑连接设备即可。

开发板 USB Host、Device 功能互斥，Device 接口接入设备后，Host 接口会自动失效。

### 接入 U 盘

Video: https://www.bilibili.com/video/BV1rm4y1E73q/?p=5

开发板 USB Type A 接口(接口 5 和 6)，支持 U 盘功能，可自动检测 U 盘接入并挂载，默认挂载目录为`/media/sda1`。

### 接入 USB 串口转接板

开发板 USB Type A 接口(接口 5 和 6)，支持 USB 串口转接板功能，可自动检测 USB 串口转接板接入并创建设备节点`/dev/ttyUSB*` 或者 `/dev/ttyACM*`（星号代表 0 开始的数字）。用户可参考 [使用串口](../../03_Basic_Application/01_40pin_user_sample/uart.md#314-串口应用) 章节对串口进行使用。

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 核心模组只支持一路 USB3.0 接口，因此载板通过外围电路及 USB HUB 扩展，实现了 4 路 USB3.0 Host 接口和 1 路 Micro USB2.0 Device 接口，满足用户对 USB 接口的多样需求，接口描述如下：

| 接口类型            | 接口序号 | 接口数量 | 接口描述                  |
| ------------------- | -------- | -------- | ------------------------- |
| USB3.0 Type A Host  | 接口 3    | 4 路      | 用于 USB 外设接入           |
| Micro USB2.0 Device | 接口 7    | 1 路      | 用于 adb 调试、fastboot 烧录 |

:::caution 注意
USB 主从模式切换完全由硬件电路实现，用户只需按照上表的逻辑连接设备即可。

开发板 USB Host、Device 功能互斥，Device 接口接入设备后，Host 接口会自动失效。
:::

</DocScope>



## USB 摄像头

Video: https://www.bilibili.com/video/BV1rm4y1E73q/?p=6

开发板 USB Type A 接口，支持 USB 摄像头功能，可自动检测 USB 摄像头接入并创建设备节点`/dev/video8`。



## MIPI CSI{#mipi_port}

<DocScope versions=">=3.0.0" products="RDK X3">
Video: https://www.bilibili.com/video/BV1rm4y1E73q/?p=7

开发板提供 1 路 MIPI CSI 接口(接口 2)，可实现 MIPI 摄像头的接入。目前开发板适配了多种规格的摄像头模组，模组型号、规格如下：

| 序号 | Sensor |   分辨率  |  FOV  | I2C 设备地址 |
| --- | ------ | ------- | ------- | ------- |
|  1  | GC4663 | 400W | H:104 V:70 D:113 | 0x29 |
|  2  | JXF37  | 200W | H:62  V:37 D:68   | 0x40 |
|  3  | IMX219  | 800W | H:62  V:37 D:68   | 0x10 |
|  4  | IMX477  | 1200W | H:62  V:37 D:68   | 0x1a |
|  5  | OV5647  | 500W | H:62  V:37 D:68   | 0x36 |

摄像头模组通过 FPC 排线跟开发板连接，注意排线两端蓝面向上插入连接器。

以 JXF37 摄像头模组为例，安装完成后如下图：
![image-X3-PI-Camera](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/hardware_interface/image-X3-PI-Camera.jpg)

安装完成后，用户可以通过 i2cdetect 命令确认模组 I2C 地址能否正常检测到。

首先，确认当前板卡的 id 号
```shell
cat /sys/class/socinfo/som_name
```

然后根据 id 号在`/etc/board_config.json`中找到对应的 i2c 和 reset gpio
```shell
cat /etc/board_config.json
```

X3 PI V2.1 的 id 是 8，i2c 接口是 1，reset gpio 是 19
```shell
"board_8": {
    "board_id": "8",
    "camera_num": 2,
    "cameras": [
      {
        "reset": "19:low",
        "i2c_bus": 1,
        "mipi_host": 0
      },
      {
        "reset": "19:low",
        "i2c_bus": 1,
        "mipi_host": 2
      }
    ]
  },
```

查询 sensor 的指令就是
```shell
echo 19 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio19/direction
echo 0 > /sys/class/gpio/gpio19/value
sleep 0.1
echo 1 > /sys/class/gpio/gpio19/value

i2cdetect -y -r 1
```

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 载板提供 CAM 0/1/2 三组 MIPI CSI 接口，可以满足 3 路 Camera 模组的同时接入，满足不同用户的使用需求，具体说明如下：

1. CAM 0/2（接口 16/17），采用 15pin FPC 连接器，可直接接入树莓派 OV5647、IMX219、IMX477 等多种 Camera 模组。
2. CAM 1（接口 11），采用 24pin FPC 连接器，支持 F37、GC4663、IMX415 等多种 Camera 模组。

摄像头模组的基础规格如下：

| 序号 | Sensor | 分辨率 | FOV              | I2C 设备地址 |
| ---- | ------ | ------ | ---------------- | ------------ |
| 1    | GC4663 | 400W   | H:104 V:70 D:113 | 0x29         |
| 2    | JXF37  | 200W   | H:62  V:37 D:68  | 0x40         |
| 3    | IMX219 | 800W   | H:62  V:37 D:68  | 0x10         |
| 4    | IMX477 | 1200W  | H:62  V:37 D:68  | 0x1a         |
| 5    | OV5647 | 500W   | H:62  V:37 D:68  | 0x36         |

上述 Camera 模组的购买方式可参考[购买链接](../../07_Advanced_development/01_hardware_development/rdk_x3/accessory.md)。

安装完成后，用户可以通过 i2cdetect 命令确认模组 I2C 地址能否正常检测到。

首先，确认当前板卡的 id 号
```shell
cat /sys/class/socinfo/som_name
```

然后根据 id 号在`/etc/board_config.json`中找到对应的 i2c 和 reset gpio
```shell
cat /etc/board_config.json
```

X3 CM 的 id 是 b，sensor 接口有三个，分别是 i2c3，reset 114， i2c1，reset 115，i2c0，reset 116。
```shell
"board_b": {
    "board_id": "b",
    "camera_num": 3,
    "cameras": [
      {
        "reset": "114:low",
        "i2c_bus": 3,
        "mipi_host": 0
      },
      {
        "reset": "114:low",
        "i2c_bus": 1,
        "mipi_host": 1
      },
      {
        "reset": "114:low",
        "i2c_bus": 0,
        "mipi_host": 2
      }
    ]
  }
```

查询 mipi_host 0 的指令就是
```shell
echo 114 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio114/direction
echo 0 > /sys/class/gpio/gpio114/value
sleep 0.1
echo 1 > /sys/class/gpio/gpio114/value

i2cdetect -y -r 3
```

</DocScope>


:::caution
重要提示：严禁在开发板未断电的情况下插拔摄像头，否则非常容易烧坏摄像头模组。
:::

## MIPI DSI 接口

<DocScope versions=">=3.0.0" products="RDK X3">

无该接口。

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 载板提供一路 MIPI DSI 接口（接口 10），可以用于 LCD 显示屏等接入。接口采用 15pin FPC 连接器，可直接接入树莓派多款 LCD 显示屏。

对于 MIPI DSI 接口的详细使用方法，可参考[MIPI DSI 显示屏使用](/hardware_development/rdk_x3_module/display)。

</DocScope>


## Micro SD 接口

<DocScope versions=">=3.0.0" products="RDK X3">

开发板提供 1 路 Micro SD 存储卡接口(接口 12)。推荐使用至少 8GB 容量的存储卡，以便满足 Ubuntu 操作系统及相关功能包的安装要求。

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 载板提供一路 Micro SD 存储卡接口（接口 18）。推荐使用至少 8GB 容量的存储卡，以便满足 Ubuntu 操作系统及相关功能包的安装要求。

</DocScope>


:::caution

开发板使用中禁止热插拔 TF 存储卡，否则会造成系统运行异常，甚至造成存储卡文件系统损坏。

:::

## Wi-Fi 天线接口

<DocScope versions=">=3.0.0" products="RDK X3">

Video: https://www.bilibili.com/video/BV1rm4y1E73q/?p=8

开发板的无线网络支持板载和外置天线两种配置，通常情况下板载天线可以满足使用需求。当开发板安装金属材质外壳后，需要连接外置天线到（接口 11），以增强信号强度。

天线接口规格：

- 接口类型： IPEX 1 代
- 频率：支持 2.4GHz Wi‑Fi 传输



:::tip
通过以下命令可以将板载天线转化为外置天线 sed -i 's/trace/cable/g' /etc/init.d/hobot-wifi ，重启后生效。
使用以下命令 sed -i 's/cable/trace/g' /etc/init.d/hobot-wifi 重启后进行复原。
:::

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 无板载天线，通常情况下需要连接外置天线，以增强信号强度。

天线接口规格：

- 接口类型： IPEX 1 代
- 频率：支持 2.4GHz Wi‑Fi 传输

![rdk_x3_module_wifi](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/hardware_interface/rdk_x3_module_wifi.jpg)

</DocScope>

## 40pin header 接口

<DocScope versions=">=3.0.0" products="RDK X3">

RDK X3 开发板提供 40pin header 接口，IO 信号采用 3.3V 电平设计。管脚定义兼容树莓派等产品，详细管脚定义、复用关系如下：

![image-20220501181722851](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/hardware_interface/rdkx3_40pin_cn.png)


RDK X3 2.0 & Module 外扩 40PIN 管脚及其定义如下：

![image-20230510155124570](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/01_hardware_development/rdk_x3_module/image/rdk_x3_module/image-20230510155124570.png)

开发板 40PIN 接口位置提供了丝印网表，方便用户对照操作，PIN1、PIN40 位置如下：

![image-X3-PI-40Pin_Index](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/hardware_interface/image-X3-PI-40Pin_Index.jpg)

40PIN 各功能的使用方法请查看 [40PIN 功能使用](../../03_Basic_Application/01_40pin_user_sample/40pin_define.md) 章节。

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 载板提供一组 40pin header 接口（接口 9），接口信号电平由 IO 电平切换 header 指定（接口 14），支持 1.8V、3.3V 两种模式。管脚定义兼容树莓派等产品，详细管脚定义、复用关系如下：

![image-40pin-header](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/01_hardware_development/rdk_x3_module/image/rdk_x3_module/image-40pin-header.png)

:::caution 注意
默认情况下，RDK X3 Module 核心模组固件、载板电平配置为 3.3V，如需要切换 IO 电平时，请参考[IO 电平选择 header 接口](#io电平切换接口)。
:::

</DocScope>   

## 功能控制接口

<DocScope versions=">=3.0.0" products="RDK X3">

无该接口。

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 载板提供一组控制 IO 接口（接口 13），用户使用跳线帽短接相应管脚，可实现对核心模组多种功能模式的控制，管脚功能定义如下：

| 管脚号 | 管脚名称 | 功能描述                       | 使用方式                            |
| ------ | -------- | ------------------------------ | ----------------------------------- |
| 1      | BOOT     | 用于控制 fastboot 烧录模式的进入 | 跳线帽接地后，重新上电              |
| 2      | GL_EN    | 用于关闭核心板输入电源         | 跳线帽接地后，核心板断电            |
| 3      | R_PG     | 用于指示核心板工作状态         | 高电平代表核心板工作正常            |
| 4      | W_EN     | 用于关闭 Wi-Fi 功能              | 跳线帽接地后 Wi-Fi 关闭，重启系统恢复 |
| 5      | BT_EN    | 用于关闭蓝牙功能               | 跳线帽接地后蓝牙关闭，重启系统恢复  |
| 6      | RXD2     | 串口 UART2 接收信号              | 串口 UART2 接收信号                   |
| 7      | TXD2     | 串口 UART2 发送信号              | 串口 UART2 接收信号                   |
| 8      | GND      | GDN                            | GND                                 |

此外，为方便用户查询，上述管脚定义在载板丝印也有体现。

![image-carrier-board-control-pin1](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/01_hardware_development/rdk_x3_module/image/rdk_x3_module/image-carrier-board-control-pin1.png)

</DocScope>


## IO 电平切换接口

<DocScope versions=">=3.0.0" products="RDK X3">

无该接口。

</DocScope>

<DocScope versions=">=3.0.0" products="RDK X3 Module">

RDK X3 Module 载板提供 IO 电平切换功能，用于控制 40pin header 电平模式，支持 1.8V、3.3V 两种电平。。

接口信号从上往下分别为 3.3V、VREF、1.8V，具体如下图：

![image-x3-md-vref](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/01_hardware_development/rdk_x3_module/image/rdk_x3_module/image-x3-md-vref.png)

需要说明的是，**该接口不能悬空，否则核心模组会因供电异常无法开机**。

:::caution 当需要切换电平时，请严格按照下述步骤进行。
默认情况下，RDK X3 Module 核心模组固件、载板电平配置为 3.3V，如需要切换 IO 电平时，需要按如下步骤进行：

1. 下载支持 1.8V 电平配置的启动固件，[固件下载地址](https://archive.d-robotics.cc/downloads/miniboot)。
2. 使用官方烧录工具`hbupdate`，更新核心板启动固件，具体方法请参考[镜像烧录](../install_os)。
3. 设备断电，使用跳线帽将`vref`、`1.8V`信号短接后重新上电。
:::

</DocScope>


## 连接器型号

<DocScope versions=">=3.0.0" products="RDK X3">

| 连接器 | 型号 |   厂商  |  描述  |
| --- | ------ | ------- | ------- |
| J34 | AFC01-S24FCA-00 | JS (钜硕电子) | MIPI CSI 摄像头接口 |
| E1 | U.FL-R-SMT-1(10) | HRS(广濑) | Wi-Fi 天线接口 |

</DocScope>
<DocScope versions=">=3.0.0" products="RDK X3 Module">

| 连接器 | 型号 |   厂商  |  描述  |
| --- | ------ | ------- | ------- |
| J710 | AFA07-S15FCA-00 | JS (钜硕电子) | MIPI DSI 接口 |
| U100/U101 | AFA07-S15FCA-00 | JS (钜硕电子) | CAM0 接口，CAM2 接口 |
| J27 | AFA07-S15FCA-00 | JS (钜硕电子) | CAM1 接口 |

</DocScope>

## 接口电源负载能力

<DocScope versions=">=3.0.0" products="RDK X3">

| 接口 | 负载能力 | 
| --- | ------ | 
| CAN 接口 | 500mA @ 3.3V | 
| DSI 接口 | 500mA @ 3.3V | 
| 40Pin 接口 | 1A @ 3.3V/1A@5V | 
| USB3 接口 | 1A @ 5V | 

</DocScope>
<DocScope versions=">=3.0.0" products="RDK X3 Module">

| 接口 | 负载能力 | 
| --- | ------ | 
| CAN 接口 | 500mA @ 3.3V | 
| DSI 接口 | 500mA @ 3.3V | 
| 40Pin 接口 | 1A @ 3.3V/1A @ 5V | 
| USB3 接口 | 600mA @ 5V | 

</DocScope>