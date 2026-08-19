---
sidebar_position: 2
sidebar_products: RDK X5,RDK X5 Module
sidebar_versions: "3.5.0"
---

# 1.1.2 硬件简介

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

<DocScope versions=">=3.5.0" products="RDK X5">

RDK X5 提供了网口、USB、摄像头、LCD、HDMI、CANFD、40PIN 等功能接口，方便用户进行图像多媒体、深度学习算法等应用的开发和测试。开发板接口布局如下：


![RDK_X5_interface](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/hardware_interface/RDK_X5_interface.jpg)


| 序号 | 功能 | 序号 | 功能 | 序号 | 功能 |
| -------- | ---------------------------- | -------- | ----------------------- | ----------------------- | ----------------------- |
| 1 | 供电接口 （USB Type C） | 2 | RTC 电池接口 <br/>(靠近 PWR 的引脚为 B+，另一引脚为 GND)| 3 | 闪连接口 （USB Type C） |
| 4 | 调试串口（Micro USB） | 5 | 2 路 MIPI Camera 接口 | 6 | 千兆以太网口，支持 POE |
| 7 | 4 路 USB 3.0 Type A 接口 | 8 | CAN FD 高速接口 | 9 | 40PIN 接口 |
| 10 | HDMI 显示接口 | 11 | 多标准兼容耳机接口 | 12 | 板载 Wi-Fi 天线 |
| 13 | TF 卡接口（底面） | 14 | LCD 显示接口（MIPI DSI） |  |  |

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

X5 MD 采用核心板与 IO 载板分离的模块化设计方式，便于功能扩展与定制开发。

RDK X5 Module Carrier Board 是 RDK X5 Module 的配套 IO 载板，提供了丰富的外设接口。 

直出接口包括：

- 两路 22Pin 摄像头接口（集成 MIPI CSI、LPWM&MCLK、I²C、GPIO）
- 一路 HDMI 接口
- 一路 RJ45 以太网接口
- 一路 LCD 接口（集成 MIPI DSI 和 I²C）
- 40Pin 扩展接口（包含 GPIO、I²C、SPI、I²S、PWM）
- 多路功能控制接口等

经过 IO 载板外围器件处理后输出的接口包括：

- CAN 总线接口（采用 TCAN4550 芯片，SPI 转 CAN）
- 耳机音频接口（基于 ES8326B，支持 I²S 转音频 DAC&ADC）
- 四路 USB 3.0 接口（通过 GL3510 USB Hub 扩展）

![img-20250416-161040](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/hardware_interface/img-20250416-161040.png)

| 序号 | 功能 | 序号 | 功能 | 序号 | 功能 |
| -------- | ---------------------------- | -------- | ----------------------- | ----------------------- | ----------------------- |
| 1	| USB Type C 5V/5A 供电接口 | 9	| CAM2 接口，4lane | 17 | Audio 接口 |
| 2	| USB2.0 配置 header | 10	| CAM1 接口，4lane | 18 | IO 电平选择 header |
| 3	| USB2.0 接口 | 11	| 40pin header | 19 | MIPI DSI 接口 |
| 4	| USB3.0 HOST 接口 x2 | 12	| 核心模组接口 | 20 | Micro SD 卡接口（背面） |
| 5	| USB3.0 HOST 接口 x2 | 13	| RTC 电池接口 | 21 | HDMI 接口 |
| 6	| 千兆以太网口 | 14	| CAN 终端电阻接入开关 | 22 | Debug 口，USB 转串口（背面） |
| 7	| 风扇接口 | 15	| CAN 总线接口 | 23 | Sleep 按键 |
| 8	| POE 接口 | 16	| 功能控制 IO header | 24 | 电源开关 |

</DocScope>

:::caution
RTC 在给电池供电的时候，对电池的电压和放电电流要求为：2~3.3V ，＞2.5uA。
开机后当 pmic 检测到 rtc 电压低到充电电压时，会自动给 rtc 充电，电池要求为：可承受的最大充电电压≥3.3V，最大可允许充入电流＞1mA。  
此外，非充电的 RTC 不可以使用进行供电
:::


## 核心模组接口

<DocScope versions=">=3.5.0" products="RDK X5">

全板载设计， 无核心模组。

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

RDK X5 Module 作为核心板，集成了 D-Robotics Sunrise®5 智能计算芯片及其关键电路设计，融合了 PMIC 电源管理模块、DDR、eMMC、QSPI NAND、Wi-Fi/蓝牙等核心功能单元。

核心板提供 300 针高速扩展接口，可灵活连接多种外设，满足各类应用场景的快速部署需求。

安装时需要首先确认正确的方向和定位，避免对核心模组、载板的连接器造成损伤。

![img-20250418-111059](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/hardware_interface/img-20250418-111059-en.png)

模组安装方法如下：

1. 对照核心模组 pin 脚，确认安装方向正确。
2. 将核心模组放于载板正上方，并确认周围四个定位孔位置对齐。
3. 从核心模组中心向下按压，当模组发出咔哒的声响后，表示安装到位。

</DocScope>

## 电源接口

<DocScope versions=">=3.5.0" products="RDK X5">

开发板提供一路 USB Type C 接口(接口 1)，作为供电接口，需要使用支持**5V/5A**的电源适配器为开发板供电。将电源适配器接入开发板后，**<font color='Green'>绿色</font> 电源指示灯 亮起**，说明开发板供电正常，3.1.0 版本后，**<font color='Orange'>橙色</font> 状态指示灯 闪烁**，说明系统运行正常。
</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

开发板提供一路 USB Type C 接口(接口 1)，作为供电接口，需要使用支持**5V/5A**的电源适配器为开发板供电。将电源适配器接入开发板后，**<font color='Green'>绿色</font> 5V 指示灯 PWR 指示灯 亮起**，说明开发板供电正常，**<font color='Green'>绿色</font> ACT 指示灯 闪烁**，说明系统运行正常。

</DocScope>

:::caution

请不要使用电脑 USB 接口为开发板供电，否则会因供电不足造成开发板**异常断电、反复重启**等情况。

:::


## 调试串口{#debug_uart}

<DocScope versions=">=3.5.0" products="RDK X5">

开发板提供一路调试串口(接口 4)，以实现串口登录、调试功能。电脑串口工具的参数配置如下：

- 波特率（Baud rate）：115200
- 数据位（Data bits）：8
- 奇偶校验（Parity）：None
- 停止位（Stop bits）：1
- 流控（Flow Control）：无

串口连接时，需要将通过 Micro-USB 线，连接开发板接口 4 与 PC。

在内核启动阶段，波特率的配置位于 `/boot/boot.cmd` 文件中；

修正串口配置后，需要重新生成 boot.scr 文件，命令如下：`mkimage -C none -A arm -T script -d boot.cmd boot.scr`。

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

开发板提供一路调试串口(<font color='Red'>背面</font>接口 22)，以实现串口登录、调试功能。电脑串口工具的参数配置如下：

- 波特率（Baud rate）：921600
- 数据位（Data bits）：8
- 奇偶校验（Parity）：None
- 停止位（Stop bits）：1
- 流控（Flow Control）：无

串口连接时，需要将通过 Micro-USB 线，连接开发板接口 22 与 PC。

在内核启动阶段，波特率的配置位于 `/boot/boot.cmd` 文件中；

修正串口配置后，需要重新生成 boot.scr 文件，命令如下：`mkimage -C none -A arm -T script -d boot.cmd boot.scr`。

</DocScope>

通常情况下，用户第一次使用该接口时需要在电脑上安装 CH340 驱动，用户可搜索`CH340串口驱动`关键字进行下载、安装。


## 有线网口

开发板提供一路千兆以太网接口(接口 6)，支持 1000BASE-T、100BASE-T 标准，默认采用静态 IP 模式，IP 地址为`192.168.127.10` 。如需确认开发板 IP 地址，可通过串口登录设备，并用`ifconfig`命令进行查看 `eth0`网口的配置.

此外，该接口支持 PoE（Power over Ethernet，以太网供电）功能，无需额外的电源线即可通过网线同时传输数据和电力，使设备的安装更加简便灵活。


## HDMI 显示接口{#hdmi_interface}

<DocScope versions=">=3.5.0" products="RDK X5">

开发板提供一路 HDMI(接口 10)显示接口，最高支持 1080P 分辨率。开发板通过 HDMI 接口在显示器输出 Ubuntu 系统桌面(Ubuntu Server 版本显示 logo 图标)。此外，HDMI 接口还支持实时显示摄像头、网络流画面功能。

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

开发板提供一路 HDMI(接口 21)显示接口，最高支持 1080P 分辨率。开发板通过 HDMI 接口在显示器输出 Ubuntu 系统桌面(Ubuntu Server 版本显示 logo 图标)。此外，HDMI 接口还支持实时显示摄像头、网络流画面功能。

</DocScope>

## USB 接口

<DocScope versions=">=3.5.0" products="RDK X5">

开发板通过硬件电路实现了多路 USB 接口扩展，满足用户对多路 USB 设备接入的需求，接口描述如下：

| 接口类型       | 接口序号 | 接口数量 | 接口描述                                                 |
| -------------- | -------- | -------- | -------------------------------------------------------- |
| USB 2.0 Type C | 接口 3    | 1 路      | USB Device 模式，用于连接主机实现 ADB、Fastboot、系统烧录等功能 |
| USB 3.0 Type A | 接口 7    | 4 路      | USB Host 模式，通过 HUB 扩展出 4 个 USB 端口，用于接入 USB 3.0 外设 |

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

开发板通过硬件电路实现了多路 USB 接口扩展，满足用户对多路 USB 设备接入的需求，接口描述如下：

| 接口类型       | 接口序号 | 接口数量 | 接口描述                                                 |
| -------------- | -------- | -------- | -------------------------------------------------------- |
| USB 2.0 Type C | 接口 3    | 1 路      | USB Device 模式，用于连接主机实现 ADB、Fastboot、系统烧录等功能 |
| USB 3.0 Type A | 接口 4 & 接口 5 | 4 路      | USB Host 模式，通过 HUB 扩展出 4 个 USB 端口，用于接入 USB 3.0 外设 |

### USB 2.0 切换 HOST

开发板可以短接接口 2，将 USB 2.0 切换到 HOST 模式。

</DocScope>

### 接入 U 盘

开发板 USB Type A 接口，支持 U 盘功能，可自动检测 U 盘接入并挂载，默认挂载目录为`/media/sda1`。

### 接入 USB 串口转接板

开发板 USB Type A 接口，支持 USB 串口转接板功能，可自动检测 USB 串口转接板接入并创建设备节点`/dev/ttyUSB*` 或者 `/dev/ttyACM*`（星号代表 0 开始的数字）。用户可参考 [使用串口](../../03_Basic_Application/01_40pin_user_sample/uart.md) 章节对串口进行使用。

### USB 摄像头

开发板 USB Type A 接口，支持 USB 摄像头功能，可自动检测 USB 摄像头接入并创建设备节点`/dev/video0`。

##  IO 电平选择

<DocScope versions=">=3.5.0" products="RDK X5">

无该接口。

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

开发板提供一路 IO 电平选择接口（对应接口 18），可切换 IO 电平为 1.8V 或 3.3V。该设置会同时影响 40Pin 接口和 CAM 接口的 IO 电平。

</DocScope>

## MIPI Camera 接口{#mipi_port}

<DocScope versions=">=3.5.0" products="RDK X5">

开发板提供 2 路 22pin MIPI CSI 接口(接口 5)，可实现 2 路 MIPI 摄像头的接入,支持双目相机的接入。目前开发板适配了多种规格的摄像头模组，模组型号、规格如下：

| 序号 | Sensor |   分辨率  |  FOV  | I2C 设备地址 |
| --- | ------ | ------- | ------- | ------- |
|  1  | IMX219  | 800W |    |  |
|  2  | OV5647  | 500W |    |  |
| 3   | IMX477  | 1230W |   |  |

摄像头模组通过 22pin 同向排线跟开发板连接，排线金属面背对黑色卡扣插入连接器。


安装完成后，用户可以通过 i2cdetect 命令确认模组 I2C 地址能否正常检测到。

查询靠近网口的 mipi_host0 接口 上 Camera Sensor 的 I2C 设备地址：
```shell
echo 353 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio353/direction
echo 0 > /sys/class/gpio/gpio353/value
sleep 0.1
echo 1 > /sys/class/gpio/gpio353/value

i2cdetect -y -r 6
```

查询远离网口的 mipi_host2 接口 上 Camera Sensor 的 I2C 设备地址：
```shell
echo 351 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio351/direction
echo 0 > /sys/class/gpio/gpio351/value
sleep 0.1
echo 1 > /sys/class/gpio/gpio351/value

i2cdetect -y -r 4
```

成功探测到 Camera Sensor 的 I2C 设别地址时，可以看到如下所示的打印（以在接口 mipi_host2 上探测 IMX219 为例，可以发现 10 地址被打印出来了）：
```shell
root@ubuntu:~# i2cdetect -y -r 4
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:                         -- -- -- -- -- -- -- -- 
10: 10 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
70: -- -- -- -- -- -- -- --    
```

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

开发板提供 2 路 22pin MIPI CSI 接口 CAM1(接口 10) CAM2(接口 9)，可实现 2 路 MIPI 摄像头的接入,支持双目相机的接入。目前开发板适配了多种规格的摄像头模组，模组型号、规格如下：

| 序号 | Sensor |   分辨率  |  FOV  | I2C 设备地址 |
| --- | ------ | ------- | ------- | ------- |
|  1  | IMX219  | 800W |    |  |
|  2  | OV5647  | 500W |    |  |
| 3   | IMX477  | 1230W |   |  |

IO 电平（接口 18）要选择 3.3V。

摄像头模组通过 22pin 同向排线跟开发板连接，排线金属面背对黑色卡扣插入连接器。

安装完成后，用户可以通过 i2cdetect 命令确认模组 I2C 地址能否正常检测到。

查询靠 CAM1(接口 10) 接口 上 Camera Sensor 的 I2C 设备地址：
```shell
echo 353 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio353/direction
echo 0 > /sys/class/gpio/gpio353/value
sleep 0.1
echo 1 > /sys/class/gpio/gpio353/value

i2cdetect -y -r 6
```

查询 CAM2(接口 9) 接口 上 Camera Sensor 的 I2C 设备地址：
```shell
echo 351 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio351/direction
echo 0 > /sys/class/gpio/gpio351/value
sleep 0.1
echo 1 > /sys/class/gpio/gpio351/value

i2cdetect -y -r 4
```

成功探测到 Camera Sensor 的 I2C 设别地址时，可以看到如下所示的打印（以在 CAM2(接口 9) 上探测 IMX219 为例，可以发现 10 地址被打印出来了）：
```shell
root@ubuntu:~# i2cdetect -y -r 4
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:                         -- -- -- -- -- -- -- -- 
10: 10 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
70: -- -- -- -- -- -- -- --    
```

</DocScope>

:::caution
重要提示：严禁在开发板未断电的情况下插拔摄像头，否则非常容易烧坏摄像头模组。
:::

## LCD 显示接口

<DocScope versions=">=3.5.0" products="RDK X5">

RDK X5 提供一路 MIPI DSI 的 LCD 显示接口（接口 14），可以用于 LCD 显示屏等接入。接口为 22pin，可使用 DSI-Cable-12cm 线材直接接入树莓派多款 LCD 显示屏。

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

RDK X5 Module 提供一路 MIPI DSI 的 LCD 显示接口（接口 19），可以用于 LCD 显示屏等接入。接口为 22pin，可使用 DSI-Cable-12cm 线材直接接入树莓派多款 LCD 显示屏。

</DocScope>

## Micro SD 接口

<DocScope versions=">=3.5.0" products="RDK X5">

开发板提供 1 路 Micro SD 存储卡接口(接口 13)。推荐使用至少 16GB 容量的存储卡，以便满足 Ubuntu 操作系统及相关功能包的安装要求。

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

开发板提供 1 路 Micro SD 存储卡接口(<font color='Red'>背面</font>接口 22)。推荐使用至少 16GB 容量的存储卡，以便满足 Ubuntu 操作系统及相关功能包的安装要求。

</DocScope>

:::caution

开发板使用中禁止热插拔 TF 存储卡，否则会造成系统运行异常，甚至造成存储卡文件系统损坏。

:::

## Wi-Fi 天线接口

<DocScope versions=">=3.5.0" products="RDK X5">

开发板的无线网络支持板载和外置天线两种配置，通常情况下板载天线可以满足使用需求。当开发板安装金属材质外壳后，需要连接外置天线到（接口 12 旁的天线接口），以增强信号强度。

天线接口规格：

- 接口类型： IPEX 1 代
- 频率：支持 2.4GHz/5GHz Wi‑Fi 传输

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

开发板的无线网络采用外置天线配置，需要连接外置天线到核心板上，以增强信号强度。

天线接口规格：

- 接口类型： IPEX 1 代
- 频率：支持 2.4GHz/5GHz Wi‑Fi 传输

</DocScope>


## CANFD 接口

<DocScope versions=">=3.5.0" products="RDK X5">

RDK X5 开发板提供 CANFD 接口（接口 8）和 CAN 终端电阻接入开关（接口 8 后的 2pin 座子，高速通信需要两段使能终端电阻，防止信号反射，提升抗干扰能力），可用于 CAN 及 CAN FD 通信，具体信息请参考 [CAN 使用](../../07_Advanced_development/01_hardware_development/rdk_x5/can.md) 章节

     </DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">


RDK X5 Module 开发板提供 CANFD 接口（接口 15）和 CAN 终端电阻接入开关（接口 14，高速通信需要两段使能终端电阻，防止信号反射，提升抗干扰能力），可用于 CAN 及 CAN FD 通信，具体信息请参考 [CAN 使用](../../07_Advanced_development/01_hardware_development/rdk_x5/can.md) 章节

</DocScope>

## 40PIN 接口

<DocScope versions=">=3.5.0" products="RDK X5">

RDK X5 开发板提供 40PIN 接口，IO 信号采用 3.3V 电平设计。管脚定义兼容树莓派等产品，详细管脚定义、复用关系参考[基础应用开发](../../03_Basic_Application/01_40pin_user_sample/40pin_define.md)章节。

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

RDK X5 Module 开发板提供 1 路 40PIN 接口，方便用户扩展外围接口，对应接口 11。

40PIN 上的所有 IO 管脚支持通过电平选择接口（接口 18）来切换 3.3V 和 1.8V 电压域。

</DocScope>

## 连接器型号

<DocScope versions=">=3.5.0" products="RDK X5">

| 连接器 | 型号 |   厂商  |  描述  |
| --- | ------ | ------- | ------- |
| J1 | HDGC1002WV-S-2P | HDGC (华德共创) | RTC 电池接口 |
| J14/J15 | AFC11-S22ICA-00 | JS (钜硕电子) | MIPI Camera 接口 |
| J16 | AFC01-S22FCA-00 | JS (钜硕电子) | LCD 显示接口 |
| J18 | HDGC1002WV-S-3P | HDGC (华德共创) | CAN FD 高速接口 |

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

| 连接器 | 型号 |   厂商  |  描述  |
| --- | ------ | ------- | ------- |
| J1/J21 | DF40C-100DS-0.4V(51) | HRS(广濑) | 100P 连接器 |
| J3 | DF40C-60DS-0.4V(51) | HRS(广濑) | 60P 连接器 |
| J4 | PZ254V-12-10P | XFCN(兴飞) | 功能控制 IO header |
| J5 | WAFER-SH1.0-2PLB | XFCN(兴飞) | RTC 电池接口 |
| J7/J8/J10 | FPC-05F-22PH20 | XUNPU(讯普) | CAM 接口，MIPI DSI 接口 |
| J15 | WAFER-SH1.0-4PLB | XUNPU(讯普) | 风扇接口 |
| J18 | WAFER-SH1.0-3PLB | XUNPU(讯普) | CAN 总线接口 |
| J20 | PH2.54-01-02PZS | XUNPU(讯普) | POE 接口 |

</DocScope>

## 接口电源负载能力

以下数据均为单个接口能提供的负载电流，多个接口同时使用时，可能会受影响。

<DocScope versions=">=3.5.0" products="RDK X5">

| 接口 | 负载能力 | 
| --- | ------ | 
| CAN 接口 | 500mA @ 3.3V | 
| DSI 接口 | 500mA @ 3.3V | 
| 40Pin 接口 | 1A @ 3.3V/1A @ 5V | 
| USB3 接口 | 1A @ 5V | 

</DocScope>
<DocScope versions=">=3.5.0" products="RDK X5 Module">

| 接口 | 负载能力 | 
| --- | ------ | 
| CAN 接口 | 500mA @ 3.3V | 
| DSI 接口 | 500mA @ 3.3V | 
| 40Pin 接口 | 1A @ 3.3V/1A @ 5V | 
| USB3 接口 | 1A @ 5V | 

</DocScope>
