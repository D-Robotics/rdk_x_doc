---
sidebar_position: 2
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

# RDK IMU Module（BMI088）

## 产品简介

RDK IMU Module 为地瓜机器人官方 IMU 配件，采用 Bosch **BMI088** 方案，集成三轴陀螺仪与三轴加速度计，可通过 **I2C** 或 **SPI** 与 RDK 开发板连接。支持通过 Linux IIO 子系统读取原始数据。

:::info 适用平台
本文档针对 **RDK X5 / RDK X5 Module**，系统镜像建议 **3.4.x**（兼容 3.5.x）。
:::

## 安装方法

### 硬件连接

<Tabs groupId="bmi088-interface">
<TabItem value="i2c" label="I2C 接口">

![rdk_x5_bmi088_hw_connect.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_hw_connect.png)

1. 将 RDK IMU Module 按说明书接入 RDK X5 的 40pin 排针。
2. 确认供电与 I2C 引脚连接牢固。

使用 I2C 的接口的时候，检查连接是否正常的时候可以使用如下命令来检查 IMU 能被探测到

```shell
i2cdetect -y -r 5
```

![rdk_x5_bmi088_i2cdetect.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_i2cdetect.png)


</TabItem>
<TabItem value="spi" label="SPI 接口">

1. 将 RDK IMU Module 按说明书接入 RDK X5 的 40pin 排针。
2. 特别注意载板上面的排针，是否都插入了 SPI 这一侧

![rdk_x5_bmi088_hw_connect_spi.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_hw_connect_spi.png)

</TabItem>
</Tabs>

### 软件配置

在全屏终端中运行 `sudo srpi-config`，按接口类型选择对应 IMU 项：

<Tabs groupId="bmi088-interface">
<TabItem value="i2c" label="I2C 接口">

1. 进入 `3 Interface Options` → `I6 IMU`

![rdk_x5_bmi088_srpiconfig_1.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_srpiconfig_1.png)

![rdk_x5_bmi088_srpiconfig_2.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_srpiconfig_2.png)

2. 选择 `BMI088-I2C-Interface`

![rdk_x5_bmi088_srpiconfig_3.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_srpiconfig_3.png)

3. 选择 `Finish`，确认后选择 `Yes` 重启

![rdk_x5_bmi088_srpiconfig_4.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_srpiconfig_4.png)

![rdk_x5_bmi088_srpiconfig_5.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_srpiconfig_5.png)






</TabItem>
<TabItem value="spi" label="SPI 接口">

1. 进入 `3 Interface Options` → `I6 IMU`

![rdk_x5_bmi088_srpiconfig_6.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_srpiconfig_6.png)

![rdk_x5_bmi088_srpiconfig_7.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_srpiconfig_7.png)

2. 选择 BMI088 的 **SPI** 相关选项（与 I2C 选项区分，以 `srpi-config` 菜单为准）

![rdk_x5_bmi088_srpiconfig_8.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_srpiconfig_8.png)

3. 选择 `Finish`，确认后重启

![rdk_x5_bmi088_srpiconfig_9.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_srpiconfig_9.png)

![rdk_x5_bmi088_srpiconfig_10.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_srpiconfig_10.png)

</TabItem>
</Tabs>

### 卸载方法

1. 进入 `srpi-config` → `3 Interface Options` → `I6 IMU`
2. 选择 `UNSET` 卸载 IMU 驱动与相关配置
3. 断电后取下 IMU 模组

## 运行

<Tabs groupId="bmi088-verify">
<TabItem value="i2c-verify" label="I2C 接口">

### 1. 检查设备

**I2C 接口**下，扫描 I2C 总线（RDK X5 常用总线号为 `5`，以实际接线为准）：

```shell
i2cdetect -y -r 5
```
![rdk_x5_bmi088_i2cdetect_2.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_i2cdetect_2.png)

若扫描结果出现一个地址为 `UU`、另一个为 `69`，需**断电重启**后再继续。

查看 input 事件节点（event 序号随挂载顺序变化）：

```shell
ls /dev/input
```

查看 IIO 设备节点：

```shell
ls /sys/bus/iio/devices/
```

### 2. 基础数据验证

直接读取 IIO 节点验证（`iio:device` 序号以 `ls /sys/bus/iio/devices/` 为准）：

```shell
cat /sys/bus/iio/devices/iio:device1/gyr_val
```

能读到正确的 `name` 与数值即表示 I2C 通路正常。

</TabItem>
<TabItem value="spi-verify" label="SPI 接口">

### 1. 检查设备

针对这款 IMU 我们可以直接检查是否有注册成功
```shell
dmesg | grep BS_LOG
```
![rdk_x5_bmi088_spi_dmesg.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_spi_dmesg.png)

### 2. 基础数据验证

直接读取 IIO 节点验证（`iio:device` 序号以 `ls /sys/bus/iio/devices/` 为准）：

```shell
cat /sys/bus/iio/devices/iio:device1/gyr_val
```

能读到正确的 `name` 与数值即表示 SPI 通路正常。参考如下：

![rdk_x5_bmi088_spi_cat_gyr_name.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_spi_cat_gyr_name.png)

![rdk_x5_bmi088_spi_cat_gyr_val.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_spi_cat_gyr_val.png)

![rdk_x5_bmi088_spi_cat_acc_val.png](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/07_accessory_instructions/imu/rdk_x5_bmi088_spi_cat_acc_val.png)

注意：IIO 的实际节点编号可能根据实际注册的设备有所不同，请以板端实际情况为准

</TabItem>
</Tabs>

### 3. 使用 Input 事件接口读取数据

上文用 IIO 节点做了「驱动有没有起来、能不能读到数」的检查。如果你要做 **SLAM、防抖（EIS）、AR/VR、多传感器融合** 这类应用，光 `cat` sysfs 往往不够——你需要知道**每一块数据对应硬件上的哪个采样时刻**。

为此，BMI088 驱动除了 IIO，还提供 **Linux Input EVENT 接口**：数据通过 `/dev/input/eventX` **连续推送**，每帧自带**硬件时间戳**。板端示例程序 `sample_imu_input` 用于演示这套接口的读取与校验。

#### 数据格式说明

可以把一帧 IMU 数据理解成「**9 个小包 + 1 个结束信号**」：

1. 驱动依次上报 9 个 `EV_MSC` 事件（code 固定为 `0x04`），分别携带加速度 XYZ、陀螺仪 XYZ、时间戳高低 32 位、中断计数；
2. 最后来一个 `EV_SYN / SYN_REPORT`，表示这一帧结束，应用侧此时把 9 个字段拼成完整一帧。

各字段含义如下：

| 顺序 | 内容 | 说明 |
|------|------|------|
| 0–2 | ACC X/Y/Z | 加速度原始值（16 位有符号，单位 LSB） |
| 3–5 | GYRO X/Y/Z | 陀螺仪原始值（16 位有符号，单位 LSB） |
| 6–7 | 时间戳高/低 32 位 | 拼成 64 位整数，单位 **纳秒（ns）**，表示硬件采样时刻 |
| 8 | 中断计数 | 驱动侧累计中断次数，可用来观察采样是否连续 |

:::info 注意区分两种时间
- `input_event` 结构体里的 `ev.time`：内核收到事件的时间，**不是** IMU 采样时间；
- 硬件采样时间戳：在 MSC 字段的 `ev.value` 里，由驱动打包上报。
:::

BMI088 与 ICM42688 采用**同一套**上报协议；下文以 RDK IMU Module（BMI088）为例说明。

#### 1. 查找 IMU 对应的 event 节点

驱动注册的 Input 设备名为 **`bmi088-sensor`**。在板端执行：

```shell
grep -A5 bmi088-sensor /proc/bus/input/devices
```

示例输出：

```shell
N: Name="bmi088-sensor"
P: Phys=bmi088/input0
S: Sysfs=/devices/virtual/input/input1
U: Uniq=
H: Handlers=event1
B: PROP=0
```

看 `H: Handlers=` 一行：这里是 **`event1`**，对应设备路径 **`/dev/input/event1`**。

不同板子、不同外设挂载顺序下，`event` 编号可能变化，**请以 `grep` 结果为准，不要照搬文档编号**。

#### 2. 运行示例程序

示例程序预置在板端以下路径：

```shell
/app/platform_samples/sample_imu/sample_imu_input/sample_imu_input
```

进入目录并运行（将 `event1` 替换为上一步得到的实际节点）：

```shell
cd /app/platform_samples/sample_imu/sample_imu_input
./sample_imu_input /dev/input/event1
```

也可省略参数，程序默认打开 `/dev/input/event1`（仅当该节点确实对应 IMU 时适用）。

程序启动后会**持续打印**每一帧数据。轻轻晃动 IMU，观察 ACC、GYRO 数值是否随之变化。按 **`Ctrl + C`** 退出；退出时会打印帧间隔统计和累计丢包数。

#### 3. 查看输出

每帧一行，格式类似：

```text
ACC(ax,ay,az) | GYRO(gx,gy,gz) | TS:1234567890 ns | Lost: 0 | EventCount: 10 | up_count: 100 | lower_count: -
```

| 字段 | 含义 |
|------|------|
| `ACC` / `GYRO` | 六轴**原始 LSB**，不是 m/s² 或 rad/s |
| `TS` | 本帧**硬件采样时间戳**（纳秒） |
| `Lost` | 累计丢帧次数 |
| `up_count` | 驱动中断计数（对应协议第 9 个字段） |

示例程序内置丢包检测：若相邻两帧硬件时间戳间隔 **超过 3.5 ms**，会打印 `[ERROR] IMU data lost` 并将 `Lost` 加 1。偶发告警可先观察；若持续大量出现，建议检查接线、供电，或尝试断电重启后再测。

#### 4. 自行开发参考

若要在自己的 C/C++ 程序里读取，核心流程是：

1. `open("/dev/input/eventX", O_RDONLY)` 打开设备；
2. 循环 `read(fd, &ev, sizeof(ev))`；
3. `ev.type == EV_MSC && ev.code == 0x04` 时按顺序缓存 `ev.value`；
4. `ev.type == EV_SYN && ev.code == SYN_REPORT` 且已收满 9 个字段时，解析六轴、拼时间戳、处理下一帧。

参考实现：

板端位置 ：`/app/multimedia_samples/sample_imu/sample_imu_input/sample_imu_input.c`。

源码位置 ：`/source/hobot-multimedia-samples/debian/app/multimedia_samples/sample_imu/sample_imu_input/sample_imu_input.c`。

## 常见问题排查

- **i2cdetect 出现一个 UU、一个 69**：断电重启开发板后再扫描。
- **找不到 IIO 设备**：确认 `srpi-config` 已选择正确接口类型并已重启。
- **device 序号与文档示例不一致**：以板上实际注册的结果为准。
- **sample_imu_input 打开失败或没有数据**：确认 `srpi-config` 已启用 BMI088（I2C/SPI）并已重启；用 `grep -A5 bmi088-sensor /proc/bus/input/devices` 核对 `event` 编号是否与命令一致。

