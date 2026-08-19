---
sidebar_position: 5
---

# PoE 供电使用

目前查阅到 PoE 有多种标准，每个标准的电压，功率都不相同。避免开发者使用不适配的 PoE 导致供电异常或者板卡损坏，请阅读以下内容

## 协议简介

以太网供电（Power over Ethernet，简称 PoE），是一种可以在以太网中透过双绞线来传输电力到设备上的标准化技术。

PoE 系统由供电设备（Power sourcing equipment， PSE）、受电设备 （Powered device，PD）组成。其中，PSE 是负责在以太网线缆上提供电源的设备，这个设备可能是一台网络交换机；PD 设备通常指的是任何由 PoE 系统供电的设备。一般来说，PD 受电设备通常附带一个可选的外部电源供电接口，即将从 PoE 获得的电源，转换为其他派生电源 VDD。

目前，常见的 PoE 协议有 IEEE 802.3af、IEEE 802.3at，分别支持最高 15W、30W 的电力传输。

## 接口使用

RDK X5 支持通过 PoE 系统供电，但是其本身并非完整的 PSE 设备或 PD 设备。RDK X5 在其中扮演的角色为：PD 设备的前端、PD 设备的后端负载。如下图所示。

![img-20241009-1](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/01_hardware_development/rdk_x5/whiteboard_exported_image.png)

RDK X5 板载的 RJ45 座内置变压器，可以输出 AC 交流电源，接口位于以太网连接器旁边的 4PIN 针脚。

如图示路径①，用户应当将上述 4PIN 针脚连接到外部第三方 PoE Hat，送入 PD 设备电路。

PoE Hat 的主要功能是将输入的 AC 电源，转换为 DC 电源。对 RDK X5 而言，**要求该 DC 电源为 5V（MAX 5.2V）**。

如图示路径②，用户应当将上述 DC 5V 电源连接到 RDK X5 40PIN 上的 5V 针脚。

## PoE Hat

用户在设计或选购 PoE Hat 时，应当注意其支持的协议标准。地瓜推荐使用 IEEE 802.3at 标准的 PoE 方案，以保证 RDK X5 及相关外设的可靠使用。