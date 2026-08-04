---
sidebar_position: 10
---

# 7.3.10 视频解码
## 概述
视频解码模块支持 H.264/H.265/JPEG/MJPEG 硬件解码。该模块支持多通道实时编码，各通道相互独立，常见的使用场景，包括智能盒子、课堂录播等。

## 功能描述

### 基础规格

X3 支持的解码规格如下：

| 硬件解码模块 | 最大通道数 | 支持协议                                             | 分辨率支持                                                   | 最大性能                                                     |
| :----------- | :--------- | :--------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| VPU<br/>JPU  | 32         | **VPU:**<br/>H.264/H.265<br/>**JPU:**<br/>JPEG/MJPEG | **VPU:**<br/>- H264:<br />max 8192×8192<br/>min：32×32<br/>- H265:<br />max 8192×8192<br/>Min: 8×8<br/>**JPU:**<br/>- JPEG/MJPEG:<br />max 32768×32768<br />min:16×16 | **H264/H265:**<br/>3840×2160 @60fps<br/>**JPEG/MJPEG:** <br/>YUV4:2:0 290M pixel/sec<br/> |

### 码流发送方式

X3 视频解码器支持按帧发送(VIDEO_MODE_FRAME)码流方式：

用户每次发送完整一帧码流到解码器。解码器就认为该帧码流已经结束，开始解码图像，因此需保证每次调用发送接口发送的码流必须为一帧，否则会出现解码错误。

码流发送方式 enMode 在 VDEC_CHN_ATTR_S 解码通道属性结构体中定义，用户可以通过调用 HB_VDEC_SetChnAttr()配置解码通道属性函数来完成。

### 图像输出方式

根据 H.264/H.265 协议，解码图像可能不会在解码后立即输出。X3 视频解码器可以通过设置不同的图像输出方式达到尽快输出的目的。图像输出方式包括以下两种：

- 解码序：解码图像按照解码的先后顺序输出。
- 显示序：解码图像按照 H.264/H.265 协议输出。

根据 H.264/H.265 协议，视频的解码顺序未必是视频的输出顺序(即显示序)。例如 B 帧解码时需要前后的 P 帧作为参数，所以 B 帧后的 P 帧先于 B 帧解码，但 B 帧先于 P 帧输出。按解码序输出是保证快速输出的一个必要条件，用户选择按解码序输出，需保证码流的解码序和显示序相同。

- 按帧发送码流与按解码序输出相结合能达到快速解码和快速输出的目的，用户必须保证每次发送的是完整的一帧码流以及码流的解码序和显示序相同。

- 按帧发送码流与按显示序输出想结合，注意需要在最后一帧设置码流结束时必配置帧结束标志 stream_end 为 HB_TRUE，否则认为当前帧码流还未结束，会出现解码异常。

图像输出方式 enOutPutOrder 在 VDEC_CHN_ATTR_S 解码通道属性结构体中定义，用户可以通过调用 HB_VDEC_SetChnAttr()配置解码通道属性函数来完成。

### 时间戳(PTS)处理
VDEC 模块在选择帧发送(VIDEO_MODE_FRAME)模型下发送码流时，解码输出的图像时间戳 PTS 为发送码流接口(HB_VDEC_SendStream)中用户送入的 PTS，解码器不会更改此值。

### 码流 Buffer 配置模式
解码码流 buffer 配置支持外部模式和内部模式。

- 外部模式：用户通过调用 HB_VP_Init()函数进行对 Video Pool 池初始化，然后可以选择公共 pool 或者通过 HB_SYS_Alloc()函数创建私有的 pool 池的 mmz 内存，用于存放需要解码的码流。用户创建的 ion 内存的 buffer 数量建议和解码通道中设置的流 buffer 数量 u32StreamBufCnt 一致，每一次解码需要把分配的 ion 内存的虚拟地址首地址赋值给 VIDEO_STREAM_S 结构体中的 vir_ptr 字段，需要解码的流大小赋值给 VIDEO_STREAM_S 结构体中的 size 字段。解码器内部实际是通过 buffer 轮转的方式去解码的，即依次取 buffer 号中的流数。如果图像输出方式设置为显示序，需要把一个 GOP 内部的所有帧都读取完才开始解码。

  通过设置解码器通道属性 VDEC_CHN_ATTR_S 结构体中的 bExternalBitStreamBuff 字段为 HB_TRUE 来使用外部 buffer 模式。

- 内部模式：用户通过其他工具，例如 FFMPEG 来进行对码流的切分(一般以帧模式来读取)，此时用户不需要申请 VB 缓存，只需要把码流切分之后的 buffer 地址传递给 VIDEO_STREAM_S 结构体中的 vir_ptr 字段，内部会自动做拷贝到编码器申请的流 buffer 地址空间中，节约了 VB 的使用。

  通过设置解码器通道属性 VDEC_CHN_ATTR_S 结构体中的 bExternalBitStreamBuff 字段为 HB_FALSE 来使用外部 buffer 模式

### Skip 高级跳帧解码
用户可以通过设置解码器通道属性 VDEC_CHN_ATTR_S 结构体中的 enDecMode 来控制解码时是否使用跳帧(默认不开启，即所有帧都解码)。可以选择只解码 IRAP 帧或者只解码参数参数帧，具体可以参考帧 skip 设置。

### 带宽优化模式解码
用户可以通过设置解码器通道属性 VDEC_CHN_ATTR_S 结构体中的 bandwidth_Opt 来控制解码时是否使用带宽优化(默认是开启)。
该模式支持 VPU 忽略将压缩格式的非参考帧或者线性格式的非显示帧写入 frame buffer 中，以此来节省带宽。

### 解码器绑定
解码器绑定后，不可再调用 HB_VDEC_GetFrame。

### 注意事项

- H.264/H.265 解码得时候第一个帧，要给齐 sps，pps，idr，如果只给 sps 就会报错,报错信息是 FAILED TO DEC_PIC_HDR: ret(1), SEQERR(00005000)

## API 参考
```C
HB_VDEC_CreateChn：创建视频解码通道。
HB_VDEC_DestroyChn：销毁视频解码通道。
HB_VDEC_StartRecvStream：解码器开始接收用户发送的码流。
HB_VDEC_StopRecvStream：解码器停止接收用户发送的码流。
HB_VDEC_ResetChn：复位解码通道。
HB_VDEC_SendStream：向视频解码通道发送码流数据。
HB_VDEC_GetFrame：获取视频解码通道的解码图像。
HB_VDEC_ReleaseFrame：释放视频解码通道的解码图像。
HB_VDEC_GetFd：获取视频解码通道的设备文件句柄。
HB_VDEC_CloseFd：关闭视频解码通道的设备文件句柄。
HB_VDEC_SetChnAttr：设置解码通道参数。
HB_VDEC_GetChnAttr：获取解码通道参数。
HB_VDEC_QueryStatus：查询解码状态。
HB_VDEC_GetUserData：获取用户数据。
HB_VDEC_ReleaseUserData：释放用户数据。
```

### HB_VDEC_CreateChn
【函数声明】
```C
int32_t HB_VDEC_CreateChn(VDEC_CHN VdChn, const VDEC_CHN_ATTR_S *pstAttr)
```
【功能描述】
> 创建视频解码通道。

【参数描述】

| 参数名称 |                        描述                        | 输入/输出 |
| :------: | :------------------------------------------------: | :-------: |
|  VdChn   | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |
| pstAttr  |                 解码通道属性指针。                 |   输入    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】
> HB_VDEC_ResetChn 参考代码

### HB_VDEC_DestroyChn
【函数声明】
```C
int32_t HB_VDEC_DestroyChn(VDEC_CHN VdChn);
```
【功能描述】
> 销毁视频解码通道。

【参数描述】

| 参数名称 |                        描述                        | 输入/输出 |
| :------: | :------------------------------------------------: | :-------: |
|  VdChn   | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】
> HB_VDEC_ResetChn 参考代码

### HB_VDEC_StartRecvStream
【函数声明】
```C
int32_t HB_VDEC_StartRecvStream(VDEC_CHN VdChn);
```
【功能描述】
> 解码器开始接收用户发送的码流.。

【参数描述】

| 参数名称 |                        描述                        | 输入/输出 |
| :------: | :------------------------------------------------: | :-------: |
|  VdChn   | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】
> HB_VDEC_ResetChn 参考代码

### HB_VDEC_StopRecvStream
【函数声明】
```C
int32_t HB_VDEC_StopRecvStream(VDEC_CHN VdChn);
```
【功能描述】
> 解码器停止接收用户发送的码流。

【参数描述】

| 参数名称 |                        描述                        | 输入/输出 |
| :------: | :------------------------------------------------: | :-------: |
|  VdChn   | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】
> HB_VDEC_ResetChn 参考代码

### HB_VDEC_ResetChn
【函数声明】
```C
int32_t HB_VDEC_ResetChn(VDEC_CHN VdChn);
```
【功能描述】
> 复位视频解码通道。

【参数描述】

| 参数名称 |                        描述                        | 输入/输出 |
| :------: | :------------------------------------------------: | :-------: |
|  VdChn   | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】
```C
    VDEC_CHN VDEC_Chn = 0;
    int32_t s32Ret = 0;
    int32_t Width = 1920;
    int32_t Height = 1080;
    VDEC_CHN_ATTR_S m_VdecChnAttr ;
    memset(&m_VdecChnAttr , 0, sizeof(VDEC_CHN_ATTR_S));
    m_VdecChnAttr.enType = PT_H264;
    m_VdecChnAttr.enMode = VIDEO_MODE_FRAME;
    m_VdecChnAttr.enPixelFormat = HB_PIXEL_FORMAT_NV12;
    m_VdecChnAttr.u32FrameBufCnt = 10;
    m_VdecChnAttr.u32StreamBufCnt = 10;
    m_VdecChnAttr.u32StreamBufSize = Width * Height * 1.5;
    m_VdecChnAttr.bExternalBitStreamBuf  = HB_TRUE;

    if (m_VdecChnAttr.enType == PT_H265) {
        m_VdecChnAttr.stAttrH265.bandwidth_Opt = HB_TRUE;
        m_VdecChnAttr.stAttrH265.enDecMode = VIDEO_DEC_MODE_NORMAL;
        m_VdecChnAttr.stAttrH265.enOutputOrder = VIDEO_OUTPUT_ORDER_DISP;
        m_VdecChnAttr.stAttrH265.cra_as_bla = HB_FALSE;
        m_VdecChnAttr.stAttrH265.dec_temporal_id_mode = 0;
        m_VdecChnAttr.stAttrH265.target_dec_temporal_id_plus1 = 2;
    }
    if (m_VdecChnAttr.enType == PT_H264) {
        m_VdecChnAttr.stAttrH264.bandwidth_Opt = HB_TRUE;
        m_VdecChnAttr.stAttrH264.enDecMode = VIDEO_DEC_MODE_NORMAL;
        m_VdecChnAttr.stAttrH264.enOutputOrder = VIDEO_OUTPUT_ORDER_DISP;
    }

    s32Ret = HB_VDEC_CreateChn(VDEC_Chn, &m_VdecChnAttr);
    HB_VDEC_SetChnAttr(VDEC_Chn, &m_VdecChnAttr);
    HB_VDEC_StartRecvStream(VDEC_Chn);
    HB_VDEC_StopRecvStream(VDEC_Chn);
    HB_VDEC_ResetChn(VDEC_Chn);
    HB_VDEC_DestroyChn(VDEC_Chn);
```

### HB_VDEC_SendStream
【函数声明】
```C
int32_t HB_VDEC_SendStream(VDEC_CHN VdChn, const VIDEO_STREAM_S *pstStream, int32_t s32MilliSec);
```
【功能描述】
> 向视频解码通道发送码流数据

【参数描述】

|  参数名称   |                                                描述                                                | 输入/输出 |
| :---------: | :------------------------------------------------------------------------------------------------: | :-------: |
|    VdChn    |                         编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。                         |   输入    |
|  pstStream  |                                         解码码流数据指针。                                         |   输入    |
| s32MilliSec | 送码流超时时间。<br/>取值范围：[-1, + ∞ )<br/> -1：阻塞。<br/> 0：非阻塞。<br/> 大于 0：超时时间。 |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】

【参考代码】

### HB_VDEC_GetFrame
【函数声明】
```C
int32_t HB_VDEC_GetFrame(VDEC_CHN VdChn, VIDEO_FRAME_S *pstFrameInfo,int32_t s32MilliSec);
```
【功能描述】
> 获取视频解码通道的解码图像。

【参数描述】

|   参数名称   |                                                 描述                                                 | 输入/输出 |
| :----------: | :--------------------------------------------------------------------------------------------------: | :-------: |
|    VdChn     |                          编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。                          |   输入    |
| pstFrameInfo |                                         获取的解码图像信息。                                         |   输入    |
| s32MilliSec  | 获取图像超时时间。<br/>取值范围：[-1, + ∞ )<br/> -1：阻塞。<br/> 0：非阻塞。<br/> 大于 0：超时时间。 |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】

【参考代码】

### HB_VDEC_ReleaseFrame
【函数声明】
```C
int32_t HB_VDEC_ReleaseFrame(VDEC_CHN VdChn, const VIDEO_FRAME_S *pstFrameInfo);
```
【功能描述】
> 释放视频解码通道的图像。

【参数描述】

| 参数名称 |                        描述                        | 输入/输出 |
| :------: | :------------------------------------------------: | :-------: |
|  VdChn   | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |
pstFrameInfo	解码后的图像信息指针。	输入

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】

【参考代码】

### HB_VDEC_GetFd
【函数声明】
```C
int32_t HB_VDEC_GetFd(VDEC_CHN VdChn, int32_t *fd);
```
【功能描述】
> 获取解码通道对应的设备文件句柄。

【参数描述】

| 参数名称 |                        描述                        | 输入/输出 |
| :------: | :------------------------------------------------: | :-------: |
|  VdChn   | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |
|    fd    |               返回编码通道文件句柄。               |   输出    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】
```C
    VDEC_CHN VDEC_Chn = 0;
    int32_t fd = 0;
    int32_t s32Ret = 0;
    int32_t Width = 1920;
    int32_t Height = 1080;
    VDEC_CHN_ATTR_S m_VdecChnAttr ;
    memset(&m_VdecChnAttr , 0, sizeof(VDEC_CHN_ATTR_S));
    m_VdecChnAttr.enType = PT_H264;
    m_VdecChnAttr.enMode = VIDEO_MODE_FRAME;
    m_VdecChnAttr.enPixelFormat = HB_PIXEL_FORMAT_NV12;
    m_VdecChnAttr.u32FrameBufCnt = 10;
    m_VdecChnAttr.u32StreamBufCnt = 10;
    m_VdecChnAttr.u32StreamBufSize = Width * Height * 1.5;
    m_VdecChnAttr.bExternalBitStreamBuf  = HB_TRUE;
    if (m_VdecChnAttr.enType == PT_H265) {
        m_VdecChnAttr.stAttrH265.bandwidth_Opt = HB_TRUE;
        m_VdecChnAttr.stAttrH265.enDecMode = VIDEO_DEC_MODE_NORMAL;
        m_VdecChnAttr.stAttrH265.enOutputOrder = VIDEO_OUTPUT_ORDER_DISP;
        m_VdecChnAttr.stAttrH265.cra_as_bla = HB_FALSE;
        m_VdecChnAttr.stAttrH265.dec_temporal_id_mode = 0;
        m_VdecChnAttr.stAttrH265.target_dec_temporal_id_plus1 = 2;
    }
    if (m_VdecChnAttr.enType == PT_H264) {
        m_VdecChnAttr.stAttrH264.bandwidth_Opt = HB_TRUE;
        m_VdecChnAttr.stAttrH264.enDecMode = VIDEO_DEC_MODE_NORMAL;
        m_VdecChnAttr.stAttrH264.enOutputOrder = VIDEO_OUTPUT_ORDER_DISP;
    }

    s32Ret = HB_VDEC_CreateChn(VDEC_Chn, &m_VdecChnAttr);
    HB_VDEC_SetChnAttr(VDEC_Chn, &m_VdecChnAttr);
    HB_VDEC_GetFd(VDEC_Chn, &fd);
    HB_VDEC_CloseFd(VDEC_Chn, fd);
    s32Ret = HB_VDEC_DestroyChn(VDEC_Chn);
```

### HB_VDEC_CloseFd
【函数声明】
```C
int32_t HB_VDEC_CloseFd(VDEC_CHN VdChn, int32_t fd);
```
【功能描述】
> 关闭解码通道对应的设备文件句柄。

【参数描述】

| 参数名称 |                        描述                        | 输入/输出 |
| :------: | :------------------------------------------------: | :-------: |
|  VdChn   | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |
|    fd    |               设置编码通道文件句柄。               |   输入    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】
> HB_VDEC_GetFd 参考代码

### HB_VDEC_GetChnAttr
【函数声明】
```C
int32_t HB_VDEC_GetChnAttr(VDEC_CHN VdChn, VDEC_CHN_ATTR_S *pstAttr);
```
【功能描述】
> 获取视频解码通道参数。

【参数描述】

| 参数名称 |                        描述                        | 输入/输出 |
| :------: | :------------------------------------------------: | :-------: |
|  VdChn   | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |
| pstAttr  |               解码后的通道属性指针。               |   输出    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】
```C
    VDEC_CHN VDEC_Chn = 0;
    int32_t s32Ret = 0;
    int32_t Width = 1920;
    int32_t Height = 1080;

    VDEC_CHN_ATTR_S m_VdecChnAttr ;
    memset(&m_VdecChnAttr , 0, sizeof(VDEC_CHN_ATTR_S));
    m_VdecChnAttr.enType = PT_H264;
    m_VdecChnAttr.enMode = VIDEO_MODE_FRAME;
    m_VdecChnAttr.enPixelFormat = HB_PIXEL_FORMAT_NV12;
    m_VdecChnAttr.u32FrameBufCnt = 10;
    m_VdecChnAttr.u32StreamBufCnt = 10;
    m_VdecChnAttr.u32StreamBufSize = Width * Height * 1.5;
    m_VdecChnAttr.bExternalBitStreamBuf  = HB_TRUE;

    if (m_VdecChnAttr.enType == PT_H265) {
        m_VdecChnAttr.stAttrH265.bandwidth_Opt = HB_TRUE;
        m_VdecChnAttr.stAttrH265.enDecMode = VIDEO_DEC_MODE_NORMAL;
        m_VdecChnAttr.stAttrH265.enOutputOrder = VIDEO_OUTPUT_ORDER_DISP;
        m_VdecChnAttr.stAttrH265.cra_as_bla = HB_FALSE;
        m_VdecChnAttr.stAttrH265.dec_temporal_id_mode = 0;
        m_VdecChnAttr.stAttrH265.target_dec_temporal_id_plus1 = 2;
    }
    if (m_VdecChnAttr.enType == PT_H264) {
        m_VdecChnAttr.stAttrH264.bandwidth_Opt = HB_TRUE;
        m_VdecChnAttr.stAttrH264.enDecMode = VIDEO_DEC_MODE_NORMAL;
        m_VdecChnAttr.stAttrH264.enOutputOrder = VIDEO_OUTPUT_ORDER_DISP;
    }

    s32Ret = HB_VDEC_CreateChn(VDEC_Chn, &m_VdecChnAttr);
    HB_VDEC_SetChnAttr(VDEC_Chn, &m_VdecChnAttr);
    HB_VDEC_GetChnAttr(VDEC_Chn, &VdecChnAttr);
    s32Ret = HB_VDEC_DestroyChn(VDEC_Chn);
```

### HB_VDEC_SetChnAttr
【函数声明】
```C
int32_t HB_VDEC_SetChnAttr(VDEC_CHN VdChn, const VDEC_CHN_ATTR_S *pstAttr);
```
【功能描述】
> 设置视频解码通道参数。

【参数描述】

| 参数名称 |                        描述                        | 输入/输出 |
| :------: | :------------------------------------------------: | :-------: |
|  VdChn   | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |
| pstAttr  |               解码后的通道属性指针。               |   输入    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】
> HB_VDEC_GetChnAttr 参考代码

### HB_VDEC_QueryStatus
【函数声明】
```C
int32_t HB_VDEC_QueryStatus(VDEC_CHN VdChn, VDEC_CHN_STATUS_S *pstStatus);
```
【功能描述】
> 查询解码通道状态。

【参数描述】

| 参数名称  |                        描述                        | 输入/输出 |
| :-------: | :------------------------------------------------: | :-------: |
|   VdChn   | 解码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |
| pstStatus |                解码通道的状态指针。                |   输入    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】

### HB_VDEC_GetUserData
【函数声明】
```C
int32_t HB_VDEC_GetUserData(VDEC_CHN VdChn, VDEC_USERDATA_S *pstUserData, int32_t s32MilliSec);
```
【功能描述】
> 获取视频解码通道用户数据。

【参数描述】

|  参数名称   |                        描述                        | 输入/输出 |
| :---------: | :------------------------------------------------: | :-------: |
|    VdChn    | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |
| pstUserData |                   用户数据指针。                   |   输入    |
| s32MilliSec |                     超时时间。                     |   输入    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】

### HB_VDEC_ReleaseUserData
【函数声明】
```C
int32_t HB_VDEC_ReleaseUserData(VDEC_CHN VdChn, VDEC_USERDATA_S *pstUserData);
```
【功能描述】
> 释放解码通道用户数据。

【参数描述】

|  参数名称   |                        描述                        | 输入/输出 |
| :---------: | :------------------------------------------------: | :-------: |
|    VdChn    | 编码通道号。<br/>取值范围：[0, VDEC_MAX_CHN_NUM)。 |   输入    |
| pstUserData |                    用户数据指针                    |   输入    |

【返回值】

| 返回值 |               描述 |
| :----: | :-----------------|
|   0    |               成功 |
|  非 0   | 失败，返回错误码。 |

【注意事项】
> 无

【参考代码】
> HB_VDEC_GetFd 参考代码

## 数据结构
### VIDEO_MODE_E
【描述】
> 定义码流发送方式。

【结构定义】
```C
typedef enum HB_VIDEO_MODE_E {
    VIDEO_MODE_FRAME = 1,
    VIDEO_MODE_BUTT
} VIDEO_MODE_E;
```
【成员说明】

|       成员       |                含义                 |
| :--------------: | :---------------------------------: |
| VIDEO_MODE_FRAME | 按帧方式发送码流。<br/>以帧为单位。 |

### VIDEO_OUTPUT_ORDER_E
【描述】
> 定义视频解码输出顺序枚举。

【结构定义】
```C
typedef enum HB_VIDEO_OUTPUT_ORDER_E {
    VIDEO_OUTPUT_ORDER_DISP = 0,
    VIDEO_OUTPUT_ORDER_DEC,
    VIDEO_OUTPUT_ORDER_BUTT
} VIDEO_OUTPUT_ORDER_E;
```
【成员说明】

|          成员           |     含义     |
| :---------------------: | :----------: |
| VIDEO_OUTPUT_ORDER_DISP | 显示序输出。 |
| VIDEO_OUTPUT_ORDER_DEC  | 解码序输出。 |

### VIDEO_DEC_MODE_E
【描述】
> 定义视频解码模式枚举。

【结构定义】
```C
typedef enum HB_VIDEO_DEC_MODE_E {
    VIDEO_DEC_MODE_NORMAL = 0,
    VIDEO_DEC_MODE_IRAP,
    VIDEO_DEC_MODE_REF,
    VIDEO_DEC_MODE_THUMB,
    VIDEO_DEC_MODE_BUTT
} VIDEO_DEC_MODE_E;
```
【成员说明】

|         成员          |             含义              |
| :-------------------: | :---------------------------: |
| VIDEO_DEC_MODE_NORMAL |       Decode IPB frame        |
|  VIDEO_DEC_MODE_IRAP  |       Decode IRAP frame       |
|  VIDEO_DEC_MODE_REF   |    Decode reference frame     |
| VIDEO_DEC_MODE_THUMB  | Decode IRAP fream without DPB |

### VDEC_ATTR_H264_S
【描述】
> 定义 H264 解码参数。

【结构定义】
```C
typedef struct HB_VDEC_ATTR_H264_S {
    VIDEO_DEC_MODE_E enDecMode;
    VIDEO_OUTPUT_ORDER_E enOutputOrder;
    HB_BOOL bandwidth_Opt;
} VDEC_ATTR_H264_S;
```
【成员说明】

|     成员      |                                                       含义                                                        |
| :-----------: | :---------------------------------------------------------------------------------------------------------------: |
|   enDecMode   |                                     解码模式，正常解码还是 skip 跳帧模式解码。                                      |
| enOutputOrder |                                  解码图像输出顺序，是解码序输出还是显示序输出。                                   |
| bandwidth_Opt | 使能节省带宽模式，该模式支持 VPU 忽略将压缩格式的非参考帧或者线性格式的非显示帧写入 frame buffer 中，以此来节省带宽。 |

### VDEC_ATTR_H265_S
【描述】
> 定义 H265 解码参数。

【结构定义】
```C
typedef struct HB_VDEC_ATTR_H265_S {
    VIDEO_DEC_MODE_E enDecMode;
    VIDEO_OUTPUT_ORDER_E enOutputOrder;
    HB_BOOLcra_as_bla;
    HB_BOOL bandwidth_Opt;
    uint32_t dec_temporal_id_mode;
    uint32_t target_dec_temporal_id_plus1;
} VDEC_ATTR_H265_S;
```
【成员说明】

|             成员             |                                                                  含义                                                                   |
| :--------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: |
|          enDecMode           |                                                解码模式，正常解码还是 skip 跳帧模式解码。                                                 |
|        enOutputOrder         |                                             解码图像输出顺序，是解码序输出还是显示序输出。                                              |
|          cra_as_bla          |                                                           使能 CRA 作为 BLA 处理                                                            |
|        bandwidth_Opt         |            使能节省带宽模式，该模式支持 VPU 忽略将压缩格式的非参考帧或者线性格式的非显示帧写入 frame buffer 中，以此来节省带宽。            |
|     dec_temporal_id_mode     |                                     指定 temporal id 的选择模式。0 是使用绝对值模式，1 是使用相对值模式                                     |
| target_dec_temporal_id_plus1 | 该值等于 0x0，tempral ID 在任何范围内，都会解码图像<br/>该值在【0x1~0x6】范围内，如果 tempral ID 小于等于 TARGET_DEC_TEMP_ID 才会解码一张图像 |

### VDEC_ATTR_MJPEG_S
【描述】
```C
定义MJPEG解码参数。
```
【结构定义】
```C
typedef struct HB_VDEC_ATTR_MJPEG_S {
    CODEC_ROTATION_E enRotation;
    MIRROR_FLIP_E enMirrorFlip;
    VIDEO_CROP_INFO_S stCropCfg;
} VDEC_ATTR_MJPEG_S;
```
【成员说明】

|     成员      |               含义                |
| :-----------: | :-------------------------------: |
|  enRotation   | 指定旋转角度，包括 0，90，180，270 |
| enMirrorFlip; |           指定镜像模式            |
|   stCropCfg   |           指定解码区域            |

### VDEC_ATTR_JPEG_S
【描述】
> 定义 JPEG 解码参数。
【结构定义】
```C
typedef struct HB_VDEC_ATTR_JPEG_S {
    CODEC_ROTATION_E enRotation;
    MIRROR_FLIP_E enMirrorFlip;
    VIDEO_CROP_INFO_S stCropCfg;
} VDEC_ATTR_JPEG_S;
```
【成员说明】

|     成员      |               含义                |
| :-----------: | :-------------------------------: |
|  enRotation   | 指定旋转角度，包括 0，90，180，270 |
| enMirrorFlip; |           指定镜像模式            |
|   stCropCfg   |           指定解码区域            |

### VDEC_CHN_ATTR_S
【描述】
> 定义解码通道属性。

【结构定义】
```C
typedef struct HB_VDEC_CHN_ATTR_S {
    PAYLOAD_TYPE_E enType;
    VIDEO_MODE_E enMode;
    PIXEL_FORMAT_E enPixelFormat;
    uint32_t u32StreamBufSize;
    uint32_t u32StreamBufCnt;
    HB_BOOL bExternalBitStreamBuf；
    uint32_t u32FrameBufCnt;
    uint32_t vlc_buf_size;
    union {
        VDEC_ATTR_H264_S stAttrH264;
        VDEC_ATTR_H265_S stAttrH265;
        VDEC_ATTR_MJPEG_S stAttrMjpeg;
        VDEC_ATTR_JPEG_S stAttrJpeg;
    };
} VDEC_CHN_ATTR_S;
```
【成员说明】

|                       成员                       |                  含义                  |
| :----------------------------------------------: | :------------------------------------: |
|                      enType                      |    码流类型，例如是 H264 还是 H265 等等    |
|                      enMode                      |         解码模式，只支持帧模式         |
|                  enPixelFormat                   |            解码输出像素格式            |
|                 u32StreamBufSize                 |    用于解码输入的 stream 流 buffer 大小    |
|                 u32StreamBufCnt                  |    用于解码输入的 strema 流 buffer 数量    |
|              bExternalBitStreamBuf               | Stream 流使用外部还是内部 buffer 进行解码 |
|                  u32FrameBufCnt                  |     用于解码输出的 frame buffer 数量     |
|                   vlc_buf_size                   |          解码器 vlc buffer 大小          |
| stAttrH264/stAttrH265<br/>stAttrMjpeg/stAttrJpeg |           种协议的编码器属性           |

### HB_VDEC_USERDATA_S
【描述】
> 定义解码用户数据结构体。

【结构定义】
```C
typedef struct HB_VDEC_USERDATA_S {
    HB_BOOL  bValid;
    uint32_t   u32Len;
    uint64_t   u64PhyAddr;
    uint8_t*   pu8Addr;
} VDEC_USERDATA_S;
```
【成员说明】

|    成员    |       含义       |
| :--------: | :--------------: |
|   bValid   |     是否使能     |
|   u32Len   |   用户数据长度   |
| u64PhyAddr | 用户数据物理地址 |
|  pu8Addr   | 用户数据虚拟地址 |

### HB_VDEC_CHN_STATUS_S
【描述】
> 定义解码通道状态结构体。

【结构定义】
```C
typedef struct HB_VDEC_CHN_STATUS_S {
	uint32_t cur_input_buf_cnt;
	uint64_t cur_input_buf_size;
	uint64_t cur_output_buf_cnt;
	uint64_t cur_output_buf_size;
	uint32_t left_recv_frame;
	uint32_t left_enc_frame;
	uint32_t total_input_buf_cnt;
	uint32_t total_output_buf_cnt;
	int32_t pipeline;
	int32_t channel_port_id;
} VDEC_CHN_STATUS_S;
```
【成员说明】

|         成员         |           含义            |
| :------------------: | :-----------------------: |
|  cur_input_buf_cnt   |  当前输入未解码码流个数   |
|  cur_input_buf_size  |  当前输入码流 buffer size  |
|  cur_output_buf_cnt  |  当前已完成解码码流个数   |
| cur_output_buf_size  | 当前已解码码流 buffer size |
|   left_recv_frame    |     剩余需要接收帧数      |
|    left_enc_frame    |     剩余需要编码帧数      |
| total_input_buf_cnt  |     总计输入码流个数      |
| total_output_buf_cnt |       总计解码个数        |
|       pipeline       |         pipeline          |
|   channel_port_id    |        channel id         |

## 错误码
VDEC 错误码如下表：

|   错误码   | 宏定义                             | 描述               |
| :--------: | :--------------------------------- | :----------------- |
| -269024256 | HB_ERR_VDEC_UNKNOWN                | 未知错误           |
| -269024257 | HB_ERR_VDEC_NOT_FOUND              | VDEC 通道未找到     |
| -269024258 | HB_ERR_VDEC_OPEN_FAIL              | 打开 VDEC 通道识别   |
| -269024259 | HB_ERR_VDEC_RESPONSE_TIMEOUT       | 操作 VDEC 通道无响应 |
| -269024260 | HB_ERR_VDEC_INIT_FAIL              | 初始化 VDEC 模块失败 |
| -269024261 | HB_ERR_VDEC_OPERATION_NOT_ALLOWDED | 操作不允许         |
| -269024262 | HB_ERR_VDEC_NOMEM                  | VDEC 内存不够       |
| -269024263 | HB_ERR_VDEC_NO_FREE_CHANNEL        | 没有空的 VDEC 通道   |
| -269024264 | HB_ERR_VDEC_ILLEGAL_PARAM          | 参数错误           |
| -269024265 | HB_ERR_VDEC_INVALID_CHNID          | 错误的通道号       |
| -269024266 | HB_ERR_VDEC_INVALID_BUF            | 错误的 buffer 块     |
| -269024267 | HB_ERR_VDEC_INVALID_CMD            | 错误的命令         |
| -269024268 | HB_ERR_VDEC_WAIT_TIMEOUT           | 等待超时           |
| -269024269 | HB_ERR_VDEC_FILE_OPERATION_FAIL    | 操作失败           |
| -269024270 | HB_ERR_VDEC_PARAMS_SET_FAIL        | 设置参数失败       |
| -269024271 | HB_ERR_VDEC_PARAMS_GET_FAIL        | 获取参数失败       |
| -269024272 | HB_ERR_VDEC_EXIST                  | VDEC 通道已存在    |
| -269024273 | HB_ERR_VDEC_UNEXIST                | VDEC 通道不存在     |
| -269024274 | HB_ERR_VDEC_NULL_PTR               | 空指针             |

## 参考代码
VDEC 部分示例代码可以参考，[sample_video_codec](./multimedia_samples#sample_video_codec)。