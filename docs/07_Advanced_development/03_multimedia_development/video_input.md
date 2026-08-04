---
sidebar_position: 4
---

# 7.3.4 视频输入
## 概述
视频输入（VIN）实现的功能：通过 MIPI Rx 接口接收视频数据。VIN 将接收到的数据给下一个模块 VPS，同时也可存入到指定的内存区域，在此过程中，VIN 可以对接收到的原始视频图像数据进行处理，实现视频数据的采集。

### 概念

视频输入设备 视频输入设备主要是指 sif，图像数据接口，主要功能接收摄像头模组输出的图像数据，经过 offline 或者 online 直接输出到 ISP 模块进行图像处理。

- 视频输入设备

​		视频输入设备主要是指 sif，图像数据接口，主要功能接收摄像头模组输出的图像数据，经过 offline 或者		 		online 直接输出到 ISP 模块进行图像处理。

- 视频输入 PIPE

​		视频输入 PIPE (ISP)绑定在设备后端，负责图像处理，硬核功能配置，支持 Multi context。

- 镜头畸变校正（LDC）

​		主要负责矫正图像，有时因为镜头曲面造成的图像变形，一些低端镜头容易产生图像畸变，需要根据畸变程		度对其图像进行校正。

- DIS

​		DIS 模块通过比较当前图像与前两帧图像采用不同自由度的防抖算法计算出当前图像在各个轴方向上的抖动偏		移向量，然后根据抖动偏移向量对当前图像进行校正，从而起到防抖的效果。

- DWE

​		DWE 主要是将 LDC 和 DIS 集成在一起，包括 LDC 的畸变矫正和 DIS 的统计结果。

## 功能描述

VIN 在软件上划分 4 个部分，如下图所示。

![image-20220329195124946](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_input/image-20220329195124946.png)

### 视频输入设备

sif 主要功能接收摄像头模组输出的图像数据，经过 offline 或者 online 直接输出到 ISP 模块进行图像处理。Mipi:支持 RAW8/RAW10/RAW12/RAW14/RAW16 or YUV422 8bit/10bit。DVP interface: RAW8/RAW10/RAW12/RAW14/RAW16 or YUV422 8bit/10bit。最多支持 8 路 sensor 接入。

### 视频输入 PIPE

Isp 主要负责图像处理，硬核功能配置，支持 Multi context，最多支持 8 路接入。主要是对图像数据进行流水线处理，输出 YUV 图像格式给通道。同时 PIPE 也包括 DIS、LDC 的功能。

### 视频物理通道

VIN 的 PIPE 包含 2 个物理通道，物理通道 0 是指 isp 处理后的数据到 ddr，或者是通过 ddr 给到下一级模块 VPS。物理通道 1 是指 isp 处理后的数据 online 到 VPS，VIN 和 VPS 的绑定关系请参考“系统控制”章节。

### 绑定关系

VIN 和 VPS 之间的绑定关系请参考“系统控制”章节 HB_SYS_SetVINVPSMode



## API 参考

```c
int HB_MIPI_SetBus(MIPI_SENSOR_INFO_S *snsInfo, uint32_t busNum);
int HB_MIPI_SetPort(MIPI_SENSOR_INFO_S *snsInfo, uint32_t port);
int HB_MIPI_SensorBindSerdes(MIPI_SENSOR_INFO_S *snsInfo, uint32_t serdesIdx, uint32_t serdesPort);
int HB_MIPI_SensorBindMipi(MIPI_SENSOR_INFO_S *snsInfo, uint32_t mipiIdx);
int HB_MIPI_SetExtraMode(MIPI_SENSOR_INFO_S *snsInfo, uint32_t ExtraMode);
int HB_MIPI_InitSensor (uint32_t DevId, MIPI_SENSOR_INFO_S  *snsInfo);
int HB_MIPI_DeinitSensor (uint32_t  DevId);
int HB_MIPI_ResetSensor(uint32_t DevId);
int HB_MIPI_UnresetSensor(uint32_t DevId);
int HB_MIPI_EnableSensorClock(uint32_t mipiIdx);
int HB_MIPI_DisableSensorClock(uint32_t mipiIdx);
int HB_MIPI_SetSensorClock(uint32_t mipiIdx, uint32_t snsMclk);
int HB_MIPI_ResetMipi(uint32_t  mipiIdx);
int HB_MIPI_UnresetMipi(uint32_t  mipiIdx);
int HB_MIPI_SetMipiAttr(uint32_t  mipiIdx, MIPI_ATTR_S  mipiAttr);
int HB_MIPI_Clear(uint32_t  mipiIdx);
int HB_MIPI_ReadSensor(uint32_t devId, uint32_t regAddr, char *buffer, uint32_t size);
int HB_MIPI_WriteSensor (uint32_t devId, uint32_t regAddr, char *buffer, uint32_t size);
int HB_MIPI_GetSensorInfo(uint32_t devId, MIPI_SENSOR_INFO_S *snsInfo);
int HB_MIPI_SwSensorFps(uint32_t devId, uint32_t fps);
int HB_VIN_SetMipiBindDev(uint32_t devId, uint32_t mipiIdx);
int HB_VIN_GetMipiBindDev(uint32_t devId, uint32_t *mipiIdx);
int HB_VIN_SetDevAttr(uint32_t devId,  const VIN_DEV_ATTR_S *stVinDevAttr);
int HB_VIN_GetDevAttr(uint32_t devId, VIN_DEV_ATTR_S *stVinDevAttr);
int HB_VIN_SetDevAttrEx(uint32_t devId,  const VIN_DEV_ATTR_EX_S *stVinDevAttrEx);
int HB_VIN_GetDevAttrEx(uint32_t devId, VIN_DEV_ATTR_EX_S *stVinDevAttrEx);
int HB_VIN_EnableDev(uint32_t devId);
int HB_VIN_DisableDev (uint32_t devId);
int HB_VIN_DestroyDev(uint32_t devId);
int HB_VIN_SetDevBindPipe(uint32_t devId, uint32_t pipeId);
int HB_VIN_GetDevBindPipe(uint32_t devId, uint32_t *pipeId);
int HB_VIN_CreatePipe(uint32_t pipeId, const VIN_PIPE_ATTR_S * stVinPipeAttr);
int HB_VIN_DestroyPipe(uint32_t pipeId);
int HB_VIN_StartPipe(uint32_t pipeId);
int HB_VIN_StopPipe(uint32_t pipeId);
int HB_VIN_EnableChn(uint32_t pipeId, uint32_t chnId);
int HB_VIN_DisableChn(uint32_t pipeId, uint32_t chnId);
int HB_VIN_SetChnLDCAttr(uint32_t pipeId, uint32_t chnId,const VIN_LDC_ATTR_S *stVinLdcAttr);
int HB_VIN_GetChnLDCAttr(uint32_t pipeId, uint32_t chnId, VIN_LDC_ATTR_S*stVinLdcAttr);
int HB_VIN_SetChnDISAttr(uint32_t pipeId, uint32_t chnId, const VIN_DIS_ATTR_S *stVinDisAttr);
int HB_VIN_GetChnDISAttr(uint32_t pipeId, uint32_t chnId, VIN_DIS_ATTR_S *stVinDisAttr);
int HB_VIN_SetChnAttr(uint32_t pipeId, uint32_t chnId);
int HB_VIN_DestroyChn(uint32_t pipeId, uint32_t chnId);
int HB_VIN_GetChnFrame(uint32_t pipeId, uint32_t chnId, void *pstVideoFrame, int32_t millSec);
int HB_VIN_ReleaseChnFrame(uint32_t pipeId, uint32_t chnId, void *pstVideoFrame);
int HB_VIN_SendPipeRaw(uint32_t pipeId, void *pstVideoFrame，int32_t millSec);
int HB_VIN_SetPipeAttr(uint32_t pipeId,VIN_PIPE_ATTR_S *stVinPipeAttr);
int HB_VIN_GetPipeAttr(uint32_t pipeId, VIN_PIPE_ATTR_S *stVinPipeAttr);
int HB_VIN_CtrlPipeMirror(uint32_t pipeId, uint8_t on);
int HB_VIN_MotionDetect(uint32_t pipeId);
int HB_VIN_InitLens(uint32_t pipeId, VIN_LENS_FUNC_TYPE_ElensType,const VIN_LENS_CTRL_ATTR_S *lenCtlAttr);
int HB_VIN_DeinitLens(uint32_t pipeId);
int HB_VIN_RegisterDisCallback(uint32_t pipeId,VIN_DIS_CALLBACK_S *pstDISCallback);
int HB_VIN_SetDevVCNumber(uint32_t devId, uint32_t vcNumber);
int HB_VIN_GetDevVCNumber(uint32_t devId, uint32_t *vcNumber);
int HB_VIN_AddDevVCNumber(uint32_t devId, uint32_t vcNumber);
int HB_VIN_SetDevMclk(uint32_t devId, uint32_t devMclk, uint32_t vpuMclk);
int HB_VIN_GetChnFd(uint32_t pipeId, uint32_t chnId);
int HB_VIN_CloseFd(void);
int HB_VIN_EnableDevMd(uint32_t devId);
int HB_VIN_DisableDevMd(uint32_t devId);
int HB_VIN_GetDevFrame(uint32_t devId, uint32_t chnId, void *videoFrame, int32_t millSec);
int HB_VIN_ReleaseDevFrame(uint32_t devId, uint32_t chnId, void *buf);
```

### HB_MIPI_SetBus
【函数声明】
```c
int HB_MIPI_SetBus(MIPI_SENSOR_INFO_S *snsInfo, uint32_t busNum)
```
【功能描述】
> 设置 sensor 的总线号

【参数描述】

| 参数名称 |       描述       | 输入/输出 |
| :------: | :--------------: | :-------: |
| snsInfo  | sensor 的配置信息 |   输入    |
|  busNum  |      bus 号       |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_MIPI_InitSensor/HB_MIPI_DeinitSensor 举例

### HB_MIPI_SetPort
【函数声明】
```c
int HB_MIPI_SetPort(MIPI_SENSOR_INFO_S *snsInfo, uint32_t port)
```
【功能描述】
> 设置 sensor 的 port，取值范围 0~7

【参数描述】

| 参数名称 |          描述           | 输入/输出 |
| :------: | :---------------------: | :-------: |
| snsInfo  |    sensor 的配置信息     |   输入    |
|   port   | 当前 sensor 的 port 号，0~7 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_MIPI_InitSensor/HB_MIPI_DeinitSensor 举例

### HB_MIPI_SensorBindSerdes
【函数声明】
```c
int HB_MIPI_SensorBindSerdes(MIPI_SENSOR_INFO_S *snsInfo, uint32_t serdesIdx, uint32_t serdesPort)
```
【功能描述】
> 设置 sensor 绑定到哪个 serdes 上

【参数描述】

|  参数名称  |              描述              | 输入/输出 |
| :--------: | :----------------------------: | :-------: |
|  snsInfo   |        sensor 的配置信息        |   输入    |
| serdesIdx  |        serdes 的索引 0~1         |   输入    |
| serdesPort | serdes 的 port 号 954 0~1  960 0~3 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_MIPI_InitSensor/HB_MIPI_DeinitSensor 举例

### HB_MIPI_SensorBindMipi
【函数声明】
```c
int HB_MIPI_SensorBindMipi(MIPI_SENSOR_INFO_S *snsInfo, uint32_t mipiIdx)
```
【功能描述】
> 设置 sensor 绑定哪一个 mipi 上

【参数描述】

| 参数名称 |        描述         | 输入/输出 |
| :------: | :-----------------: | :-------: |
| snsInfo  |  sensor 的配置信息   |   输入    |
| mipiIdx  | mipi_host 的索引 0~3 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_MIPI_InitSensor 举例

### HB_MIPI_SetExtraMode
【函数声明】
```c
int HB_MIPI_SetExtraMode(MIPI_SENSOR_INFO_S *snsInfo, uint32_t ExtraMode);
```
【功能描述】
> 设置 sensor 在 DOL2 或 DOL3 下的工作模式

【参数描述】

| 参数名称  |        描述        | 输入/输出|
| :-------: | :----------------: | :---------- |
|  snsInfo  |  sensor 的配置信息  | 输入 |
| ExtraMode | 选择以何种工作模式 | 1. 单路 DOL2,值为 0<br /> 2. DOL2 分为两路 linear,一路值为 1，另一路值为 2<br /> 3. 单路 DOl3,值为 0<br /> 4. 一路 DOl2(值为 1)+一路 linear(值为 4)<br /> 5. DOL3 分为三路 linear,一路为 2，一路为 3，一路为 4 |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_MIPI_InitSensor/HB_MIPI_DeinitSensor 举例

### HB_MIPI_InitSensor/HB_MIPI_DeinitSensor
【函数声明】
```c
int HB_MIPI_InitSensor (uint32_t DevId, MIPI_SENSOR_INFO_S  *snsInfo);
int HB_MIPI_DeinitSensor (uint32_t  DevId);
```
【功能描述】
> sensor 的初始化和释放初始化产生的资源

【参数描述】

| 参数名称 |       描述        | 输入/输出 |
| :------: | :---------------: | :-------: |
|  devId   | 通路索引，范围 0~7 |   输入    |
| snsInfo  |    Sensor 信息    |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
```c
    MIPI_SENSOR_INFO_S  snsInfo;
    MIPI_ATTR_S  mipiAttr;
    int DevId = 0, mipiIdx = 1;
    int bus = 1, port = 0, serdes_index = 0, serdes_port = 0;
    int ExtraMode= 0;

    memset(snsInfo, 0, sizeof(MIPI_SENSOR_INFO_S));
    memset(mipiAttr, 0, sizeof(MIPI_ATTR_S));
    snsInfo.sensorInfo.bus_num = 0;
    snsInfo.sensorInfo.bus_type = 0;
    snsInfo.sensorInfo.entry_num = 0;
    snsInfo.sensorInfo.sensor_name = "imx327";
    snsInfo.sensorInfo.reg_width = 16;
    snsInfo.sensorInfo.sensor_mode = NORMAL_M;
    snsInfo.sensorInfo.sensor_addr = 0x36;

    mipiAttr.dev_enable = 1;
    mipiAttr.mipi_host_cfg.lane = 4;
    mipiAttr.mipi_host_cfg.datatype = 0x2c;
    mipiAttr.mipi_host_cfg.mclk = 24;
    mipiAttr.mipi_host_cfg.mipiclk = 891;
    mipiAttr.mipi_host_cfg.fps = 25;
    mipiAttr.mipi_host_cfg.width = 1952;
    mipiAttr.mipi_host_cfg.height = 1097;
    mipiAttr.mipi_host_cfg->linelenth = 2475;
    mipiAttr.mipi_host_cfg->framelenth = 1200;
    mipiAttr.mipi_host_cfg->settle = 20;

    HB_MIPI_SetBus(snsInfo, bus);
    HB_MIPI_SetPort(snsinfo, port);
    HB_MIPI_SensorBindSerdes(snsinfo, sedres_index, sedres_port);
    HB_MIPI_SensorBindMipi(snsinfo,  mipiIdx);
    HB_MIPI_SetExtraMode (snsinfo,  ExtraMode);
    ret = HB_MIPI_InitSensor(DevId, snsInfo);
    if(ret < 0) {
        printf("HB_MIPI_InitSensor error!\n");
        return ret;
    }
    ret = HB_MIPI_SetMipiAttr(mipiIdx, mipiAttr);
    if(ret < 0) {
        printf("HB_MIPI_SetMipiAttr error! do sensorDeinit\n");
        HB_MIPI_SensorDeinit(DevId);
        return ret;
    }
    ret = HB_MIPI_ResetSensor(DevId);
    if(ret < 0) {
        printf("HB_MIPI_ResetSensor error! do mipi deinit\n");
        HB_MIPI_DeinitSensor(DevId);
        HB_MIPI_Clear(mipiIdx);
        return ret;
    }
    ret = HB_MIPI_ResetMipi(mipiIdx);
    if(ret < 0) {
        printf("HB_MIPI_ResetMipi error!\n");
        HB_MIPI_UnresetSensor(DevId);
        HB_MIPI_DeinitSensor(DevId);
        HB_MIPI_Clear(mipiIdx);
        return ret;
    }
    HB_MIPI_UnresetSensor(DevId);
    HB_MIPI_UnresetMipi(mipiIdx);
    HB_MIPI_DeinitSensor(DevId);
    HB_MIPI_Clear(mipiIdx);
```

### HB_MIPI_ResetSensor/HB_MIPI_UnresetSensor
【函数声明】
```c
int HB_MIPI_ResetSensor(uint32_t DevId);
int HB_MIPI_UnresetSensor(uint32_t DevId);
```
【功能描述】
> sensor 数据流的打开和关闭,sensor_start/sensor_stop

【参数描述】

| 参数名称 |       描述        | 输入/输出 |
| :------: | :---------------: | :-------: |
|  devId   | 通路索引，范围 0~7 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_MIPI_InitSensor/HB_MIPI_DeinitSensor 举例

### HB_MIPI_EnableSensorClock/HB_MIPI_DisableSensorClock
【函数声明】
```c
int HB_MIPI_EnableSensorClock(uint32_t mipiIdx);
int HB_MIPI_DisableSensorClock(uint32_t mipiIdx);
```
【功能描述】
> 打开和关闭,sensor_clk

【参数描述】

| 参数名称 |           描述            | 输入/输出 |
| :------: | :-----------------------: | :-------: |
| mipiIdx  | Mipi host 索引号，范围 0~3 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 使用此接口需去掉子板的晶振

【参考代码】
> 暂无

### HB_MIPI_SetSensorClock
【函数声明】
```c
int HB_MIPI_SetSensorClock(uint32_t mipiIdx, uint32_t snsMclk)
```
【功能描述】
> 设置 sensor_mclk
> 一共有 4 个 sensor_mclk，目前用到得是 sensor0_mclk 和 sensor1_mclk,
> mipi0 连接在 sensor_mclk1, mipi1 连接在 sensor_mclk0,硬件连接关系在 dts 里面定义。

【参数描述】

| 参数名称 |           描述            |             输入/输出              |
| :------: | :-----------------------: | :--------------------------------: |
| mipiIdx  | Mipi host 索引号，范围 0~3 |                输入                |
| snsMclk  |          单位 HZ           | 输入，比如 24MHZ，snsMclk 为 24000000 |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 使用此接口需去掉子板的晶振

【参考代码】
> 初始化时:
>> 先设置 sensor_mclk 然后再去使能
>> HB_MIPI_SetSensorClock(mipiIdx, 24000000);
>> HB_MIPI_EnableSensorClock(mipiIdx);

> 退出时：
>> HB_MIPI_Clear(mipiIdx);
>> HB_MIPI_DeinitSensor(devId);
>> HB_MIPI_DisableSensorClock(mipiIdx);

### HB_MIPI_ResetMipi/HB_MIPI_UnresetMipi
【函数声明】
```c
int HB_MIPI_ResetMipi(uint32_t  mipiIdx);
int HB_MIPI_UnresetMipi(uint32_t  mipiIdx)
```
【功能描述】
> mipi 的 start 和 stop

【参数描述】

| 参数名称 |           描述            | 输入/输出 |
| :------: | :-----------------------: | :-------: |
| mipiIdx  | Mipi host 索引号，范围 0~3 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_MIPI_InitSensor/HB_MIPI_DeinitSensor 举例

### HB_MIPI_SetMipiAttr
【函数声明】
```c
int HB_MIPI_SetMipiAttr(uint32_t  mipiIdx, MIPI_ATTR_S  mipiAttr)
```
【功能描述】
> 设置 mipi 的属性，host 和 dev 的初始化。

【参数描述】

| 参数名称 |       描述       | 输入/输出 |
| :------: | :--------------: | :-------: |
| mipiIdx  | Mipi host 索引号 |   输入    |
| mipiAttr | Mipi 总线属性信息 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_MIPI_InitSensor/HB_MIPI_DeinitSensor 举例

### HB_MIPI_Clear
【函数声明】
```c
int HB_MIPI_Clear(uint32_t  mipiIdx);
```
【功能描述】
> 清除设备相关的配置，mipi host/dev 的 deinit，和接口 HB_MIPI_SetMipiAttr 对应。

【参数描述】

| 参数名称 |           描述            | 输入/输出 |
| :------: | :-----------------------: | :-------: |
| mipiIdx  | Mipi host 索引号，范围 0~3 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_MIPI_InitSensor/HB_MIPI_DeinitSensor 举例

### HB_MIPI_ReadSensor
【函数声明】
```c
int HB_MIPI_ReadSensor(uint32_t devId, uint32_t regAddr, char *buffer, uint32_t size)
```
【功能描述】
> 通过 i2c 读取 sensor。

【参数描述】

| 参数名称 |       描述        | 输入/输出 |
| :------: | :---------------: | :-------: |
|  devId   | 通路索引，范围 0~7 |   输入    |
| regAddr  |    寄存器地址     |   输入    |
| buffer,  |  存放数据的地址   |   输出    |
|   size   |    读取的长度     |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 必须在 HB_MIPI_InitSensor 接口调用后才能使用

【参考代码】
> 不同的 sensor 不一样，以 imx327 为例：
```c
    int i;
    char buffer[] = {0x34, 0x56};
    char rev_buffer[30] = {0};
    printf("HB_MIPI_InitSensor end\n");
    ret = HB_MIPI_ReadSensor(devId, 0x3018, rev_buffer,  2);
    if(ret < 0) {
        printf("HB_MIPI_ReadSensor error\n");
    }
    for(i = 0; i < strlen(rev_buffer); i++) {
        printf("rev_buffer[%d] 0x%x  \n", i, rev_buffer[i]);
    }
    ret = HB_MIPI_WriteSensor(devId, 0x3018, buffer, 2);
    if(ret < 0) {
        printf("HB_MIPI_WriteSensor error\n");
    }
    ret = HB_MIPI_ReadSensor(devId, 0x3018, rev_buffer, 2);
    if(ret < 0) {
        printf("HB_MIPI_ReadSensor error\n");
    }
    for(i = 0; i < strlen(rev_buffer); i++) {
        printf("rev_buffer[%d] 0x%x  \n", i, rev_buffer[i]);
    }
```

### HB_MIPI_WriteSensor
【函数声明】
```c
int HB_MIPI_WriteSensor (uint32_t devId, uint32_t regAddr, char *buffer, uint32_t size)
```
【功能描述】
> 通过 i2c 写 sensor 寄存器

【参数描述】

| 参数名称 |       描述        | 输入/输出 |
| :------: | :---------------: | :-------: |
|  devId   | 通路索引，范围 0~7 |   输入    |
| regAddr  |    寄存器地址     |   输入    |
|  buffer  |  存放数据的地址   |   输入    |
|   size   |     写的长度      |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 必须在 HB_MIPI_InitSensor 接口调用后才能使用

【参考代码】
> 请参见 HB_MIPI_ReadSensor 举例

### HB_MIPI_GetSensorInfo
【函数声明】
```c
int HB_MIPI_GetSensorInfo(uint32_t devId, MIPI_SENSOR_INFO_S *snsInfo)
```
【功能描述】
> 获取 sensor 相关配置信息

【参数描述】

| 参数名称 |       描述        | 输入/输出 |
| :------: | :---------------: | :-------: |
|  devId   | 通路索引，范围 0~7 |   输入    |
| snsInfo  |    sensor 信息     |   输出    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 必须在 HB_MIPI_InitSensor 接口调用后才能使用

【参考代码】
```c
    MIPI_SENSOR_INFO_S *snsinfo = NULL;
    snsinfo = malloc(sizeof(MIPI_SENSOR_INFO_S));
    if(snsinfo == NULL) {
        printf("malloc error\n");
        return -1;
    }
    memset(snsinfo, 0, sizeof(MIPI_SENSOR_INFO_S));
    ret = HB_MIPI_GetSensorInfo(devId, snsinfo);
    if(ret < 0) {
        printf("HB_MIPI_InitSensor error!\n");
        return ret;
    }
```

### HB_MIPI_SwSensorFps
【函数声明】
```c
int HB_MIPI_SwSensorFps(uint32_t devId, uint32_t fps)
```
【功能描述】
> 切换 sensor 的帧率

【参数描述】

| 参数名称 |       描述        | 输入/输出 |
| :------: | :---------------: | :-------: |
|  devId   | 通路索引，范围 0~7 |   输入    |
|   fps    |   sensor 的帧率    |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 必须在 HB_MIPI_InitSensor 接口调用后才能使用

【参考代码】
> 暂无

### HB_VIN_SetMipiBindDev/HB_VIN_GetMipiBindDev
【函数声明】
```c
int HB_VIN_SetMipiBindDev(uint32_t devId, uint32_t mipiIdx)
int HB_VIN_GetMipiBindDev(uint32_t devId, uint32_t *mipiIdx)
```
【功能描述】
> 设置 mipi 和 dev 的绑定，dev 使用哪一个 mipi_host

【参数描述】

| 参数名称 |          描述           | 输入/输出 |
| :------: | :---------------------: | :-------: |
|  devId   | 对应通道索引号，范围 0~7 |   输入    |
|mipiIdx|mipi_host 的索引| 输入|

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_SetDevAttr/HB_VIN_GetDevAttr
【函数声明】
```c
int HB_VIN_SetDevAttr(uint32_t devId,  const VIN_DEV_ATTR_S *stVinDevAttr)
int HB_VIN_GetDevAttr(uint32_t devId, VIN_DEV_ATTR_S *stVinDevAttr)
```
【功能描述】
> 设置和获取 dev 的属性

【参数描述】

|   参数名称   |          描述           |             输入/输出             |
| :----------: | :---------------------: | :-------------------------------: |
|    devId     | 对应通道索引号，范围 0~7 |               输入                |
| stVinDevAttr |       dev 通道属性       | 输入，调用 HB_VIN_GetDevAttr 为输出 |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> DOL3 拆分成多路时，多进程情况：第一个进程要先于第二个进程运行 1 秒即可。
> 另外目前不支持 HB_VIN_DestroyDev 之后重新 HB_VIN_SetDevAttr。
>
> 出现 SIF_IOC_BIND_GROUT ioctl failed 报错，一般是前一次 pipeid 的调用没有退出，又重新调用。

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_SetDevAttrEx/HB_VIN_GetDevAttrEx
【函数声明】
```c
int HB_VIN_SetDevAttrEx(uint32_t devId,  const VIN_DEV_ATTR_EX_S *stVinDevAttrEx)
int HB_VIN_GetDevAttrEx(uint32_t devId, VIN_DEV_ATTR_EX_S *stVinDevAttrEx)
```
【功能描述】
> 设置何获取 dev 的扩展属性

【参数描述】

|    参数名称    |          描述           |             输入/输出             |
| :------------: | :---------------------: | :-------------------------------: |
|     devId      | 对应通道索引号，范围 0~7 |               输入                |
| stVinDevAttrEx |      dev 的扩展属性      | 输入，调用 HB_VIN_GetDevAttr 为输出 |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 该接口暂不支持

【参考代码】
> 暂无

### HB_VIN_EnableDev/HB_VIN_DisableDev
【函数声明】
```c
int HB_VIN_EnableDev(uint32_t devId);
int HB_VIN_DisableDev (uint32_t devId);
```
【功能描述】
> dev 模块的使能和关闭

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  devId   | 对应每路输入，范围 0~7 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_DestroyDev
【函数声明】
```c
int HB_VIN_DestroyDev(uint32_t devId)
```
【功能描述】
> dev 模块的销毁，资源释放

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  devId   | 对应每路输入，范围 0~7 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_SetDevBindPipe/HB_VIN_GetDevBindPipe
【函数声明】
```c
int HB_VIN_SetDevBindPipe(uint32_t devId, uint32_t pipeId)
int HB_VIN_GetDevBindPipe(uint32_t devId, uint32_t *pipeId)

```
【功能描述】
> 设置 dev 的 chn 输出和 pipe 的 chn 输入的绑定
> 设置 pipe 的 chn 输入和 pipe 输出的 chn 绑定。

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  devId   | 对应每路输入，范围 0~7 |   输入    |
|  pipeId  |  对应每路输入，同上   |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> HB_VIN_GetDevBindPipe 接口暂未实现

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_CreatePipe/HB_VIN_DestroyPipe
【函数声明】
```c
int HB_VIN_CreatePipe(uint32_t pipeId, const VIN_PIPE_ATTR_S * stVinPipeAttr);
int HB_VIN_DestroyPipe(uint32_t pipeId);
```
【功能描述】
> 创建 pipe、销毁 pipe

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  pipeId  | 对应每路输入，范围 0~7 |   输入    |
|stVinPipeAttr|描述 pipe 属性的指针|输入|

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
```c
    VIN_DEV_ATTR_S  stVinDevAttr;
    VIN_PIPE_ATTR_S  stVinPipeAttr;
    VIN_DIS_ATTR_S   stVinDisAttr;
    VIN_LDC_ATTR_S  stVinLdcAttr;
    MIPI_SNS_TYPE_E sensorId = 1;
    MIPI_SENSOR_INFO_S  snsInfo;
    MIPI_ATTR_S  mipiAttr;
    MIPI_SNS_TYPE_E sensorId = 1;
    int PipeId = 0;
    int DevId = 0, mipiIdx = 1;
    int ChnId = 1, bus = 1, port = 0, serdes_index = 0, serdes_port = 0;

    memset(snsInfo, 0, sizeof(MIPI_SENSOR_INFO_S));
    memset(mipiAttr, 0, sizeof(MIPI_ATTR_S));
    memset(stVinDevAttr, 0, sizeof(VIN_DEV_ATTR_S));
    memset(stVinPipeAttr, 0, sizeof(VIN_PIPE_ATTR_));
    memset(stVinDisAttr, 0, sizeof(VIN_DIS_ATTR_S));
    memset(stVinLdcAttr, 0, sizeof(VIN_LDC_ATTR_S));
    snsInfo.sensorInfo.bus_num = 0;
    snsInfo.sensorInfo.bus_type = 0;
    snsInfo.sensorInfo.entry_num = 0;
    snsInfo.sensorInfo.sensor_name = "imx327";
    snsInfo.sensorInfo.reg_width = 16;
    snsInfo.sensorInfo.sensor_mode = NORMAL_M;
    snsInfo.sensorInfo.sensor_addr = 0x36;

    mipiAttr.dev_enable = 1;
    mipiAttr.mipi_host_cfg.lane = 4;
    mipiAttr.mipi_host_cfg.datatype = 0x2c;
    mipiAttr.mipi_host_cfg.mclk = 24;
    mipiAttr.mipi_host_cfg.mipiclk = 891;
    mipiAttr.mipi_host_cfg.fps = 25;
    mipiAttr.mipi_host_cfg.width = 1952;
    mipiAttr.mipi_host_cfg.height = 1097;
    mipiAttr.mipi_host_cfg->linelenth = 2475;
    mipiAttr.mipi_host_cfg->framelenth = 1200;
    mipiAttr.mipi_host_cfg->settle = 20;
    stVinDevAttr.stSize.format = 0;
    stVinDevAttr.stSize.width = 1952;
    stVinDevAttr.stSize.height = 1097;
    stVinDevAttr.stSize.pix_length = 2;
    stVinDevAttr.mipiAttr.enable = 1;
    stVinDevAttr.mipiAttr.ipi_channels =  1;
    stVinDevAttr.mipiAttr.enable_frame_id = 1;
    stVinDevAttr.mipiAttr.enable_mux_out = 1;
    stVinDevAttr.DdrIspAttr.enable = 1;
    stVinDevAttr.DdrIspAttr.buf_num = 4;
    stVinDevAttr.DdrIspAttr.raw_feedback_en = 0;
    stVinDevAttr.DdrIspAttr.data.format = 0;
    stVinDevAttr.DdrIspAttr.data.width = 1952;
    stVinDevAttr.DdrIspAttr.data.height = 1907;
    stVinDevAttr.DdrIspAttr.data.pix_length = 2;
    stVinDevAttr.outIspAttr.isp_enable = 1;
    stVinDevAttr.outIspAttr.dol_exp_num = 4;
    stVinDevAttr.outIspAttr.enable_flyby = 0;
    stVinDevAttr.outDdrAttr.enable = 1;
    stVinDevAttr.outDdrAttr.mux_index = 0;
    stVinDevAttr.outDdrAttr.buffer_num = 10;
    stVinDevAttr.outDdrAttr.raw_dump_en = 0;
    stVinDevAttr.outDdrAttr.stride = 2928;
    stVinDevAttr.outIpuAttr.enable_flyby = 0;

    stVinPipeAttr.ddrOutBufNum = 8;
    stVinPipeAttr.pipeDmaEnable = 1;
    stVinPipeAttr.snsMode = 3;
    stVinPipeAttr.stSize.format = 0;
    stVinPipeAttr.stSize.width = 1920;
    stVinPipeAttr.stSize.height = 1080;
    stVinDisAttr.xCrop.rg_dis_start = 0;
    stVinDisAttr.xCrop.rg_dis_end = 1919;
    stVinDisAttr.yCrop.rg_dis_start = 0;
    stVinDisAttr.yCrop.rg_dis_end = 1079
    stVinDisAttr.disHratio = 65536;
    stVinDisAttr.disVratio = 65536;
    stVinDisAttr.disPath.rg_dis_enable = 0;
    stVinDisAttr.disPath.rg_dis_path_sel = 1;
    stVinDisAttr.picSize.pic_w = 1919;
    stVinDisAttr.picSize.pic_h = 1079;
    stVinLdcAttr->ldcEnable = 0;
    stVinLdcAttr->ldcPath.rg_h_blank_cyc = 32;
    stVinLdcAttr->yStartAddr = 524288;
    stVinLdcAttr->cStartAddr = 786432;
    stVinLdcAttr->picSize.pic_w = 1919;
    stVinLdcAttr->picSize.pic_h = 1079;
    stVinLdcAttr->lineBuf = 99;
    stVinLdcAttr->xParam.rg_algo_param_a = 1;
    stVinLdcAttr->xParam.rg_algo_param_b = 1;
    stVinLdcAttr->yParam.rg_algo_param_a = 1;
    stVinLdcAttr->yParam.rg_algo_param_b = 1;
    stVinLdcAttr->xWoi.rg_length = 1919;
    stVinLdcAttr->xWoi.rg_start = 0;
    stVinLdcAttr->yWoi.rg_length = 1079;
    stVinLdcAttr->yWoi.rg_start = 0;

    ret = HB_VIN_CreatePipe(PipeId, pipeInfo);
    if(ret < 0) {
        printf("HB_VIN_CreatePipe t error!\n");
        HB_VIN_DestroyPipe(PipeId);
        return ret;
    }
    ret = HB_VIN_SetMipiBindDev(pipeId, mipiIdx);
    if(ret < 0) {
        printf("HB_VIN_SetMipiBindDev error!\n");
        HB_VIN_DestroyPipe(PipeId);
        return ret;
    }
    ret = HB_VIN_SetDevVCNumber(pipeId, deseri_port);
    if(ret < 0) {
        printf("HB_VIN_SetDevVCNumber error!\n");
        return ret;
    }
    ret = HB_VIN_SetDevAttr(DevId, devInfo);
    if(ret < 0) {
        printf("HB_VIN_SetDevAttr error!\n");
        HB_VIN_DestroyPipe(PipeId);
        return ret;
    }
    ret = HB_VIN_SetPipeAttr (PipeId, pipeInfo);
    if(ret < 0) {
        printf("HB_VIN_SetPipeAttr error!\n");
        HB_VIN_DestroyDev(DevId);
        HB_VIN_DestroyPipe(PipeId);
        return ret;
    }
    ret = HB_VIN_SetChnDISAttr(PipeId, ChnId, disInfo);
    if(ret < 0) {
        printf("HB_VIN_SetChnDISAttr error!\n");
        HB_VIN_DestroyDev(DevId);
        HB_VIN_DestroyPipe(PipeId);
        return ret;
    }
    ret = HB_VIN_SetChnLDCAttr(PipeId, ChnId, ldcInfo);
    if(ret < 0) {
            printf("HB_VIN_SetChnLDCAttr error!\n");
        HB_VIN_DestroyDev(DevId);
        HB_VIN_DestroyPipe(PipeId);
        return ret;
    }
    ret = HB_VIN_SetChnAttr(PipeId, ChnId );
    if(ret < 0) {
        printf("HB_VIN_SetChnAttr error!\n");
        HB_VIN_DestroyPipe(PipeId);
        return ret;
    }
    HB_VIN_SetDevBindPipe(DevId, PipeId);

    HB_MIPI_SetBus(snsInfo, bus);
    HB_MIPI_SetPort(snsinfo, port);
    HB_MIPI_SensorBindSerdes(snsinfo, sedres_index, sedres_port);
    HB_MIPI_SensorBindMipi(snsinfo,  mipiIdx);
    ret = HB_MIPI_InitSensor(devId, snsInfo);
    if(ret < 0) {
        printf("HB_MIPI_InitSensor error!\n");
        HB_VIN_DestroyPipe(PipeId);
        return ret;
    }
    ret = HB_MIPI_SetMipiAttr(mipiIdx, mipiAttr);
    if(ret < 0) {
        printf("HB_MIPI_SetMipiAttr error! do sensorDeinit\n");
        HB_MIPI_SensorDeinit(sensorId);
        HB_VIN_DestroyPipe(PipeId);
        return ret;
    }

    ret = HB_VIN_EnableChn(PipeId, ChnId );
    if(ret < 0) {
        printf("HB_VIN_EnableChn error!\n");
        HB_MIPI_DeinitSensor(DevId );
        HB_MIPI_Clear(mipiIdx);
        HB_VIN_DestroyDev(pipeId);
        HB_VIN_DestroyChn(pipeId, ChnId);
        HB_VIN_DestroyPipe(pipeId);
        return ret;
    }
    ret = HB_VIN_StartPipe(PipeId);
    if(ret < 0) {
        printf("HB_VIN_StartPipe error!\n");
        HB_MIPI_DeinitSensor(DevId );
        HB_MIPI_Clear(mipiIdx);
        HB_VIN_DisableChn(pipeId, ChnId);
        HB_VIN_DestroyDev(pipeId);
        HB_VIN_DestroyChn(pipeId, ChnId);
        HB_VIN_DestroyPipe(pipeId);
        return ret;
    }
    ret = HB_VIN_EnableDev(DevId);
    if(ret < 0) {
        printf("HB_VIN_EnableDev error!\n");
        HB_MIPI_DeinitSensor(DevId );
        HB_MIPI_Clear(mipiIdx);
        HB_VIN_DisableChn(pipeId, ChnId);
        HB_VIN_StopPipe(pipeId);
        HB_VIN_DestroyDev(pipeId);
        HB_VIN_DestroyChn(pipeId, ChnId);
        HB_VIN_DestroyPipe(pipeId);
        return ret;
    }
    ret = HB_MIPI_ResetSensor(DevId );
    if(ret < 0) {
        printf("HB_MIPI_ResetSensor error! do mipi deinit\n");
        HB_MIPI_DeinitSensor(DevId );
        HB_MIPI_Clear(mipiIdx);
        HB_VIN_DisableDev(pipeId);
        HB_VIN_StopPipe(pipeId);
        HB_VIN_DisableChn(pipeId, ChnId);
        HB_VIN_DestroyDev(pipeId);
        HB_VIN_DestroyChn(pipeId, ChnId);
        HB_VIN_DestroyPipe(pipeId);
        return ret;
    }
    ret = HB_MIPI_ResetMipi(mipiIdx);
    if(ret < 0) {
        printf("HB_MIPI_ResetMipi error!\n");
        HB_MIPI_UnresetSensor(DevId );
        HB_MIPI_DeinitSensor(DevId );
        HB_MIPI_Clear(mipiIdx);
        HB_VIN_DisableDev(pipeId);
        HB_VIN_StopPipe(pipeId);
        HB_VIN_DisableChn(pipeId, ChnId);
        HB_VIN_DestroyDev(pipeId);
        HB_VIN_DestroyChn(pipeId, ChnId);
        HB_VIN_DestroyPipe(pipeId);
        return ret;
    }

    HB_MIPI_UnresetSensor(DevId );
    HB_MIPI_UnresetMipi(mipiIdx);
    HB_VIN_DisableDev(PipeId);
    HB_VIN_StopPipe(PipeId);
    HB_VIN_DisableChn(PipeId, ChnId);
    HB_MIPI_DeinitSensor(DevId );
    HB_MIPI_Clear(mipiIdx);
    HB_VIN_DestroyDev(DevId);
    HB_VIN_DestroyChn(PipeId, ChnId);
    HB_VIN_DestroyPipe(PipeId);
```

### HB_VIN_StartPipe/HB_VIN_StopPipe
【函数声明】
```c
int HB_VIN_StartPipe(uint32_t pipeId);
int HB_VIN_StopPipe(uint32_t pipeId);
```
【功能描述】
> 启动和停止 pipe

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  pipeId  | 对应每路输入，范围 0~7 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_EnableChn/HB_VIN_DisableChn
【函数声明】
```c
int HB_VIN_EnableChn(uint32_t pipeId, uint32_t chnId);
int HB_VIN_DisableChn(uint32_t pipeId, uint32_t chnId);
```
【功能描述】
> 对 pipe 的 chn 使能和关闭

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  pipeId  | 对应每路输入，范围 0~7 |   输入    |
|  chnId   |       输入 1 即可       |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_SetChnLDCAttr/HB_VIN_GetChnLDCAttr
【函数声明】
```c
int HB_VIN_SetChnLDCAttr(uint32_t pipeId, uint32_t chnId,const VIN_LDC_ATTR_S *stVinLdcAttr);
int HB_VIN_GetChnLDCAttr(uint32_t pipeId, uint32_t chnId, VIN_LDC_ATTR_S*stVinLdcAttr);
```
【功能描述】
> 设置和获取 LDC 的属性

【参数描述】

|   参数名称   |         描述          |         输入/输出          |
| :----------: | :-------------------: | :------------------------: |
|    pipeId    | 对应每路输入，范围 0~7 |            输入            |
|    chnId     |       输入 1 即可       |            输入            |
| stVinLdcAttr |     ldc 的属性信息     | 输入，获取属性的时候为输出 |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> LDC 有调整送往 IPU 数据时序的功能，在 VIN_ISP 与 VPS 模块是在线模式的情况下，必须要通过该接口配置 LDC 参数，否则 VPS 会出异常。VIN_ISP 与 VPS 模块是离线模式 LDC 参数配置与否都不影响。

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_SetChnDISAttr/HB_VIN_GetChnDISAttr
【函数声明】
```c
int HB_VIN_SetChnDISAttr(uint32_t pipeId, uint32_t chnId, const VIN_DIS_ATTR_S *stVinDisAttr);
int HB_VIN_GetChnDISAttr(uint32_t pipeId, uint32_t chnId, VIN_DIS_ATTR_S *stVinDisAttr);
```
【功能描述】
> 设置和获取 DIS 的属性

【参数描述】

|   参数名称   |         描述          |         输入/输出          |
| :----------: | :-------------------: | :------------------------: |
|    pipeId    | 对应每路输入，范围 0~7 |            输入            |
|    chnId     |       输入 1 即可       |            输入            |
| stVinDisAttr |     dis 的属性信息     | 输入，获取属性的时候为输出 |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_SetChnAttr
【函数声明】
```c
int HB_VIN_SetChnAttr(uint32_t pipeId, uint32_t chnId);
```
【功能描述】
> 设置 chn 的属性

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  pipeId  | 对应每路输入，范围 0~7 |   输入    |
|  chnId   |       输入 1 即可       |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> LDC 和 DIS 的属性真正设置是在这个接口里面，HB_VIN_SetChnLDCAttr 和 HB_VIN_SetChnDISAttr 只是给属性赋值。这个 chn 是指 isp 的其中一个输出 chn,值固定为 1。

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_DestroyChn
【函数声明】
```c
int HB_VIN_DestroyChn(uint32_t pipeId, uint32_t chnId)
```
【功能描述】
> 销毁 chn

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  pipeId  | 对应每路输入，范围 0~7 |   输入    |
|  chnId   |       输入 1 即可       |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 目前不支持 HB_VIN_DestroyChn 之后重新 HB_VIN_SetChnAttr

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_GetChnFrame/HB_VIN_ReleaseChnFrame
【函数声明】
```c
int HB_VIN_GetChnFrame(uint32_t pipeId, uint32_t chnId, void *pstVideoFrame, int32_t millSec);
int HB_VIN_ReleaseChnFrame(uint32_t pipeId, uint32_t chnId, void *pstVideoFrame);
```
【功能描述】
> 获取 pipe chn 后的数据

【参数描述】

|   参数名称    |                                                                描述                                                                | 输入/输出 |
| :-----------: | :--------------------------------------------------------------------------------------------------------------------------------: | :-------: |
|    pipeId     |                                                       对应每路输入，范围 0~7                                                        |   输入    |
|     chnId     |                                                             输入 0 即可                                                              |   输入    |
| pstVideoFrame |                                                              数据信息                                                              |   输出    |
|    millSec    | 超时参数 millSec<br/>设为-1 时，为阻塞接口；<br/>0 时为 非阻塞接口；<br/>大于 0 时为超时等待时间，<br/>超时时间的 单位为毫秒（ms） |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 此接口是获取 ISP 处理之后的图像

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_GetDevFrame/HB_VIN_ReleaseDevFrame
【函数声明】
```c
int HB_VIN_GetDevFrame(uint32_t devId, uint32_t chnId, void *videoFrame, int32_t millSec);
int HB_VIN_ReleaseDevFrame(uint32_t devId, uint32_t chnId, void *buf);
```
【功能描述】
> 获取 sif chn 处理后的数据，chn 为 0

【参数描述】

| 参数名称  |                                                                描述                                                                | 输入/输出 |
| :-------: | :--------------------------------------------------------------------------------------------------------------------------------: | :-------: |
|   devId   |                                                       对应每路输入，范围 0~7                                                        |   输入    |
|   chnId   |                                                             输入 0 即可                                                              |   输入    |
| videoFram |                                                              数据信息                                                              |   输出    |
|  millSec  | 超时参数 millSec<br/>设为-1 时，为阻塞接口；<br/>0 时为 非阻塞接口；<br/>大于 0 时为超时等待时间，<br/>超时时间的 单位为毫秒（ms） |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 此接口是获取 SIF 处理之后的图像，sif –offline-isp 得时候可以 dump raw 图，
适用场景：
>>VIN_OFFLINE_VPS_ONLINE
>>VIN_OFFLINE_VPS_OFFINE
>>VIN_SIF_OFFLINE_ISP_OFFLINE_VPS_ONLINE

另外 sif-online-isp 同时 sif 到 ddr 也可以 dump raw 图，适用场景：
>>VIN_SIF_ONLINE_DDR_ISP_DDR_VPS_ONLINE
>>VIN_SIF_ONLINE_DDR_ISP_ONLINE_VPS_ONLINE

【参考代码】
```c
    typedef struct {
        uint32_t frame_id;
        uint32_t plane_count;
        uint32_t xres[MAX_PLANE];
        uint32_t yres[MAX_PLANE];
        char *addr[MAX_PLANE];
        uint32_t size[MAX_PLANE];
    } raw_t;
    typedef struct {
        uint8_t ctx_id;
        raw_t raw;
    } dump_info_t;
    dump_info_t dump_info = {0};
    hb_vio_buffer_t *sif_raw = NULL;
    int pipeId = 0;
    sif_raw = (hb_vio_buffer_t *) malloc(sizeof(hb_vio_buffer_t));
    memset(sif_raw, 0, sizeof(hb_vio_buffer_t));

    ret = HB_VIN_GetDevFrame(pipeId, 0, sif_raw, 2000);
    if (ret < 0) {
        printf("HB_VIN_GetDevFrame error!!!\n");
    } else {
        if (sif_raw->img_info.planeCount == 1) {
            dump_info.ctx_id = info->group_id;
            dump_info.raw.frame_id = sif_raw->img_info.frame_id;
            dump_info.raw.plane_count = sif_raw->img_info.planeCount;
            dump_info.raw.xres[0] = sif_raw->img_addr.width;
            dump_info.raw.yres[0] = sif_raw->img_addr.height;
            dump_info.raw.addr[0] = sif_raw->img_addr.addr[0];
            dump_info.raw.size[0] = size;
            printf("pipe(%d)dump normal raw frame id(%d),plane(%d)size(%d)\n",
                dump_info.ctx_id, dump_info.raw.frame_id,
                dump_info.raw.plane_count, size);
        } else if (sif_raw->img_info.planeCount == 2) {
            dump_info.ctx_id = info->group_id;
            dump_info.raw.frame_id = sif_raw->img_info.frame_id;
            dump_info.raw.plane_count = sif_raw->img_info.planeCount;
            for (int i = 0; i < sif_raw->img_info.planeCount; i ++) {
                dump_info.raw.xres[i] = sif_raw->img_addr.width;
                dump_info.raw.yres[i] = sif_raw->img_addr.height;
                dump_info.raw.addr[i] = sif_raw->img_addr.addr[i];
                dump_info.raw.size[i] = size;
            }
            if(sif_raw->img_info.img_format == 0) {
                printf("pipe(%d)dump dol2 raw frame id(%d),plane(%d)size(%d)\n",
                    dump_info.ctx_id, dump_info.raw.frame_id,
                    dump_info.raw.plane_count, size);
                }
            } else if (sif_raw->img_info.planeCount == 3) {
                dump_info.ctx_id = info->group_id;
                dump_info.raw.frame_id = sif_raw->img_info.frame_id;
                dump_info.raw.plane_count = sif_raw->img_info.planeCount;
                for (int i = 0; i < sif_raw->img_info.planeCount; i ++) {
                    dump_info.raw.xres[i] = sif_raw->img_addr.width;
                    dump_info.raw.yres[i] = sif_raw->img_addr.height;
                    dump_info.raw.addr[i] = sif_raw->img_addr.addr[i];
                    dump_info.raw.size[i] = size;
                }
                printf("pipe(%d)dump dol3 raw frame id(%d),plane(%d)size(%d)\n",
                dump_info.ctx_id, dump_info.raw.frame_id,
                dump_info.raw.plane_count, size);
            } else {
                printf("pipe(%d)raw buf planeCount wrong !!!\n", info->group_id);
            }
            for (int i = 0; i < dump_info.raw.plane_count; i ++) {
                if(sif_raw->img_info.img_format == 0) {
                    sprintf(file_name, "pipe%d_plane%d_%ux%u_frame_%03d.raw",
                            dump_info.ctx_id,
                            i,
                            dump_info.raw.xres[i],
                            dump_info.raw.yres[i],
                            dump_info.raw.frame_id);
                    dumpToFile(file_name,  dump_info.raw.addr[i], dump_info.raw.size[i]);
                }
            }
            if(sif_raw->img_info.img_format == 8) {
                sprintf(file_name, "pipe%d_%ux%u_frame_%03d.yuv",
                        dump_info.ctx_id,
                        dump_info.raw.xres[i],
                        dump_info.raw.yres[i],
                        dump_info.raw.frame_id);
                dumpToFile2plane(file_name, sif_raw->img_addr.addr[0],
                    sif_raw->img_addr.addr[1], size, size/2);
            }
        }
        ret = HB_VIN_ReleaseDevFrame(pipeId, 0, sif_raw);
        if (ret < 0) {
            printf("HB_VIN_ReleaseDevFrame error!!!\n");
        }
        free(sif_raw);
        sif_raw = NULL;
    }

    int dumpToFile(char *filename, char *srcBuf, unsigned int size)
    {
        FILE *yuvFd = NULL;
        char *buffer = NULL;

        yuvFd = fopen(filename, "w+");
        if (yuvFd == NULL) {
            vio_err("ERRopen(%s) fail", filename);
            return -1;
        }
        buffer = (char *)malloc(size);
        if (buffer == NULL) {
            vio_err(":malloc file");
            fclose(yuvFd);
            return -1;
        }
        memcpy(buffer, srcBuf, size);
        fflush(stdout);
        fwrite(buffer, 1, size, yuvFd);
        fflush(yuvFd);
        if (yuvFd)
            fclose(yuvFd);
        if (buffer)
        free(buffer);
        vio_dbg("filedump(%s, size(%d) is successed\n", filename, size);
        return 0;
    }
    int dumpToFile2plane(char *filename, char *srcBuf, char *srcBuf1,
                        unsigned int size, unsigned int size1)
    {
        FILE *yuvFd = NULL;
        char *buffer = NULL;

        yuvFd = fopen(filename, "w+");
        if (yuvFd == NULL) {
            vio_err("open(%s) fail", filename);
            return -1;
        }
        buffer = (char *)malloc(size + size1);
        if (buffer == NULL) {
            vio_err("ERR:malloc file");
            fclose(yuvFd);
            return -1;
        }
        memcpy(buffer, srcBuf, size);
        memcpy(buffer + size, srcBuf1, size1);
        fflush(stdout);
        fwrite(buffer, 1, size + size1, yuvFd);
        fflush(yuvFd);
        if (yuvFd)
            fclose(yuvFd);
        if (buffer)
            free(buffer);
        vio_dbg("filedump(%s, size(%d) is successed\n", filename, size);
        return 0;
    }
```

### HB_VIN_SendPipeRaw
【函数声明】
```c
int HB_VIN_SendPipeRaw(uint32_t pipeId, void *pstVideoFrame，int32_t millSec)
```
【功能描述】
> 回灌 raw 接口，数据给 ISP 处理

【参数描述】

|   参数名称    |                                                                描述                                                                | 输入/输出 |
| :-----------: | :--------------------------------------------------------------------------------------------------------------------------------: | :-------: |
|    pipeId     |                                                       对应每路输入，范围 0~7                                                        |   输入    |
| pstVideoFrame |                                                          回灌 raw 数据信息                                                           |   输入    |
|    millSec    | 超时参数 millSec<br/>设为-1 时，为阻塞接口；<br/>0 时为 非阻塞接口；<br/>大于 0 时为超时等待时间，<br/>超时时间的 单位为毫秒（ms） |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
```c
    int pipeId = 0;
    hb_vio_buffer_t *feedback_buf;
    hb_vio_buffer_t *isp_yuv = NULL;
    isp_yuv = (hb_vio_buffer_t *) malloc(sizeof(hb_vio_buffer_t));
    memset(isp_yuv, 0, sizeof(hb_vio_buffer_t));
    ret = HB_VIN_SendPipeRaw(pipeId, feedback_buf,1000);
    if (ret) {
        printf("HB_VIN_SendFrame error!!!\n");
    }
    ret = HB_VIN_GetChnFrame(pipeId, 0, isp_yuv, -1);
    if (ret < 0) {
        printf("HB_VIN_GetPipeFrame error!!!\n");
    }
    ret = HB_VIN_ReleaseChnFrame(pipeId, 0, isp_yuv);
    if (ret < 0) {
        printf("HB_VPS_ReleaseDevRaw error!!!\n");
    }
```

### HB_VIN_SetPipeAttr/HB_VIN_GetPipeAttr
【函数声明】
```c
int HB_VIN_SetPipeAttr(uint32_t pipeId,VIN_PIPE_ATTR_S *stVinPipeAttr);
int HB_VIN_GetPipeAttr(uint32_t pipeId, VIN_PIPE_ATTR_S *stVinPipeAttr);
```
【功能描述】
> 设置 pipe（ISP）属性、获取 pipe 属性

【参数描述】

|   参数名称    |         描述          |       输入/输出       |
| :-----------: | :-------------------: | :-------------------: |
|    pipeId     | 对应每路输入，范围 0~7 |         输入          |
| stVinPipeAttr |  描述 pipe 属性的指针   | 输入，get 的时候为输出 |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_VIN_CreatePipe/HB_VIN_DestroyPipe 举例

### HB_VIN_CtrlPipeMirror
【函数声明】
```c
int HB_VIN_CtrlPipeMirror(uint32_t pipeId, uint8_t on);
```
【功能描述】
> pipe 镜像控制。

【参数描述】

| 参数名称 |               描述               | 输入/输出 |
| :------: | :------------------------------: | :-------: |
|  pipeId  |      对应每路输入，范围 0~7       |   输入    |
|    on    | 非 0 打开镜像功能，0 关闭镜像功能。 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> Flip 功能需要借助 GDC 实现，如先把镜像打开然后再旋转 180 度。

### HB_VIN_MotionDetect
【函数声明】
```c
int HB_VIN_MotionDetect(uint32_t pipeId)
```
【功能描述】
> 检测 MD 是否有中断,有 MD 中断就返回

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  pipeId  | 对应每路输入，范围 0~7 |   输入    |

【返回值】

| 返回值 |                         描述                         |
| :----: | :--------------------------------------------------: |
|   0    | 检测到运行物体，阻塞调用，未检测到运动物体一直阻塞。 |

【注意事项】
> 无

【参考代码】
> 请参见 HB_VIN_EnableDevMd 举例

### HB_VIN_InitLens
【函数声明】
```c
int HB_VIN_InitLens(uint32_t pipeId, VIN_LENS_FUNC_TYPE_E lensType, const VIN_LENS_CTRL_ATTR_S *lenCtlAttr)
```
【功能描述】
> 马达驱动初始化。

【参数描述】

|  参数名称  |             描述             | 输入/输出 |
| :--------: | :--------------------------: | :-------: |
|   pipeId   |    对应每路输入，范围 0~7     |   输入    |
|  lensType  | 马达的功能类型，AF、Zoom 功能 |   输入    |
| lenCtlAttr |           控制属性           |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 如果使用 AF 调用一次接口，如果同时使用 AF 和 Zoom 功能，调用两次初始化。使用就去调用，不使用建议不调用。

【参考代码】
> 暂无

### HB_VIN_DeinitLens
【函数声明】
```c
int HB_VIN_DeinitLens(uint32_t pipeId)
```
【功能描述】
> 马达退出

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  pipeId  | 对应每路输入，范围 0~7 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 暂无

### HB_VIN_RegisterDisCallback
【函数声明】
```c
int HB_VIN_RegisterDisCallback(uint32_t pipeId, VIN_DIS_CALLBACK_S *pstDISCallback)
```
【功能描述】
> 注册 dis 回调

【参数描述】

|    参数名称    |         描述          | 输入/输出 |
| :------------: | :-------------------: | :-------: |
|     pipeId     | 对应每路输入，范围 0~7 |   输入    |
| pstDISCallback |       回调接口        |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 暂无

### HB_VIN_SetDevVCNumber/HB_VIN_GetDevVCNumber
【函数声明】
```c
int HB_VIN_SetDevVCNumber(uint32_t devId, uint32_t vcNumber);
int HB_VIN_GetDevVCNumber(uint32_t devId, uint32_t *vcNumber);
```
【功能描述】
> 设置和获取 dev 的 vc_index，使用 MIPI 的哪个 vc.

【参数描述】

| 参数名称 |         描述          |       输入/输出        |
| :------: | :-------------------: | :--------------------: |
|  devId   | 对应每路输入，范围 0~7 |          输入          |
| vcNumber | 对应 mipi 的 vc,范围 0~3  | 输入，获取的时候为输出 |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 无

### HB_VIN_AddDevVCNumber
【函数声明】
```c
int HB_VIN_AddDevVCNumber(uint32_t devId, uint32_t vcNumber)
```
【功能描述】
> 设置 dev 的 vc_index,使用 MIPI 的哪个 vc.

【参数描述】

| 参数名称 |          描述           | 输入/输出 |
| :------: | :---------------------: | :-------: |
|  devId   | 对应每路输 vc 入，范围 0~7 |   输入    |
| vcNumber |  对应 mipi 的 vc,范围 0~3   |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 当使用 linear 模式时，这个接口不用使用，当使用 DOL2 模式时，此接口 vcNumber 设置为 1，当使用 DOL3 模式时，调用两次 HB_VIN_AddDevVCNumber，vcNumber 分别传 0 和 1.

【参考代码】
> 一路 DOL2
> 初始化顺序：
> 1)  把 dev0 绑到 mipi0
> HB_VIN_SetMipiBindDev(0, 0)
> 2)  把 mipi0 的虚通道 0 绑到 dev0
> HB_VIN_SetDevVCNumber(0, 0)
> 3)  把 mipi0 的虚通道 1 绑到 dev0
> HB_VIN_AddDevVCNumber(0, 1);
> 4)  把 dev0 分别绑到 ISP pipe0,
> HB_VIN_SetDevBindPipe(0, 0)
```c
    ret = HB_SYS_SetVINVPSMode(pipeId, vin_vps_mode);
    if(ret < 0) {
        printf("HB_SYS_SetVINVPSMode%d error!\n", vin_vps_mode);
        return ret;
    }
    ret = HB_VIN_CreatePipe(pipeId, pipeinfo);   // isp init
    if(ret < 0) {
        printf("HB_MIPI_InitSensor error!\n");
        return ret;
    }
    ret = HB_VIN_SetMipiBindDev(pipeId, mipiIdx);
    if(ret < 0) {
        printf("HB_VIN_SetMipiBindDev error!\n");
        return ret;
    }
    ret = HB_VIN_SetDevVCNumber(pipeId, deseri_port);
    if(ret < 0) {
        printf("HB_VIN_SetDevVCNumber error!\n");
        return ret;
    }
    ret = HB_VIN_AddDevVCNumber(pipeId, vc_num);
    if(ret < 0) {
        printf("HB_VIN_AddDevVCNumber error!\n");
        return ret;
    }
    ret = HB_VIN_SetDevAttr(pipeId, devinfo);
    if(ret < 0) {
        printf("HB_MIPI_InitSensor error!\n");
        return ret;
    }
    ret = HB_VIN_SetPipeAttr(pipeId, pipeinfo);
    if(ret < 0) {
        printf("HB_VIN_SetPipeAttr error!\n");
        goto pipe_err;
    }
    ret = HB_VIN_SetChnDISAttr(pipeId, 1, disinfo);
    if(ret < 0) {
        printf("HB_VIN_SetChnDISAttr error!\n");
        goto pipe_err;
    }
    ret = HB_VIN_SetChnLDCAttr(pipeId, 1, ldcinfo);
    if(ret < 0) {
        printf("HB_VIN_SetChnLDCAttr error!\n");
        goto pipe_err;
    }
    ret = HB_VIN_SetChnAttr(pipeId, 1);
    if(ret < 0) {
        printf("HB_VIN_SetChnAttr error!\n");
        goto chn_err;
    }
    HB_VIN_SetDevBindPipe(pipeId, pipeId);
```

### HB_VIN_SetDevMclk
【函数声明】
```c
int HB_VIN_SetDevMclk(uint32_t devId, uint32_t devMclk, uint32_t vpuMclk);
```
【功能描述】
> 设置 sif mclk 和 vpu clk.

【参数描述】

| 参数名称 |             描述             |   输入/输出   |
| :------: | :--------------------------: | :-----------: |
|  devId   |    对应每路输入，范围 0~7     |     输入      |
| devMclk  | Sif mclk 设置，请参见 SIF MCLK | 输入，单位 KHz |
| vpuMclk  |  vpu clk 设置, 请参见 VPU CLK  | 输入，单位 KHz |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 暂无

### HB_VIN_GetChnFd
【函数声明】
```c
int HB_VIN_GetChnFd(uint32_t pipeId, uint32_t chnId)
```
【功能描述】
> 获取通道的 fd

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  pipeId  | 对应每路输入，范围 0~7 |   输入    |
|  chnId   |      通道号，为 0      |   输入    |

【返回值】

| 返回值 | 描述  |
| :----: | :---: |
|  正值  | 成功  |
|  负值  | 失败  |

【注意事项】
> 无

【参考代码】
> 暂无

### HB_VIN_CloseFd
【函数声明】
```c
int HB_VIN_CloseFd(void)
```
【功能描述】
> 关闭通道的 fd

【参数描述】

| 参数名称 | 描述  | 输入/输出 |
| :------: | :---: | :-------: |
|   void   |  无   |  无输入   |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 无

【参考代码】
> 暂无

### HB_VIN_EnableDevMd
【函数声明】
```c
int HB_VIN_EnableDevMd(uint32_t devId)
```
【功能描述】
> 打开 motiondetect 功能

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  devId   | 对应每路输入，范围 0~7 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 调用得在 HB_VIN_SetDevAttrEx 之后，HB_VIN_SetDevAttrEx 接口是设置 MD 的一些属性值

【参考代码】
```c
    VIN_DEV_ATTR_EX_S devAttr;
    devAttr. path_sel = 0;
    devAttr. roi_top = 0;
    devAttr. roi_left = 0;
    devAttr. roi_width = 1280;
    devAttr. roi_height = 640;
    devAttr. grid_step = 128;
    devAttr. grid_tolerance =10;
    devAttr. threshold = 10;
    devAttr. weight_decay = 128;
    devAttr. precision = 0;
    ret = HB_VIN_SetDevAttrEx(pipeId, devexinfo);
    if(ret < 0) {
        printf("HB_VIN_SetDevAttrEx error!\n");
        return ret;
    }
    ret = HB_VIN_EnableDevMd(pipeId);
    if(ret < 0) {
        printf("HB_VIN_EnableDevMd error!\n");
        return ret;
    }
```
下面起一个线程调用 HB_VIN_MotionDetect 检测收到 MD 中断后将 MD 功能关闭 HB_VIN_DisableDevMd。
```c
    int md_func(work_info_t * info)
    {
        int ret = 0;
        int pipeId = info->group_id;
        ret =  HB_VIN_MotionDetect(pipeId);
        if (ret < 0) {
            printf("HB_VIN_MotionDetect error!!! ret %d \n", ret);
        } else {
            HB_VIN_DisableDevMd(pipeId);
            printf("HB_VIN_DisableDevMd success!!! ret %d \n", ret);
        }
        return ret;
    }
```

### HB_VIN_DisableDevMd
【函数声明】
```c
int HB_VIN_DisableDevMd(uint32_t devId)
```
【功能描述】
> 关闭 motiondetect 功能

【参数描述】

| 参数名称 |         描述          | 输入/输出 |
| :------: | :-------------------: | :-------: |
|  devId   | 对应每路输入，范围 0~7 |   输入    |

【返回值】

| 返回值 | 描述 |
|:------:|:----:|
|    0   | 成功 |
|   非 0  | 失败 |

【注意事项】
> 用户收到 md 中断后关闭 md 功能

【参考代码】
> 请参见 HB_VIN_EnableDevMd 举例

## 数据结构

### MIPI_INPUT_MODE_E
【结构定义】
```c
typedef enum HB_MIPI_INPUT_MODE_E
{
    INPUT_MODE_MIPI         = 0x0,              /* mipi */
    INPUT_MODE_DVP         = 0x1,              /* DVP*/
    INPUT_MODE_BUTT
} MIPI_INPUT_MODE_E;
```
【功能描述】
> sensor 接入方式

【成员说明】
- MIPI 接入
- DVP 接入

### MIPI_SENSOR_MODE_E
【结构定义】
```c
typedef enum HB_MIPI_SENSOR_MODE_E
{
    NORMAL_M             = 0x0,
    DOL2_M               = 0x1,
    DOL3_M               = 0x2,
    PWL_M                = 0x3,
} MIPI_SENSOR_MODE_E;
```
【功能描述】
> sensor 工作模式

【成员说明】
> linear 模式、DOL2 模式、DOL3 模式、PWL 模式

### MIPI_DESERIAL_INFO_T
【结构定义】
```c
typedef struct HB_MIPI_DESERIAL_INFO_T {
    int bus_type;
    int bus_num;
    int deserial_addr;
    int physical_entry;
    char *deserial_name;
} MIPI_DESERIAL_INFO_T;
```
【功能描述】
> 定义 serdes 初始化的属性信息

【成员说明】

|      成员      | 含义                                         |
| :------------: | :------------------------------------------- |
|    bus_type    | 总线类型，0 是 i2c,1 是 spi                      |
|    bus_num     | 总线号,根据具体板子硬件原理图确定，目前用的 5 |
| deserial_addr  | serdes 地址                                   |
| physical_entry | 保留                                         |
| deserial_name  | serdes 名字                                   |

### MIPI_SNS_INFO_S
【结构定义】
```c
typedef struct HB_MIPI_SNS_INFO_S {
    int port;
    int dev_port;
    int bus_type;
    int bus_num;
    int fps;
    int resolution;
    int sensor_addr;
    int serial_addr;
    int entry_index;
    MIPI_SENSOR_MODE_E sensor_mode;
    int reg_width;
    char *sensor_name;
    int extra_mode;
    int deserial_index;
    int deserial_port;
    int gpio_num;
    int gpio_pin[GPIO_NUM];
    int gpio_level[GPIO_NUM];
    MIPI_SPI_DATA_S spi_info;
} MIPI_SNS_INFO_S;
```
【功能描述】
> 定义 sensor 初始化的属性信息

【成员说明】

|      成员      | 含义                                                                       |
| :------------: | :------------------------------------------------------------------------- |
|      port      | 当前 sensor 的一个逻辑编号，必须从 0 开始                                      |
|    dev_port    | 每路 sensor 操作的驱动节点，一个驱动支持多个节点。                           |
|    bus_type    | 总线类型，0 是 i2c,1 是 spi                                                    |
|    bus_num     | 总线号，根据具体板子硬件原理图确定,现在默认 i2c5                            |
|      fps       | 帧率                                                                       |
|   resolution   | Sensor 的分辨率                                                             |
|  sensor_addr   | sensor 地址                                                                 |
|  serial_addr   | sensor 内部 serdes 地址                                                       |
|  entry_index   | sensor 使用的 mipi 索引                                                       |
|  sensor_mode   | sensor 工作模式，1 是 normal,2 是 dol2,3 是 dol3                                  |
|   reg_width    | 寄存器地址宽度                                                             |
|  sensor_name   | sensor 名字                                                                 |
|   extra_mode   | 区分 sensor 的特性，具体 sensor 驱动实现                                       |
| deserial_index | 当前属于哪一个 serdes                                                       |
| deserial_port  | 当前属于 serdes 哪一个 port                                                   |
|    gpio_num    | 有的 sensor 需要 gpio 上下电，此 sensor 用到的相关 GPIO 管脚                       |
|    gpio_pin    | 操作的 GPIO 管脚，GPIO_NUM 是用到的 GPIO 管脚的个数                             |
|   gpio_level   | 初始有效值，比如该管脚需要先拉低再拉高，此值为 0，如果先拉高在拉低，此值为 1 |
|    spi_info    | sensor spi 信息，有的 sensor 通过 spi 总线访问                                  |

### MIPI_SENSOR_INFO_S
【结构定义】
```c
typedef struct HB_MIPI_SENSOR_INFO_S {
    int    deseEnable;
    MIPI_INPUT_MODE_E  inputMode;
    MIPI_DESERIAL_INFO_T deserialInfo;
    MIPI_SNS_INFO_S  sensorInfo;
} MIPI_SENSOR_INFO_S;
```
【功能描述】
> 定义 dev 初始化的属性信息

【成员说明】

|     成员     | 含义                 |
| :----------: | :------------------- |
|  deseEnable  | 该 sensor 是否有 serdes |
|  inputMode   | sensor 接入方式       |
| deserialInfo | serdes 信息           |
|  sensorInfo  | sensor 信息           |

### MIPI_HOST_CFG_S
【结构定义】
```c
typedef struct HB_MIPI_HOST_CFG_S {
    uint16_t  lane;
    uint16_t  datatype;
    uint16_t  mclk;
    uint16_t  mipiclk;
    uint16_t  fps;
    uint16_t  width;
    uint16_t  height;
    uint16_t  linelenth;
    uint16_t  framelenth;
    uint16_t  settle;
    uint16_t  channel_num;
    uint16_t  channel_sel[4];
} MIPI_HOST_CFG_S;
```
【功能描述】
> 定义 mipi 初始化参数信息

【成员说明】

|      成员      | 含义                                                   |
| :------------: | :----------------------------------------------------- |
|      lane      | lane 个数，0~4                                          |
|    datatype    | 数据格式,参见 DATA TYPE                                 |
|      mclk      | mipi 模块主时钟，目前固定是 24MHZ                        |
|    mipiclk     | sensor 输出 总的 mipi bit rate, 单位 Mbits/每秒         |
|      fps       | sensor 输出实际帧率                                     |
|     width      | sensor 输出实际宽度                                     |
|     height     | sensor 输出实际高度                                     |
|   linelenth    | sensor 输出带 blanking 的总行长                           |
|   framelenth   | sensor 输出带 blanking 的总行数                           |
|     settle     | sensor 输出实际 Ttx-zero + Ttx-prepare 时间（clk 为单位） |
|  channel_num   | 使用虚通道的个数                                       |
| channel_sel[4] | 保存每个虚通道的值                                     |

### MIPI_ATTR_S
【结构定义】
```c
typedef struct HB_MIPI_ATTR_S {
    MIPI_HOST_CFG_S mipi_host_cfg;
    uint32_t  dev_enable;
} MIPI_ATTR_S;
```
【功能描述】
> 定义 mipi 初始化参数信息

【成员说明】

|     成员      | 含义                               |
| :-----------: | :--------------------------------- |
| mipi_host_cfg | mipi host 属性结构体                |
|  dev_enable   | mipi dev 是否使能，1 是使能，0 是关闭 |

### MIPI_SPI_DATA_S
【结构定义】
```c
typedef struct HB_MIPI_SPI_DATA_S {
    int spi_mode;
    int spi_cs;
    uint32_t spi_speed;
} MIPI_SPI_DATA_S;
```
【功能描述】
> 定义 sensor 相关 spi 信息

【成员说明】

|   成员    | 含义          |
| :-------: | :------------ |
| spi_mode  | spi 的工作模式 |
|  spi_cs   | spi 的片选     |
| spi_speed | spi 的传输速率 |

### VIN_DEV_SIZE_S
【结构定义】
```c
typedef struct HB_VIN_DEV_SIZE_S {
    uint32_t  format;
    uint32_t  width;
    uint32_t  height;
    uint32_t  pix_length;
} VIN_DEV_SIZE_S;
```
【功能描述】
> 定义 dev 初始化的属性信息

【成员说明】

|    成员    | 含义                                                                            |
| :--------: | :------------------------------------------------------------------------------ |
|   format   | 像素格式，format 为 0 代表是 raw8~raw16,根据 pixel_lenght 来表示究竟是 raw8 还是 raw16。 |
|   width    | 数据宽                                                                          |
|   height   | 数据高                                                                          |
| pix_length | 每个像素点长度                                                                  |

### VIN_MIPI_ATTR_S
【结构定义】
```c
typedef struct HB_VIN_MIPI_ATTR_S {
    uint32_t  enable;
    uint32_t  ipi_channels;
    uint32_t  ipi_mode;
    uint32_t  enable_mux_out;
    uint32_t  enable_frame_id;
    uint32_t  enable_bypass;
    uint32_t  enable_line_shift;
    uint32_t  enable_id_decoder;
    uint32_t  set_init_frame_id;
    uint32_t  set_line_shift_count;
    uint32_t  set_bypass_channels;
    uint32_t  enable_pattern;
} VIN_MIPI_ATTR_S;
```
【功能描述】
> 定义 dev mipi 初始化的信息

【成员说明】

|         成员         | 含义                                                                                        |
| :------------------: | :------------------------------------------------------------------------------------------ |
|        enable        | mipi 使能,0 是关闭，1 是使能                                                                   |
|     ipi_channels     | ipi_channels 表示用了几个 channel，默认是 0 开始，如果设置是 2，是用了 0，1                       |
|       ipi_mode       | 当 DOL2 分成两路 linear 或者 DOL3 分成一路 DOl2 和一路 linear 或者三路 linear 的时候，此值就赋值为 2 或 3. |
|    enable_mux_out    | 使能 mux 选择输出                                                                             |
|   enable_frame_id    | 是否使能 frameid                                                                             |
|    enable_bypass     | 是否使能 bypass                                                                              |
|  enable_line_shift   | 未用                                                                                        |
|  enable_id_decoder   | 未用                                                                                        |
|  set_init_frame_id   | 初始 frame id 值一般为 1                                                                       |
| set_line_shift_count | 未用                                                                                        |
| set_bypass_channels  | 未用                                                                                        |
|    enable_pattern    | 是否使能 testpartern                                                                         |

### VIN_DEV_INPUT_DDR_ATTR_S
【结构定义】
```c
typedef struct HB_VIN_DEV_INPUT_DDR_ATTR_S {
    uint32_t stride;
    uint32_t buf_num;
    uint32_t raw_feedback_en;
    VIN_DEV_SIZE_S data;
} VIN_DEV_INPUT_DDR_ATTR_S;
```
【功能描述】
> 定义 dev 输入信息，offline 和回灌场景用

【成员说明】

|      成员       | 含义                                                         |
| :-------------: | :----------------------------------------------------------- |
|     stride      | 硬件 stride 跟格式匹配，如果是 12bit 那么 stride = widthx1.5，如果是 10bit，stride = widthx1.25,如此类推 |
|     buf_num     | 回灌的存储数据的 buf 数目                                    |
| raw_feedback_en | 使能回灌模式，不能和 offline 模式同时开启，独立使用           |
|      data       | 数据格式，见 VIN_DEV_SIZE_S                                  |

### VIN_DEV_OUTPUT_DDR_S
【结构定义】
```c
typedef struct HB_VIN_DEV_OUTPUT_DDR_S {
    uint32_t stride;
    uint32_t buffer_num;
    uint32_t frameDepth
} VIN_DEV_OUTPUT_DDR_S;
```
【功能描述】
> 定义 dev 输出到 ddr 初始化的信息

【成员说明】

|    成员    | 含义                                                                            |
| :--------: | :------------------------------------------------------------------------------ |
|   stride   | 硬件 stride 跟格式匹配，目前 12bit  1952x1.5                                      |
| buffer_num | dev 输出到 ddr 的 buf 个数                                                        |
| frameDepth | 最多 get 的帧数, buffer_num 是总 buff 数量，建议 frameDepth 值最大是 ddrOutBufNum – 4。 |

### VIN_DEV_OUTPUT_ISP_S
【结构定义】
```c
typedef struct HB_VIN_DEV_OUTPUT_ISP_S {
    uint32_t dol_exp_num;
    uint32_t enable_dgain;
    uint32_t set_dgain_short;
    uint32_t set_dgain_medium;
    uint32_t set_dgain_long;
    uint32_t short_maxexp_lines;
    uint32_t medium_maxexp_lines;
    uint32_t vc_short_seq;
    uint32_t vc_medium_seq;
    uint32_t vc_long_seq;
} VIN_DEV_OUTPUT_ISP_S;
```
【功能描述】
> 定义 dev 输出到 pipe 初始化的信息

【成员说明】

|        成员         | 含义                                                                                |
| :-----------------: | :---------------------------------------------------------------------------------- |
|     dol_exp_num     | 曝光模式，1 为普通模式，dol 2 或者 3 设置对应数目                                   |
|    enable_dgain     | ISP 内部调试参数，暂可忽略                                                           |
|   set_dgain_short   | ISP 内部调试参数，暂可忽略                                                          |
|  set_dgain_medium   | ISP 内部调试参数，暂可忽略                                                          |
|   set_dgain_long    | ISP 内部调试参数，暂可忽略                                                          |
| short_maxexp_lines  | 最短帧的最大曝光行数，一般是 sensor mode 寄存器表中找，DOL2/3 需要填，用来分配 IRAM 大小 |
| medium_maxexp_lines | 普通帧的最大曝光行数，一般是 sensor mode 寄存器表中找，DOL3 需要填，用来分配 IRAM 大小   |
|    vc_short_seq     | 用来描述 DOL2/3 模式下，短帧的顺序                                                    |
|    vc_medium_seq    | 用来描述 DOL2/3 模式下，普通帧的顺序                                                  |
|     vc_long_seq     | 用来描述 DOL2/3 模式下，长帧的顺序                                                    |

### VIN_DEV_ATTR_S
【结构定义】
```c
typedef struct HB_VIN_DEV_ATTR_S {
    VIN_DEV_SIZE_S        stSize;
    union
    {
        VIN_MIPI_ATTR_S  mipiAttr;
        VIN_DVP_ATTR_S   dvpAttr;
    };
    VIN_DEV_INPUT_DDR_ATTR_S DdrIspAttr;
    VIN_DEV_OUTPUT_DDR_S outDdrAttr;
    VIN_DEV_OUTPUT_ISP_S outIspAttr;
    }VIN_DEV_ATTR_S;
```
【功能描述】
> 定义 dev 初始化的属性信息

【成员说明】

|        成员         | 含义                                                        |
| :-----------------: | :---------------------------------------------------------- |
|   VIN_DEV_SIZE_S    | stSize 输入的数据                                           |
| VIN_DEV_INTF_MODE_E | enIntfMode sif(dev)输入的接口模式，mipi or dvp,目前都是 mipi |
|     DdrIspAttr      | isp(pipe)的输入属性配置，offline 或者是回灌                  |
|     outDdrAttr      | sif(dev)的输出到 ddr 配置                                     |
|     outIspAttr      | sif 到 isp 一些属性设置                                        |

### VIN_DEV_ATTR_EX_S
【结构定义】
```c
typedef struct HB_VIN_DEV_ATTR_EX_S {
    uint32_t path_sel;
    uint32_t roi_top;
    uint32_t roi_left;
    uint32_t roi_width;
    uint32_t roi_height;
    uint32_t grid_step;
    uint32_t grid_tolerance;
    uint32_t threshold;
    uint32_t weight_decay;
    uint32_t precision;
}VIN_DEV_ATTR_EX_S;
```
【功能描述】
> 定义 md 相关信息

【成员说明】

|      成员      | 含义                                                                                                                                                   |
| :------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
|    path_sel    | 0：sif-isp 通路；1：sif-ipu 通路                                                                                                                         |
|    roi_top     | ROI 的 y 坐标                                                                                                                                             |
|    roi_left    | ROI 的 x 坐标                                                                                                                                             |
|   roi_width    | ROI 的长，必须是 step 的整数 s 倍                                                                                                                           |
|   roi_height   | ROI 的宽， 必须是 step 的整数倍                                                                                                                           |
|   grid_step    | 对应 motion detect 的区域中划分的每块的宽和高。为 2 的整数次幂，有效范围为 4~128。                                                                          |
| grid_tolerance | 每个块前后两帧进行比较的阈值。当前后两帧中相同块进行相减，插值超过这个阈值时，判断为不同。                                                             |
|   threshold    | 动态检测选取的 ROI 区域中划分的块比较不同的个数超过这个阈值,发出 mot_det 中断。                                                                            |
|  weight_decay  | 新的一帧更新 ref buffer 时不是完全替代上一帧的数据，而是前后两帧加权平均的结果。Mot_det_wgt_decay 为当前帧的权重，前一帧的权重为(256-mot_det_wgt_decay)。 |
|   precision    | 为进行每个块计算时保留的小数点后的精度的位数，有效范围为 1~4.                                                                                           |

### VIN_PIPE_SENSOR_MODE_E
【结构定义】
```c
typedef enum HB_VIN_PIPE_SENSOR_MODE_E {
    SENSOR_NORMAL_MODE = 1,
    SENSOR_DOL2_MODE,
    SENSOR_DOL3_MODE,
    SENSOR_DOL4_MODE,
    SENSOR_PWL_MODE,
    SENSOR_INVAILD_MODE
} VIN_PIPE_SENSOR_MODE_E;
```
【功能描述】
> sensor 工作模式

【成员说明】
> normal 模式、DOL2 模式、DOL3 模式、PWL 模式（压缩模式）

### VIN_PIPE_CFA_PATTERN_E
【结构定义】
```c
typedef enum HB_VIN_PIPE_CFA_PATTERN_E {
    PIPE_BAYER_RGGB = 0,
    PIPE_BAYER_GRBG,
    PIPE_BAYER_GBRG,
    PIPE_BAYER_BGGR,
    PIPE_MONOCHROME,
} VIN_PIPE_CFA_PATTERN_E;
```
【功能描述】
> 数据格式布局

【成员说明】
>不同的数据存储格式

### VIN_PIPE_SIZE_S
【结构定义】
```c
typedef struct HB_VIN_PIPE_SIZE_S {
    uint32_t  format;
    uint32_t  width;
    uint32_t  height;
} VIN_PIPE_SIZE_S;
```
【功能描述】
> 定义 pipe size 数据信息

【成员说明】

|  成员  | 含义     |
| :----: | :------- |
| format | 数据格式 |
| width  | 数据宽   |
| height | 数据高   |

### VIN_PIPE_CALIB_S
【结构定义】
```c
typedef struct HB_VIN_PIPE_CALIB_S {
    uint32_t mode;
    unsigned char *lname;
} VIN_PIPE_CALIB_S;
```
【功能描述】
> sensor 矫正数据加载

【成员说明】

| 成员  | 含义                       |
| :---: | :------------------------- |
| mode  | 是否开启 sensor 矫正数据加载 |
| lname | 对应使用的校准库           |

### VIN_PIPE_ATTR_S
【结构定义】
```c
typedef struct HB_VIN_PIPE_ATTR_S {
    uint32_t  ddrOutBufNum;
    uint32_t  frameDepth;
    VIN_PIPE_SENSOR_MODE_E snsMode;
    VIN_PIPE_SIZE_S stSize;
    VIN_PIPE_CFA_PATTERN_E cfaPattern;
    uint32_t   temperMode;
    uint32_t   ispBypassEn;
    uint32_t   ispAlgoState;
    uint32_t   ispAfEn;s
    uint32_t   bitwidth;
    uint32_t   startX;
    uint32_t   startY;
    VIN_PIPE_CALIB_S calib;
} VIN_PIPE_ATTR_S;
```
【功能描述】
> 定义 pipe 属性信息

【成员说明】

|     成员     | 含义                                                         |
| :----------: | :----------------------------------------------------------- |
| ddrOutBufNum | 数据的位宽，8 \10\12\14\16                                   |
|  frameDepth  | 最多 get 的帧数, ddrOutBufNum 是总 buff 数量，建议 frameDepth 值最大是 ddrOutBufNum – 3。 |
|   snsMode    | sensor 工作模式                                               |
|    stSize    | sensor 的数据信息，见 17                                       |
|  cfaPattern  | 数据格式布局，和 sensor 保持一致                               |
|  temperMode  | temper 模式，0 关闭，2 打开                                     |
| BypassEnable | 是否使能 isp 的 bypass                                          |
| ispAlgoState | 是否启动 3a 算法库,1 是启动，0 是关闭                            |
|   bitwidth   | 位宽，有效值 8、10、12、14、16、20                           |
|    startX    | 相对于原点的 X 偏移                                            |
|    startY    | 相对于原点的 Y 偏移                                            |
|    calib     | 是否开启 sensor 矫正数据加载，1 是开启，0 是关闭。               |

### VIN_LDC_PATH_SEL_S
【结构定义】
```c
typedef struct HB_VIN_LDC_PATH_SEL_S {
    uint32_t rg_y_only:1;
    uint32_t rg_uv_mode:1;
    uint32_t rg_uv_interpo:1;
    uint32_t reserved1:5;
    uint32_t rg_h_blank_cyc:8;
    uint32_t reserved0:16;
} VIN_LDC_PATH_SEL_S;
```
【功能描述】
> 定义 LDC 属性信息

【成员说明】

|      成员      | 含义      |
| :------------: | :-------- |
|   rg_y_only    | 输出类型  |
|   rg_uv_mode   | 输出类型  |
| rg_uv_interpo  | turning 用 |
| rg_h_blank_cyc | turning 用 |

### VIN_LDC_PICSIZE_S
【结构定义】
```c
typedef struct HB_VIN_LDC_PICSIZE_S {
    uint16_t pic_w;
    uint16_t pic_h;
} VIN_LDC_PICSIZE_S;
```
【功能描述】
> 定义 LDC 宽高输入信息

【成员说明】

| 成员  | 含义                                                               |
| :---: | :----------------------------------------------------------------- |
| pic_w | 需要设置比接入尺寸  -1 的 size, 如果 ISP 输出 1920 , 则这里设置 1919 |
| pic_h | 除了 size, ldc 以及 dis 部分其他设置不要更改                          |

### VIN_LDC_ALGOPARAM_S
【结构定义】
```c
typedef struct HB_VIN_LDC_ALGOPARAM_S {
    uint16_t rg_algo_param_b;
    uint16_t rg_algo_param_a;
} VIN_LDC_ALGOPARAM_S;
```
【功能描述】
> 定义 LDC 属性信息

【成员说明】

|      成员       | 含义           |
| :-------------: | :------------- |
| rg_algo_param_b | 参数需要 tuning |
| rg_algo_param_a | 参数需要 tuning |

### VIN_LDC_OFF_SHIFT_S
【结构定义】
```c
typedef struct HB_VIN_LDC_OFF_SHIFT_S {
    uint32_t rg_center_xoff:8;
    uint32_t rg_center_yoff:8;
    uint32_t reserved0:16;
} VIN_LDC_OFF_SHIFT_S;
```
【功能描述】
> 定义 LDC 属性信息

【成员说明】

|      成员      | 含义         |
| :------------: | :----------- |
| rg_center_xoff | 处理区域修正 |
| rg_center_yoff | 处理区域修正 |

### VIN_LDC_WOI_S
【结构定义】
```c
typedef struct HB_VIN_LDC_WOI_S {
    uint32_t rg_start:12;
    uint32_t reserved1:4;
    uint32_t rg_length:12;
    uint32_t reserved0:4;
}VIN_LDC_WOI_S;
```
【功能描述】
> 定义 LDC 属性信息

【成员说明】

|   成员    | 含义         |
| :-------: | :----------- |
| rg_start  | 处理区域修正 |
| rg_length | 处理区域修正 |

### VIN_LDC_ATTR_S
【结构定义】
```c
typedef struct HB_VIN_LDC_ATTR_S {
    uint32_t         ldcEnable;
    VIN_LDC_PATH_SEL_S  ldcPath;
    uint32_t yStartAddr;
    uint32_t cStartAddr;
    VIN_LDC_PICSIZE_S  picSize;
    uint32_t lineBuf;
    VIN_LDC_ALGOPARAM_S xParam;
    VIN_LDC_ALGOPARAM_S yParam;
    VIN_LDC_OFF_SHIFT_S offShift;
    VIN_LDC_WOI_S   xWoi;
    VIN_LDC_WOI_S   yWoi;
} VIN_LDC_ATTR_S;
```
【功能描述】
> 定义 LDC 属性信息

【成员说明】

|    成员    | 含义           |
| :--------: | :------------- |
| ldcEnable  | LDC 是否使能    |
|  ldcPath   | 输出类型       |
| yStartAddr | Iram 使用地址   |
| cStartAddr | Iram 使用地址   |
|  picSize   | 接入的尺寸     |
|  lineBuf   | 值设置 99       |
|   xParam   | 参数需要 tuning |
|   yParam   | 参数需要 tuning |
|  offShift  | 处理区域修正   |
|    xWoi    | 处理区域修正   |
|    yWoi    | 处理区域修正   |

### VIN_DIS_PICSIZE_S
【结构定义】
```c
typedef struct HB_VIN_DIS_PICSIZE_S {
    uint16_t pic_w;
    uint16_t pic_h;
} VIN_DIS_PICSIZE_S;
```
【功能描述】
> 定义 DIS 属性信息

【成员说明】

| 成员  | 含义                                                              |
| :---: | :---------------------------------------------------------------- |
| pic_w | 需要设置比接入尺寸  -1 的 size, 如果 ISP 输出 1920 , 则这里设置 1919 |
| pic_h | 需要设置比接入尺寸  -1 的 size                                     |

### VIN_DIS_PATH_SEL_S
【结构定义】
```c
typedef struct HB_VIN_DIS_PATH_SEL_S {
    uint32_t rg_dis_enable:1;
    uint32_t rg_dis_path_sel:1;
    uint32_t reserved0:30;
} VIN_DIS_PATH_SEL_S;
```
【功能描述】
> 定义 DIS 属性信息

【成员说明】

|      成员       | 含义     |
| :-------------: | :------- |
|  rg_dis_enable  | 输出类型 |
| rg_dis_path_sel | 输出类型 |

### VIN_DIS_CROP_S
【结构定义】
```c
typedef struct HB_VIN_DIS_CROP_S {
    uint16_t rg_dis_start;
    uint16_t rg_dis_end;
} VIN_DIS_CROP_S;
```
【功能描述】
> 定义 DIS 属性信息

【成员说明】

|     成员     | 含义         |
| :----------: | :----------- |
| rg_dis_start | 处理区域修正 |
|  rg_dis_end  | 处理区域修正 |

### VIN_DIS_CALLBACK_S
【结构定义】
```c
typedef struct HB_VIN_DIS_CALLBACK_S {
    void (*VIN_DIS_DATA_CB) (uint32_t pipeId, uint32_t event,
    VIN_DIS_MV_INFO_S *disData, void *userData);
} VIN_DIS_CALLBACK_S;
```
【功能描述】
> 定义 dis 回调接口

【成员说明】

|      成员       | 含义                           |
| :-------------: | :----------------------------- |
| VIN_DIS_DATA_CB | 回调函数，收到数据后返回给用户 |

### VIN_DIS_MV_INFO_S
【结构定义】
```c
typedef struct HB_VIN_DIS_MV_INFO_S {
    int  gmvX;
    int  gmvY;
    int  xUpdate;
    int  yUpdate;
} VIN_DIS_MV_INFO_S;
```

【功能描述】
> 定义坐标移动的信息

【成员说明】

|  成员   | 含义                                                                                                                                                         |
| :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  gmvX   | 绝对坐标,相对于相机中心的 x 移动量, 如果相机锁好固定住，gmv 就是相对于固定锁好位置的移动。                                                                      |
|  gmvY   | 绝对坐标,相对于相机中心的 y 移动量                                                                                                                             |
| xUpdate | 相对量，相对于前一帧的 x 移动量, Update 则是不管锁在那,只看前一帧相机晃动的位置的移动.(如果前一帧是锁好的位置,则 update 与 gmv 相同,但这只会在连续晃动的第一帧发生) |
| yUpdate | 相对量，相对于前一帧的 y 移动量                                                                                                                                |

### VIN_DIS_ATTR_S
【结构定义】
```c
typedef struct HB_VIN_DIS_ATTR_S {
    VIN_DIS_PICSIZE_S picSize;
    VIN_DIS_PATH_SEL_S disPath;
    uint32_t disHratio;
    uint32_t disVratio;
    VIN_DIS_CROP_S xCrop;
    VIN_DIS_CROP_S yCrop;
} VIN_DIS_ATTR_S;
```
【功能描述】
> 定义 DIS 属性信息

【成员说明】

|   成员    | 含义         |
| :-------: | :----------- |
|  picSize  | 输入数据宽高 |
|  disPath  | 输出类型     |
| disHratio | 设置为 65536  |
| disVrati  | 设置为 65536  |
|   xCrop   | 处理区域修正 |
|   yCrop   | 处理区域修正 |

### VIN_LENS_FUNC_TYPE_E
【结构定义】
```c
typedef enum HB_VIN_LENS_FUNC_TYPE_E {
    VIN_LENS_AF_TYPE = 1,
    VIN_LENS_ZOOM_TYPE,
    VIN_LENS_INVALID,
} VIN_LENS_FUNC_TYPE_E;
```
【功能描述】
> 马达功能

【成员说明】
- AF 自动对焦，改变像距
- ZOOM 变焦，改变焦距

### VIN_LENS_CTRL_ATTR_S
【结构定义】
```c
typedef struct HB_VIN_LENS_CTRL_ATTR_S {
    uint16_t port;
    VIN_LENS_MOTOR_TYPE_E motorType;
    uint32_t maxStep;
    uint32_t initPos;
    uint32_t minPos;
    uint32_t maxPos;
    union {
        struct {
            uint16_t pwmNum;
            uint32_t pwmDuty;
            uint32_t pwmPeriod;
        } pwmParam;
        struct {
            uint16_t pulseForwardNum;
            uint16_t pulseBackNum;
            uint32_t pulseDuty;
            uint32_t pulsePeriod;
        } pulseParam;
        struct {
            uint16_t i2cNum;
            uint32_t i2cAddr;
        } i2cParam;
        struct {
            uint16_t gpioA1;
            uint16_t gpioA2;
            uint16_t gpioB1;
            uint16_t gpioB2;
        } gpioParam;
    };
} VIN_LENS_CTRL_ATTR_S;
```
【功能描述】
> 定义 pipe 属性信息

【成员说明】

|      成员       | 含义                                    |
| :-------------: | :-------------------------------------- |
|      port       | 每一路输入，和 pipeId 对应                |
|    motorType    | 电机驱动类型，详见 VIN_LENS_MOTOR_TYPE_E |
|     maxStep     | 电机最大步数                            |
|     initPos     | 电机初始位置                            |
|     minPos      | 电机最小位置                            |
|     maxPos      | 电机最大位置                            |
|     pwmNum      | 马达控制 pwm  设备号                     |
|     pwmDuty     | 马达控制 pwm 占空比                      |
|    pwmPeriod    | 马达控制 pwm 频率                        |
| pulseForwardNum | 马达控制 前向控制 pulse 设备号          |
|  pulseBackNum   | 马达控制 后向控制 pulse 设备号          |
|    pulseDuty    | 马达控制 脉冲占空比                     |
|   pulsePeriod   | 马达控制 脉冲 频率                      |
|     i2cNum      | 马达控制 I2C 设备号                      |
|     i2cAddr     | 马达控制 I2C 地址                        |
|     gpioA1      | 马达控制 a+ gpio 号                      |
|     gpioA2      | 马达控制 a- gpio 号                      |
|     gpioB1      | 马达控制 b+ gpio 号                      |
|     gpioB2      | 马达控制 b- gpio 号                      |

### VIN_LENS_MOTOR_TYPE_E
【结构定义】
```c
typedef enum HB_VIN_LENS_MOTOR_TYPE_E {
    VIN_LENS_PWM_TYPE = 0,
    VIN_LENS_PULSE_TYPE,
    VIN_LENS_I2C_TYPE,
    VIN_LENSSPI_TYPE,
    VIN_LENS_GPIO_TYPE
} VIN_LENS_MOTOR_TYPE_E;
```
【功能描述】
> 电机驱动类型，由以上几种。

【成员说明】
- PWM 驱动、脉冲个数驱动、I2C 通信方式控制、spi 通信方式控制、GPIP 引脚时序控制。
由于硬件环境因素，只调试验证过 GPIO 方式。

### DATA TYPE

| Data | Type Description                               |
| :--: | :--------------------------------------------- |
| 0x28 | RAW6                                           |
| 0x29 | RAW7                                           |
| 0x2A | RAW8                                           |
| 0x2B | RAW10                                          |
| 0x2C | RAW12                                          |
| 0x2D | RAW14                                          |
| 0x2E | Reserved                                       |
| 0x18 | YUV 420 8-bit                                  |
| 0x19 | YUV 420 10-bit                                 |
| 0x1A | Legacy YUV420 8-bit                            |
| 0x1B | Reserved                                       |
| 0x1C | YUV 420 8-bit(Chroma Shifted Pixel Sampling)   |
| 0x1D | YUV 420 10-bit(Chroma Shifted Pixel Sampling)) |
| 0x1E | YUV 422 8-bit                                  |
| 0x1F | YUV 422 10-bit                                 |

### SIF MCLK

| ISP 应用场景          | SIF_MCLK(MHz) |
| :------------------- | :-----------: |
| 8M 30fps 输入         |     326.4     |
| 2M 30fps 2 路分时多工 |    148.36     |
| 2M 30fps 1 路输入     |    102.00     |
| 8M DOL2 30fps        |    544.00     |
| 2M 15fps 4 路分时多工 |    148.36     |

### VPU CLK

| VPU 应用场景 | 编码  | VPU_BCLK/VPU_CCLK(MHz) |
| :---------- | :---: | :--------------------: |
| 8M@30fps    |  AVC  |         326.4          |
|             | HEVC  |          408           |
| 2M*4@30fps  |  AVC  |          544           |
|             | HEVC  |          544           |
| 2M @30fps   |  AVC  |          204           |
|             | HEVC  |          204           |

## 错误码

VIN 错误码如下表：

|   错误码   | 宏定义                           | 描述                         |
| :--------: | :------------------------------- | :--------------------------- |
| -268565505 | HB_ERR_VIN_CREATE_PIPE_FAIL      | 创建 PIPE 失败                 |
| -268565506 | HB_ERR_VIN_SIF_INIT_FAIL         | DEV(Sif)初始化失败           |
| -268565507 | HB_ERR_VIN_DEV_START_FAIL        | DEV(Sif) start 失败           |
| -268565508 | HB_ERR_VIN_PIPE_START_FAIL       | ISP start 失败                |
| -268565509 | HB_ERR_VIN_CHN_UNEXIST           | Chn 不存在                    |
| -268565510 | HB_ERR_VIN_INVALID_PARAM         | 接口参数错误                 |
| -268565511 | HB_ERR_VIN_ISP_INIT_FAIL         | ISP 初始化错误                |
| -268565512 | HB_ERR_VIN_ISP_FRAME_CORRUPTED   | ISP 破帧，isp 驱动应该会有 drop |
| -268565513 | HB_ERR_VIN_CHANNEL_INIT_FAIL     | ISP 初始化两个 chn 通道时失败   |
| -268565514 | HB_ERR_VIN_DWE_INIT_FAIL         | DWE 初始化失败                |
| -268565515 | HB_ERR_VIN_SET_DEV_ATTREX_FAIL   | SIF 扩展属性初始化失败        |
| -268565516 | HB_ERR_VIN_LENS_INIT_FAIL        | 马达初始化失败               |
| -268565517 | HB_ERR_VIN_SEND_PIPERAW_FAIL     | SIF 回灌 raw 失败               |
| -268565518 | HB_ERR_VIN_NULL_POINT            | VIN 模块有空指针              |
| -268565519 | HB_ERR_VIN_GET_CHNFRAME_FAIL     | 获取 ISP 出来的数据失败        |
| -268565520 | HB_ERR_VIN_GET_DEVFRAME_FAIL     | 获取 SIF 出来的数据失败        |
| -268565521 | HB_ERR_VIN_MD_ENABLE_FAIL        | 使能 MotionDetect 失败         |
| -268565522 | HB_ERR_VIN_MD_DISABLE_FAIL       | 关闭 MotionDetect 失败         |
| -268565523 | HB_ERR_VIN_SWITCH_SNS_TABLE_FAIL | ISP 模式 linear\DOL 切换失败    |

## 参考代码
VIN 部分示例代码可以参考，[get_sif_data](./multimedia_samples#get_sif_data)和[get_isp_data](./multimedia_samples#get_isp_data)。