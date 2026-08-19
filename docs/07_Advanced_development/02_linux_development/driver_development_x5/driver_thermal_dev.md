---
sidebar_position: 10
---

# Thermal 系统

## 温度传感器

在 X5 上有三个温度传感器，用于显示 DDR/BPU/CPU 的温度 在/sys/class/hwmon/下有 hwmon0 目录下包含温度传感器的相关参数 temp1_input 是 DDR 的温度，temp2_input 是 BPU 的温度，temp3_input 是 CPU 的温度 温度的精度为 0.001 摄氏度

```
cat /sys/class/hwmon/hwmon0/temp1_input
46643
```

注：BPU 的温度传感器位于 bpu subsytem，bpu subsystem 只有在 bpu 运行时才会上电，所以只有 bpu 运行时，bpu 的温度才可以查看。

## Thermal

Linux Thermal 是 Linux 系统下温度控制相关的模块，主要用来控制系统运行过程中芯片产生的热量，使芯片温度和设备外壳温度维持在一个安全、舒适的范围。

要想达到合理控制设备温度，我们需要了解以下三个模块：

- 获取温度的设备：在 Thermal 框架中被抽象为 Thermal Zone Device，X5 上有两个 thermal zone，分别是 thermal_zone0 和 thermal_zone1；
- 需要降温的设备：在 Thermal 框架中被抽象为 Thermal Cooling Device，有 CPU、BPU、GPU 和 DDR；
- 控制温度策略：在 Thermal 框架中被抽象为 Thermal Governor;

以上模块的信息和控制都可以在 /sys/class/thermal 目录下获取。

在 X5 里面一共有四个 cooling(降温)设备：

- cooling_device0: cpu
- cooling_device1: bpu
- cooling_device2: gpu
- cooling_device3: ddr

其中，cooling 设备 DDR 与 thermal_zone0 关联，cooling 设备 CPU/BPU/GPU 与 thermal_zone1 关联。 目前默认的策略通过以下命令可知是使用的 step_wise。

```
cat /sys/class/thermal/thermal_zone0/policy
```

 通过以下命令可看到支持的策略：user_space、step_wise 一共两种。

```
cat /sys/class/thermal/thermal_zone0/available_policies
```

- user_space 是通过 uevent 将温区当前温度，温控触发点等信息上报到用户空间，由用户空间软件制定温控的策略。
- step_wise 是每个轮询周期逐级提高冷却状态，是一种相对温和的温控策略

具体选择哪种策略是根据产品需要自己选择。可在编译的时候指定或者通过 sysfs 动态切换。 例如：动态切换 thermal_zone0 的策略为 user_space 模式

```
echo user_space > /sys/class/thermal/thermal_zone0/policy
```

在 thermal_zone0 中有 1 个 trip_point，用于控制 cooling 设备 DDR 的调频温度

可通过 sysfs 查看 DDR 的调频温度，当前配置的为 95 度

```
cat /sys/devices/virtual/thermal/thermal_zone0/trip_point_0_temp
```

若想调整 DDR 的调频温度，如 85 度，可通过如下命令：

```
echo 85000 > /sys/devices/virtual/thermal/thermal_zone0/trip_point_0_temp
```

在 thermal_zone1 中有 3 个 trip_point，其中 trip_point_0_temp 为预留作用；trip_point_1_temp 是该 thermal zone 的调频温度，可控制 CPU/BPU/GPU 的频率，当前设置为 95 度。trip_point_2_temp 为关机温度，当前设置为 105 度 例如想要结温到 85 摄氏度，CPU/BPU/GPU 开始调频：

```
echo 85000 > /sys/devices/virtual/thermal/thermal_zone1/trip_point_1_temp
```

如果想要调整关机温度为 105 摄氏度：

```
echo 105000 > /sys/devices/virtual/thermal/thermal_zone1/trip_point_2_temp
```

<font color="red">注意：</font>以上设置断电重启后需要重新设置

## thermal 参考文档

以下路径以 kernel 代码目录为根目录。

```
./Documentation/devicetree/bindings/thermal
./Documentation/driver-api/thermal
```
