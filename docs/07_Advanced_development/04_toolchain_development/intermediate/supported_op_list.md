---
sidebar_position: 3
---

# 模型算子支持列表{#supported_op_list_and_restrictions}

```mdx-code-block
import DocScope from '@site/src/components/DocScope';
```

## 使用限制说明

本章节主要介绍 D-Robotics 处理器支持的 `Caffe` 和 `ONNX` 算子情况，其他未列出的算子因 D-Robotics 处理器 bpu 硬件限制，暂不支持。

**术语概念：**

-    BPU 加速   ：D-Robotics 处理器可以进行加速的算子（一定约束条件下），如果不满足约束条件，则会在 CPU 进行计算

-    CPU 计算   ：当前已经在 D-Robotics ARM CPU 上进行优化的算子，支持 onnx opset10 与 opset11。

-    CPU 计算※   ：暂时未集成的 CPU 算子。


**其他注意事项：**

-   RDK X3 所有 BPU 上运行的算子均遵守一般限制：input_batch ≤ 128。 

-   RDK Ultra 和 RDK X5 所有 BPU 上运行的算子均遵守一般限制：1. 输入输出维度均为 4，对于支持非四维情况的 op，会在约束中显性标识； 2. shape：H,W,C ∈ [1, 65536]，`N <= 4096；3. N x C x H x W <= 1G bytes`。

-   支持 ``Caffe 1.0`` 基础算子以及常用扩展算子，支持onnx ``opset10`` 和 ``opset11`` 算子，对于无法满足 BPU 加速约束条件的算子将会退化到 ARM CPU 进行计算。

-   ``Cast`` , ``Constant`` , ``Dropout`` , ``Reshape`` , ``Squeeze`` , ``Unsqueeze`` , ``Shape`` 这些算子(OP)无法直接运行在 BPU 上，但在一些情况下（常量折叠）算法工具链会将其优化掉进而实现支持的效果。

-   标记为 PyTorch 的算子(OP)为官方的 opset11 不包含的算子，D-Robotics 算法工具链提供了导出脚本可以将其从 PyTorch 导出到 D-Robotics 自定义的 onnx OP 中。

-   基于 tensorflow-onnx（https://github.com/onnx/tensorflow-onnx
）转换工具，支持将 ``tensorlfow1.*`` 版本的算子稳定的转换到opset6-opset11版本的ONNX模型格式，但是 ``Tensroflow2.*`` 当前支持还属于实验版本。

-   关于 OP 主动量化被动量化的说明：一个符合本章节约束条件的 OP 仍然运行在 CPU 的主要原因是该 OP 属于被动量化 OP，算法工具链会根据 OP 的计算特性和 BPU 底层逻辑等多方面考虑设计量化逻辑，当前量化逻辑分为：主动量化，被动量化，手动量化。量化逻辑更多信息请阅读：[**算法工具链中的主动量化和被动量化逻辑**](https://developer.d-robotics.cc/forumDetail/118364000835765793) 章节。


<DocScope versions=">= 3.0.0" products="RDK-X3">
## RDK X3 支持的 Caffe 算子列表

| **caffe 算子名称**       | **CPU 计算/BPU 加速** | **X3 BPU 支持约束** | **CPU 支持约束** |
| ---------------------- | ----------------- | ----------------- | -------------- |
| Convolution | BPU 加速 | Kernel 宽高取值范围：HxW=[1,7]x[1,7] <br/> 输入输出 Channel 取值范围 `(one group) <= 2048`（对于非 dilated、group、depthwise conv 等普通卷积，可以放宽至 `<=4096`）。<br/> stride 无限制。<br/> Dilation 取值范围：只支持设置为 2 的幂次方，且必须能够被 stride 整除。<br/> h_dilated 和 w_dilated 可以不同但要求 `h_diated <= w_dilated`。<br/> 单个 Kernel 总体大小限制：`HxWxC <= 32768`。<br/> 不支持配置 axis，默认为 1 | 仅支持 4 维 Conv 计算。<br/> auto_pad 属性不支持。<br/> type 约束支持：float, int32, int8。<br/> pads 属性约束``[Hstart, Wstart, Hend, Wend]`（pads 长度等于 4）并且 Hstart == Hend，Wstart == Wend。 | 
| Deconvolution | BPU 加速 | Kernel 宽高取值范围：HxW=[2,14]x[2,14]。  <br/> 输入输出 Channel 数值取值范围：`C <= 2048`。  <br/>Padding 宽高取值范围： <br/>HxW=[0,(Kernel_H-1)/2]x[0,(Kernel_W-1)/2] 。 <br/>Stride 取值范围：Stride ∈ {2, 4} 。 <br/> `stride_h ≦ stride_w` 。 <br/>Dilation ∈ {(1, 1)}。  <br/>不支持配置 axis 属性。 | 不支持 output_shape 和 output_padding 参数；  <br/>auto_pad 参数只支持 NOTSET 模式；  <br/>不支持 axis |
| MaxUnpool                                                    | CPU 计算 | --- | from_type 支持：   <br/>- X：type 约束：仅支持 float 类型。  <br/>- I：Tensor（int64）。  <br/>to_type 支持：type 约束：仅支持 float 类型。                                       |
| Pooling      | BPU 加速 | 共有四种 Pooling 算子即 MaxPooling，AveragePooling，GlobalMaxPooling，GlobalAveragePooling。 <br/>对四种 Pooling 的约束分别为：   <br/>MaxPooling： <br/> Kernel 宽高的取值范围为：[1,64]x[1,64] 。 <br/>Stride 取值范围为：[1,185]。 <br/> Padding 值需要大于等于零。 <br/>AveragePooling： <br/> Kernel HxW=[1, 7]x[1, 7], Stride ∈{1, 185}。  <br/>GlobalAveragePooling：  <br/>假设输入 shape 为 NCHW， 则输入宽高需满足 `HxW <= 8192` 。 <br/>GlobalMaxPooling：  <br/>假设输入 shape 为 NCHW，则输入宽高取值范围为 HxW=[1,1024]x[1,1024]。 | 无  |
| SPP          | CPU 计算 | 不支持                                                       | 支持 pyramid_height，2^n 次 pooling, `n<7` ; <br/> pooling kernel 小于等于 255；  <br/> 支持 pool，配置可选值为 `{0，1}` |
| InnerProduct | BPU 加速 | InnerProduct 将被转化为 Conv 实现。  <br/>假设 InnerProduct 的输入 feature map 的 shape 为 NCHW ： <br/>1. 如果 HW 均小于等于 7，则 Gemm 的限制等同于 Conv。  <br/>2. 如果 H 和 W 均为 1，那么 C 的限制为` <= 16384`；否则 C 的大小限制为 `<= 2048`。  <br/>3. 如果 Gemm 后是一个 BPU 支持的节点，Gemm 会进行低精度 int8 输出，此时的输入宽高限制为: H x W/8 x C/4 `<=` 1024。  <br/>4. 如果 Gemm 后是一个非 BPU 支持的节点，Gemm 会进行高精度 int32 输出，此时的输入宽高限制为: H x W/8 x C/4 < 2048 。 <br/> 不支持配置 axis 属性 | 无                                                           |
| LRN  | CPU 计算 | 不支持 | local_size 支持、 <br/>alpha 支持、 <br/>beta 支持、 <br/>norm_region 支持，配置可选值`{ACROSS_CHANNELS, WITHIN_CHANNEL }`、 <br/>k 支持 |
| MVN  | CPU 计算 | 不支持 | normalize_variance 支持，配置可选值为{0, 1}、 <br/>across_channels 支持，配置可选值为{0, 1}、 <br/>仅支持 Float32 类型的计算。 |
| BatchNorm                                                    | BPU 加速 | 无限制 | 无                                         |
| ELU                                                          | CPU 计算 | 不支持 | 无                                         |
| BNLL                                                         | CPU 计算 | 不支持 | 无                                         |
| PReLU                                                        | BPU 加速 | 无限制 | 无                                         |
| ReLU/LeakyRelu                                               | BPU 加速 | 无限制 | 无                                         |
| Sigmoid                                                      | BPU 加速 | 对于一个输入维度为 1CHW 的 tensor，仅支持 min(8W4C 对齐后的 shape，32C 对齐后的 shape) `<=8192`的情况。 <br/>8W4C：实际运行时 tensor 的 W 维度 padding 至 8 的整数倍，C 维度 padding 至 4 的整数倍。 <br/>32C：实际运行时 tensor 的 C 维度 padding 至 32 的整数倍。 <br/>在两个对齐方式中取对齐后 shape 最小值，判断是否`<=8192`。 | 无                                         |
| TanH                                                         | BPU 加速 | 无限制 | 无                                         |
| Eltwise                                                      | BPU 加速 | operation 目前支持 Add 和 Mul，暂不支持减。  <br/>Add：  <br/>输入 channel 大小 `M<= 2048`  <br/>支持以下几种情况： <br/> 1. Add 的两个输入 shape 为 NCHW 和 NCHW；  <br/>2. Add 的两个输入 shape 为 NCHW 和 NC11（Add 的两个输入都需要是其它 op 的输出） <br/> Mul： <br/> Mul 的两个输入都需要是四维并且 C 的大小需要 `<= 2048`。 <br/> 同时仅支持如下 shape 的相乘：  <br/>1. (1xCxHxW vs 1xCxHxW)。  <br/>2. (1xCxHxW vs 1xCx1x1)。  <br/>3. (1xCxHxW vs 1x1x1x1)。 | 无                                                           |
| Bias                                                         | BPU 加速 | 参考 Eltwise 等于 Add 的情况                                     | 无                                                           |
| Scale                                                        | BPU 加速 | 参考 Eltwise 等于 Mul 的情况                                     | 无                                                           |
| AbsVal                                                       | CPU 计算 | 不支持                                                       | 无                                                           |
| Exp                                                          | BPU 加速 | 无限制                                                       | 无                                                           |
| Log                                                          | CPU 计算 | 不支持                                                       | 无                                                           |
| Power                                                        | BPU 加速 | 无限制                                                       | 无                                                           |
| Threshold                                                    | CPU 计算 | 不支持                                                       | 无                                                           |
| Reduction                                                    | CPU 计算 | 不支持                                                       | operation 支持 SUM、ASUM、 SUMSQ、MEAN ； <br/>axis 支持；  <br/> 仅支持 Float32 类型的计算。 |
| Softmax                                                      | CPU 计算 | 不支持                                                       | 无                                                           |
| ArgMax                                                       | BPU 加速 | 仅支持 `axis=1，c<=64` 。 <br/>不支持配置 top_k != 1                    | 无                                                           |
| Concat                                                       | BPU 加速 | 输入输出 Channel：`C<=2048 `                                       | 无                                                           |
| Split                                                        | BPU 加速 | 无限制                                                       | 无                                                           |
| Slice                                                        | BPU 加速 | 无限制                                                       | 无                                                           |
| Reshape                                                      | CPU 计算 | 不支持（一些场景下可以融合）                                 | shape 支持[1,4]个 shape_dim 配置 ； <br/> axis 支持[-4,3]范围内可配，不支 持 N 维度，默认值 0，遵循 caffe 规则 ； <br/> num_axes 支持[-1,3]范围内可配，默认 值-1 表示对 axis 起始的所有 轴进行变换 |
| Flatten                                                      | CPU 计算 | 不支持（一些场景下可以融合）                                 | axis 取值范围[-4,3]，默认值 为 1，-4 与 0 含义相同。  <br/>只支持 End_axis == -1。 |
| Crop                                                         | CPU 计算 | 不支持                                                       | 无                                                           |
| Dropout                                                      | BPU 加速 | 无限制                                                       | 无                                                           |
| LSTM                                                         | BPU 加速 | 仅支持 batch=1                                                | --                                                           |
| Normalize                                                    | CPU 计算 | 不支持                                                       | type 约束：仅支持 float 类型。                                 |
| PassThrough                                                  | BPU 加速 | 支持 mode=DCR 和 mode=CRD。 <br/>仅支持 H 和 W 方向的重新排列，并且仅支持 blocksize=2 的重排列。 <br/>举例：NxCxHxW -> Nx(4C)x(H/2)x(W/2)。  | type 约束：仅支持 float 类型。  |
| CReLU                                                         | CPU 计算 | 不支持                                               | type 约束：仅支持 float 类型。                                 |
| RReLU                                                         | CPU 计算 | 不支持                                               | 无                                                          |
| Permute                                                         | CPU 计算 | 不支持     | - 支持 nhwc2nchw，perm：[0, 3, 1, 2]。  <br/> - 支持 nchw2nhwc，perm：[0, 2, 3, 1]。 <br/> - 支持指定 perm 维度转换，数据类型仅支持 float，int8，int32。 |
| MatMul                                                         | BPU 加速 | 对于两个输入分别为 featuremap 和 weight 的场景（即 featuremap 与常量相乘） <br/> 其中第一个输入是 featuremap，第二个输入是 weight，以下几种场景均可优化到 BPU 上运行： <br/>- K vs KxN、K vs 1xKxN、K vs 1x1xKxN  <br/>- MxK vs K、MxK vs KxN、MxK vs 1x1xKxN  <br/>- 1xMxK vs K、1xMxK vs 1xKxN  <br/>- 1x1xMxK vs K、1x1xMxK vs 1xKxN、1x1xMxK vs 1x1xKxN  <br/>- BxMxK vs KxN （B>=1）  <br/>- 1xBxMxK vs KxN （B>=1） <br/>- AxBxMxK vs KxN (A>1，B>1)  <br/>- 其中第一个输入是 weight，第二个输入是 featuremap，以下场景可优化到 BPU 上运行： <br/>- 1xBxMxK vs 1x1xKxN (B>1)  <br/>对于两个输入均为 featuremap 的场景（即两个 featuremap 相乘），以下场景可优化到 BPU 上运行： <br/>- 1xBxMxK vs 1x1xKxN （B>=1）  | type 约束：仅支持 float 类型。                                                       |
| Upsample                                                     | BPU 加速 | 输入 featuremap 需为四维 NCHW，并且只支持在 H 和 W 维度上进行 resize；  <br/> 放大系数 factor 支持 2 的幂数倍如 2，4，8，16，32 等； <br/> 支持 H 维度和 W 维度的放大系数不同但需要满足 `H_factor <= W_factor` | 无                                                           |
| ROIPooling                                                   | CPU 计算 | 不支持                                                       | 无                                                           |
| PSROIPooling                                                 | CPU 计算 | 不支持                                                       | 无                                                           |



## RDK X3 支持的 ONNX 算子列表

| **ONNX 算子名称** | **CPU 计算/BPU 加速** | **X3 BPU 支持约束** | **CPU 支持约束** |
| ------------ | --------------- | --------------- | ----------- |
| Abs                       | CPU 计算         | --          | type 约束：仅支持 float 类型。   |  
| Acos                      | CPU 计算         | --          | type 约束：仅支持 float 类型。 |    
| Acosh                     | CPU 计算         | --     | type 约束：仅支持 float 类型。      |    
| Add                       | BPU 加速         | 输入 channel 大小 `M<= 2048` 支持以下几种情况： <br/> 1. Add 的两个输入 shape 为 NCHW 和 NCHW；  <br/>2. Add 的两个输入 shape 为 NCHW 和 NC11（Add 的两个输入都需要是其它 op 的输出）； <br/>3.作为 resnet 中的 short-cut 子结构的 Add，会被融合到上一个 conv 中加速计算。 | - 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。 |          
| And                       | CPU 计算         | --  | - 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。 |                      
| ArgMax                    | BPU 加速         | 1. 输入维度为四维输入 NCHW。  <br/>2. 仅支持沿 C 维度进行 argmax，即 axis=1。 <br/> 3. `C <= 64 `| type 约束：仅支持 float 类型。      |                       
| ArgMin                    | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。    |                         
| Asin                      | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。     |                         
| Asinh                     | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。    |                        
| Atan                      | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。     |                       
| Atanh                     | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。     |                        
| AveragePool               | BPU 加速         | Kernel HxW=[1, 7]x[1, 7], Stride ∈{1, 185}                   | auto_pad 属性不支持。 <br/>仅支持四维 Tensor 计算。     |                      
| BatchNormalization        | BPU 加速         | 优化阶段会被融合到上一个 conv 中支持                               | type 约束：仅支持 float 类型。  <br/>支持第 1 个维度是 channel 的数据排布方式计算。   |         
| BitShift                  | CPU 计算※        | --                                                           | --                                                           |     
| Cast                      | CPU 计算         | --                                                           | from_type 支持 double, float, bool, int64, uint32, int32, uint16, int16, uint8, int8。<br/>to_type 支持 double, float, bool, int64, uint32, int32, uint16, int16, uint8, int8。|    
| Ceil                      | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。     | 
| Clip                      | BPU 加速         | 无限制。                                                      | type 约束：仅支持 float 类型。 <br/>仅有 2 个输入时，默认为 min 参数。 | 
| Compress                  | CPU 计算※        | --                                                           | --                                                           |  
| Concat                    | BPU 加速         | 输入输出 Channel：`C<=2048`。                                    | --                                                          |  
| ConcatFromSequence        | CPU 计算※        | --                                                           | --                                                           |   
| Constant                  | BPU 加速         | 会通过常量折叠将其优化为数值存储                                | 目前不支持 sparse_tensor 属性。 <br/> type 约束：仅支持 float 类型。                    |    
| ConstantOfShape           | BPU 加速         | 会通过常量折叠将其优化为数值存储                                 | type 约束支持：float,int32,int8。   |    
| Conv                      | BPU 加速         | Kernel 宽高取值范围：HxW=[1,7]x[1,7]。 <br/> 输入输出 Channel 取值范围`(one group) <= 2048`（对于非 dilated、group、depthwise conv 等普通卷积，可以放宽至`<=4096`）。 <br/> stride 无限制，，但对于 Conv 后接 Add(resnet shortcut-connecting) Stride 取值范围为：{1, 2}。 <br/> Dilation 取值范围：只支持设置为 2 的幂次方，且必须能够被 stride 整除。 <br/>h_dilated 和 w_dilated 可以不同但要求`h_diated<=w_dilated` 。 <br/> 单个 Kernel 总体大小限制: `HxWxC <= 32768` | 仅支持 4 维 Conv 计算。 <br/>auto_pad 属性不支持。 <br/>type 约束支持：float,int32,int8。 <br/>pads 属性约束：[Hstart, Wstart, Hend, Wend]（pads 长度等于 4）并且 Hstart==Hend，Wstart==Wend。|   
| ConvInteger               | CPU 计算※        | --                                                           | --                                                           | 
| ConvTranspose             | BPU 加速         | Kernel 宽高取值范围：HxW=[2,14]x[2,14]。 <br/> 输入输出 Channel 数值取值范围：`C <= 2048` 。 <br/> Padding 宽高取值范围：HxW=[0,(Kernel_H-1)/2]x[0,(Kernel_W-1)/2]。 <br/> Stride 取值范围：`Stride ∈ {2, 4}`。 <br/> `stride_h ≦ stride_w`。 <br/> `Dilation ∈ {(1, 1)}` | auto_pad 属性不支持。  <br/>type 约束支持：float,int32,int8。 |  
| Cos                       | BPU 加速         | 对于一个输入维度为 1CHW 的 tensor，仅支持 `CxHxW <= 8192`的情况        | type 约束：仅支持 float 类型。            |   
| Cosh                      | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。      |    
| CumSum                    | CPU 计算         | --                                                           | from_type： <br/>x：type 约束仅支持 float 类型。 <br/>axis：type 约束仅支持 int32 类型。 <br/>to_type：type 约束仅支持 float 类型。 |   
| DepthToSpace              | BPU 加速         | 支持 mode=DCR 和 mode=CRD。 <br/> 仅支持 H 和 W 方向的重新排列，并且仅支持 blocksize=2 的重排列。  <br/>举例：NxCxHxW -> Nx(C/4)x(2H)x(2W) | from_type 支持： <br/>- type 约束仅支持 float 类型。 <br/>- 仅支持 4 维度 Tensor 计算。 <br/>to_type 支持： <br/>- type 约束仅支持 float 类型。 <br/>- 仅支持 4 维度 Tensor 计算。  | 
| DequantizeLinear          | CPU 计算        | --                                                           | --                                                           |   
| Det                       | CPU 计算※        | --                                                           | --                                                           |   
| Div                       | BPU 加速         | 1. 只支持两个输入均为 featuremap（不支持输入来自于常量）；  <br/>2. 对 input shape 的约束请参考 Mul 算子    | - 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。 |  
| Dropout                   | BPU 加速         | 该算子推理阶段不参加计算， 会被移除优化                                   | --                                                           |   
| Einsum                    | CPU 计算※        | --                                                           | --                                                           |  
| Elu                       | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。   |  
| Equal                     | CPU 计算         | --                                                           | - 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。   |    
| Erf                       | CPU 计算        | --                                                           | type 约束：支持 float、double 数据类型。                               |     
| Exp                       | BPU 加速         | --                                                           | type 约束：仅支持 float 类型。        | 
| Expand                    | CPU 计算         | --                                                           | --                                                           | 
| EyeLike                   | CPU 计算        | --                                                           | --                                                           |  
| Flatten                   | CPU 计算         | --                                                           | --               | 
| Floor                     | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。   | 
| GRU                       | CPU 计算         | --                                                           | - direction 属性仅支持 forward 类型。 <br/>- type 约束：仅支持 float 类型。 <br/>- 仅支持输入个数是 3、4、6。 <br/>- 输出个数是 2。  | 
| Gather                    | CPU 计算         | --                                                           | from_type 支持： <br/>- input：type 约束支持： <br/>float,int64,int32,int8,uint64,uint32,uint8。 <br/>- indices：type 约束支持 int32, int64。  <br/>to_type 支持：type 约束支持： <br/>float,int64,int32,int8,uint64,uint32,uint8。 |
| GatherElements            | CPU 计算        | --                                                           | --                                                      |   
| GatherND                  | CPU 计算         | --                          | from_type 支持： <br/>- input：type 约束支持 float,int32,int8。 <br/>- indices：tensor(int64)。 <br/>to_type 支持：type 约束支持 float,int32,int8。|    
| Gemm                      | BPU 加速         | Gemm 将被转化为 Conv 实现。 <br/> 假设 Gemm 的输入 feature map 的 shape 为 NCHW： <br/> 1. 如果 HW 均小于等于 7，则 Gemm 的限制等同于 Conv。 <br/> 2. 如果 H 和 W 均为 1，那么 C 的限制为 `<= 16384`；否则 C 的大小限制为 `<= 2048`。 <br/> 3. 如果 Gemm 后是一个 BPU 支持的节点，Gemm 会进行低精度 int8 输出，此时的输入宽高限制为: `H x W/8 x C/4 <= 1024`。 <br/> 4. 如果 Gemm 后是一个非 BPU 支持的节点，Gemm 会进行高精度 int32 输出，此时的输入宽高限制为: `H x W/8 x C/4 < 2048`。 | type 约束：仅支持 float 类型。    |  
| GlobalAveragePool         | BPU 加速         | 假设输入 shape 为 NCHW， 则输入宽高需满足 `HxW <= 8192 `          | 无                                                           | 
| GlobalLpPool              | CPU 计算        | --                                                           | - type 约束：支持 float 和 double 类型。 <br/> - 仅支持四维 Tensor 计算。 |  
| GlobalMaxPool             | BPU 加速         | 假设输入 shape 为 NCHW， 则输入宽高取值范围为 HxW=[1,1024]x[1,1024] | - type 约束仅支持 float 类型。 <br/>- 仅支持四维 Tensor。 |   
| Greater                   | CPU 计算         | --                                                           | - 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。 | 
| HardSigmoid               | CPU 计算         | --                                                           | type 约束仅支持 float 类型。  |   
| Hardmax                   | CPU 计算※        | --                                                           | --                                                           |  
| Identity                  | CPU 计算         | --                                                           | --                                                         |    
| If                        | CPU 计算※        | --                                                           | --                                                           |  
| InstanceNormalization     | CPU 计算         | --                                                           |- type 约束仅支持 float 类型。 <br/>- 支持第 1 个维度是 channel 的数据排布方式计算。   |  
| IsInf                     | CPU 计算※        | --                                                           | --                                                           |   
| IsNaN                     | CPU 计算※        | --                                                           | --                                                           |   
| LRN                       | CPU 计算         | --                                                           | - type 约束仅支持 float 类型。 <br/>- 仅支持四维 Tensor。  | 
| LSTM                      | BPU 加速         | 仅支持 batch_size=1                                           | - 不支持属性设置。 <br/>- type 约束仅支持 float 类型。 <br/>- 仅支持输入个数是 3、4、8。 <br/>- 输出个数是 2。 |   
| LeakyRelu                 | BPU 加速         | 无                                                           | 无                                                           | 
| Less                      | CPU 计算        | --                                                           | - 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。| 
| LessOrEqual               | CPU 计算         |                                                              |- 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。  |  
| Log                       | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。    | 
| LogSoftmax                | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。    | 
| Loop                      | CPU 计算※        | --                                                           | --                                                           |  
| LpNormalization           | CPU 计算        | --                                                           | - p 范数仅支持 1 或者 2。 <br/>- type 约束支持 double 类型和 float 类型。|  
| LpPool                    | CPU 计算        | --                                                           | - auto_pad 属性不支持。 <br/>- type 约束支持 double 类型和 float 类型。 <br/>- 仅支持 4 维计算。 |  
| MatMulInteger             | CPU 计算※        | --                                                           | --                                                           |    
| MatMul                    | BPU 加速         | 对于两个输入分别为 featuremap 和 weight 的场景（即 featuremap 与常量相乘） <br/> 其中第一个输入是 featuremap，第二个输入是 weight，以下几种场景均可优化到 BPU 上运行： <br/>- K vs KxN、K vs 1xKxN、K vs 1x1xKxN  <br/>- MxK vs K、MxK vs KxN、MxK vs 1x1xKxN  <br/>- 1xMxK vs K、1xMxK vs 1xKxN  <br/>- 1x1xMxK vs K、1x1xMxK vs 1xKxN、1x1xMxK vs 1x1xKxN  <br/>- BxMxK vs KxN （B>=1）  <br/>- 1xBxMxK vs KxN （B>=1） <br/>- AxBxMxK vs KxN (A>1，B>1)  <br/>- 其中第一个输入是 weight，第二个输入是 featuremap，以下场景可优化到 BPU 上运行： <br/>- 1xBxMxK vs 1x1xKxN (B>1)  <br/>对于两个输入均为 featuremap 的场景（即两个 featuremap 相乘），以下场景可优化到 BPU 上运行： <br/>- 1xBxMxK vs 1x1xKxN （B>=1） | type 约束：仅支持 float 类型。  |  
| Max                       | CPU 计算         | --                                                           | - 支持 1-∞个输入。 <br/>- 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。 |  
| MaxPool                   | BPU 加速         | Kernel 宽高的取值范围为：[1, 64]x[1, 64]。 <br/> Stride 取值范围为：[1,185]。 <br/>Padding 值需要大于等于零。 <br/>MaxPool 不支持 dilation。 | 1. dilation 只支持 1x1。 <br/>2. 只支持数据行优先存储。 <br/>3. auto_pad 属性不支持。 <br/>4. storage_order 属性不支持。 <br/>5. 仅支持四维 Tensor 计算。 |   
| MaxRoiPool                | CPU 计算         | --                                                           | 无                                                           |   
| Mean                      | CPU 计算※        | --                                                           | --                                                           | 
| Min                       | CPU 计算        | --                                                           | - 支持 1-∞个输入。 <br/>- 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。 |  
| Mod                       | CPU 计算※        | --                                                           | --                                                           | 
| Mul                       | BPU 加速         | Mul 的两个输入都需要是四维并且 C 的大小需要 `<= 2048`。  <br/>同时仅支持如下 shape 的相乘：  <br/>1. (1xCxHxW vs 1xCxHxW)。  <br/>2. (1xCxHxW vs 1xCx1x1)。 <br/> 3. (1xCxHxW vs 1x1x1x1) 。 <br/>注意：输入的取值不能为 0。 | - 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。 |    
| Multinomial               | CPU 计算※        | --                                                           | --                                                           |   
| Neg                       | CPU 计算        | --                                                           | --                                                        |  
| NonZero                   | CPU 计算         | --                                                           | - type 约束支持：float,int32,int8。 <br/>- 支持 1 维计算。 <br/>- 支持 4 维计算。 |   
| Not                       | CPU 计算        | --                                                           | --                                                           |  
| OneHot                    | CPU 计算        | --                                                           | --                                                        |   
| Or                        | CPU 计算         | --                                                           | - 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。  <br/>- 支持 broadcast 计算，最大维度是 5。  |   
| PRelu                     | BPU 加速         | --                                                        | - type 约束支持：仅支持 float 类型。 <br/>- from_type：X 和 slope。 <br/>- to_type：Y。 <br/>- X 的 shape 为 data_shape，slope 的为 slope_shape ，shape 约束如下：   <br/>- data_shape == slope_shape。    <br/>- slope_shape.ProdSize() == 1。    <br/>- X 和 slope 仅支持 NCHW 排布的 4 维度计算，并且 N、C 维度值相等。      <br/>- HxW 与 1x1（ slope_shape ）。      <br/>- HxW 与 Hx1（ slope_shape ）。      <br/>- HxW 与 1xW（ slope_shape ）。  <br/>- X 是 4 维度 && slope 是 3 维度 && data_shape[1] == slope_shape [0] && slope_shape [1] == 1 && slope_shape [2] == 1。  |                         |
| Pad                       | BPU 加速         | 支持 mode = Constant。 <br/>仅支持 H，W 维度的 pad。   | Pad-10： <br/>- type 约束仅支持 float 类型。 <br/>- 仅支持 NCHW 排布的 4 维 Tensor。 <br/>- 属性 pads 的约束如下：   <br/>- len(pads) == 8 && pads[i] >=0 && pads[0] == 0 && pads[1] == 0 && pads[4] == 0 && pads[5] == 0。  <br/>Pad-11： <br/>- from_type 支持：   <br/>- data：type 约束仅支持 float 类型。   <br/>- pads : tensor(int64)。   <br/>- constant_value (optional)：type 约束仅支持 float 类型。 <br/>- to_type 支持：type 约束仅支持 float 类型。 <br/>- 仅支持 4 维 Tensor。 <br/>- 仅支持 2/3 维度填充。 |   
| Pow                       | BPU 加速         | 只支持第二个输入（exponent）为单个值。                 | - type 约束支持：double, float，int64, int32。 <br/>- 支持相同输入 shape 的计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。 <br/>- 仅支持 X 和 Y 相同 type。 |  
| QLinearConv               | CPU 计算※        | --                                                           | --                                                           |   
| QLinearMatMul             | CPU 计算※        | --                                                           | --                                                           |
| QuantizeLinear            | CPU 计算          | --                                                           | --                                                           |
| RNN                       | CPU 计算         | --                                                           | - type 约束：仅支持 float 类型。 <br/>- 属性约束：direction 属性仅支持 forward。 <br/>- 输入约束：仅支持 X、W、R 输入，不支持可选输入 B、sequence_lens、initial_h 设置。  <br/>- 输出约束：仅支持 Y_h 的输出，shape [num_directions, batch_size, hidden_size]。 |
| RandomNormal              | CPU 计算※        | --                                                           | --                                                           |
| RandomNormalLike          | CPU 计算※        | --                                                           | --                                                           |
| RandomUniform             | CPU 计算         | --                                                           | --                                                           |
| RandomUniformLike         | CPU 计算         | --                                                           | --                                                           |
| Range                     | CPU 计算         | --                                                           |type 约束支持：float,int64,int32,int16。            |
| Reciprocal                | BPU 加速         | --                                                           | --                                                           |
| ReduceL1                  | CPU 计算         | --                                                           | --                              |
| ReduceL2                  | CPU 计算         | --                                                           | --       |
| ReduceLogSum              | CPU 计算         | --                                                           | 仅支持 float、double 数据类型                           |
| ReduceLogSumExp           | CPU 计算         | --                                                           | type 约束支持 float、double 数据类型。               |
| ReduceMax                 | CPU 计算         | --                                                           | axes 支持 0, 1 或者等于输入数据的维数                           |
| ReduceMean                | BPU 加速         | input featuremap 需为四维，并且 axes=[2, 3]                    | axes 支持 0, 1 或者等于输入数据的维数                           |
| ReduceMin                 | CPU 计算         | --                                                           | --                                                           |
| ReduceProd                | CPU 计算         | --                                                           | --                                                           |
| ReduceSum                 | CPU 计算         | --                                                           | axes 支持 0, 1 或者等于输入数据的维数                           |
| ReduceSumSquare           | CPU 计算         | --                                                           | axes 支持 0, 1 或者等于输入数据的维数                           |
| Relu                      | BPU 加速         | 会被融合到前一个 conv 中                                         | type 约束：仅支持 float 类型。      |  
| Reshape                   | CPU 计算         | --                                                           | --                                                         |
| Resize                    | BPU 加速         | 1. 输入 featuremap 需为四维 NCHW，并且只支持在 H 和 W 维度上进行 resize，onnx opset=11 时支持 roi 输入（pytorch 转换的模型需手动修改算子添加 roi 输入，roi 只支持常量输入），roi 输入只支持 H 和 W 维度，roi 输入只在 tf_crop_and_resize 模式下起作用。 <br/>2. 属性 mode 支持 nearest 和 linear 两种模式。 <br/>3. 支持放大和缩小。 <br/>4. 对于 mode=nearest，放大系数 factor 支持 2 的幂数倍如 2，4，8，16，32 等；支持 H 维度和 W 维度的放大系数不同但需要满足 `H_factor <= W_factor`。 <br/>5. 对于 onnx opset=11，属性 coordinate_transformation_mode 支持 half_pixel，pytorch_half_pixel, asymmetric，align_corners 和 tf_crop_and_resize，当 coordinate_transformation_mode=tf_crop_and_resize 时，需要保证 roi 输入转换得到的边界坐标为整数。 | resize-10  <br/>- 输入等于 2 时，使用 opset10。 <br/>- 输入数据是 4 维 Tensor。  <br/>resize-11   <br/>- 输入大于 2 时，使用 opset11。 <br/>- 输入数据是 4 维 Tensor。 <br/>- coordinate_transformation_mode 在 nearest, linear 模式下支持 half_pixel, asymmetric, align_corners 和 pytorch_half_pixel 四种，在 cubic 模式下只支持 half_pixel。 <br/>- extrapolation_value 属性不支持。 |
| ReverseSequence           | CPU 计算         | --                                                           | --                                                           |
| RoiAlign                  | CPU 计算         | --                                                           | --                                                           |
| Round                     | CPU 计算        | --                                                           | --                                                           |
| Scan                      | CPU 计算※        | --                                                           | --                                                           |
| Scatter (deprecated)      | CPU 计算※        | --                                                           | --                                                           |
| ScatterElements           | CPU 计算         | --                                                           | from_type 支持： <br/>- data：type 约束支持：float,int32,int8。 <br/>- indices：type 约束仅支持 int32 类型。 <br/>- updates：type 约束支持：float,int32,int8。 <br/>to_type 支持：type 约束支持：float,int32,int8。  |
| ScatterND                 | CPU 计算         | --                                                           | from_type 支持： <br/>- data：type 约束支持：float,int32,int8。 <br/>- updates : type 约束支持：float,int32,int8。 <br/>to_type 支持：type 约束支持：float,int32,int8。   |
| Selu                      | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。    |
| SequenceAt                | CPU 计算※        | --                                                           | --                                                           |
| SequenceConstruct         | CPU 计算※        | --                                                           | --                                                           |
| SequenceEmpty             | CPU 计算※        | --                                                           | --                                                           |
| SequenceErase             | CPU 计算※        | --                                                           | --                                                           |
| SequenceInsert            | CPU 计算※        | --                                                           | --                                                           |
| SequenceLength            | CPU 计算※        | --                                                           | --                                                           |
| Shape                     | BPU 加速         | 会通过常量折叠将其优化为数值存储                               | --  |
| Shrink                    | CPU 计算※        | --                                                           | --                                                           |
| Sigmoid                   | BPU 加速         | 对于一个输入维度为 1CHW 的 tensor，仅支持 min(8W4C 对齐后的 shape，32C 对齐后的 shape) `<=8192`的情况。 <br/>8W4C：实际运行时 tensor 的 W 维度 padding 至 8 的整数倍，C 维度 padding 至 4 的整数倍。 <br/>32C：实际运行时 tensor 的 C 维度 padding 至 32 的整数倍。 <br/>在两个对齐方式中取对齐后 shape 最小值，判断是否`<=8192`。    | type 约束：仅支持 float 类型。   |
| Sign                      | CPU 计算         | --                                                           | 无                                                           |
| Sin                       | BPU 加速         | 对于一个输入维度为 1CHW 的 tensor，仅支持`CxHxW <= 8192`的情况       | type 约束：仅支持 float 类型。     |
| Sinh                      | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。     |
| Size                      | BPU 加速         | 会通过常量折叠将其优化为数值存储                            | --                                                           |
| Slice                     | BPU 加速         | 无限制                                                       | 无                                                           |
| Softmax                   | BPU 加速         | 默认运行在 CPU 上，当该 op 输入为四维且 axis=1，并且作为模型输出节点时，可以通过 run_on_bpu 指定该节点将其运行在 BPU 上。 | type 约束：仅支持 float 类型。  |
| Softplus                  | BPU 加速         | 对于一个输入维度为 1CHW 的 tensor，仅支持`CxHxW <= 8192`的情况    | type 约束：仅支持 float 类型。  |
| Softsign                  | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。       |
| SpaceToDepth              | BPU 加速         | 支持 mode=DCR 和 mode=CRD。 <br/> 仅支持 H 和 W 方向的重新排列，并且仅支持 blocksize=2 的重排列。  <br/>举例：NxCxHxW -> Nx(4C)x(H/2)x(W/2) | type 约束：仅支持 float 类型。    |
| Split                     | BPU 加速         | 1. 只支持输入大小为 NCHW；  <br/>2. 原始输入的长度必须是每个被切分的 tensor 长度的倍数；  <br/>3. 只支持沿着 C，H，W 维度的切分，也就是 axis 支持等于 1，2，3；  <br/>4. split 数应可以整除 | type 约束：仅支持 float 类型。    |
| SplitToSequence           | CPU 计算※        | --                                                           | --                                                           |
| Sqrt                      | BPU 加速         | 对于一个输入维度为 1CHW 的 tensor，仅支持`CxHxW <= 8192`的情况            |type 约束：仅支持 float 类型。   |
| Squeeze                   | CPU 计算         | 如果该 op 出现在模型中的常量计算子结构中，会被常量折叠优化删除掉，不参与推理      | --                                                          |            |
| StringNormalizer          | CPU 计算※        | --                                                           | --                                                           |
| Sub                       | CPU 计算         | --                                                           | - 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。  |
| Sum                       | BPU 加速         | 限制条件等同于 Add                                            | type 约束：仅支持 float 类型。   |   
| Tan                       | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。   |
| Tanh                      | BPU 加速         | 对于一个输入维度为 1CHW 的 tensor，仅支持`CxHxW <= 8192`的情况       | type 约束：仅支持 float 类型。   |
| TfIdfVectorizer           | CPU 计算※        | --                                                           | --                                                           |
| ThresholdedRelu           | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。  |
| Tile                      | CPU 计算         | --                                                           | type 约束：仅支持 float,int64,int32,uint64,uint32 类型。   |
| TopK                      | CPU 计算         | --                                                           | - type 约束：仅支持 float 类型。  <br/>- 仅支持 opset-10。  |
| Transpose                 | CPU 计算         | --                                                            | - 支持 nhwc2nchw，perm：[0, 3, 1, 2]。 <br/>- 支持 nchw2nhwc，perm：[0, 2, 3, 1]。 <br/>- 支持指定 perm 维度转换，数据类型仅支持 float，int8，int32。   |
| Unique                    | CPU 计算※        | --                                                           | --                                                           |
| Unsqueeze                 | CPU 计算         | 如果该 op 出现在模型中的常量计算子结构中，会被常量折叠优化删除掉，不参与推理        | --                                                          |
| Upsample (resize 替代)     | BPU 加速          | --                                                           | Upsample-(resize-10)  <br/>- 输入等于 2 时，使用 opset10。 <br/>- 输入数据是 4 维 Tensor。  <br/>Upsample-(resize-11)   <br/>- 输入大于 2 时，使用 opset11。 <br/>- 输入数据是 4 维 Tensor。 <br/>- coordinate_transformation_mode 在 nearest, linear 模式下支持 half_pixel, asymmetric, align_corners 和 pytorch_half_pixel 四种，在 cubic 模式下只支持 half_pixel。 <br/>- extrapolation_value 属性不支持。  |
| Where                     | CPU 计算         | --                                                           | type 约束支持 float 和 int64 类型。 <br/> condition 的 shape 为 cond_shape，X 的 shape 为 x_shape，Y 的 shape 为 y_shape ，output 的 shape 为 o_shape，shape 约束如下： <br/>- 仅支持 cond_shape == o_shape 情况下：   <br/>- x_shape == o_shape 的 broadcast。   <br/>- y_shape == o_shape 的 broadcast。 <br/>- 仅支持 cond_shape.NDim() == 4 && o_shape.NDim() == 4 && N 维度值相同 && C 维度值相同：   <br/>- 1x1（cond_shape）与 HxW （o_shape）。   <br/>- Hx1（cond_shape）与 HxW（o_shape）。   <br/>- 1xW（cond_shape）与 HxW（o_shape）。 |
| Xor                       | CPU 计算※        | --                                                           | --                                                           |
| Function                  | CPU 计算※        | --                                                           | --                                                           |
| Celu                      | CPU 计算※        | --                                                           | --                                                           |
| DynamicQuantizeLinear     | CPU 计算※        | --                                                           | --                                                           |
| GreaterOrEqual            | CPU 计算        | --    | - 支持相同输入 shape 计算。 <br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 5。 |
| MeanVarianceNormalization | CPU 计算※        | --                                                           | --                                                           |
| GridSample（PyTorch）     | CPU 计算※         | --                                                           |                                                              |


</DocScope>

<DocScope versions=">= 3.5.0" products="RDK-X5">

## RDK X5 支持的 Caffe 算子列表

| **caffe 算子名称**       | **CPU 计算/BPU 加速** | **X5 BPU 支持约束** | **CPU 支持约束** |
| ------------------- | --------------- | --------------- | ----------- |
| Convolution   | BPU 加速 | 限制条件等同于 ONNX Conv | 支持 conv1d、conv2d、conv3d。<br/>type 约束支持：float，int32，int8。<br/>auto_pad 属性不支持。<br/>pads 属性约束：<br/> - conv1d： [Dstart，Dend]，pads 长度等于 2，并且 Dstart = Dend。<br/> - conv2d：[Hstart，Wstart，Hend，Wend]，pads 长度等于 4 ，并且 Hstart==Hend，Wstart==Wend。<br/>- conv3d：[Dstart，Hstart，Wstart，Dend，Hend，Wend]，pads 长度等于 6 ，并且 Dstart = Dend，Hstart==Hend，Wstart==Wend。                           |
| Deconvolution | BPU 加速 | 限制条件等同于 ONNX ConvTranspose | shape 约束：仅支持 4 维 Tensor 计算。 <br/>type 约束：仅支持 float 类型。 <br/>attribute 约束：<br/>- 仅支持 dilations、group、output_padding、 pads 、strides 属性。<br/>- pads 属性约束：[hstart, wstart, hend, wend]必须满足(hstart==hend and wstart==wend)。 |
| MaxUnpool| CPU 计算 | --- | from_type 支持：  <br/>- X：type 约束：仅支持 float 类型。<br/>- I：Tensor（int64）。<br/>to_type 支持：type 约束：仅支持 float 类型。                                       |
| Pooling      | BPU 加速 | 共有四种 Pooling 算子即 MaxPooling，AveragePooling，GlobalMaxPooling，GlobalAveragePooling。对四种 Pooling 的约束分别为：<br/>- MaxPooling：<br/>该算子支持 int16 输入输出。<br/>kernel `<=` 256；<br/>stride `<=` 256；<br/>padding `<=` 256。<br/>MaxPooling 不支持 dilation。<br/>- AveragePooling：<br/>限制条件等同于 ONNX AveragePool <br/>- GlobalAveragePooling：<br/>无限制。<br/>- GlobalMaxPooling：<br/>H, W ∈ [1, 256]。 | 无  |
| SPP          | CPU 计算 | 不支持  | 支持 pyramid_height，`2^n` 次 pooling, n `< 7`;<br/>pooling kernel 小于等于 255； <br/>支持 pool，配置可选值为 `{0，1}` |
| InnerProduct | BPU 加速 | InnerProduct 将被转化为 Conv 实现，边界约束参考 Conv。 <br/>不支持配置 axis 属性。 | 无                                                           |
| LRN  | CPU 计算 | 不支持 | local_size 支持。<br/>alpha 支持。<br/>beta 支持。<br/>norm_region 支持，配置可选值`{ACROSS_CHANNELS, WITHIN_CHANNEL }`。<br/>k 支持。 |
| MVN  | CPU 计算 | 不支持 | normalize_variance 支持，配置可选值为{0, 1}。<br/>across_channels 支持，配置可选值为{0, 1}。<br/>仅支持 Float32 类型的计算。 |
| BatchNorm                                                    | BPU 加速 | 无限制 | 无                                         |
| ELU                                                          | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维，最高维 ∈ [1, 4096]，其它维 ∈ [1, 65536]。 | 无                                         |
| BNLL                                                         | CPU 计算 | 不支持 | 无                                         |
| PReLU                                                        | BPU 计算 | 1. 该算子仅支持 int8 输入输出。<br/> 2. 输入输出仅支持 4 维。 | - type 约束支持：仅支持 float 类型。<br/>- from_type：X 和 slope。<br/>- to_type：Y。<br/>- X 的 shape 为 data_shape，slope 的为 slope_shape ，shape 约束如下：<br/>  - data_shape == slope_shape 。<br/>  - slope_shape.ProdSize() == 1 。<br/>  - X 和 slope 仅支持 NCHW 排布的 4 维度计算，并且 N、C 维度值相等。 <br/>    - HxW 与 1x1（ slope_shape ）。 <br/>    - HxW 与 Hx1（ slope_shape ）。 <br/>    - HxW 与 1xW（ slope_shape ） 。<br/>  - X 是 4 维度 && slope 是 3 维度 && data_shape[1] == slope_shape [0] && slope_shape [1] == 1 && slope_shape [2] == 1。                         |
| ReLU/LeakyRelu                                               | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | 无                                         |
| Sigmoid                                                      | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | 无                                         |
| TanH                                                         | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | 无                                         |
| Eltwise                                                      | BPU 加速 | 目前支持的 operation 包括 Add、Sub、Mul。<br/>1. 该算子支持 int16 输入输出。<br/>2. 输入类型支持 featurmap 和常量，且最多支持一个常量输入。<br/>3. 支持所有维度的广播，支持两个输入之间的互相广播，例如 NH1C 和 N1WC。<br/>4. 输入输出维度支持 1-10 维，大小为一般限制（见备注）。支持两个输入维度不同，输入大于 4 维时可通过合并相邻维度降维到 4 维（包括 N），合并规则是：<br/>(1)将输出 dim 为 1 的维度去除，例如[1, 2, 3, 4] [1, 2, 1, 4]->[1, 2, 3, 4]可看为[2, 3, 4],[2, 1, 4]->[2, 3,4]。<br/>(2)相邻的非广播维度可以合并，如[2, 5, 4, 5, 3] [2, 5, 1, 5, 3], 2, 5 可以合并。<br/>(3)相邻的同一 Tensor 的广播维度可以合并: 如[2, 5, 4, 5, 2] [1, 1, 1, 5, 2] 2，5，4 可以合并。<br/>(4)广播维度不能和相邻非广播维度合并，如[2, 5, 4, 5, 2] [2, 1, 4, 1, 2]不能合并；非同一 Tensor 的广播维度不能合并 [2, 1, 4, 1, 2] [1, 5, 1, 5, 1]。 | 无                                                           |
| Bias                                                         | BPU 加速 | 参考 Eltwise 等于 Add 的情况                                     | 无                                                           |
| Scale                                                        | BPU 加速 | 参考 Eltwise 等于 Mul 的情况                                     | 无                                                           |
| AbsVal                                                       | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| 无  |
| Exp                                                          | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| 无  |
| Log                                                          | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| 无  |
| Power                                                        | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维<br/>3. 第二个输入只支持标量。| 无  |
| Threshold    | CPU 计算 | 不支持      | 无                                                           |
| Reduction                                                    | CPU 计算 | 不支持  | operation 支持 SUM、ASUM、 SUMSQ、MEAN、Max、LogSum、Min、Prod； <br/>axis 支持； <br/> 仅支持 Float32 类型的计算。 |
| Softmax                                                      | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 默认运行在 CPU 上，当该 op 输入为四维并且 axis=1,2,3 时，可以通过 run_on_bpu 指定该节点将其运行在 BPU 上。 | 无 |
| ArgMax                                                       | BPU 加速 | 1. 仅支持 axis=1，c`<=`64。<br/>2. 不支持配置 top_k != 1。<br/>3. 该算子支持 int16 输入输出。| 无  |
| Concat                                                       | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 不支持 N 维度 concat。 | 无                                                           |
| Split                                                        | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 原始输入的长度必须是每个被切分的 tensor 长度的倍数。<br/>3. 支持除 N 维度以外的任意维度。<br/>4. split 数应可以整除。<br/>5. 支持非四维输入输出。| 无 |
| Slice                                                        | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 无限制，支持非四维输入输出。 | 无                                                           |
| Reshape                                                      | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. 支持 1-10 维输入输出。| shape 支持`[1,4]`个 shape_dim 配置 ；<br/> axis 支持`[-4,3]`范围内可配，不支 持 N 维度，默认值 0，遵循 caffe 规则 ；<br/> num_axes 支持`[-1,3]`范围内可配，默认 值 -1 表示对 axis 起始的所有 轴进行变换 |
| Flatten                                                      | CPU 计算 | 不支持（一些场景下可以融合）                                 | axis 取值范围`[-4,3]`，默认值 为 1，-4 与 0 含义相同。 <br/>只支持 End_axis == -1。 |
| Crop    | CPU 计算 | 不支持           | 无                                                           |
| Dropout  | BPU 加速 | 无限制        | 无                                                           |
| LSTM     | BPU 加速 | 仅支持 batch=1     | --                                                           |
| Normalize   | CPU 计算 | 不支持        | type 约束：仅支持 float 类型。                                 |
| PassThrough  | BPU 加速 | 支持 mode=DCR 和 mode=CRD。<br/>仅支持 H 和 W 方向的重新排列，并且仅支持 blocksize=2 的重排列。<br/>举例：NxCxHxW -> Nx(4C)x(H/2)x(W/2)。  | type 约束：仅支持 float 类型。  |
| CReLU | CPU 计算 | 不支持       | type 约束：仅支持 float 类型。                                 |
| RReLU  | CPU 计算 | 不支持     | 无                                                          |
| Permute                                                       | BPU 加速 | 1. 支持任意输入维度。<br/>2. 除 batch 维度（第一维）以外，支持任意其它维度的转换。 | - 支持 nhwc2nchw，perm：[0, 3, 1, 2]。 <br/> - 支持 nchw2nhwc，perm：[0, 2, 3, 1]。<br/> - 支持指定 perm 维度转换，数据类型仅支持 float，int8，int32。 |
| MatMul                                                         | BPU 加速 | C = MatMul(A，B)，对输入 A 和输入 B 有以下维度限制：<br/>- A 和 B 均支持非四维输入但需满足约束：<br/>  - A 和 B 的维度必须相同。<br/>  - A 和 B 的最低两个维度 M, K ∈ [1, 8192]，其他更高维度∈[1, 4096]。    <br/>  注：HDMK vs HDKN，MK/KN 即为最低两个维度。<br/>- 支持的 broadcast 需满足以下条件：<br/>  - A 跟 B 两个输入，除开最低两维的其他维度全是 1 或者全是不需要广播的值。<br/>    - 此场景支持的例子：HDMK vs H1KN<br/>    - 此场景不支持反例：H1MK vs 1DKN<br/>  - A 除了最低两个维度，其他维度不能即有需要广播的值也有不需要广播的值。<br/>    - 此场景支持的例子：11MK vs HDKN<br/>    - 此场景不支持反例：H1MK vs HDKN<br/>  - B 除了最低两个维度，如果其他维度即有需要广播的值也有不需要广播的值，那么不需要广播的值只能在连续的高维度上。<br/>    - 此场景支持的例子：BHDMK vs B11KN<br/>    - 此场景不支持反例：BHDMK vs B1DKN  <br/>  注：需要广播的值和不需要广播的值：<br/>   <br/>- 如果 A 和 B 在对应维度轴上的两个值，一个为 1，另一个为非 1，那么 1 就是需要广播的值，非 1 就是不需要广播的值；<br/>    - 如果 A 和 B 在对应维度轴上的两个值相等，那么这两个值都是不需要广播的值（如 HDMK vs H1KN，1 是需要广播的值，H 是不需要广播的值）。 | type 约束：仅支持 float 类型。                                                       |
| Upsample                                                     | BPU 加速 | 输入 featuremap 需为四维 NCHW，并且只支持在 H 和 W 维度上进行 resize； <br/> 放大系数 factor 不能同时小于 2。 | 无  |
| ROIPooling  | CPU 计算 | 不支持       | 无                                                           |
| PSROIPooling  | CPU 计算 | 不支持     | 无                                                           |



## RDK X5 支持的 ONNX 算子列表

| **ONNX 算子名称** | **CPU 计算/BPU 加速** | **X5 BPU 支持约束** | **CPU 支持约束** |
| ------------ | --------------- | --------------- | ----------- |
| Abs  | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| type 约束：仅支持 float 类型。   |  
| Acos  | BPU 加速         |1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| type 约束支持 float 和 double 类型。 |    
| Acosh | BPU 加速         |1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| type 约束支持 float 和 double 类型。|    
| Add                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入类型支持 featurmap 和常量，且最多支持一个常量输入。<br/>3. 支持所有维度的广播，支持两个输入之间的互相广播，例如 NH1C 和 N1WC。<br/>4. 输入输出维度支持 1-10 维，大小为一般限制（见备注）。支持两个输入维度不同，输入大于 4 维时可通过合并相邻维度降维到 4 维（包括 N），合并规则是：<br/>(1)将输出 dim 为 1 的维度去除，例如[1, 2, 3, 4] [1, 2, 1, 4]->[1, 2, 3, 4]可看为[2, 3, 4],[2, 1, 4]->[2, 3,4]。<br/>(2)相邻的非广播维度可以合并，如[2, 5, 4, 5, 3] [2, 5, 1, 5, 3], 2, 5 可以合并。<br/>(3)相邻的同一 Tensor 的广播维度可以合并: 如[2, 5, 4, 5, 2] [1, 1, 1, 5, 2] 2，5，4 可以合并。<br/>(4)广播维度不能和相邻非广播维度合并：如[2, 5, 4, 5, 2] [2, 1, 4, 1, 2]不能合并；非同一 Tensor 的广播维度不能合并 [2, 1, 4, 1, 2] [1, 5, 1, 5, 1]。<br/>5. 作为 resnet 中的 short-cut 子结构的 Add，会被融合到上一个 conv 中加速计算。 | - 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。 |          
| And                       | CPU 计算         | --  | - 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。 |                      
| ArgMax                    | BPU 加速         | 1. 输入维度为四维输入 NCHW。<br/>2. N ∈ [1, 4096]，H,W ∈ [1, 65536] ，C ∈ [1, 8191]。<br/>3. 该算子支持 int16 输入输出。<br/>4. 仅支持沿 C 维度进行 argmax/argmin，即 axis=1。| type 约束：仅支持 float 类型。|
| ArgMin                    | BPU 加速         | 1. 输入维度为四维输入 NCHW。<br/>2. N ∈ [1, 4096]，H,W ∈ [1, 65536] ，C ∈ [1, 8191]。<br/>3. 该算子支持 int16 输入输出。<br/>4. 仅支持沿 C 维度进行 argmax/argmin，即 axis=1。| type 约束：仅支持 float 类型。| 
| Asin                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维。| type 约束支持 float 和 double 类型。 |                         
| Asinh                     | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维。| type 约束支持 float 和 double 类型。|                        
| Atan                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维。| type 约束支持 float 和 double 类型。|                       
| Atanh                     | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维。| type 约束支持 float 和 double 类型。|                       
| AveragePool               | BPU 加速         | kernel: H,W ∈ [1, 256] <br/> H * W `<=` 8192 ，H * W > 1 <br/>stride: H,W ∈ [1, 256]< br/>padding: H,W ∈ [0, 255] | 输入和输出支持 4 维和 5 维。|                      
| BatchNormalization        | BPU 加速         | 无限制。  | type 约束：仅支持 float 类型。 <br/>支持第 1 个维度是 channel 的数据排布方式计算。   |         
| BitShift                  | CPU 计算※        | --                                                           | --                                                           |     
| Cast                      | CPU 计算         | --                                                           | from_type 支持 double, float, bool, int64, uint32, int32, uint16, int16, uint8, int8。<br/>to_type 支持 double, float, bool, int64, uint32, int32, uint16, int16, uint8, int8。|    
| Ceil                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| type 约束支持 double 类型和 float 类型。     | 
| Clip                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| opset6: <br/>min, max 作为属性值，dtype 仅支持 float 类型;<br/>opset11: <br/>min, max 作为输入，仅有两个输入时，第二个为 min；dtype 支持 float, double 类型。 | 
| Compress                  | CPU 计算※        | --                                                           | --                                                           |  
| Concat                    | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 不支持 N 维度 concat。 | --                                                          |  
| ConcatFromSequence        | CPU 计算※        | --                                                           | --                                                           |   
| Constant                  | BPU 加速         | 会通过常量折叠将其优化为数值存储                                | 目前不支持 sparse_tensor 属性。 |    
| ConstantOfShape           | BPU 加速         | 会通过常量折叠将其优化为数值存储                                 | type 约束支持：float,int32,int8。   |    
| Conv                      | BPU 加速         | 支持四维输入（conv2d）和五维输入（conv3d）。<br/>四维输入（conv2d）：<br/>Kernel shape 范围：N,C ∈ [1, 8192]; H,W ∈ [1, 31]。C * H * W < = 32767。<br/>输入输出 Channel 取值范围(one group) `<=` 8192，如果 Conv 是量化子图的最后一个算子，取值范围`<=` 65536。<br/>stride 取值范围：H,W ∈ [1, 256]，但对于 Conv 后接 Add(resnet shortcut-connecting) Stride 取值范围为：{1, 2}，对 dilated>1 的 conv，stride 只支持=1。<br/>Dilation 取值范围：H,W∈ [1, 16]，H 或 W 大于 1 时，只支持输出 int8，且输入 Tensor 的 H 必须能被 dilation 的 H 整除，输入 Tensor 的 W 必须能被 dilation 的 W 整除。<br/>padding 取值范围：H,W ∈ [0, 256]。<br/>五维输入（conv3d）：<br/>输入大小 NCDHW：N ∈ [1, 128]; H,W,D,C ∈ [1, 65536]。<br/>kernel 大小 NCDHW：N,C ∈ [1, 65536]; H,W ∈ [1, 31], D ∈ [1, 8191]。<br/>padding 大小 DHW：H,W ∈ [0, 256], D ∈ [0, kernel_d/2]。<br/>stride 取值范围：H, W 同为 1 或 H, W 同为 2。<br/>group，dilation 暂不支持。<br/>Size: 1G bytes；当 D * C > 4096 时, H * alignCeil(W, 256) * D * C < 1G。<br/>weight 的 D * 输入的 C `<=` 8192。 | 支持 conv1d、conv2d、conv3d。<br/>type 约束支持：float，int32，int8。<br/>auto_pad 属性不支持。<br/>pads 属性约束：<br/>- conv1d： [Dstart，Dend]，pads 长度等于 2，并且 Dstart = Dend。<br/>- conv2d：[Hstart，Wstart，Hend，Wend]，pads 长度等于 4 ，并且 Hstart==Hend，Wstart==Wend。<br/>- conv3d：[Dstart，Hstart，Wstart，Dend，Hend，Wend]，pads 长度等于 6 ，并且 Dstart = Dend，Hstart==Hend，Wstart==Wend。|   
| ConvInteger               | CPU 计算※        | --                      | --  |
| ConvTranspose             | BPU 加速         | 输入输出 featuremap 大小限制：<br/>N ∈ [1, 128]。<br/>H,W ∈ [1, 65536]。 <br/>C ∈ [1, 2048] 。<br/>Size: 1G bytes。<br/>weight 大小限制：<br/>N,C ∈ [1, 2048]。 <br/>H,W ∈ [1, 14]且 HW 不同时为 1。<br/>Size: <br/>psh = padding.h % stride.h;<br/>psw = padding.w % stride.w;<br/>ksh = (kernel.h - 1 + psh) / stride.h +1<br/>ksw = (kernel.w - 1 + psw) / stride.w + 1<br/>group_num = fout.c / kernel.c<br/>ksc = fin.c / group_num<br/>kernel_size = ksh * ksw * ksc<br/>kernel_size ∈ [1, 32767] <br/>padding 取值范围：<br/>stride 为奇数时，H,W ∈ [0, kernel / stride)。<br/>stride 为偶数，H,W ∈ [0, kernel / stride]。<br/>out_pad 取值范围：H,W ∈ {0,1}。<br/>stride >= 1 && stride `<=`14 但不支持 stride_h 和 stride_w 同时等于 1。<br/>Dilation ∈ {(1, 1)}。| shape 约束：仅支持 4 维 Tensor 计算。<br/>type 约束：仅支持 float 类型。<br/>attribute 约束：<br/>- 仅支持 dilations、group、output_padding、 pads 、strides 属性。<br/>- pads 属性约束：[hstart, wstart, hend, wend]必须满足(hstart==hend and wstart==wend)。|  
| Cos                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| type 约束支持 float 类型。|   
| Cosh                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| type 约束支持 float 类型。|   
| CumSum                    | CPU 计算         | --                                                           | axis：type 约束仅支持 int32 类型。 |   
| DepthToSpace              | BPU 加速         | 该算子支持 int16 输入输出。<br/> 支持 mode=DCR 和 mode=CRD。<br/> 仅支持 H 和 W 方向的重新排列，并且仅支持 blocksize=2 的重排列。 <br/>举例：NxCxHxW -> Nx(C/4)x(2H)x(2W) 输出的 channel 必须是 4 的倍数。| from_type 支持：<br/>- type 约束仅支持 float 类型。<br/>- 仅支持 4 维度 Tensor 计算。<br/>to_type 支持：<br/>- type 约束仅支持 float 类型。<br/>- 仅支持 4 维度 Tensor 计算。  | 
| DequantizeLinear          | CPU 计算        | --       | --         |   
| Det                       | CPU 计算※        | --  | --       |   
| Div                       | BPU 加速         | 对 input shape 的约束请参考 Mul 算子。  | - 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。 |  
| Dropout                   | BPU 加速         | 该算子推理阶段不参加计算， 会被移除优化                                   | --                                                           |   
| Einsum                    | CPU 计算※        | --                                                           | --                                                           |  
| Elu                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维| type 约束：仅支持 float 类型。   |  
| Equal                     | BPU 加速         | 1. 该算子支持 int16 输入。<br/>2. 支持所有维度的广播，支持 fin0 或 fin1 其中一个输入的广播，不能支持互相广播。<br/>3. 输入输出维度支持 1-10 维，大小为一般限制（见备注）。输入大于 4 维时可通过合并相邻维度降维到 4 维（包括 N），合并规则是：<br/>(1)将输出 dim 为 1 的维度去除，例如[1, 2, 3, 4] [1, 2, 1, 4]->[1, 2, 3, 4]可看为[2, 3, 4],[2, 1, 4]->[2, 3,4]。<br/>(2)相邻的非广播维度可以合并，如[2, 5, 4, 5, 3] [2, 5, 1, 5, 3], 2, 5 可以合并。<br/>(3)相邻的同一 Tensor 的广播维度可以合并: 如[2, 5, 4, 5, 2] [1, 1, 1, 5, 2] 2，5，4 可以合并。<br/>(4)广播维度不能和相邻非广播维度合并：如[2, 5, 4, 5, 2] [2, 1, 4, 1, 2]不能合并。<br/>4. 默认运行在 CPU 上，可以通过 run_on_bpu 指定该节点将其运行在 BPU 上。 | - 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。   |    
| Erf                       | BPU 加速        | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束：支持 float 数据类型。                              |     
| Exp                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束：仅支持 float 类型。        | 
| Expand                    | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维，输入与输出仅支持有一个维度上的数值不同。<br/>3. 输入与输出仅允许有一个维度上数值不同。 | --    | 
| EyeLike                   | CPU 计算        | --                                                           | --                                                           |  
| Flatten                   | BPU 加速         | 限制条件等同于 Reshape。 | --               | 
| Floor                     | BPU 加速         |  1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束：仅支持 float 类型。   | 
| GRU                       | CPU 计算         | --                                                           | - direction 属性仅支持 forward 类型。<br/>- type 约束：仅支持 float 类型。  | 
| Gather                    | BPU 加速         | 1. input/output/indices 的 rank 都要小于等于 4。<br/>2. indices 支持：<br/>    - indices 是 feature（其他 op 输出）时，type 约束仅支持 int32 类型。<br/>    - indices 是 weight（模型保存的常量）时，type 约束支持 int32 和 int64 类型。 | from_type 支持：<br/>- input：type 约束支持：<br/>float,int64,int32,int8,uint64,uint32,uint8。<br/>- indices：type 约束支持 int32, int64。 <br/>to_type 支持：type 约束支持：<br/>float,int64,int32,int8,uint64,uint32,uint8。 |
| GatherElements            | BPU 加速        | 1. 该算子支持 int16 输入输出。<br/>2. input/indices/output 维度支持 1-10 维。<br/>3. 当输入维度 i != axis 时，要求 indices.shape[i] `<=` input.shape[i]。 | --     |   
| GatherND                  | CPU 计算         | --                          | from_type 支持：<br/>- input：type 约束支持 float,int32,int8。<br/>- indices：tensor(int64)。<br/>to_type 支持：type 约束支持 float,int32,int8。|    
| Gemm                      | BPU 加速         | Gemm 将被转化为 Conv 实现，边界约束参考 Conv。 | type 约束：仅支持 float 类型。    |  
| GlobalAveragePool         | BPU 加速         | 无限制。           | - type 约束：仅支持 float 类型。<br/>- 仅支持四维 Tensor。| 
| GlobalLpPool              | CPU 计算        | --                                                           | - type 约束：支持 float 和 double 类型。<br/> - 仅支持四维 Tensor 计算。 |  
| GlobalMaxPool             | BPU 加速         | H, W ∈ [1, 256]。 | - type 约束仅支持 float 类型。<br/>- 仅支持四维 Tensor。 |   
| Greater                   | BPU 加速         | 1. 该算子支持 int16 输入。<br/>2. 支持所有维度的广播，支持 fin0 或 fin1 其中一个输入的广播，不能支持互相广播。<br/>3. 输入输出维度支持 1-10 维，大小为一般限制（见备注）。输入大于 4 维时可通过合并相邻维度降维到 4 维（包括 N），合并规则是：<br/>(1)将输出 dim 为 1 的维度去除，例如[1, 2, 3, 4] [1, 2, 1, 4]->[1, 2, 3, 4]可看为[2, 3, 4],[2, 1, 4]->[2, 3,4]。<br/>(2)相邻的非广播维度可以合并，如[2, 5, 4, 5, 3] [2, 5, 1, 5, 3], 2, 5 可以合并。<br/>(3)相邻的同一 Tensor 的广播维度可以合并：如[2, 5, 4, 5, 2] [1, 1, 1, 5, 2] 2，5，4 可以合并。<br/>(4)广播维度不能和相邻非广播维度合并：如[2, 5, 4, 5, 2] [2, 1, 4, 1, 2]不能合并。<br/>4. 默认运行在 CPU 上，可以通过 run_on_bpu 指定该节点将其运行在 BPU 上。 | - 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。 | 
| HardSigmoid               | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束仅支持 float 类型。  |   
| Hardmax                   | CPU 计算※        | --                                                           | --                                                           |  
| Identity                  | CPU 计算         | --                                                           | --                                                         |    
| If                        | CPU 计算※        | --                                                           | --                                                           |  
| InstanceNormalization     | CPU 计算         | --                                                           |- type 约束仅支持 float 类型。<br/>- 支持第 1 个维度是 channel 的数据排布方式计算。   |  
| IsInf                     | CPU 计算※        | --                                                           | --                                                           |   
| IsNaN                     | CPU 计算※        | --                                                           | --                                                           |   
| LRN                       | CPU 计算         | --                                                           | - type 约束仅支持 float 类型。<br/>- 仅支持四维 Tensor。  | 
| LSTM                      | BPU 加速         | 仅支持 batch_size=1，如果需要配置多 batch，需要在导出 onnx 时保证 LSTM 的 batch 为 1 并在 yaml 中配置参数 input_batch=1。 | - type 约束仅支持 float 类型。<br/>- 属性约束：direction 属性仅支持 forward。<br/>- 输入约束：<br/>   - 支持 X、W、R 输入配置；<br/>   - 支持 X、W、R、B 输入配置（sequence_lens 为空或默认值）；<br/>   -  支持 X、W、R、B、sequence_lens、initial_h、initial_c、P 输入配置（sequence_lens 为空或者默认值）。 |   
| LeakyRelu                 | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束：仅支持 float 类型。  | 
| Less                      | BPU 加速        | 1. 该算子支持 int16 输入。<br/>2. 支持所有维度的广播，支持 fin0 或 fin1 其中一个输入的广播，不能支持互相广播。<br/>3. 输入输出维度支持 1-10 维，大小为一般限制（见备注）。输入大于 4 维时可通过合并相邻维度降维到 4 维（包括 N），合并规则是：<br/>(1)将输出 dim 为 1 的维度去除，例如[1, 2, 3, 4] [1, 2, 1, 4]->[1, 2, 3, 4]可看为[2, 3, 4],[2, 1, 4]->[2, 3,4]。<br/>(2)相邻的非广播维度可以合并，如[2, 5, 4, 5, 3] [2, 5, 1, 5, 3], 2, 5 可以合并。<br/>(3)相邻的同一 Tensor 的广播维度可以合并：如[2, 5, 4, 5, 2] [1, 1, 1, 5, 2] 2，5，4 可以合并。<br/>(4)广播维度不能和相邻非广播维度合并：如[2, 5, 4, 5, 2] [2, 1, 4, 1, 2]不能合并。<br/>4. 默认运行在 CPU 上，可以通过 run_on_bpu 指定该节点将其运行在 BPU 上。 | - 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。| 
| LessOrEqual               | BPU 加速         |opset11 不支持单个 LessOrEqual 算子，支持拆分后的算子 Greater+Not 运行在 BPU 上，限制条件与 Greater 相同。|- 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。  |  
| Log                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束：仅支持 float 类型。    | 
| LogSoftmax                | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。    | 
| Loop                      | CPU 计算※        | --                                                           | --                                                           |  
| LpNormalization           | CPU 计算        | --                                                           | - p 范数仅支持 1 或者 2。<br/>- type 约束支持 float 类型。|  
| LpPool                    | CPU 计算        | --                                                           | - auto_pad 属性不支持。<br/>- type 约束支持 float 类型。<br/>- 仅支持 4 维计算。 |  
| MatMulInteger             | CPU 计算※        | --                                                           | --                                                           |    
| MatMul                    | BPU 加速         | C = MatMul(A，B)，对输入 A 和输入 B 有以下维度限制：<br/>- A 和 B 均支持非四维输入但需满足约束：<br/>  - A 和 B 的维度必须相同。<br/>  - A 和 B 的最低两个维度 M, K∈[1, 8192]，其他更高维度∈[1, 4096]。    <br/>  注：HDMK vs HDKN，MK/KN 即为最低两个维度。<br/>- 支持的 broadcast 需满足以下条件：<br/>  - A 跟 B 两个输入，除开最低两维的其他维度全是 1 或者全是不需要广播的值。<br/>    - 此场景支持的例子：HDMK vs H1KN<br/>    - 此场景不支持反例：H1MK vs 1DKN<br/>  - A 除了最低两个维度，其他维度不能即有需要广播的值也有不需要广播的值。<br/>    - 此场景支持的例子：11MK vs HDKN<br/>    - 此场景不支持反例：H1MK vs HDKN<br/>  - B 除了最低两个维度，如果其他维度即有需要广播的值也有不需要广播的值，那么不需要广播的值只能在连续的高维度上。<br/>    - 此场景支持的例子：BHDMK vs B11KN<br/>    - 此场景不支持反例：BHDMK vs B1DKN  <br/>  注：需要广播的值和不需要广播的值：<br/>    - 如果 A 和 B 在对应维度轴上的两个值，一个为 1，另一个为非 1，那么 1 就是需要广播的值，非 1 就是不需要广播的值；<br/>    - 如果 A 和 B 在对应维度轴上的两个值相等，那么这两个值都是不需要广播的值（如 HDMK vs H1KN，1 是需要广播的值，H 是不需要广播的值） | type 约束：仅支持 float 类型。  |  
| Max                       | BPU 加速         | 1.该算子支持 int16 输入输出。<br/>2.支持所有维度的广播，支持两个输入之间的互相广播，例如 NH1C 和 N1WC。<br/>3.输入输出维度支持 1-10 维，大小为一般限制（见备注）。支持两个输入维度不同，输入大于 4 维时可通过合并相邻维度降维到 4 维（包括 N），合并规则是：<br/>(1)将输出 dim 为 1 的维度去除，例如[1, 2, 3, 4] [1, 2, 1, 4]->[1, 2, 3, 4]可看为[2, 3, 4],[2, 1, 4]->[2, 3,4]。<br/>(2)相邻的非广播维度可以合并，如[2, 5, 4, 5, 3] [2, 5, 1, 5, 3], 2, 5 可以合并。<br/>(3)相邻的同一 Tensor 的广播维度可以合并：如[2, 5, 4, 5, 2] [1, 1, 1, 5, 2] 2，5，4 可以合并。<br/>(4)广播维度不能和相邻非广播维度合并：如[2, 5, 4, 5, 2] [2, 1, 4, 1, 2]不能合并；非同一 Tensor 的广播维度不能合并 [2, 1, 4, 1, 2] [1, 5, 1, 5, 1]。| - 支持 1-∞个输入。<br/>- 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。 |  
| MaxPool                   | BPU 加速         | 该算子支持 int16 输入输出。<br/>kernel `<=` 256。<br/>stride `<=` 256。<br/>padding `<=` 256。<br/>MaxPool 不支持 dilation。 | 1. dilation 只支持 1x1。<br/>2. 只支持数据行优先存储。<br/>3. auto_pad 属性不支持。<br/>4. storage_order 属性不支持。<br/>5. 输入和输出支持 4 维和 5 维。|   
| MaxRoiPool                | CPU 计算         | --                                                           | 无                                                           |   
| Mean                      | CPU 计算※        | --                                                           | --                                                           | 
| Min                       | BPU 加速        | 1.该算子支持 int16 输入输出。<br/>2.支持所有维度的广播，支持两个输入之间的互相广播，例如 NH1C 和 N1WC。<br/>3.输入输出维度支持 1-10 维，大小为一般限制（见备注）。支持两个输入维度不同，输入大于 4 维时可通过合并相邻维度降维到 4 维（包括 N），合并规则是：<br/>(1)将输出 dim 为 1 的维度去除，例如[1, 2, 3, 4] [1, 2, 1, 4]->[1, 2, 3, 4]可看为[2, 3, 4],[2, 1, 4]->[2, 3,4]。<br/>(2)相邻的非广播维度可以合并，如[2, 5, 4, 5, 3] [2, 5, 1, 5, 3], 2, 5 可以合并。<br/>(3)相邻的同一 Tensor 的广播维度可以合并：如[2, 5, 4, 5, 2] [1, 1, 1, 5, 2] 2，5，4 可以合并。<br/>(4)广播维度不能和相邻非广播维度合并：如[2, 5, 4, 5, 2] [2, 1, 4, 1, 2]不能合并；非同一 Tensor 的广播维度不能合并 [2, 1, 4, 1, 2] [1, 5, 1, 5, 1]。<br/>4. 默认运行在 CPU 上，可以通过 run_on_bpu 指定该节点将其运行在 BPU 上。| - 支持 1-∞个输入。<br/>- 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。 |  
| Mod                       | CPU 计算        | --                                                           | --                                                           | 
| Mul                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2.输入类型支持 featurmap 和常量，且最多支持一个常量输入。<br/>3. 支持所有维度的广播，支持两个输入之间的互相广播，例如 NH1C 和 N1WC。<br/>4. 输入输出维度支持 1-10 维，大小为一般限制（见备注）。支持两个输入维度不同，输入大于 4 维时可通过合并相邻维度降维到 4 维（包括 N），合并规则是：<br/>(1)将输出 dim 为 1 的维度去除，例如[1, 2, 3, 4] [1, 2, 1, 4]->[1, 2, 3, 4]可看为[2, 3, 4],[2, 1, 4]->[2, 3,4]。<br/>(2)相邻的非广播维度可以合并，如[2, 5, 4, 5, 3] [2, 5, 1, 5, 3], 2, 5 可以合并。<br/>(3)相邻的同一 Tensor 的广播维度可以合并: 如[2, 5, 4, 5, 2] [1, 1, 1, 5, 2] 2，5，4 可以合并。<br/>(4)广播维度不能和相邻非广播维度合并：如[2, 5, 4, 5, 2] [2, 1, 4, 1, 2]不能合并；非同一 Tensor 的广播维度不能合并 [2, 1, 4, 1, 2] [1, 5, 1, 5, 1]。| - 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。 |    
| Multinomial               | CPU 计算※        | --                                                           | --                                                           |   
| Neg                       | CPU 计算        | --                                                           | --                                                        |  
| Not                       | CPU 计算        | --                                                           | --                                                           |  
| OneHot                    | CPU 计算        | --                                                           | --                                                        |   
| Or                        | CPU 计算         | --                                     | - 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。 <br/>- 支持 broadcast 计算，最大维度是 8。|   
| PRelu                     | BPU 加速         | 1. 该算子仅支持 int8 输入输出。<br/>2. 输入输出仅支持 4 维。| - type 约束支持：仅支持 float 类型。<br/>- from_type：X 和 slope。<br/>- to_type：Y。<br/>- X 的 shape 为 data_shape，slope 的为 slope_shape ，shape 约束如下：  <br/>- data_shape == slope_shape。   <br/>- slope_shape.ProdSize() == 1。   <br/>- X 和 slope 仅支持 NCHW 排布的 4 维度计算，并且 N、C 维度值相等。     <br/>- HxW 与 1x1（ slope_shape ）。     <br/>- HxW 与 Hx1（ slope_shape ）。     <br/>- HxW 与 1xW（ slope_shape ）。 <br/>- X 是 4 维度 && slope 是 3 维度 && data_shape[1] == slope_shape [0] && slope_shape [1] == 1 && slope_shape [2] == 1。  |                         |
| Pad                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 支持 mode = Constant。<br/>3. 支持所有维度的 Pad。 | Pad-10：<br/>- type 约束仅支持 float 类型。<br/>- 仅支持 NCHW 排布的 4 维 Tensor。<br/>- 属性 pads 的约束如下：  <br/>- len(pads) == 8 && pads[i] >=0 && pads[0] == 0 && pads[1] == 0 && pads[4] == 0 && pads[5] == 0。 <br/>Pad-11：<br/>- from_type 支持：  <br/>- data：type 约束仅支持 float 类型。  <br/>- pads : tensor(int64)。  <br/>- constant_value (optional)：type 约束仅支持 float 类型。<br/>- to_type 支持：type 约束仅支持 float 类型。<br/>- 输入和输出支持 4 维，仅支持 2/3 维度填充。<br/>- 输入和输出支持 5 维，仅支持 2/3/4 维度填充。|   
| Pow                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 <br/>3. 第二个输入只支持标量。  | - type 约束支持：double, float，int64, int32。<br/>- 支持相同输入 shape 的计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 5。<br/>- 仅支持 X 和 Y 相同 type。 |  
| QLinearConv               | CPU 计算※        | --                                                           | --                                                           |   
| QLinearMatMul             | CPU 计算※        | --                                                           | --                                                           |
| QuantizeLinear            | CPU 计算          | --                                                           | --                                                           |
| RNN                       | CPU 计算         | --                                                           | - type 约束：仅支持 float 类型。<br/>- 属性约束：direction 属性仅支持 forward。<br/>- 输入约束：仅支持 X、W、R 输入，不支持可选输入 B、sequence_lens、initial_h 设置。 <br/>- 输出约束：仅支持 Y_h 的输出，shape [num_directions, batch_size, hidden_size]。 |
| RandomNormal              | CPU 计算※        | --                                                           | --                                                           |
| RandomNormalLike          | CPU 计算※        | --                                                           | --                                                           |
| RandomUniform             | CPU 计算         | --                                                           | --                                                           |
| RandomUniformLike         | CPU 计算         | --                                                           | --                                                           |
| Range                     | CPU 计算         | --                                                           |type 约束支持：float,int64,int32,int16。            |
| Reciprocal                | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维  | --                                                           |
| ReduceL1                  | CPU 计算         | --                                                           | --                              |
| ReduceL2                  | CPU 计算         | --                                                           | --       |
| ReduceLogSum              | CPU 计算         | --                                                           | --                         |
| ReduceLogSumExp           | CPU 计算         | --                                                           | type 约束支持 float、double 数据类型。               |
| ReduceMax                 | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入支持 2-5 维，需要指定 axes 属性，指定的 axes 数量为 1，不支持沿大于 1 个维度进行 reduce 操作。<br/>3. reduce 维度对应的轴的 size ∈ [1, 8192]。<br/>4. 仅支持 keepdims == 1。 | axes 支持 0, 1 或者等于输入数据的维数                           |
| ReduceMean                | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入支持 2-5 维，需要指定 axes 属性，指定的 axes 数量为 1，不支持沿大于 1 个维度进行 reduce 操作。<br/>3. 当 reduce 维度=2 时，支持同时沿 HW 维度进行 reduce。<br/>4. 仅支持 keepdims == 1。 | axes 支持 0, 1 或者等于输入数据的维数                           |
| ReduceMin                 | CPU 计算         | --                                                           | --                                                           |
| ReduceProd                | CPU 计算         | --                                                           | --                                                           |
| ReduceSum                 | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入支持 2-5 维，需要指定 axes 属性，指定的 axes 数量为 1，不支持沿大于 1 个维度进行 reduce 操作。 | axes 支持 0, 1 或者等于输入数据的维数  |
| ReduceSumSquare           | CPU 计算         | --                                                           | axes 支持 0, 1 或者等于输入数据的维数                           |
| Relu                      | BPU 加速         | 无限制                                      | type 约束：仅支持 float 类型。      |  
| Reshape                   | BPU 加速         |1. 该算子支持 int16 输入输出。<br/>2. 支持 1-10 维输入输出。  | --                                                         |
| Resize                    | BPU 加速         | 1. 输入 featuremap 需为四维 NCHW，并且只支持在 H 和 W 维度上进行 resize，onnx opset=11 时支持 roi 输入（pytorch 转换的模型需手动修改算子添加 roi 输入，roi 只支持常量输入），roi 输入只支持 H 和 W 维度，roi 输入只在 tf_crop_and_resize 模式下起作用。<br/>2. 属性 mode 支持 nearest 和 linear 两种模式。<br/>3. 支持放大和缩小。<br/>4. 对于 mode=nearest，放大系数 factor 支持 2 的幂数倍如 2，4，8，16，32 等；支持 H 维度和 W 维度的放大系数不同但需要满足 H_factor `<=` W_factor。<br/>5. 对于 onnx opset=11，属性 coordinate_transformation_mode 支持 half_pixel，pytorch_half_pixel, asymmetric，align_corners 和 tf_crop_and_resize，当 coordinate_transformation_mode=tf_crop_and_resize 时，需要保证 roi 输入转换得到的边界坐标为整数。 | resize-10 <br/>- 输入等于 2 时，使用 opset10。<br/>- 输入数据是 4 维 Tensor。 <br/>resize-11  <br/>- 输入大于 2 时，使用 opset11。<br/>- 输入数据是 4 维 Tensor。<br/>- coordinate_transformation_mode 在 nearest, linear 模式下支持 half_pixel, asymmetric, align_corners 和 pytorch_half_pixel 四种，在 cubic 模式下只支持 half_pixel。<br/>- extrapolation_value 属性不支持。 |
| ReverseSequence           | CPU 计算         | --                                                           | --                                                           |
| RoiAlign                  | CPU 计算         | --                                                           | --                                                           |
| Round                     | BPU 加速        | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维。| --                                                           |
| Scan                      | CPU 计算※        | --                                                           | --                                                           |
| Scatter (deprecated)      | CPU 计算※        | --                                                           | --                                                           |
| ScatterElements           | CPU 计算         | --                                                           | from_type 支持：<br/>- data：type 约束支持：float,int32,int8。<br/>- indices：type 约束仅支持 int32 类型。<br/>- updates：type 约束支持：float,int32,int8。<br/>to_type 支持：type 约束支持：float,int32,int8。  |
| ScatterND                 | CPU 计算         | --                                                           | from_type 支持：<br/>- data：type 约束支持：float,int32,int8。<br/>- updates : type 约束支持：float,int32,int8。<br/>to_type 支持：type 约束支持：float,int32,int8。   |
| Selu                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维。 | type 约束：仅支持 float 类型。    |
| SequenceAt                | CPU 计算※        | --                                                           | --                                                           |
| SequenceConstruct         | CPU 计算※        | --                                                           | --                                                           |
| SequenceEmpty             | CPU 计算※        | --                                                           | --                                                           |
| SequenceErase             | CPU 计算※        | --                                                           | --                                                           |
| SequenceInsert            | CPU 计算※        | --                                                           | --                                                           |
| SequenceLength            | CPU 计算※        | --                                                           | --                                                           |
| Shape                     | BPU 加速         | 会通过常量折叠将其优化为数值存储                               | --                                                             |
| Shrink                    | CPU 计算※        | --                                                           | --                                                           |
| Sigmoid                   | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维  | type 约束：仅支持 float 类型。   |
| Sign                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束：仅支持 float 类型。                |
| Sin                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维  | type 约束支持 float 和 double 类型。 |
| Sinh                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束支持 float 类型。 |
| Size                      | BPU 加速         | 会通过常量折叠将其优化为数值存储                            | --                                                           |
| Slice                     | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 无限制，支持非四维输入输出。  | 无                                                           |
| Softmax                   | BPU 加速         | - 该算子支持 int16 输入输出。<br/>- 默认运行在 CPU 上，由于 onnx::softmax 和 pytorch::softmax 计算存在区别，分以下两种情况：<br/>1. 对于 onnx::softmax，当该 op 输入为四维并且 axis=3 时，可以通过 run_on_bpu 指定该节点将其运行在 BPU 上。<br/>2. 对于 pytorch::softmax, 当该 op 输入为四维并且 axis=1,2,3 时，可以通过 run_on_bpu 指定该节点将其运行在 BPU 上。 | type 约束：仅支持 float 类型。  |
| Softplus                  | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束：仅支持 float 类型。  |
| Softsign                  | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束：仅支持 float 类型。  |
| SpaceToDepth              | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 支持 mode=DCR 和 mode=CRD。<br/> 仅支持 H 和 W 方向的重新排列，并且仅支持 blocksize=2 的重排列。 <br/>举例：NxCxHxW -> Nx(4C)x(H/2)x(W/2) | type 约束：仅支持 float 类型。    |
| Split                     | BPU 加速         |1. 该算子支持 int16 输入输出。<br/>2. 原始输入的长度必须是每个被切分的 tensor 长度的倍数。<br/>3. 支持除 N 维度以外的任意维度。<br/>4. split 数应可以整除。<br/>5. 支持非四维输入输出。 | type 约束：仅支持 float 类型。    |
| SplitToSequence           | CPU 计算※        | --                                                           | --                                                           |
| Sqrt                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 |type 约束：仅支持 float 类型。   |
| Squeeze                   | BPU 加速         | 该 op 会被转换成 Reshape，BPU 约束详见 Reshape op。     | --                                                          |            |
| StringNormalizer          | CPU 计算※        | --                                                           | --                                                           |
| Sub                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入类型支持 featurmap 和常量，且最多支持一个常量输入。<br/>3. 支持所有维度的广播，支持两个输入之间的互相广播，例如 NH1C 和 N1WC。<br/>4. 输入输出维度支持 1-10 维，大小为一般限制（见备注）。支持两个输入维度不同，输入大于 4 维时可通过合并相邻维度降维到 4 维（包括 N），合并规则是：<br/>(1)将输出 dim 为 1 的维度去除，例如[1, 2, 3, 4] [1, 2, 1, 4]->[1, 2, 3, 4]可看为[2, 3, 4],[2, 1, 4]->[2, 3,4]。<br/>(2)相邻的非广播维度可以合并，如[2, 5, 4, 5, 3] [2, 5, 1, 5, 3], 2, 5 可以合并。<br/>(3)相邻的同一 Tensor 的广播维度可以合并: 如[2, 5, 4, 5, 2] [1, 1, 1, 5, 2] 2，5，4 可以合并。<br/>(4)广播维度不能和相邻非广播维度合并：如[2, 5, 4, 5, 2] [2, 1, 4, 1, 2]不能合并；非同一 Tensor 的广播维度不能合并 [2, 1, 4, 1, 2] [1, 5, 1, 5, 1]。 | - 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 8。  |
| Sum                       | BPU 加速         | 限制条件等同于 Add                                            | type 约束：仅支持 float 类型。   |   
| Tan                       | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维  | type 约束：支持 float 类型。 |
| Tanh                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入输出支持 1-10 维 | type 约束：仅支持 float 类型。   |
| TfIdfVectorizer           | CPU 计算※        | --                                                           | --                                                           |
| ThresholdedRelu           | CPU 计算         | --                                                           | type 约束：仅支持 float 类型。  |
| Tile                      | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 输入与输出仅允许有一个维度上数值不同。| type 约束：仅支持 float,int64,int32,uint64,uint32 类型。   |
| TopK                      | BPU 加速 | 1. 该算子支持 int16 输入输出。<br/>2. input/indices/output 维度支持 1-10 维。<br/>3. indices type 约束支持 int16/int32/int64。<br/>4. 参数 sorted 只支持 true。 | - type 约束：仅支持 float 类型。|
| Transpose                 | BPU 加速         | 1. 该算子支持 int16 输入输出。<br/>2. 支持任意输入维度。 | - 支持 nhwc2nchw，perm：[0, 3, 1, 2]。<br/>- 支持 nchw2nhwc，perm：[0, 2, 3, 1]。<br/>- 支持指定 perm 维度转换，数据类型仅支持 float，int8，int32。   |
| Unique                    | CPU 计算※        | --                                                           | --                                                           |
| Unsqueeze                 | BPU 加速         | 该 op 会被转换成 Reshape，BPU 约束详见 Reshape op。       | --                                                          |
| Upsample (resize 替代)     | BPU 加速          | --                                                           | Upsample-(resize-10) <br/>- 输入等于 2 时，使用 opset10。<br/>- 输入数据是 4 维 Tensor。 <br/>Upsample-(resize-11)  <br/>- 输入大于 2 时，使用 opset11。<br/>- 输入数据是 4 维 Tensor。<br/>- coordinate_transformation_mode 在 nearest, linear 模式下支持 half_pixel, asymmetric, align_corners 和 pytorch_half_pixel 四种，在 cubic 模式下只支持 half_pixel。<br/>- extrapolation_value 属性不支持。  |
| Where                     | CPU 计算         | --                                                           | type 约束支持 float 和 int64 类型。<br/> condition 的 shape 为 cond_shape，X 的 shape 为 x_shape，Y 的 shape 为 y_shape ，output 的 shape 为 o_shape，shape 约束如下：<br/>- 仅支持 cond_shape == o_shape 情况下：  <br/>- x_shape == o_shape 的 broadcast。  <br/>- y_shape == o_shape 的 broadcast。<br/>- 仅支持 cond_shape.NDim() == 4 && o_shape.NDim() == 4 && N 维度值相同 && C 维度值相同：  <br/>- 1x1（cond_shape）与 HxW （o_shape）。  <br/>- Hx1（cond_shape）与 HxW（o_shape）。  <br/>- 1xW（cond_shape）与 HxW（o_shape）。 |
| Xor                       | CPU 计算※        | --                                                           | --                                                           |
| Function                  | CPU 计算※        | --                                                           | --                                                           |
| Celu                      | CPU 计算※        | --                                                           | --                                                           |
| DynamicQuantizeLinear     | CPU 计算※        | --                                                           | --                                                           |
| GreaterOrEqual            | BPU 加速        | opset11 不支持单个 GreaterOrEqual 算子，支持拆分后的算子 Less+Not 运行在 BPU 上，限制条件与 Less 相同。| - 支持相同输入 shape 计算。<br/>- 支持输入 1 是标量或者输入 2 是标量的计算。<br/>- 支持 broadcast 计算，最大维度是 5。 |
| MeanVarianceNormalization | CPU 计算※        | --                                                           | --                                                           |
| GridSample（PyTorch）     | BPU 加速         | 1. 输入维度仅支持四维，第一个输入需满足 N ∈ [1, 4096]； C ∈ [1, 65536]； H,W ∈ [1, 1024] 且 H * W `<=` 512 * 512。<br/>2. mode 只支持'bilinear'、'nearest'。<br/>3. padding_mode 只支持'zeros'、'border'。<br/>4. 该算子为 opset16 的 onnx 算子，为在 opset11 支持，工具链以自定义算子的方式提供导出，导出包含该算子的 onnx 模型请使用 horizon_nn.torch.export_onnx 接口替换 torch.onnx.export，接口传参相同，示例代码如下：<br/>from horizon_nn.torch import export_onnx<br/>    ...    <br/>    export_onnx(...)|  |

</DocScope>