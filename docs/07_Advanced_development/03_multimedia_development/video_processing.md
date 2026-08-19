---
sidebar_position: 6
---

# 7.3.6 视频处理

## 概述
`VPS（Video Process System）`是视频处理系统，支持对图像进行缩小、放大、裁剪、旋转、GDC 矫正、帧率控制以及金字塔图像输出。


## 功能描述
### 基本概念
- Group

  `VPS`对用户提供组的概念，各个`Group`分时复用`IPU`, `GDC`, `PYM`硬件，可以将多个`VPS Group`进行级联使用。

- Channel

  `VPS`的通道，一路通道代表`VPS`的一路输出。输出的通道主要分为普通图像通道和金字塔图像通道，普通通道输出缩放裁剪或旋转后的单层数据，金字塔通道输出多层金字塔缩放数据。
### 功能描述
![Func Description](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_ch5_func_description.png)

`VPS`可以通过调用 [系统控制](./system_control) 提供的绑定接口与其他模块绑定，输入可以与`VIN`、`VDEC`模块绑定，`VPS`输出可以与`VOT`、`VENC`模块绑定，前者为`VPS`的输入源，后者为`VPS`的接收者，也可以与另一个`VPS`绑定实现更多的通道；支持处理用户回灌的图像数据。用户可以通过`VPS`接口对`Group`进行管理，每个`Group`仅可以与一个输入源绑定，每个`Channel`可以与不同的模块绑定。 `VPS`与`VIN`绑定场景下，需要调用`HB_SYS_SetVINVPSMode` 来配置`VIN`与`VPS`之间在线或离线的不同模式。

![Func Description Topology](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_ch5_func_description_topology.png)

`VPS`硬件由一个`IPU`，一个`PYM`，两个`GDC`组成。共有 7 路输出`Channel`（chn0~chn6），chn0~chn4 可以实现`downscale`，chn5 可以实现`upscale`，chn0~chn5 均可实现裁剪（ROI）、旋转、矫正、帧率控制，chn6 为金字塔 online Channel。虚框为硬件复用，其中`OSD`灰色块为 CPU 叠加，其余三个米色块为硬件叠加。
- Upscale 功能：

  尺寸限制请参考下表

  支持水平方向最大 1.5 倍放大，宽度需为 4 的倍数，最小 32x32，最大 4096

  支持垂直方向最大 1.5 倍放大, 高度需为偶数，最小 32x32，最大 4096

  只有 channel5 支持 Upscale 功能

- Downscale 功能：

  尺寸限制参考下表

  水平方向最大缩小为原尺寸的 1/8（大于 1/8）, 最小 32x32，最大 4096

  垂直方向最大缩小为原尺寸的 1/8（大于 1/8）, 最小 32x32，最大 4096

  Channel0~channel4 支持 Downscale 功能

- IPU 各通道的尺寸限制如下：

|Scaler| FIFO(bytes)| Resolution(pixel)|
|:-:|:-:|:-:|
|Scaler 5 (IPU US)| 4096 |8M|
|Scaler 2 (IPU DS2)| 4096 |8M|
|Scaler 1 (IPU DS1)| 2048 |2M|
|Scaler 3 (IPU DS3)| 2048 |2M|
|Scaler 4 (IPU DS4)| 1280 |1M|
|Scaler 0 (IPU DS0)| 1280 |1M|

- Crop 功能：

  `VPS`可以对输入的图形进行裁剪，选择裁剪后的 ROI 区域去做放大或者缩小

- PYM 金字塔处理功能：

  最大输入图像宽度 4096，最大输入图像高度 4096

  最小输入图像宽度 64，最小输入图像高度 64

  最大输出图像宽度 4096，最大输出图像高度 4096

  最小输出图像宽度 48，最小输出图像高度 32

  缩小图像层数 24（0~23）层，其中 0、4、8、12、16、20 层为基础 Base 层，基础层每一层的 size 为上一层的 1/2；其余层为 ROI 层，ROI 层基于 Base 层作缩小（1、2、3 层基于 Base0 层，5、6、7 层基于 Base4 层，以此类推）各层可以单独使能，缩放区域、缩放系数可以配置放大图像层数为 6（24~29）层，放大比例固定，分别为 1.28、1.6、2、2.56、3.2、4 倍。

  `PYM`通道也可以为 0~5，此时为非 online 通道。
  
  每一个 group 下最多使用一个`PYM`。

### 注意事项
- `PYM`硬件要求最少使能 BASE0 层与 BASE4 层；

- `PYM`在 online 输入（chn6）时，PYM ds 所有层（0~23）累计输出数据量不得大于输入数据量的 2.5 倍，us 层（24~29）累计宽之和不得超过输入宽，否则会有未知风险；

- `IPU`绑定了`PYM`后，不能再绑定`VOT`/`VPS`/`VENC`等模块；

- `Rotate`旋转功能：

  `VPS`支持旋转 90 度、180 度、270 度，支持`Group旋转`与`Chnnel旋转`（二选一），`Group旋转`时`VPS`所有输出通道均旋转，`Chnnel旋转`可以将 chn0~chn5 中任意两路旋转，`PYM`处理过的通道不可以旋转。

- `Gdc`矫正功能：

  `VPS`支持输入矫正文件作图形畸变矫正，支持`Group矫正`与`Chnnel矫正`（二选一），`Group矫正`时`VPS`所有输出通道均作矫正，`Chnnel矫正`可以在 chn0~chn5 中任意两路作矫正。

- 帧率控制功能：

  `VPS`的 channel0~5 支持帧率控制，可以输出小于等于输入帧率的任意帧率。

## API 参考
### HB_VPS_CreateGrp
【函数声明】
```c
int HB_VPS_CreateGrp(int VpsGrp, const VPS_GRP_ATTR_S *grpAttr);
```
【功能描述】
> 创建一个 VPS Group

【参数描述】

| 参数名称 | 描述          | 输入/输出 |
| :------: | :------------ | :-------: |
|  VpsGrp  | Group 号       |   输入    |
| grpAttr  | Group 属性指针 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> VPS 最多可以创建 8 个 Group；Group 属性主要包含输入的宽、高和 GDC 的 buf 深度。

【参考代码】
> VPS 参考代码

### HB_VPS_DestroyGrp
【函数声明】
```c
int HB_VPS_DestroyGrp(int VpsGrp);
```
【功能描述】
> 销毁一个 VPS Group

【参数描述】

| 参数名称 | 描述    | 输入/输出 |
| :------: | :------ | :-------: |
|  VpsGrp  | Group 号 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> Group 必须已经创建

【参考代码】
> 无

### HB_VPS_StartGrp
【函数声明】
```c
int HB_VPS_StartGrp(int VpsGrp);
```
【功能描述】
> 启动 VPS Group 处理

【参数描述】

| 参数名称 | 描述    | 输入/输出 |
| :------: | :------ | :-------: |
|  VpsGrp  | Group 号 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> Group 必须已经创建

【参考代码】
> VPS 参考代码

### HB_VPS_StopGrp
【函数声明】
```c
int HB_VPS_StopGrp(int VpsGrp);
```
【功能描述】
> 停止 VPS Group 处理

【参数描述】

| 参数名称 |    描述 | 输入/输出 |
| :------: | ------: | --------: |
|  VpsGrp  | Group 号 |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> Group 必须已经创建并且已经启动

【参考代码】
> VPS 参考代码

### HB_VPS_GetGrpAttr
【函数声明】
```c
int HB_VPS_GetGrpAttr(int VpsGrp, VPS_GRP_ATTR_S *grpAttr);
```
【功能描述】
> 获取 VPS Group 属性

【参数描述】

| 参数名称 | 描述           | 输入/输出 |
| :------: | :------------- | :-------: |
|  VpsGrp  | Group 号        |   输入    |
| grpAttr  | 属性结构体指针 |   输出    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> 无

### HB_VPS_SetGrpAttr
【函数声明】
```c
int HB_VPS_SetGrpAttr(int VpsGrp, const VPS_GRP_ATTR_S *grpAttr);
```
【功能描述】
> 设置 VPS Group 属性

【参数描述】

| 参数名称 | 描述           | 输入/输出 |
| :------: | :------------- | :-------: |
|  VpsGrp  | Group 号        |   输入    |
| grpAttr  | 属性结构体指针 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> VPS 参考代码

### HB_VPS_SetGrpRotate
【函数声明】
```c
int HB_VPS_SetGrpRotate(int VpsGrp, ROTATION_E enRotation);
```
【功能描述】
> 设置 VPS Group 旋转功能，使 VPS 的所有输出都旋转

【参数描述】

|  参数名称  | 描述     | 输入/输出 |
| :--------: | :------- | :-------: |
|   VpsGrp   | Group 号  |   输入    |
| enRotation | 旋转参数 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 该接口需要在 HB_VPS_SetChnAttr 之前调用，GroupRotate 使能之后禁止使能 ChnRotate；isp 绑定 ipu 必须得是 offline 模式

【参考代码】
> VPS 参考代码

### HB_VPS_GetGrpRotate
【函数声明】
```c
int HB_VPS_Get GrpRotate(int VpsGrp, ROTATION_E *enRotation);
```
【功能描述】
> 获取 VPS Group 旋转功能属性

【参数描述】

|  参数名称  | 描述             | 输入/输出 |
| :--------: | :--------------- | :-------: |
|   VpsGrp   | Group 号          |   输入    |
| enRotation | 旋转功能参数指针 |   输出    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> 无

### HB_VPS_SetGrpRotateRepeat
【函数声明】
```c
int HB_VPS_SetGrpRotateRepeat(int VpsGrp, ROTATION_E enRotation);
```
【功能描述】
> 动态组旋转：该接口会保存当前 group 及后面绑定的多个 VPS group 所有通道配置，根据传的 enRotation，自动重新计算旋转后所有通道的尺寸、roi 区域，重新初始化 group，重新绑定 VIN；

【参数描述】

|  参数名称  | 描述     | 输入/输出 |
| :--------: | :------- | :-------: |
|   VpsGrp   | Group 号  |   输入    |
| enRotation | 旋转参数 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 该接口暂时不支持配置过 PYM 的场景

【参考代码】
> 无

### HB_VPS_SetGrpGdc
【函数声明】
```c
int HB_VPS_SetGrpGdc(int VpsGrp, char* buf_addr, uint32_t buf_len, ROTATION_E enRotation)
```
【功能描述】
> 设置 VPS Group GDC 矫正功能，使 VPS 的所有输出都有矫正效果

【参数描述】

|  参数名称  | 描述         | 输入/输出 |
| :--------: | :----------- | :-------: |
|   VpsGrp   | Group 号      |   输入    |
|  buf_addr  | 矫正文件地址 |   输入    |
|  buf_len   | 矫正文件长度 |   输入    |
| enRotation | 旋转参数     |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 该接口需要在 HB_VPS_SetChnAttr 之前调用；根据不同的镜头，不同的畸变，不同的尺寸，需要传入不同矫正 bin 文件。

【参考代码】
> VPS 参考代码

### HB_VPS_SendFrame
【函数声明】
```c
int HB_VPS_SendFrame(int VpsGrp, void* videoFrame, int ms);
```
【功能描述】
> 向 VPS 发送数据

【参数描述】

|  参数名称  | 描述                                                                                                      | 输入/输出 |
| :--------: | :-------------------------------------------------------------------------------------------------------- | :-------: |
|   VpsGrp   | Group 号                                                                                                   |   输入    |
| videoFrame | 图像数据指针；VPS 回灌数据结构为 hb_vio_buffer_t 结构；                                                      |   输入    |
|     ms     | 超时参数 ms 设为-1 时，为阻塞接口；0 时为 非阻塞接口；大于 0 时为超时等待时间，超时时间的 单位为毫秒（ms） |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> VPS 参考代码

### HB_VPS_SetChnAttr
【函数声明】
```c
int HB_VPS_SetChnAttr(int VpsGrp, int VpsChn, const VPS_CHN_ATTR_S *chnAttr);
```
【功能描述】
> 设置 VPS 通道属性（设置 IPU 某个通道的输出尺寸）

【参数描述】

| 参数名称 | 描述         | 输入/输出 |
| :------: | :----------- | :-------: |
|  VpsGrp  | Group 号      |   输入    |
|  VpsChn  | 通道号       |   输入    |
| chnAttr  | 通道属性指针 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 该接口支持动态配置 IPU 的输出尺寸，动态配置需要在 StartGrp 之后调用该接口，动态配置的新尺寸不可以比第一次初始化配置的尺寸大。如果需要启动以后从小尺寸改到大尺寸，那么需要在 StartVps 之前调用两次该接口，第一次传最大 size，第二次传最小 size。

【参考代码】
> VPS 参考代码

### HB_VPS_GetChnAttr
【函数声明】
```c
int HB_VPS_GetChnAttr(int VpsGrp, int VpsChn, VPS_CHN_ATTR_S *chnAttr);
```
【功能描述】
> 获取 VPS 通道属性

【参数描述】

| 参数名称 | 描述         | 输入/输出 |
| :------: | :----------- | :-------: |
|  VpsGrp  | Group 号      |   输入    |
|  VpsChn  | 通道号       |   输入    |
| chnAttr  | 通道属性指针 |   输出    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> 无

### HB_VPS_EnableChn
【函数声明】
```c
int HB_VPS_EnableChn(int VpsGrp, int VpsChn);
```
【功能描述】
> 启用 VPS 通道

【参数描述】

| 参数名称 | 描述    | 输入/输出 |
| :------: | :------ | :-------: |
|  VpsGrp  | Group 号 |   输入    |
|  VpsChn  | 通道号  |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 如果未使能通道，GetChnFrame 接口获取不到图像

【参考代码】
> VPS 参考代码

### HB_VPS_DisableChn
【函数声明】
```c
int HB_VPS_DisableChn(int VpsGrp, int VpsChn);
```
【功能描述】
> 禁用 VPS 通道

【参数描述】

| 参数名称 | 描述    | 输入/输出 |
| :------: | :------ | :-------: |
|  VpsGrp  | Group 号 |   输入    |
|  VpsChn  | 通道号  |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> VPS 参考代码

### HB_VPS_SetChnRotate
【函数声明】
```c
int HB_VPS_SetChnRotate(int VpsGrp, int VpsChn, ROTATION_E enRotation);
```
【功能描述】
> 设置 VPS 通道图像固定角度旋转

【参数描述】

|  参数名称  | 描述     | 输入/输出 |
| :--------: | :------- | :-------: |
|   VpsGrp   | Group 号  |   输入    |
|   VpsChn   | 通道号   |   输入    |
| enRotation | 旋转属性 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> SetChnRotate 属性需要在 SetChnAttr 之后调用，最多同时支持两个 CHN 做旋转；启动以后也支持调用，可以动态控制通道旋转。

【参考代码】
> VPS 参考代码

### HB_VPS_GetChnRotate
【函数声明】
```c
int HB_VPS_GetChnRotate(int VpsGrp, int VpsChn, ROTATION_E *enRotation);
```
【功能描述】
> 获取 VPS 通道图像旋转属性

【参数描述】

|  参数名称  | 描述     | 输入/输出 |
| :--------: | :------- | :-------: |
|   VpsGrp   | Group 号  |   输入    |
|   VpsChn   | 通道号   |   输入    |
| enRotation | 旋转属性 |   输出    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> 无

### HB_VPS_SetChnGdc
【函数声明】
```c
int HB_VPS_SetChnGdc(int VpsGrp, int VpsChn, char* buf_addr, uint32_t buf_len, ROTATION_E enRotation)
```
【功能描述】
> 设置 VPS chn GDC 矫正功能

【参数描述】

|  参数名称  | 描述         | 输入/输出 |
| :--------: | :----------- | :-------: |
|   VpsGrp   | Group 号      |   输入    |
|   VpsChn   | Channel 号    |   输入    |
|  buf_addr  | 矫正文件地址 |   输入    |
|  buf_len   | 矫正文件长度 |   输入    |
| enRotation | 旋转参数     |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 该接口需要在 HB_VPS_SetChnAttr 之后调用，最多同时支持两个 CHN 做矫正；根据不同的镜头，不同的畸变，不同的尺寸，需要传入不同矫正 bin 文件。

【参考代码】
> VPS 参考代码

### HB_VPS_UpdateGdcSize
【函数声明】
```c
int HB_VPS_UpdateGdcSize(int VpsGrp, int VpsChn, uint16_t out_width, uint16_t out_height)
```
【功能描述】
> 设置 VPS GDC 矫正输出尺寸（GDC 输入输出尺寸默认是一致的，可以用该接口改变 GDC 输出的尺寸）

【参数描述】

|  参数名称  | 描述      | 输入/输出 |
| :--------: | :-------- | :-------: |
|   VpsGrp   | Group 号   |   输入    |
|   VpsChn   | Channel 号 |   输入    |
| out_width  | 输出宽度  |   输入    |
| out_height | 输出高度  |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 该接口需要在 HB_VPS_SetChnGdc 和 HB_VPS_SetGrpGdc 之后调用，传入的输出尺寸需要与矫正 bin 文件对应；出入的尺寸不能比当前 GDC 输入的尺寸大

【参考代码】
> Group 作 gdc 矫正时输出尺寸和输入尺寸不一致的场景：
```c
    ret = HB_VPS_SetGrpGdc(grp_id, bin_buf, buf_len, degree);
    ret = HB_VPS_UpdateGdcSize(grp_id, 0, 1280, 720);
```
> channel 作 gdc 矫正时输出尺寸和输入尺寸不一致的场景：
```c
    ret = HB_VPS_SetChnGdc(grp_id, chn_id, bin_buf, buf_len, degree);
    ret = HB_VPS_UpdateGdcSize(grp_id, 0, 1280, 720);
```

### HB_VPS_SetChnCrop
【函数声明】
```c
int HB_VPS_SetChnCrop(int VpsGrp, int VpsChn, const VPS_CROP_INFO_S *cropInfo)
```
【功能描述】
> 设置 VPS Chn 裁剪功能

【参数描述】

| 参数名称 | 描述     | 输入/输出 |
| :------: | :------- | :-------: |
|  VpsGrp  | Group 号  |   输入    |
|  VpsChn  | 通道号   |   输入    |
| cropInfo | 裁剪属性 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 需要在 SetChnAttr 之后调用；传入的 ROI 区域需要在 IPU 输入的 size 范围内；

【参考代码】
> VPS 参考代码

### HB_VPS_GetChnCrop
【函数声明】
```c
int HB_VPS_GetChnCrop(int VpsGrp, int VpsChn, VPS_CROP_INFO_S *cropInfo)
```
【功能描述】
> 获取 VPS Chn 固定角度旋转

【参数描述】

| 参数名称 | 描述     | 输入/输出 |
| :------: | :------- | :-------: |
|  VpsGrp  | Group 号  |   输入    |
|  VpsChn  | 通道号   |   输入    |
| cropInfo | 裁剪属性 |   输出    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> 无

### HB_VPS_SetChnFrameRate
【函数声明】
```c
int HB_VPS_SetChnFrameRate(int VpsGrp, int VpsChn, FRAME_RATE_CTRL_S *frameRate)
```
【功能描述】
> 设置 VPS 通道帧率

【参数描述】

|         参数名称         | 描述    | 输入/输出 |
| :----------------------: | :------ | :-------: |
|          VpsGrp          | Group 号 |   输入    |
|          VpsChn          | 通道号  |   输入    |
| frameRate	帧率属性结构体 | 输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> 无

### HB_VPS_TriggerSnapFrame
【函数声明】
```c
int HB_VPS_TriggerSnapFrame(int VpsGrp, int VpsChn, uint32_t frameCnt)
```
【功能描述】
> 抓拍帧；从当前帧开始标记 frameCnt 帧

【参数描述】

| 参数名称 | 描述         | 输入/输出 |
| :------: | :----------- | :-------: |
|  VpsGrp  | Group 号      |   输入    |
|  VpsChn  | 通道号       |   输入    |
| frameCnt | 抓拍帧的个数 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 启动以后才可以调用

【参考代码】
> 无

### HB_VPS_GetChnFrame
【函数声明】
```c
int HB_VPS_GetChnFrame(int VpsGrp, int VpsChn, void *videoFrame, int ms);
```
【功能描述】
> 从通道获取一帧处理完的图像

【参数描述】

|  参数名称  | 描述                                                                                                                    | 输入/输出 |
| :--------: | :---------------------------------------------------------------------------------------------------------------------- | :-------: |
|   VpsGrp   | Group 号                                                                                                                 |   输入    |
|   VpsChn   | 通道号                                                                                                                  |   输入    |
| videoFrame | 图像信息                                                                                                                |   输出    |
|     ms     | 超时参数 <br/>ms 设为-1 时，为阻塞接口；<br/>0 时为 非阻塞接口；<br/>大于 0 时为超时等待时间，超时时间的单位为毫秒（ms） |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 获取到的图像结构分为正常 BUF 结构（hb_vio_buffer_t）和金字塔 BUF 结构（pym_buffer_t）

【参考代码】
> VPS 参考代码

### HB_VPS_GetChnFrame_Cond
【函数声明】
```c
int HB_VPS_GetChnFrame_Cond(int VpsGrp, int VpsChn, void *videoFrame, int ms, int time);
```
【功能描述】
> 有条件的从通道获取一帧处理完的图像

【参数描述】

|  参数名称  | 描述                                                                                                                    | 输入/输出 |
| :--------: | :---------------------------------------------------------------------------------------------------------------------- | :-------: |
|   VpsGrp   | Group 号                                                                                                                 |   输入    |
|   VpsChn   | 通道号                                                                                                                  |   输入    |
| videoFrame | 图像信息                                                                                                                |   输出    |
|     ms     | 超时参数 <br/>ms 设为-1 时，为阻塞接口；<br/>0 时为 非阻塞接口；<br/>大于 0 时为超时等待时间，超时时间的单位为毫秒（ms） |   输入    |
|    time    | 时间条件：为 0 表示从当前开始丢弃旧帧，等待获取新的一帧，其余值未作支持                                                   |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 获取到的图像结构分为正常 BUF 结构（hb_vio_buffer_t）和金字塔 BUF 结构（pym_buffer_t）

【参考代码】
> VPS 参考代码

### HB_VPS_ReleaseChnFrame
【函数声明】
```c
int HB_VPS_ReleaseChnFrame(int VpsGrp, int VpsChn, void *videoFrame);
```
【功能描述】
> 释放一帧通道图像

【参数描述】

|  参数名称  | 描述     | 输入/输出 |
| :--------: | :------- | :-------: |
|   VpsGrp   | Group 号  |   输入    |
|   VpsChn   | 通道号   |   输入    |
| videoFrame | 图像信息 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> VPS 参考代码

### HB_VPS_SetPymChnAttr
【函数声明】
```c
int HB_VPS_SetPymChnAttr(int VpsGrp, int VpsChn, const VPS_PYM_CHN_ATTR_S *pymChnAttr);
```
【功能描述】
> 设置金字塔通道属性

【参数描述】

|  参数名称  | 描述               | 输入/输出 |
| :--------: | :----------------- | :-------: |
|   VpsGrp   | Group 号            |   输入    |
|   VpsChn   | 通道号             |   输入    |
| pymChnAttr | 金字塔通道属性指针 |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
1) 该接口支持动态配置 PYM roi 层的输出尺寸，需要在 StartGrp 之后调用该接口，动态配置的新 roi size 不可以比第一次初始化配置的 size 大。如果需要启动以后从小尺寸改到大尺寸，那么需要在 StartVps 之前调用两次该接口，第一次传最大 size，第二次传最小 size。
2) 该接口同时支持动态配置 PYM 的输入尺寸，仅在 PYM 回灌时有效，支持 StartGrp 以后 src 尺寸从大改小。

【参考代码】
> VPS 参考代码

### HB_VPS_GetPymChnAttr
【函数声明】
```c
int HB_VPS_GetPymChnAttr(int VpsGrp, int VpsChn, VPS_PYM_CHN_ATTR_S *pymChnAttr);
```
【功能描述】
> 获取金字塔通道属性

【参数描述】

|  参数名称  |               描述 | 输入/输出 |
| :--------: | -----------------: | ---------: |
|   VpsGrp   |            Group 号 |       输入 |
|   VpsChn   |             通道号 |       输入 |
| pymChnAttr | 金字塔通道属性指针 |       输出 |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |

【注意事项】
> 无

【参考代码】
> 无

### HB_VPS_ChangePymUs
【函数声明】
```c
int HB_VPS_ChangePymUs(int VpsGrp, uint8_t us_num, uint8_t enable)
```
【功能描述】
> 使能或关闭 pym 的 us 某一层

【参数描述】

| 参数名称 |       描述 | 输入/输出 |
| :------: | ---------: | ---------: |
|  VpsGrp  |    Group 号 |       输入 |
|  us_num  | 金字塔 us 层 |       输入 |
|  enable  |     是使能 |       输入 |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |

【注意事项】
> 无

【参考代码】
> 无

### HB_VPS_GetChnFd
【函数声明】
```c
int HB_VPS_GetChnFd(int VpsGrp, int VpsChn);
```
【功能描述】
> 获取 VPS 通道对应的设备文件描述符，获得的 fd 可以作 select 监听，select 返回后可以直接通过 getChnFrame 接口获得图像。

【参数描述】

| 参数名称 | 描述    | 输入/输出 |
| :------: | :------ | :-------: |
|  VpsGrp  | Group 号 |   输入    |
|  VpsChn  | 通道号  |   输入    |

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
| 正数值 | 成功 |
|  负值  | 失败 |

【注意事项】
> 无

【参考代码】
> 无

### HB_VPS_CloseChnFd
【函数声明】
```c
int HB_VPS_CloseChnFd(void);
```
【功能描述】
> 关闭 VPS 内所有的通道 fd。

【参数描述】
> 无

【返回值】

| 返回值 | 描述 |
| :----: | ---: |
|   0    | 成功 |
|  非 0   | 失败 |

【注意事项】
> 无

【参考代码】
> 无

### VPS 参考代码
```c
    grp_attr.maxW = 1280;
    grp_attr.maxH = 720;
    ret = HB_VPS_CreateGrp(grp_id, &grp_attr);

    grp_attr.maxW = 1920;
    grp_attr.maxH = 1080;
    ret = HB_VPS_SetGrpAttr(grp_id, &grp_attr);

    ret = HB_VPS_SetGrpRotate(grp_id, ROTATION_90);
    ret = HB_VPS_SetGrpGdc(grp_id, bin_buf, bin_len, ROTATION_90);
    chn_attr.enScale = 1;
    chn_attr.width = 1280;
    chn_attr.height = 720;
    chn_attr.frameDepth = 8;
    ret = HB_VPS_SetChnAttr(grp_id, chn_id, &chn_attr);

    chn_crop_info.en = 1;
    chn_crop_info.cropRect.x = 0;
    chn_crop_info.cropRect.y = 0;
    chn_crop_info.cropRect.width = 1280;
    chn_crop_info.cropRect.height = 720;
    ret = HB_VPS_SetChnCrop(grp_id, chn_id, &chn_crop_info);

    ret = HB_VPS_EnableChn(grp_id, chn_id);

    ret = HB_VPS_SetChnRotate(grp_id, chn_id, ROTATION_90);

    ret = HB_VPS_SetChnGdc(grp_id, chn_id, bin_buf, bin_len, ROTATION_90);

    pym_chn_attr.timeout = 2000;
    pym_chn_attr.ds_layer_en = 24;
    pym_chn_attr.us_layer_en = 0;
    pym_chn_attr.frame_id = 0;
    pym_chn_attr.frameDepth = 8;
    ret = HB_VPS_SetPymChnAttr(grp_id, pym_chn, &pym_chn_attr);

    ret = HB_VPS_StartGrp(grp_id);

    ret = HB_VPS_SendFrame(grp_id, feedback_buf, 1000);
    ret = HB_VPS_GetChnFrame(grp_id, chn_id, &out_buf, 2000);
    ret = HB_VPS_ReleaseChnFrame(grp_id, chn_id, &out_buf);
    ret = HB_VPS_DisableChn(grp_id, chn_id);
    ret = HB_VPS_StopGrp(grp_id);
    ret = HB_VPS_DestroyGrp(grp_id);
```

### VPS 接口调用流程
VPS 初始化接口主要分为 Group 的初始化和 Channel 的初始化，Group 的接口可视为全局配置，Group 属性对整个 VPS 输出均生效，Channel 的接口是用作对多个输出通道分别配置，配置的属性仅对当前 channel 有效；初始化时需要先配置 Group 属性，然后再分别配置每个 channel 属性。

![image-20220329204239415](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/image-20220329204239415.png)

### VPS 场景使用说明
VPS 内部主要由一个 IPU、一个 PYM、两个 GDC 共四个模块组成，根据接口的调用顺序将不同的模块动态绑定在一起，可以单独一个模块运行，也可以多个模块组合运行，不同的链接关系对应的接口调用流程如下：

![VPS IPU](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_ipu.png)

如果仅用 IPU 一个模块，在创建 Group 之后只调用 HB_VPS_SetChnAttr，如果需要 IPU 输出多个通道，那么需要多次调用该接口。

![VPS GDC](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_gdc.png)

如果仅使用 GDC 一个模块，在创建 Group 之后调用 HB_VPS_SetGrpGdc/Rotate 接口。

![VPS PYM](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_pym.png)

如果仅使用 PYM 一个模块，在创建 Group 之后调用 HB_VPS_SetPymChnAttr 接口。

![VPS IPU_PYM](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_ipu_pym.png)

IPU 作为第一个模块，PYM 作为第二个模块，需要创建 Group 之后先调用 HB_VPS_SetChnAttr，然后调用 HB_VPS_SetPymChnAttr。

![VPS GDC_IPU](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_gdc_ipu.png)

GDC 放在 IPU 之前，先调用 HB_VPS_SetGrpGdc/Rotate，再调用 HB_VPS_SetChnAttr。

![VPS GDC_PYM](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_gdc_pym.png)

GDC 放在 PYM 之前，先调用 HB_VPS_SetGrpGdc/Rotate，再调用 HB_VPS_SetPymChnAttr。

![VPS IPU_GDC](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_ipu_gdc.png)

IPU 放在 GDC 之前，先调用 HB_VPS_SetChnAttr，再调用 HB_VPS_SetChnGdc/Rotate。

![VPS IPU_GDC_PYM](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_ipu_gdc_pym.png)

先 IPU 然后 GDC 再 PYM 的话，需要先调用 HB_VPS_SetChnAttr，再调用 HB_VPS_SetChnGdc/Rotate，最后调用 HB_VPS_SetPymChnAttr。

![VPS IPU_GDC+PYM](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_ipu_gdc%2Bpym.png)

如果需要 IPU 输出的多个通道分别接 GDC 和 PYM，那么需要先调用 HB_VPS_SetChnAttr(chnA)、HB_VPS_SetChnAttr(chnB)，然后 HB_VPS_SetChnGdc/Rotate(chnA)，然后 HB_VPS_SetPymChnAttr(chnB)。

![VPS IPU_GDC_PYM+GDC](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_ipu%2Bgdc%2Bpym%2Bgdc.png)

HB_VPS_SetChnAttr(chnA)、HB_VPS_SetChnAttr(chnB)，然后 HB_VPS_SetChnGdc/Rotate(chnA)，然后 HB_VPS_SetChnGdc/Rotate(chnB)，最后 HB_VPS_SetPymChnAttr(chnB)。

![VPS IPU+GDC+PYM+GDC](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_ipu%2Bgdc%2Bpym%2Bgdc.png)

HB_VPS_SetChnAttr(chnA)、HB_VPS_SetChnAttr(chnB)、HB_VPS_SetChnAttr(chnC)，然后 HB_VPS_SetChnGdc/Rotate(chnA) ， HB_VPS_SetPymChnAttr(chnB)，HB_VPS_SetChnGdc/Rotate(chnC)。

![VPS IPU_GDC_PYM_GDC](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/07_Advanced_development/03_multimedia_development/video_processing/ss_vps_ipu%2Bgdc%2Bpym%2Bgdc.png)

如果需要 VPS 中四个模块串一起跑，需要 HB_VPS_SetGrpGdc、HB_VPS_SetChnAttr(chnA)，HB_VPS_SetChnRotate(chnA)、HB_VPS_SetPymChnAttr(chnA)。

## 数据结构
### HB_VPS_GRP_ATTR_S
【结构定义】
```c
typedef struct HB_VPS_GRP_ATTR_S {
	uint32_t		maxW;
	uint32_t		maxH;
    uint8_t 	frameDepth;
	int				pixelFormat;
} VPS_GRP_ATTR_S;
```
【功能描述】
> VPS 组的属性结构体

【成员说明】

|    成员     |                             含义                             |
| :---------: | :----------------------------------------------------------: |
|    maxW     |                     VPS 输入图像最大宽度                      |
|    maxH     |                     VPS 输入图像最大高度                      |
| frameDepth  | Gdc 申请的 buf 个数，如果是 vps 绑定了 vot，需要注意 frameDepth 不能大于 6，iar 输入的 buffer 个数实际是 8，gdc 的话是 framedepth+2，iar 里面会判断 gdc 送过来 index（下标从 0 开始算）不能大于等于 8 |
| pixelFormat |       像素格式（VPS 只支持 nv12 一种格式，当前参数预留）        |

### HB_RECT_S
【结构定义】
```c
typedef struct HB_RECT_S {
    uint16_t    x;
    uint16_t    y;
    uint16_t    width;
    uint16_t    height;
} RECT_S;
```
【功能描述】
> 定义矩形区域

【成员说明】

|  成员  |   含义    |
| :----: | :-------: |
|   x    | 起始 x 坐标 |
|   y    | 起始 y 坐标 |
| width  |  图像宽   |
| height |  图像高   |

### HB_VPS_CROP_INFO_S
【结构定义】
```c
typedef HB_VPS_CROP_INFO_S {
    bool        en;
    RECT_S      cropRect;
} VPS_CROP_INFO_S;
```
【功能描述】
> 裁剪信息结构体

【成员说明】

|   成员   |     含义     |
| :------: | :----------: |
|    en    | 裁剪是否使能 |
| cropRect |  裁剪的区域  |

### HB_FRAME_RATE_CTRL_S
【结构定义】
```c
typedef HB_FRAME_RATE_CTRL_S {
    uint32		srcFrameRate;
    uin32		dstFrameRate;
} FRAME_RATE_CTRL_S;
```
【功能描述】
> 帧率控制信息结构体，dstFrameRate 不得大于 srcFrameRate

【成员说明】

|     成员     |     含义     |
| :----------: | :----------: |
| srcFrameRate | 输入视频帧率 |
| dstFrameRate | 目标视频帧率 |

### HB_VPS_CHN_ATTR_S
【结构定义】
```c
typedef struct HB_VPS_CHN_ATTR_S {
    uint32_t		width;
	uint32_t		height;
	int			pixelFormat;
	uint8_t		enMirror;
	uint8_t		enFlip;
	uint8_t		enScale;
	uint32_t		frameDepth;
	FRAME_RATE_CTRL_S	frameRate;
} VPS_CHN_ATTR_S;
```
【功能描述】
> 通道输出属性结构体

【成员说明】

|    成员     |                             含义                             |
| :---------: | :----------------------------------------------------------: |
|    width    |                          图像输出宽                          |
|   height    |                          图像输出高                          |
| pixelFormat |           像素格式（VPS 目前输出只有 nv12 一种格式）            |
|  enMirror   | 镜像使能,VPS 不支持此功能，可以使用 isp 接口的 HB_VIN_CtrlPipeMirror 去水平镜像 |
|   enFlip    |     翻转使能，VPS 不支持此功能，需要使用 sensor 的上下翻转      |
|   enScale   |                           缩放使能                           |
| frameDepth  |                         图像队列长度                         |
|  frameRate  | 帧率控制（此帧率不生效，可以使用 HB_VPS_SetChnFrameRate 接口实现帧率控制） |

### HB_ROTATION_E
【结构定义】
```c
typedef enum HB_ROTATION_E {
    ROTATION_0      = 0,
    ROTATION_90     = 1,
    ROTATION_180    = 2,
    ROTATION_270    = 3,
    ROTATION_MAX
} ROTATION_E;
```
【功能描述】
> 旋转枚举

【成员说明】

|     成员     |     含义     |
| :----------: | :----------: |
|  ROTATION_0  |    不旋转    |
| ROTATION_90  |   旋转 90 度   |
| ROTATION_180 |  旋转 180 度   |
| ROTATION_270 |  旋转 270 度   |
| ROTATION_MAX | 枚举的最大值 |

### DYNAMIC_SRC_INFO_S
【结构定义】
```c
typedef struct HB_VPS_DYNAMIC_SRC_INFO_S {
	uint8_t 	src_change_en;
	uint16_t 	new_width;
	uint16_t 	new_height;
} DYNAMIC_SRC_INFO_S;
```

【功能描述】
> 金字塔动态改变输入 size 配置结构体

【成员说明】

|     成员      |       含义       |
| :-----------: | :--------------: |
| src_change_en | 使能输入 size 改变 |
|   new_width   |        宽        |
|  new_height   |        高        |

### HB_PYM_SCALE_INFO_S
【结构定义】
```c
typedef struct HB_PYM_SCALE_INFO_S {
	uint8_t		factor;
	uint16_t		roi_x;
	uint16_t		roi_y;
	uint16_t		roi_width;
	uint16_t		roi_height;
} PYM_SCALE_INFO_S;

```
【功能描述】
> 金字塔裁剪缩放属性结构体

【成员说明】

|    成员    |                             含义                             |
| :--------: | :----------------------------------------------------------: |
|   factor   | 缩放参数（1~63），对于缩小得层，缩放公式是 factor/(factor+64),对于放大得层对应是 64/factor，因为放大层是固定的倍数，也即对应放大层 24 的 factor 固定是 50，25 层的 factor 固定是 40，26 层 factor 固定是 32，27 层 factor 固定是 25，28 层 factor 固定是 20，29 层 factor 固定是 16 |
|   roi_x    |                          起始 x 坐标                           |
|   roi_y    |                          起始 y 坐标                           |
| roi_width  |                            图像宽                            |
| roi_height |                            图像高                            |

### HB_VPS_PYM_CHN_ATTR_S
【结构定义】
```c
typedef struct HB_VPS_PYM_CHN_ATTR_S {
	uint32_t		frame_id;
	uint32_t		ds_uv_bypass;
	uint16_t		ds_layer_en;
	uint8_t		us_layer_en;
	uint8_t		us_uv_bypass;
	int			timeout;
	uint32_t		frameDepth;
    DYNAMIC_SRC_INFO_S	dynamic_src_info;
#define			MAX_PYM_DS_NUM			24
#define			MAX_PYM_US_NUM			6
	PYM_SCALE_INFO_S ds_info[MAX_PYM_DS_NUM];
	PYM_SCALE_INFO_S us_info[MAX_PYM_US_NUM];
} VPS_PYM_CHN_ATTR_S;
```
【功能描述】
> 辅助通道属性结构体

【成员说明】

|     成员     |         含义         |
| :----------: | :------------------: |
|   frame_id   |       帧 ID 使能       |
| ds_uv_bypass |   DS 层 uv 分量 bypass   |
| ds_layer_en  | DS 层使能层数（4~23） |
| us_layer_en  | US 层使能层数（0~6）  |
| us_uv_bypass |   US 层 uv 分量 bypass   |
|   timeout    |       超时时间       |
|  frameDepth  |     图像队列长度     |
|   ds_info    |      DS 缩放信息      |
|   us_info    |      US 缩放信息      |

### HB_DIS_MV_INFO_S
【结构定义】
```c
typedef struct HB_DIS_MV_INFO_S {
    int    gmvX;
    int    gmvY;
    int    xUpdate;
    int    yUpdate;
} DIS_MV_INFO_S;
```
【功能描述】
> 偏移信息结构体

【成员说明】

|  成员   |     含义     |
| :-----: | :----------: |
|  gmvX   | 横坐标偏移值 |
|  gmvY   | 纵坐标偏移值 |
| xUpdate |   X 更新值    |
| yUpdate |   Y 更新值    |

## 错误码

|    错误码    |                       宏定义 |                   描述 |
| :----------: |: --------------------------- | :--------------------- |
| -268,696,577 |   HB_ERR_VPS_INVALID_GROUPID |               非法组号 |
| -268,696,578 |            HB_ERR_VPS_BUFMGR |             帧队列错误 |
| -268,696,579 |        HB_ERR_VPS_GROUP_FAIL |                 组失败 |
| -268,696,580 |     HB_ERR_VPS_GROUP_UNEXIST |               组不存在 |
| -268,696,581 |       HB_ERR_VPS_CHN_UNEXIST |             通道不存在 |
| -268,696,582 |            HB_ERR_VPS_ROTATE |               旋转失败 |
| -268,696,583 |         HB_ERR_VPS_NULL_PARA |           参数 NULL 指针 |
| -268,696,584 |           HB_ERR_VPS_BAD_ARG |               非法参数 |
| -268,696,585 |       HB_ERR_VPS_UN_PREPARED |               未准备好 |
| -268,696,586 |         HB_ERR_VPS_SENDFRAME |           回灌图像失败 |
| -268,696,587 |       HB_ERR_VPS_CHN_DISABLE |             通道未使能 |
| -268,696,588 |           HB_ERR_VPS_TIMEOUT |                   超时 |
| -268,696,589 |            HB_ERR_VPS_CHN_FD | 获取通道文件描述符失败 |
| -268,696,590 |   HB_ERR_VPS_SET_AFTER_START |     不允许启动以后配置 |
| -268,696,591 |  HB_ERR_VPS_SET_BEFORE_START |       不允许启动前配置 |
| -268,696,592 | HB_ERR_VPS_SET_AT_WRONG_TIME |       在不允许时刻配置 |
| -268,696,593 |   HB_ERR_VPS_UN_SUPPORT_SIZE |           不支持的尺寸 |
| -268,696,594 |     HB_ERR_VPS_FRAME_UNEXIST |         不存在的帧图像 |
| -268,696,595 |    HB_ERR_VPS_DEV_FRAME_DROP |               硬件丢帧 |
| -268,696,596 |        HB_ERR_VPS_NOT_ENOUGH |             缓冲帧不够 |
| -268,696,597 |   HB_ERR_VPS_UN_SUPPORT_RATE |           不支持的帧率 |
| -268,696,598 |        HB_ERR_VPS_FRAME_RATE |               帧率错误 |

## 参考代码
VPS 部分示例代码可以参考，[sample_vps](./multimedia_samples#sample_vps)和[sample_vps_zoom](./multimedia_samples#sample_vps_zoom)。
