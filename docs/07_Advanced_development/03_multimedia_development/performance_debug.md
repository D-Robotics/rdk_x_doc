---
sidebar_position: 12
---

# 7.3.12 多媒体性能调试
## 概述
Camera 是图像数据的主要外部来源，VIO 部分软件是一个相对不透明的内部软件，主要面向提供内部应用软件提供相关的图像以及信息，XJ3 芯片内部图像处理 IP 信息大致如下：

![image-20220329205706352](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/performance_debug/multimedia_all.png)

| 输入方式       | IP   | 输出方式       |
|----------------|------|----------------|
| Online         | MIPI | Online         |
| Online/Offline | SIF  | Online/Offline |
| Online         | ISP  | Online/Offline |
| Online         | LDC  | Online         |
| Offline        | GDC  | Offline        |
| Online/Offline | IPU  | Online/Offline |
| Online/Offline | PYM  | Offline        |

注：Online 指硬件通过片内 RAM 交换数据，Offline 指硬件通过 DDR 交换数据。

本章节主要描述 X3 芯片关于图像数据处理通路等模块在实际使用的常用场景中，根据 DDR 带宽和延迟进行各处理模块 DDR 优先级和其它一些相关参数的调整。

在 DDR 瞬时带宽不足时会造成视频丢帧，在帧率和丢帧这两个问题之间，可以根据本章节的描述，选择一个合适的配置值来平衡。

## DDR Master 的 QoS

XJ3 各模块通过 AXI 接口访问 DDR，XJ3 有 8 个 AXI 接口，分别为 AXI_0 ~ AXI_7，XJ3 的模块使用 AXI 接口关系如下表：

| 端口号 | AXI_0  | AXI_1 | AXI_2 | AXI_3 | AXI_4 | AXI_5   | AXI_6 | AXI_7 |
|--------|--------|-------|-------|-------|-------|---------|-------|-------|
| 模块名 | CPU/R5 | NOC   | CNN0  | CNN1  | VIO0  | VPU/JPU | VIO1  | PERI  |

AXI_4 和 AXI\_6 可配置，可以通过寄存器配置 VIO 子模块到 AXI\_4 或者 AXI_6，AXI_6 有更高的优先级。

XJ3 VIO 包括如下子模块：SIF_W、ISP0\_M0、ISP0\_M2、GDC0、DIS、SIF_R、IPU0、PYM、IAR。

## AXI QOS 控制

AXI Qos 优先级范围 0\~15，值越大优先级越高。XJ3 系统启动后读写 QoS 默认配置为 0x2021100。

每个 Port 的优先级值通过 Perf Monitor 的 DDR_PORT_READ/WRITE_QOS_CTRL 寄存器设置，Perf
Montior 再通过硬件的方式设置到 DDR 控制器中。软件无需设置 DDR 控制器。

DDR QoS 的值在 DDR\_Monitor 驱动中通过 Sysfs 的属性文件的方式设置和查询。

可以通过 all 属性文件一次性设置，最低的 4bit 对应 P0_CPU，最高 4bit 对应 P7_PERI。

也可以通过 cpu、bifdma、bpu0、bpu1、vio0、vpu、vio1、peri 单独设置和查询各个端口的优先级，如下：

**QoS sysfs 接口**

```bash
#查询读QoS：
cat /sys/bus/platform/drivers/ddr_monitor/read_qos_ctrl/all

CPU port is not allowed to be configured in runtime.
You can run chmod +w as root for debugging purpose.
****************************************************

04032221:
P0_CPU:    1
P1_BIFDMA: 2
P2_CNN0:   2
P3_CNN1:   2
P4_VIO0:   3
P5_VPU:    0
P6_VIO1:   4
P7_PERI:   0
```

```bash
cat /sys/bus/platform/drivers/ddr_monitor/write_qos_ctrl/all

****************************************************
CPU port is not allowed to be configured in runtime.
You can run chmod +w as root for debugging purpose.
****************************************************

04032211:
P0_CPU:    1
P1_BIFDMA: 1
P2_CNN0:   2
P3_CNN1:   2
P4_VIO0:   3
P5_VPU:    0
P6_VIO1:   4
P7_PERI:   0
```

```bash
#设置bifdma读QoS为2：
echo 2 > /sys/bus/platform/drivers/ddr_monitor/read_qos_ctrl/bifdma
#设置bpu0读QoS为1：
echo 1 > /sys/bus/platform/drivers/ddr_monitor/read_qos_ctrl/bpu0
#设置bpu1读QoS为1：
echo 1 > /sys/bus/platform/drivers/ddr_monitor/read_qos_ctrl/bpu1
#设置vio0读QoS为2：
echo 2 > /sys/bus/platform/drivers/ddr_monitor/read_qos_ctrl/vio0
#设置vpu读QoS为0：
echo 0 > /sys/bus/platform/drivers/ddr_monitor/read_qos_ctrl/vpu
#设置vio1读QoS为3：
echo 3 > /sys/bus/platform/drivers/ddr_monitor/read_qos_ctrl/vio1
#设置peri读QoS为0：
echo 0 > /sys/bus/platform/drivers/ddr_monitor/read_qos_ctrl/peri 
#设置bifdma写QoS为2：
echo 2 > /sys/bus/platform/drivers/ddr_monitor/write_qos_ctrl/bifdma
#设置bpu0写QoS为1：
echo 1 > /sys/bus/platform/drivers/ddr_monitor/write_qos_ctrl/bpu0
#设置bpu1写QoS为1：
echo 1 > /sys/bus/platform/drivers/ddr_monitor/write_qos_ctrl/bpu1
#设置vio0写QoS为2：
echo 2 > /sys/bus/platform/drivers/ddr_monitor/write_qos_ctrl/vio0
#设置vpu写QoS为0：
echo 0 > /sys/bus/platform/drivers/ddr_monitor/write_qos_ctrl/vpu
#设置vio1写QoS为3：
echo 3 > /sys/bus/platform/drivers/ddr_monitor/write_qos_ctrl/vio1
#设置peri写QoS为0：
echo 0 > /sys/bus/platform/drivers/ddr_monitor/write_qos_ctrl/peri
```

## VIO 子模块配置

XJ3 VIO 子模块包括 SIF_W、ISP0\_M0、ISP0\_M2、GDC0、DIS、SIF_R、IPU0、PYM、IAR，分别对应 SIF 模块写、ISP 写、ISP Temper 读写、GDC0 读写、DIS 写、SIF 模块读、IPU0 模块读写、PYM 模块读写、IAR 模块读写。

可以通过 AXIBUS 寄存器将这些子模块配置到 VIO0 或者 VIO1 上，XJ3 系统启动后默认配置 IAR 和 SIF_W 到 VIO1，其余模块配置到 VIO0。AXIBUS 寄存器 bit31\~bit16 对应子模块如下图：

![](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/performance_debug/vio_config.png)

其中灰色部分模块不存在，对应 bit 设置为 1，该子模块被配置到 VIO1 上，否则配置到 VIO0 上。可以通过 all 属性一次性配置或查询，查询返回 vio1 上的模块，别的模块在 vio0 上。也可以通过子模块属性单独配置或查询。

AXIBUS sys 接口                                                                            

```bash
# 设置，值为1配置到vio1，值为0配置到vio0
echo 0xc0020000 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/all
echo 0 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/sifr
echo 0 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/isp0m0
echo 0 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/isp0m1
echo 0 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/isp0m2
echo 0 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/t21
echo 0 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/gdc0
echo 0 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/gdc1
echo 1 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/iar
echo 1 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/pym
echo 1 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/sifw
echo 0 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/ipu0 
#读取，打印所有配置在vio1上的模块，其余模块为vio0
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/all axibus: 0xc0020000: sifw: vio1 pym: vio1 iar: vio1
#模块读取
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/sifr axibus: 0xc0020000: sifr: vio0
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/sifw axibus: 0xc0020000: sif: vio1
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/isp0m0 axibus: 0xc0020000: isp_0_m0: vio0
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/isp0m1 axibus: 0xc0020000: isp_0_m1: vio0
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/isp0m2 axibus: 0xc0020000: isp_0_m2: vio0
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/gdc0 axibus: 0xc0020000: gdc_0: vio0
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/gdc1 axibus: 0xc0020000: gdc_1: vio0
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/t21 axibus: 0xc0020000: t21: vio0
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/ipu0 axibus: 0xc0020000: ipu0: vio0
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/pym axibus: 0xc0020000: pym: vio1
cat /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/iar axibus: 0xc0020000: iar: vio1
```

## SIF 的 hblank 设置

SIF 将读取到的图像逐行送给 ISP 处理，可以通过增加行间隔 hblank 来延迟下一行的送出，以置换更多时间给 ISP 或后边的模块做处理。

XJ3 SIF 默认的 hblank 为 10。

hblank 会影响帧率，与帧率的关系为：

```shell
time = ((width + hblank * 32) * hight）/ (clock * 1000) 
# clock为ISP频率，默认为544M。
```

以 4K 为例计算如下：

```shell
time = ((width + hblank * 32) * high) / (clock * 1000)
```

| image width | hblank(register) | image high | clock(MHz) | time(ms) | fps   |
| ----------- | ---------------- | ---------- | ---------- | -------- | ----- |
| 3840        | 10               | 2160       | 544        | 16.5176  | 60.54 |
| 3840        | 40               | 2160       | 544        | 20.3294  | 49.19 |
| 3840        | 70               | 2160       | 544        | 24.1412  | 41.42 |
| 3840        | 120              | 2160       | 544        | 30.4941  | 32.79 |

提供 Sysfs 接口设置查询 hblank，如下：

设置 hblank：echo 120 \> /sys/devices/platform/soc/a4001000.sif/hblank

查询 hblank：cat /sys/devices/platform/soc/a4001000.sif/hblank

## IPU 的设置

### IPU Line_delay wr_ddr_fifo_thred

IPU 有个 line_delay 设置，单位为 1 行。值越大，代表 IPU 可以忍受的总线延迟更大，对 offline 模式下降低 frame drop 有帮助。

同时 wr_ddr_fifo_thred 的值越小越能够降低 frame drop。

当 ipu 输出多个通道同时到 DDR 的时候，建议将 line_delay 设置为 255，wr_ddr_fifo_thred 设置为 0。

line_delay 默认值是 16，wr_fifo_thred0 默认值是 0x30323020，wr_fifo_thred1 默认值是 0x00003220。

提供 sysfs 接口设置如下:

```
echo 0x0 > /sys/devices/platform/soc/a4040000.ipu/wr_fifo_thred0
echo 0x0 > /sys/devices/platform/soc/a4040000.ipu/wr_fifo_thred1
echo 255 > /sys/devices/platform/soc/a4040000.ipu/line_delay
```



### IPU Clock

IPU 的 clock 由 SIF mclk 提供，可以通过 sysfs 配置 SIF clock 来改变 IPU 的频率，IPU 频率默认为 544MHz，可以配置的频率有 544M、408M、326M、272M。

```
echo 544000000 > /sys/module/hobot_dev_ips/parameters/sif_mclk_freq
```

### IPU 安全尺寸

IPU 多个通道的 FIFO 深度不同，安全尺寸如下

| **IPU Scaler #** |  **Full 深度限制 (Bytes)** | **建议分辨率(像素)** |
|-------------------|----------------------------|----------------------|
| Scaler 5(IPU US)  | 4096                       | 8M                   |
| Scaler 2(DS2)     | 4096                       | 8M                   |
| Scaler 1(DS1)     | 2048                       | 2M                   |
| Scaler 3(DS3)     | 2048                       | 2M                   |
| Scaler 4(DS4)     | 1280                       | 1M                   |
| Scaler 0(DS0)     | 1280                       | 1M                   |

Scaler0\~4 对应 IPU 的 ds0\~5，Scaler5 对应 IPU 的 us。如果输出尺寸超过安全尺寸，可能会造成硬件丢帧概率变大、输出数据中连续二三十字节出错的风险。

## 典型场景的设置

### 单路 4K 输入多通道编码

典型场景如下：4k DOL2 输入，SIF - offline - ISP - GDC - IPU，IPU 出 1 路 4k，2 路 1080P，2 路 D1 共 5 路送编码器编码。同时 IPU ds2 online 到 PYM，PYM 出 720P。

SIF hblank 和 QoS 建议配置如下：

```
echo 120 > /sys/devices/platform/soc/a4001000.sif/hblank
echo 0x10100000 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/all
echo 0x03120000 > /sys/bus/platform/drivers/ddr_monitor/read_qos_ctrl/all
echo 0x03120000 > /sys/bus/platform/drivers/ddr_monitor/write_qos_ctrl/all
```

### 双路 1080P 输入

典型场景如下：两路 1080P 输入，SIF-offline-ISP-online-IPU-online-PYM-\>DDR(基础层)。

一路 pym 出来的去编码（1080P）+显示（1080P），另一路开 BPU。

SIF hblank 和 QoS 建议配置如下：

```
echo 120 > /sys/devices/platform/soc/a4001000.sif/hblank  
echo 0x40000000 > /sys/bus/platform/drivers/ddr_monitor/axibus_ctrl/all
```

### 单路 1080P 输入

典型场景如下：单路 1080P 输入，SIF-offline-ISP-online-IPU，IPU 6 通道 roi 打开。

SIF hblank 建议配置如下：

echo 64 \> /sys/devices/platform/soc/a4001000.sif/hblank

## 多进程共享配置

多进程共享目前最多支持 8 个进程共享一路 camera 数据，支持从 IPU 和 PYM 获取输出数据，多进程共享需要满足：

-   必须是全 online 的场景：SIF-online-ISP-online-IPU-online-PYM；
-   输出通道配置 BUF 个数需要大于等于 4，否则会有帧率较低的风险；

## VIO 延时查看

### 方法一

1.正常跑 vio 应用，ls /tmp，可以看到如下在/tmp 目录下有 vio_group_info_pidxxx，其中 xxx 是进
程号。

2.在板子命令行输入 echo "frame_state" > /tmp/vio_group_info_pidxxx 命令，其中 xxx 对应步骤 1
的进程号。

3.步骤 2 之后，会在/userdata/log/usr/目录下面生成 dump 的信息
vio_frame_state_pipe[pipeline]_[time].log

4.用 Notepad++，通过搜索 Frmid xxxxx，其中 xxxxx 是帧号，会把 ISP，IPU，PYM 的 TimeStp 搜索出
来，通过把 PYM out free 前面对应的 xxx 时间-ISP out dq 前面对应的 xxx 时间得出模块得处理时间。

如下截图：

![image-20220929113655983](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/performance_debug/vio_delay_view.png)

### 方法二

通过 HB_VPS_GetChnFrame(int VpsGrp, int VpsChn, void *videoFrame, int ms)接口获取到金字塔得 videoFrame，此结构体指针强制转换成 pym_buffer_t 指针，通过 pym_buffer_t 找到 pym_img_info，pym_img_info 包含了 struct timeval tv，这个 tv 是 sif 得 frame start 填充得系统时间，使用 gettimeofday 接口获取到系统当前时间减去 tv 时间就是 sif 的 frame start->pym 获取到数据的延时。

