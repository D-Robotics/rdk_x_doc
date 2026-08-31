---
sidebar_position: 1
id: ai-python-api
title: BPU Algorithm API Guide
sidebar_label: BPU algorithm inference
---
## Introduction 

After version RDK X5 3.5.0, the parts related to algorithm inference, object detection, semantic segmentation, etc., using Python have been fully upgraded to the `hbm_runtime` interface. This interface is a Python binding interface based on pybind11, used to access and operate the `libdnn` C++ library, providing high-performance neural network model loading and inference capabilities.

This interface encapsulates the underlying model runtime details, allowing Python users to easily load single or multiple neural network models, manage model input/output information, and flexibly perform inference operations. The interface supports various input data formats and ensures continuous storage of input data through intelligent conversion, improving operational efficiency.

### Applicable Scenarios
- Quickly integrating and calling `hbm_runtime` functionalities in a Python environment.
- Applications with high requirements for inference efficiency and flexibility, such as robot vision and intelligent edge computing.
- Scenarios where multiple models need to be loaded and managed simultaneously, with dynamic configuration of inference priorities and hardware resource allocation.

### Key Features
- **Multi-Model Support**
  - Supports loading a single model or a group of multiple models. Input/output metadata can be independently retrieved and inference performed for each model.
- **Flexible Input Formats**
  - Supports single input (`numpy.ndarray`);
  - Supports input dictionaries mapped by model name (`Dict[str, np.ndarray]`);
  - Supports multi-model, multi-input structures (`Dict[str, Dict[str, np.ndarray]]`). All inputs are automatically checked for C-contiguous memory format, and copying is performed when necessary to ensure efficient and correct underlying access.
- **Inference Priority Specification**
  - The `priority: Dict[str, int]` parameter can explicitly specify the scheduling priority of model tasks, enabling the scheduler to reasonably schedule inference tasks under limited hardware resources.
- **BPU Core Specification for Inference**
  - Supports explicitly specifying the BPU computing cores used for model inference via `bpu_cores: Dict[str, List[int]]`, enabling strategies such as heterogeneous core resource binding.
- **Parallel Multi-Model Inference**
  - For multi-model input scenarios, the underlying system automatically adopts a multi-threaded mechanism to execute inference tasks for each model in parallel (multi-threaded launch). Higher throughput can be achieved on multi-core BPU systems (single-core BPU still executes serially at the underlying level).
- **Metadata Access Interface**
  - Number, names, data types (via `hbDNNDataType` enumeration) of inputs and outputs;
  - Input/output tensor shapes, memory strides, quantization parameters (including scale, zero point, quantization type);
  - Model description information, HBM file description information, etc.
- **Fully Bound Type System**
  - Supports the `QuantParams` structure for quantization parameters, the `hbDNNDataType` enumeration, the `SchedParam` object for model scheduling parameters, and the `hbDNNQuantiType` enumeration for quantization types, providing type-safe property access.

## Installation Instructions
The `hbm_runtime` module is a high-performance inference runtime Python interface implemented in C++, depending on `pybind11` and the underlying inference libraries (such as `libdnn`) provided by Horizon. It can be installed via system DEB packages (`.deb`) and supports Python 3.10 and above.

### System Dependencies
| Dependency          | Minimum Version | Description                                                                                   |
|---------------------|----------------|-----------------------------------------------------------------------------------------------|
| Python              | ≥ 3.10         | Python 3.10 is recommended                                                                    |
| pip                 | ≥ 22.0         | Required for installing wheel packages                                                        |
| pybind11            | Any            | Used during build; not required for installation                                              |
| scikit-build-core   | ≥ 0.7          | Used for building wheel packages (source build only)                                          |
| Horizon Base Libraries | Platform-dependent | Such as `libdnn.so`, typically provided by the BSP (Board Support Package)                 |

### Building the Wheel Package
There are two ways to build the wheel package. (The `hbm_runtime` is installed by default after RDK X5 software version 3.5.0)

#### Building During DEB Installation
The relevant files for `hbm_runtime` are available in the `hobot-spdev` repository. Compile `hobot-spdev` and then install it directly.
  ```bash
  # Install via local DEB package (note that package names compiled at different times may vary; refer to the actual situation)
  dpkg -i hobot-spdev-xxx.deb
  ```

#### Building on the Device Side
  ```bash
  # Navigate to the source code repository of hbm_runtime
  cd /usr/hobot/lib/hbm_runtime

  # Run the build command
  ./build.sh

  # Check the built wheel package
  ls dist/

  # Note: The wheel package name varies by version; xxx represents the version
  # hbm_runtime-x.x.x-cp310-cp310-manylinux_2_34_aarch64.whl
  ```

### Installation Methods

#### Using a Wheel Package
There are two ways to install using a wheel package; choose either one.
- **Install via local wheel package**
  - Locate the wheel file built in the "Building the Wheel Package" section.
  ```bash
  # Example: Install a local wheel package using pip (note: package name varies by version; xxx represents the version)
  pip install hbm_runtime-x.x.x-cp310-cp310-manylinux_2_34_aarch64.whl
  ```

- **Install from PyPI source**
  ```bash
  pip install hbm_runtime
  ```

#### Using a DEB Package
There are two ways to install using a DEB package; choose either one.
- **Install via local DEB package**
  ```bash
  # Example: Install a DEB package (note: package names compiled at different times may vary; refer to the actual situation)
  sudo dpkg -i hobot-spdev_4.0.2-20250714201215_arm64.deb
  ```

- **Install via APT repository**
  ```bash
  sudo apt-get install hobot-spdev
  ```

- **Common Issues**
  - If files do not take effect after installing the `.deb` package, check if other dependencies are preventing overwriting (e.g., an older version of `hobot-spdev` already installed).
  - Use `dpkg -L hobot-spdev` to verify if files have been successfully deployed.

### Uninstallation Instructions
- **Uninstall a package installed via pip:**
  ```bash
  pip uninstall hbmruntime
  ```

- **Uninstall a package installed via DEB:**
  ```bash
  sudo apt remove hobot-spdev
  ```

## Quick start

This section shows how to load models and run inference with `hbm_runtime` in a few lines.

### Prerequisites

Install `hbm_runtime` as in [Installation](#installation-instructions), and have a `.bin` model file available.

### Examples

#### Single model, single input

Use when the model has exactly one input tensor.
```python
import numpy as np
from hbm_runtime import HB_HBMRuntime

# Load model
model = HB_HBMRuntime("/opt/hobot/model/x5/basic/resnet18_224x224_nv12.bin")

# Model and input names
model_name = model.model_names[0]
input_name = model.input_names[model_name][0]  # single-input model

# Input shape
input_shape = model.input_shapes[model_name][input_name]

# Build NumPy input
input_tensor = np.ones(input_shape, dtype=np.float32)

# Run inference
outputs = model.run(input_tensor)

# Output tensor
output_array = outputs[model_name]
print("Output:", output_array)
```
#### Single model, multiple inputs

Use when the model has more than one input tensor.
```python
import numpy as np
from hbm_runtime import HB_HBMRuntime

hb_dtype_map = {
    "U8": np.uint8,
    "S8": np.int8,
    "F32": np.float32,
    "F16": np.float16,
    "U16": np.uint16,
    "S16": np.int16,
    "S32": np.int32,
    "U32": np.uint32,
}

# Load model
model = HB_HBMRuntime("/opt/hobot/model/x5/basic/yolov5x_672x672_nv12.bin")

# Model name (single loaded model)
model_name = model.model_names[0]

# Input names, shapes, dtypes
input_names = model.input_names[model_name]
input_shapes = model.input_shapes[model_name]
input_dtypes = model.input_dtypes[model_name]

# Build input dict
input_tensors = {}
for name in input_names:
    shape = input_shapes[name]
    np_dtype = hb_dtype_map.get(input_dtypes[name].name, np.float32)  # fallback
    input_tensors[name] = np.ones(shape, dtype=np_dtype)

# Optional: priority and BPU cores
priority = {model_name: 5}
bpu_cores = {model_name: [0]}

model.set_scheduling_params(
    priority=priority,
    bpu_cores=bpu_cores
)

# Run inference
results = model.run(input_tensors)

# Outputs
for output_name, output_data in results[model_name].items():
    print(f"Output: {output_name}, shape={output_data.shape}")

```
### FAQ

| Question | Answer |
|------------------------|------------------------------------------------------------|
| How do I get model names? | Use `model.model_names`. |
| How do I check input shape/dtype? | Use `model.input_shapes` and `model.input_dtypes`. |
| How are BPU cores chosen? | Pass `bpu_cores`, e.g. `[0, 1, 2, 3]`, subject to hardware. |

For multi-input models, quantization metadata, and more, see [API reference](#modules-classes-and-functions-api-reference).

## Modules, classes, and functions (API reference)

The `hbm_runtime` module is a PyBind11 binding to Horizon BIN inference on top of `libdnn`. It provides model loading, I/O introspection, and `run()`, including multi-model loads, multi-input inference, per-model selection, BPU core binding, and priorities.

### Enumerations

#### hbDNNDataType

##### Tensor data types:
- Y: 1-bit unsigned
- S4：4-bit signed
- U4：4-bit unsigned
- S8：8-bit signed
- U8：8-bit unsigned
- NV12: 12-bit unsigned
- F16：16-bit float
- S16：16-bit signed
- U16：16-bit unsigned
- NV12_SEPARATE: 16-bit unsigned
- YUV444: 24-bit unsigned
- F32：32-bit float
- S32：32-bit signed
- U32：32-bit unsigned
- F64：64-bit float
- S64：64-bit signed
- U64：64-bit unsigned
- MAX: sentinel / reserved

##### Example
```python
from hbm_runtime import hbDNNDataType
print(hbDNNDataType.F32)  # hbDNNDataType.F32
```
#### hbDNNQuantiType

##### Quantization kinds:
- NONE: not quantized
- SCALE: linear scale + zero_point

##### Example
```python
from hbm_runtime import hbDNNQuantiType
print(hbDNNQuantiType.SCALE)  # hbDNNQuantiType.SCALE
```

### Classes

#### HB_HBMRuntime

Runtime class that loads one or more HBM files and exposes inference.

##### Constructors

- Signatures
    ```python
    HB_HBMRuntime(model_file: str)
    HB_HBMRuntime(model_files: List[str])
    ```
- Parameters

    | Name | Type | Description |
    |------------|--------------|--------------------------------------|
    | model_file | str | Path to an HBM model file |
    | model_files | List[str] | Paths to multiple HBM files (multi-model) |
- Returns

  The runtime instance.
- Example
    ```python
    from hbm_runtime import HB_HBMRuntime

    model = HB_HBMRuntime("model.bin")
    # Or load multiple models:
    model = HB_HBMRuntime(["model1.bin", "model2.bin"])
    ```

##### Properties
All properties below are read-only.
- version: str
  - Description:
    - Library version string.
  - Structure:
    - `str`
  - Example：
print("version:", HB_HBMRuntime.version)
- model_names: List[str]
  - Description:
    - Loaded model names.
  - Structure:
    - `List[str]`
  - Example：
    ```python
    print(model.model_names)
    # ->['model_1', 'model_2']
    ```
- model_count: int
  - Description:
    - Number of loaded models.
  - Structure:
    - `int`
  - Example：
    ```python
    print(model.model_count)
    # ->2
    ```
- model_descs: Dict[str, str]
  - Description:
    - Per-model description strings embedded in the model (from the compiler).
  - Structure:
    - `Dict[str, str]` — model name → description
  - Example：
    ```python
    # Print model descriptions
    print(model.model_descs)
    # ->{'yolov5x_672x672_nv12': 'Image classification model based on ResNet-18.'}
    ```

- hbm_descs: Dict[str, str]
  - Description:
    - Notes or metadata strings for each loaded HBM file path.
  - Structure:
    - `Dict[str, str]` — file path → comment string
  - Example：
    ```python
    # Print per-file HBM descriptions
    print(model.hbm_descs)
    # ->{'/opt/hobot/model/s100/basic/yolov5x_672x672_nv12.bin': 'xxx'}
    ```
- input_counts: Dict[str, int]
  - Description:
    - Number of input tensors per model.
  - Structure:
    - `Dict[str, int]` — model name → input count
  - Example：
    ```python
    print(model.input_counts)
    # ->{'yolov5x_672x672_nv12': 2}
    ```
- input_names: Dict[str, List[str]]
  - Description:
    - Input tensor names per model.
  - Structure:
    - Outer `Dict` keyed by model name; inner `List[str]` of input names
  - Example：
    ```python
    print(model.input_names)
    # ->{'yolov5x_672x672_nv12': ['data_y', 'data_uv']}
    ```
- input_descs: Dict[str, Dict[str, str]]
  - Description:
    - Optional per-input descriptions.
  - Structure:
    - Outer key: model name; inner: input name → description
  - Example：
    ```python
    print(model.input_descs)
    # ->{'yolov5x_672x672_nv12': {'data_uv': 'xxx', 'data_y': 'xxx'}}
    ```
- input_shapes: Dict[str, Dict[str, List[int]]]
  - Description:
    - Input tensor shapes per model.
  - Structure:
    - Outer key: model name; inner: input name → shape
  - Example：
    ```python
    model.input_shapes
    # ->{'yolov5x_672x672_nv12': {'data_uv': [1, 336, 336, 2], 'data_y': [1, 672, 672, 1]}}
    ```
- input_dtypes: Dict[str, Dict[str, hbDNNDataType]]
  - Description:
    - Input tensor dtypes per model.
  - Structure:
    - Outer key: model name; inner: input name → `hbDNNDataType`
  - Example：
    ```python
    print(model.input_dtypes)
    # ->{'yolov5x_672x672_nv12': {'data_uv': <hbDNNDataType.U8: 3>, 'data_y': <hbDNNDataType.U8: 3>}}
    ```

- input_quants: Dict[str, Dict[str, QuantParams]]
  - Description:
    - Quantization parameters for each input tensor (for quantized models / preprocessing).
  - Structure:
    - Outer key: model name; inner: input name → `QuantParams`
    - `QuantParams` fields:
      - `scale: np.ndarray`
      - `zero_point: np.ndarray`
      - `quant_type: hbDNNQuantiType`
      - `axis: int` — quantization axis when per-channel
  - Example：
    ```python
    quanti_info = model.input_quants
    for model, inputs in quanti_info.items():
        print(f"{model}:")
        for name, info in inputs.items():
            print(f"  {name}:")
            print(f"    quant_type: {info.quant_type.name}")
            print(f"    quantize_axis: {info.axis}")
            print(f"    scale_data: {info.scale.tolist()}")
            print(f"    zero_point_data: {info.zero_point.tolist()}")
    ```
- input_strides: Dict[str, Dict[str, List[int]]]
  - Description:
    - Per-input tensor strides.
  - Structure:
    - Outer key: model name; inner: input name → stride list
  - Example：
    ```python
    print(model.input_strides)
    # ->{'yolov5x_672x672_nv12': {'data_uv': [-1, -1, 2, 1], 'data_y': [-1, -1, 1, 1]}}
    ```
    Note: See stride details in the [OE documentation](https://developer.d-robotics.cc/api/v1/fileData/horizon_j5_open_explorer_cn_doc/runtime/source/bpu_sdk_api/source/bpu_sdk_api_doc.html?highlight=stride#hbdnntensorproperties) for `hbDNNTensorProperties`.
- output_counts: Dict[str, int]
  - Description:
    - Number of output tensors per model.
  - Structure:
    - `Dict[str, int]` — model name → output count
  - Example：
    ```python
    print(model.output_counts)
    # ->{'yolov5x_672x672_nv12': 3}
    ```
- output_names: Dict[str, List[str]]
  - Description:
    - Output tensor names per model.
  - Structure:
    - Outer key: model name; inner: `List[str]` of output names
  - Example：
    ```python
    print(model.output_names)
    # ->{'yolov5x_672x672_nv12': ['output', '1310', '1312']}
    ```
- output_descs: Dict[str, Dict[str, str]]
  - Description:
    - Optional per-output descriptions.
  - Structure:
    - Outer key: model name; inner: output name → description
  - Example：
    ```python
    print(model.output_descs)
    # ->{'yolov5x_672x672_nv12': {'1310': 'xxx', '1312': 'xxx', 'output': 'xxx'}}
    ```
- output_shapes: Dict[str, Dict[str, List[int]]]
  - Description:
    - Output tensor shapes per model.
  - Structure:
    - Outer key: model name; inner: output name → shape
  - Example：
    ```python
    print(model.output_shapes)
    # ->{'yolov5x_672x672_nv12': {'1310': [1, 42, 42, 255], '1312': [1, 21, 21, 255], 'output': [1, 84, 84, 255]}}
    ```
- output_dtypes: Dict[str, Dict[str, List[int]]]
  - Description:
    - Output tensor dtypes per model.
  - Structure:
    - Outer key: model name; inner: output name → `hbDNNDataType`
  - Example：
    ```python
    print(model.output_dtypes)
    # ->{'yolov5x_672x672_nv12': {'1310': <hbDNNDataType.S32: 8>, '1312': <hbDNNDataType.S32: 8>, 'output': <hbDNNDataType.S32: 8>}}
    ```
- output_quants: Dict[str, Dict[str, QuantParams]]
  - Description:
    - Quantization metadata for outputs (post-processing, dequantization, etc.).
  - Structure:
    - Outer key: model name; inner: output name → `QuantParams`
    - `QuantParams` fields: same as for inputs (`scale`, `zero_point`, `quant_type`, `axis`)
  - Example：
    ```python
    output_quanti = model.output_quants
    for model, outputs in output_quanti.items():
        print(f"{model}:")
        for name, info in outputs.items():
            print(f"  {name}:")
            print(f"    quant_type: {info.quant_type.name}")
            print(f"    quantize_axis: {info.axis}")
            print(f"    scale_data: {info.scale}")
            print(f"    zero_point_data: {info.zero_point}")
    ```
- output_strides: Dict[str, Dict[str, List[int]]]
  - Description:
    - Per-output tensor strides.
  - Structure:
    - Outer key: model name; inner: output name → stride list
  - Example：
    ```python
    print(model.output_strides)
    # ->{'yolov5x_672x672_nv12': {'1310': [1806336, 43008, 1024, 4], '1312': [451584, 21504, 1024, 4], 'output': [7225344, 86016, 1024, 4]}}
    ```
    Note: See stride details in the [OE documentation](https://developer.d-robotics.cc/api/v1/fileData/horizon_j5_open_explorer_cn_doc/runtime/source/bpu_sdk_api/source/bpu_sdk_api_doc.html?highlight=stride#hbdnntensorproperties) for `hbDNNTensorProperties`.

- sched_params: Dict[str, SchedParam]
  - Description:
    Current scheduling parameters for all loaded models:
    - `priority`
    - `customId`
    - `bpu_cores`
    - `deviceId`
    These control how models execute on hardware and matter most for multi-model or multi-core setups.
  - Structure:
    - Outer key: model name; value: `SchedParam` with `priority`, `customId`, `bpu_cores`, `deviceId`
      ```python
      {
          "model_name": SchedParam(
              priority: int,
              customId: int,
              bpu_cores: List[int],
              deviceId: int
          )
      }
      ```
  - Example：
    ```python
    params = model.sched_params
    for name, sched in params.items():
        print(f"Model: {name}")
        print(f"  priority: {sched.priority}")
        print(f"  customId: {sched.customId}")
        print(f"  bpu_cores: {sched.bpu_cores}")
        print(f"  deviceId: {sched.deviceId}")
    # ->
    # Model: yolo12s_detect_nashe_640x640_nv12
    #   priority: 10
    #   customId: 0
    #   bpu_cores: [0]
    #  deviceId: 0
    # Model: yolov5nu_detect_nashe_640x640_nv12
    #   priority: 66
    #   customId: 0
    #   bpu_cores: [-1]
    #   deviceId: 0
    ```
    Note: `bpu_cores` value `-1` means the scheduler auto-assigns cores.
##### Inference methods
- run(input_tensor, **kwargs)
  - Signature
    ```python
    run(input_tensor: np.ndarray, **kwargs) -> Dict[str, Dict[str, np.ndarray]]
    ```
  - Description
    Single model, single input. Pass one NumPy array for the sole input. If only one model is loaded, `model_name` may be omitted.
  - Parameters

    | Name | Type | Description |
    |--------------|---------------|--------------------------------------------------------------------------------------------------|
    | input_tensor | np.ndarray | Input tensor; shape must match the model input. |
    | kwargs | optional | `model_name` (`str`): required when multiple models are loaded. |

  - Returns
    - Type: Dict[str, Dict[str, np.ndarray]]  
    - Outer dictionary key: model name  
    - Inner dictionary key: output tensor name  
    - Value: corresponding NumPy output array  
  - Example: see Quick start — single model, single input.
- run(input_tensors: Dict[str, np.ndarray], **kwargs)
  - Signature
    ```python
    run(input_tensors: Dict[str, np.ndarray], **kwargs) -> Dict[str, Dict[str, np.ndarray]]
    ```
  - Description
    Single model, multiple inputs. Keys are input tensor names as defined by the model. If only one model is loaded, `model_name` may be omitted.
  - Parameters

    | Name | Type | Description |
    |---------------|---------------------------|------------------------------------------------------------------------------------------------|
    | input_tensors | Dict[str, np.ndarray] | Input name → NumPy array. |
    | kwargs | optional | `model_name` (`str`): required when multiple models are loaded. |

  - Returns
    Same as above.
  - Example: see Quick start — single model, multiple inputs.
- run(multi_input_tensors: Dict[str, Dict[str, np.ndarray]], **kwargs)
  - Signature
    ```python
    run(multi_input_tensors: Dict[str, Dict[str, np.ndarray]], **kwargs) -> Dict[str, Dict[str, np.ndarray]]
    ```
  - Description
    Multiple models at once. Outer keys are model names; inner dict maps input names to arrays. You can omit `model_name` to run every model listed in `multi_input_tensors`, or pass `model_name` to run a subset.
  - Parameters

        | Name | Type | Description |
        |-------------------|-----------------------------------|------|
        | multi_input_tensors | Dict[str, Dict[str, np.ndarray]] | Model name → (input name → tensor). Supports multiple models, each with one or more inputs. |
        | kwargs | optional | `model_name` (`str`): optional filter for which model(s) to run. |

  - Returns

    Same as above.
  - Example
    ```python
    import numpy as np
    from hbm_runtime import HB_HBMRuntime

    # Map hbDNNDataType to NumPy
    hb_dtype_map = {
        "F32": np.float32,
        "F16": np.float16,
        "S8": np.int8,
        "U8": np.uint8,
        "S16": np.int16,
        "U16": np.uint16,
        "S32": np.int32,
        "U32": np.uint32,
        "S64": np.int64,
        "U64": np.uint64,
        "BOOL8": np.bool_,
    }

    # Load multiple models
    model_files = ["/opt/hobot/model/s100/basic/lanenet256x512.bin",
        "/opt/hobot/model/s100/basic/yolov5x_672x672_nv12.bin"]

    model = HB_HBMRuntime(model_files)

    print("Loaded models:", model.model_names)

    # Build inputs per model
    multi_input_tensors = {}

    for model_name in model.model_names:
        model_inputs = {}

        for input_name in model.input_names[model_name]:
            shape = model.input_shapes[model_name][input_name]
            dtype_enum = model.input_dtypes[model_name][input_name]

            np_dtype = hb_dtype_map.get(dtype_enum.name, np.float32)

            model_inputs[input_name] = np.ones(shape, dtype=np_dtype)

        multi_input_tensors[model_name] = model_inputs

    # Optional: priority and BPU cores
    priority = {name: 5 for name in model.model_names}
    bpu_cores = {name: [0] for name in model.model_names}

    model.set_scheduling_params(
        priority=priority,
        bpu_cores=bpu_cores
    )

    # Run inference
    results = model.run(multi_input_tensors)

    # Outputs
    for model_name, outputs in results.items():
        print(f"\nModel: {model_name}")
        for output_name, output_tensor in outputs.items():
            print(f"  Output: {output_name}, shape={output_tensor.shape}, dtype={output_tensor.dtype}")
    ```
- `kwargs` details
  - model_name
    - Type: `str` (model name)
    - Selects which model to run; must be one of the loaded models. For the first two `run` overloads, omit when only one model is loaded; required when multiple models exist. For the third overload, omit to run all models in `multi_input_tensors`, or set to run one model only.
    - Example：
        ```python
        outputs = model.run(input_tensor, model_name="resnet18")
        ```
##### Scheduling
- set_scheduling_params
  - Signature
    ```python
    def set_scheduling_params(
        priority: Optional[Dict[str, int]] = None,
        bpu_cores: Optional[Dict[str, List[int]]] = None,
        custom_id: Optional[Dict[str, int]] = None,
        device_id: Optional[Dict[str, int]] = None
    ) -> None
    ```
  - Parameters

    | Name      | Type                             | Description                                                                 |
    |-------------|----------------------------------|----------------------------------------------------------------------|
    | priority    | Optional Dict[str, int]        | Per-model priority (often 0–255; higher = higher priority)       |
    | bpu_cores   | Optional Dict[str, List[int]]  | BPU core indices; default/auto depends on hardware |
    | custom_id   | Optional Dict[str, int]        | Custom ordering (e.g. timestamp, frame id); smaller value = higher priority. Precedence: `priority` > `customId`.|
    | device_id   | Optional Dict[str, int]        | Device id per model                                             |

  - Returns
    `None`
  - Example：
    ```python
    # Set scheduling
    model.set_scheduling_params(
        priority={"model1": 200, "model2": 100},
        bpu_cores={"model1": [0, 1], "model2": [0]}
    )

    # Verify scheduling
    params = model.sched_params
    print(params["model1"].priority)   # -> 200
    print(params["model1"].bpu_cores)  # -> [0, 1]
    ```
- Exceptions
  - `ValueError` if shape/dtype do not match the model.
  - Non-contiguous inputs are copied to C-contiguous buffers.
  - Input shapes must match `input_shapes` before inference.
#### `QuantParams`
  Quantization parameters for a tensor.
##### Fields
- scale: np.ndarray — scale factors
- zero_point: np.ndarray — zero points
- quant_type: hbDNNQuantiType
- axis: int — quantization axis (e.g. per-channel)
##### Example:
    ```python
    # Output quantization for one tensor
    tensor_qparams = model.output_quants[model_name][output_name]
    print("scale:", tensor_qparams.scale)
    print("zero_point:", tensor_qparams.zero_point)
    print("type:", tensor_qparams.quant_type)
    print("axis:", tensor_qparams.axis)
    ```

#### `SchedParam`
  Scheduling parameters (priority, core binding, etc.).
##### Fields
- priority: Dict[str, int]
 Per-model priority (higher value = higher priority, typically 0–255).
- customId: Dict[str, int]
 Custom ordering (e.g. timestamp, frame id); smaller value = higher priority. Precedence: `priority` > `customId`.
- bpu_cores: Dict[str, List[int]]
 BPU core indices per model, e.g. `[0]` or `[0, 1]`.
- deviceId: Dict[str, int]
 Device id per model.
##### Example:
  ```python
  from hbm_runtime import HB_HBMRuntime, SchedParam

  # Build a SchedParam
  sched = SchedParam()
  sched.priority = {"modelA": 8}
  sched.customId = {"modelA": 1001}
  sched.bpu_cores = {"modelA": [0, 1]}
  sched.deviceId = {"modelA": 0}

  # Apply scheduling to runtime
  model.set_scheduling_params(priority=sched.priority,
                              custom_id=sched.customId,
                              bpu_cores=sched.bpu_cores,
                              device_id=sched.deviceId)
  ```
