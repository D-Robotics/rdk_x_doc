---
sidebar_position: 1
---

# 7.4.1 简介

:::tip 🛠️ 系统环境要求和工具链下载指引

使用算法工具链前请确认系统环境要求。相关下载资源请参考：[下载资源汇总](../../01_Quick_start/download.md)

:::

D-Robotics 算法工具链是基于 D-Robotics 处理器研发的算法解决方案，可以帮助您把浮点模型量化为定点模型， 并在 D-Robotics 处理器上快速部署自研算法模型。

目前在 GPU 上训练的模型大部分都是浮点模型，即参数使用的是 float 类型存储；D-Robotics BPU 架构的处理器使用的是  INT8   的计算精度（业内处理器的通用精度），只能运行定点量化模型。从训练出的浮点模型转为定点模型的过程，我们叫做量化，依据是否要对量化后的参数进行调整，我们可以将量化方法分为 QAT（Quantification Aware Training）量化感知训练和 PTQ（Post-Training Quantization）训练后量化。

D-Robotics 算法工具链主要使用的是<font color='Red'>训练后量化 PTQ</font>方法，只需使用一批校准数据对训练好的浮点模型进行校准, 将训练过的 FP32 网络直接转换为定点计算的网络，此过程中无需对原始浮点模型进行任何训练，只对几个超参数调整就可完成量化过程, 整个过程简单快速, 目前在端侧和云侧场景已得到广泛应用。 


## 使用注意事项

本章节适用于使用 D-Robotics 处理器的开发者，用于介绍 D-Robotics 算法工具链的一些使用注意事项。

### 浮点模型(FP32)注意事项

-   支持<font color='Red'>caffe 1.0</font> 版本的 caffe 浮点模型和<font color='Red'>ir_version≤7</font> 、<font color='Red'>opset10</font> 、<font color='Red'>opset11</font> 版本的 onnx 浮点模型量化成 D-Robotics 支持的定点模型；

-   其他框架训练的浮点模型需要先导出第 1 点要求符合版本的 onnx 浮点模型后，才能进行量化；

-   模型输入维度只支持<font color='Red'>固定 4 维</font> 输入 NCHW 或 NHWC（N 维度只能为 1），例如：1x3x224x224 或 1x224x224x3， 不支持动态维度及非 4 维输入；

-   浮点模型中不要包含有<font color='Red'>后处理算子</font> ,例如：nms 计算。

### 模型算子列表说明

-   目前提供了 D-Robotics 处理器可支持的所有 Caffe 和 ONNX 算子情况，其他未列出的算子因<font color='Red'>D-Robotics 处理器 bpu 硬件限制</font> ，<font color='Red'>暂不支持</font> 。具体算子支持列表，请参考 [**模型算子支持列表**](./intermediate/supported_op_list) 章节内容。