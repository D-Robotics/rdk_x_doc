---
sidebar_position: 1
---

# 7.4.1 Introduction

:::tip 🛠️ System Requirements and Toolchain Download Guide

Please confirm system environment requirements before using the algorithm toolchain. For related download resources, please refer to: [Download Resources Summary](../../01_Quick_start/download.md)

:::

The D-Robotics Algorithm Toolchain is an algorithm solution developed based on the D-Robotics processor. It can help you quantize floating-point models into fixed-point models and quickly deploy self-developed algorithm models on the D-Robotics processor.

Currently, most models trained on GPUs are floating-point models, which means that the parameters are stored using the float data type. The D-Robotics BPU architecture processor uses INT8 as the computing precision (the general precision of processors in the industry) and can only run quantized fixed-point models. The process of converting a trained floating-point model to a fixed-point model is called quantization. Depending on whether the quantized parameters need to be adjusted, we can divide the quantization methods into Quantization Aware Training (QAT) and Post-Training Quantization (PTQ).

D-Robotics algorithm toolchain primarily uses the <font color='Red'>Post-Training Quantization (PTQ)</font> method. This approach only requires calibrating the trained floating-point model using a batch of calibration data, directly converting the trained FP32 network into a fixed-point computation network. During this process, there is no need to retrain the original floating-point model; the quantization process can be completed by adjusting just a few hyperparameters. The entire process is simple and fast, and it has been widely applied in both edge-side and cloud-side scenarios.

## Instructions for Use

This section is intended for developers using D-Robotics processors and provides important considerations for using the D-Robotics algorithm toolchain.

### Floating-Point Model (FP32) Notes

- Supports quantizing floating-point models from <font color='Red'>caffe 1.0</font> and ONNX floating-point models with <font color='Red'>ir_version ≤ 7</font>, <font color='Red'>opset10</font>, and <font color='Red'>opset11</font> into fixed-point models supported by D-Robotics.

- Floating-point models trained with other frameworks must first be exported to ONNX floating-point models that meet the version requirements specified in point 1 before quantization can be performed.

- Model input dimensions are limited to <font color='Red'>fixed 4 dimensions</font> in NCHW or NHWC format (the N dimension can only be 1), for example: 1x3x224x224 or 1x224x224x3. Dynamic dimensions and non-4D inputs are not supported.

- Floating-point models should not include <font color='Red'>post-processing operators</font>, such as NMS computations.

### Model Operator List Description

Currently, the list of all Caffe and ONNX operators supported by D-Robotics processors is provided. Operators not listed are <font color='Red'>currently unsupported</font> due to <font color='Red'>limitations of the D-Robotics processor's BPU hardware</font>. For the specific supported operator list, please refer to the user manual of the algorithm toolchain.