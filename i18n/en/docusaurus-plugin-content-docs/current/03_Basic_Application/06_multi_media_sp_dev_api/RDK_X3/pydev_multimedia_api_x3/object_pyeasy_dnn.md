---
sidebar_position: 1
---

# BPU Algorithm Inference

## Module Description

`pyeasy_dnn` is a C++ wrapper implementation of the underlying DNN inference capabilities, exposing a lightweight Python interface. It provides three core functionalities: module-level model loading methods, `Model` object inference methods, and `TensorProperties` tensor attribute retrieval. This interface is suitable for neural network inference scenarios on the RDK X3 and RDK X5 (software versions prior to 3.5.0) series hardware platforms.

## Basic Specifications
- **Hardware Compatibility**: RDK series development boards (supporting NPU hardware acceleration)
- **Model Format Support**: Compatible with bin and other model formats supported by the RDK platform (specifics depend on the underlying inference library)
- **Data Interaction**: Inference input/output is handled via tensors, with support for retrieving tensor shape, data type, and other information through attributes
- **Interface Dependency**: Depends on the RDK platform's `libdnn.so` underlying inference library; Python layer only wraps the core inference process
- **Core Capabilities**: Model loading, inference execution, tensor attribute querying

## Reference Example
Refer to the `01_basic_sample/test_efficientnasnet_m.py` example for an introduction.

## API Reference

### Module-Level Methods
| API Interface | Function Description |
| ---- | ----- |
| load | **Loads a model file and returns a Model inference object** |

### Model Object Methods
| API Interface | Function Description |
| ---- | ----- |
| forward | **Executes model inference, inputs tensor data, and returns output tensor objects** |

### TensorProperties Tensor Attributes (Read-Only)
| API Interface | Function Description |
| ---- | ----- |
| tensor_type | **Gets the tensor type (e.g., input/output tensor, intermediate tensor, etc.)** |
| dtype | **Gets the tensor's data type (e.g., float32/uint8/int32, etc.)** |
| layout | **Gets the tensor's dimension layout (e.g., NCHW/NHWC/CHW, etc.)** |
| shape | **Gets the tensor's logical shape (e.g., (1, 3, 640, 640))** |
| alignedShape | **Gets the tensor's aligned shape (actual shape after hardware-level alignment, adapting to RDK hardware memory alignment requirements)** |
| validShape | **Gets the tensor's valid shape (effective dimensions actually used in computation, distinct from the aligned shape)** |
| scale_data | **Gets the tensor's quantization scaling factor (specific to quantized models; for floating-point models, it is usually 1.0)** |

### Module-Level Methods

#### load

<font color='Blue'>【Function Declaration】</font>  

```python
model = dnn.load(model_path, **kwargs)
```

<font color='Blue'>【Function Description】</font>  

Loads a deep learning model file from the specified path, completes model parsing, hardware adaptation, and memory allocation, and returns a `Model` object capable of performing inference.

<font color='Blue'>【Parameter Description】</font>  

| Parameter Name | Description | Value Range |
| ----------- | ------------------------ | -------- |
| model_path     | Absolute/relative path to the model file | Valid file path; supports RKNN/ONNX, etc. (depends on the underlying library) |
| **kwargs | Optional parameters (extended based on underlying implementation) | e.g., `core_num` (number of inference cores), `precision` (inference precision); pass empty if none |

<font color='Blue'>【Return Value】</font>  

| Return Value | Description |
| ------ | ----- |
| model  | The initialized `Model` object, containing inference capabilities and tensor attributes |

<font color='Blue'>【Usage Example】</font> 

```python
from hobot_dnn import pyeasy_dnn as dnn

models = dnn.load('../models/efficientnasnet_m_300x300_nv12.bin')
```

<font color='Blue'>【Notes】</font> 

- The model path must point to an existing model file, and the model must be compatible with the current RDK hardware platform;
- A `RuntimeError` exception is thrown if loading fails; it should be caught and handled;
- Optional parameters (`kwargs`) must match the keyword argument definitions of the underlying `Dnnpy_load` function; they can be omitted if no special requirements exist.

### Model Object Methods
#### forward

<font color='Blue'>【Function Description】</font>

Based on the loaded model, this method receives input tensor data, invokes the underlying inference interface to perform forward computation, and returns a list of `TensorProperties` objects containing the output tensor data and attributes.

<font color='Blue'>【Function Declaration】</font>  

```python
output_tensors = model.forward(inputs, **kwargs)
```

<font color='Blue'>【Parameter Description】</font>  

| Parameter Name | Description | Value Range |
| ----------- | ------------------------ | -------- |
| inputs    | List of input data for model inference | Each element in the list is a numpy array/byte stream; shape and data type must match the model's input tensor definition |
| **kwargs  | Optional inference parameters (extended based on underlying implementation) | e.g., `batch_size` (batch size); pass empty if none |

<font color='Blue'>【Return Value】</font>  

| Return Value | Description |                 
| ------ | ----- |
| output_tensors  | A list of `TensorProperties` objects, each containing the values and attributes (shape/dtype, etc.) of an output tensor |

:::info Note!
The shape and data type (`dtype`) of the input data must strictly match the `shape` and `dtype` attributes of the model's input tensor;
For multi-input models, the `inputs` list must be passed in the order of the input tensors;
Inference time depends on model complexity and the number of hardware cores; it is recommended to use asynchronous calls to avoid blocking the main thread.
:::

### TensorProperties Tensor Attributes (Read-Only)
`TensorProperties` is an object that encapsulates tensor metadata. It exposes the following read-only attributes via getter functions, with no independent methods; they are accessed directly by attribute name.

| Attribute Name | Function Description | Data Type |
| ----------- | ------------------------ | -------- |
| tensor_type | Gets the tensor type (e.g., input/output tensor, intermediate tensor, etc.) | String / Integer |
| dtype | Gets the tensor's data type (e.g., float32/uint8/int32, etc.) | String / Enumeration |
| layout | Gets the tensor's dimension layout (e.g., NCHW/NHWC/CHW, etc.) | String |
| shape | Gets the tensor's logical shape (e.g., (1, 3, 640, 640)) | Tuple (integers) |
| alignedShape | Gets the tensor's aligned shape (actual shape after hardware-level alignment, adapting to RDK hardware memory alignment requirements) | Tuple (integers) |
| validShape | Gets the tensor's valid shape (effective dimensions actually used in computation, distinct from the aligned shape) | Tuple (integers) |
| scale_data | Gets the tensor's quantization scaling factor (specific to quantized models; for floating-point models, it is usually 1.0) | Float / Array |

#### Attribute Access Example
```python
# Assuming 'model' is a loaded Model object and 'inputs' is a list of input tensor attributes
input_tensor = model.inputs[0]

# Access tensor attributes
print(f"Tensor type: {input_tensor.tensor_type}")
print(f"Data type: {input_tensor.dtype}")
print(f"Dimension layout: {input_tensor.layout}")
print(f"Logical shape: {input_tensor.shape}")
print(f"Aligned shape: {input_tensor.alignedShape}")
print(f"Valid shape: {input_tensor.validShape}")
print(f"Quantization scaling factor: {input_tensor.scale_data}")

# Access output tensor attributes similarly
output_tensor = model.forward(inputs=[input_data])[0]
print(f"Output tensor data type: {output_tensor.dtype}")
```

<font color='Blue'>【Notes】</font> 

- All attributes are read-only and cannot be modified directly; input data preprocessing must match the tensor attributes;
- `alignedShape` is the memory-aligned shape at the RDK hardware level (e.g., the X3 chip requires width alignment to 32); the actual data storage size follows this attribute;
- `validShape` represents the range of valid data dimensions in the tensor; in some scenarios, it is consistent with `shape`;
- `scale_data` is meaningful only for quantized models (e.g., int8 quantized RKNN); for floating-point models, this value is usually 1.0.

## Additional Notes
1. **Resource Release**: `dnn_python.cpp` does not explicitly define a `release` method. Model resources are typically automatically released when the `Model` object is garbage-collected by Python. For manual release, refer to the underlying library interface extensions.
2. **Error Handling**: Python exceptions (e.g., `RuntimeError`) are thrown when model loading or inference execution fails; it is recommended to use try-except blocks for handling.
3. **Hardware Adaptation**: The tensor's `alignedShape` must comply with the RDK chip's memory alignment rules (e.g., X3 width alignment to 32); otherwise, inference anomalies or data errors may occur.
4. **Multiple Inputs/Outputs**: The `inputs` parameter of the `forward` method is a list corresponding to multiple input tensors for multi-input models; the returned `output_tensors` list corresponds to multiple output tensors for multi-output models, in the order defined by the model.