---
sidebar_position: 1
---

# Environment Installation

```mdx-code-block
import DocScope from '@site/src/components/DocScope';
```

This chapter mainly introduces the deployment method for the complete development environment of the D-Robotics algorithm toolchain.

<DocScope versions=">= 3.0.0" products="RDK-X3">

## RDK-X3

### Deliverable Usage Instructions{#deliverables_instructions}

Before deploying the environment for the algorithm toolchain, please download the **Embedded Application Development Sample Delivery Package** provided by D-Robotics into your Linux development machine environment.

Download the Embedded Application Development Sample Delivery Package:

```bash
  // Example version is V2.6.6

  wget https://d-robotics-aitoolchain.oss-cn-beijing.aliyuncs.com/oe_x3/2.6.6/horizon_xj3_open_explorer_v2.6.6_py38_20240717.tar.gz

  // Download more model conversion examples as needed!
  //wget -c ftp://oeftp@sdk.d-robotics.cc/RDK/rdk-x3-ultra/horizon_model_convert_sample.tar.gz --ftp-password=Oeftp~123$%
```

#### Sample Package Source Directory Structure Description

Extract the algorithm toolchain SDK source package:

```bash
  // Example version is V2.6.6

  tar -xvf horizon_xj3_open_explorer_v2.6.6_py38_20240717.tar.gz
```

The extracted directory structure is as follows:

```
├── bsp
│  ├── tools
│  └── resolve.sh
└── ddk
   ├── package  # This directory contains some basic libraries and components for running the deliverables
   │   ├── board
   │   │   ├── hrt_tools  # Contains source code and executables for hrt_model_exec and hrt_bin_dump
   │   │   └── install.sh # One-click installation script to install hrt tools to a specified development board
   │   └── host
   │       ├── ai_toolchain
   │       ├── host_package
   │       ├── hrt_tools
   │       ├── install.sh
   │       └── resolve.sh  # Used to download dependencies like cross-compilation tools, torch, etc.
   └── samples
       ├── ai_benchmark  # Provides evaluation examples for common classification, detection, and segmentation models, including performance evaluation and accuracy evaluation
       ├── ai_toolchain # Provides a series of model algorithm related examples
       │   ├── horizon_model_convert_sample
       │   ├── horizon_model_train_sample
       │   ├── horizon_runtime_sample
       │   └── model_zoo
       └── model_zoo -> ai_toolchain/model_zoo
```

### Development Machine Deployment{#machine_deploy}

For the development machine environment deployment, D-Robotics supports using Docker deployment.

#### Development Machine Preparation

To use the algorithm toolchain smoothly, D-Robotics recommends that the development machine you choose meets the following requirements:

| Hardware/OS | Requirements |
|---------------|------|
| CPU | CPU I3 or above, or equivalent E3/E5 processor |
| Memory | 16GB or above |
| GPU (Optional) | CUDA 11.6, Driver version Linux: >= 510.39.01* (Recommended driver version Linux: 515.76)<br/>Compatible graphics cards include but are not limited to:<br/>1) GeForce RTX 3090<br/>2) GeForce RTX 2080 Ti<br/>3) NVIDIA TITAN V<br/>4) Tesla V100S-PCIE-32GB<br/>5) A100 |
| OS | Ubuntu 20.04 |

For more information on CUDA and graphics card compatibility, please refer to [**NVIDIA Official Website Information**](https://docs.nvidia.com/deploy/cuda-compatibility/).

#### Using the Docker Environment

To help you quickly use the algorithm toolchain, D-Robotics provides a Docker image containing a complete development environment, greatly simplifying the deployment process.

Before reading this section, we assume that the Docker base environment is already pre-installed on your development machine.
The Docker base environment information required by D-Robotics is as follows:

- Docker (19.03 or higher, version 19.03 recommended), see [**Docker Installation Guide**](https://docs.docker.com/install/).
- NVIDIA Container Toolkit (1.13.1-1.13.5, version 1.13.5 recommended), see [**NVIDIA Container Toolkit Installation Guide**](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html).

After installing the Docker environment, you need to add non-root users to the Docker user group. Refer to the following command:

```bash
  sudo groupadd docker
  sudo gpasswd -a ${USER} docker
  sudo service docker restart
```

The addresses for the Docker images needed in this section are as follows:

- [**D-Robotics Docker Hub GPU Docker**](https://hub.docker.com/r/openexplorer/ai_toolchain_ubuntu_20_x3j5_gpu)

The image file naming format is:

- GPU version docker: ``openexplorer/ai_toolchain_ubuntu_20_x3j5_gpu:{version}``

:::tip Tip

  When executing commands, replace ``{version}`` with the **latest version Docker image** you obtained, for example: The latest version currently in [**D-Robotics docker hub GPU Docker**](https://hub.docker.com/r/openexplorer/ai_toolchain_ubuntu_20_x3j5_gpu) is ``openexplorer/ai_toolchain_ubuntu_20_x3j5_gpu:v1.0.0``.

  For the local Docker image package version, please contact the D-Robotics technical support team.

  The development machine does not necessarily need to have a GPU card; generally, using a CPU development machine with the Docker image loaded is sufficient for model conversion!
:::

Each image file needs to be pulled before its first use.

- The command to pull the image is:

  ```bash
    docker pull openexplorer/ai_toolchain_ubuntu_20_x3j5_gpu:v1.0.0
  ```
Then execute the following command to run the Docker container.

- For a CPU development machine Docker container, execute the following command:

  ```bash
    // Command to run the docker image

    export version=v1.0.0

    export ai_toolchain_package_path=/home/users/xxx/ai_toolchain_package

    export dataset_path=/home/users/xxx/data/

    docker run -it --rm \
      -v "$ai_toolchain_package_path":/open_explorer \
      -v "$dataset_path":/data \
      openexplorer/ai_toolchain_ubuntu_20_x3j5_gpu:"${version}"
  ```
- For a GPU development machine Docker container, execute the following command:

  ```bash
    // Command to run the docker image

    export version=v1.0.0

    export ai_toolchain_package_path=/home/users/xxx/ai_toolchain_package

    export dataset_path=/home/users/xxx/data/

    docker run -it --rm \
      --gpus all \ # Add this flag when starting the container to enable access to GPU resources
      --shm-size=15g \ # Modify shared memory size
      -v "$ai_toolchain_package_path":/open_explorer \
      -v "$dataset_path":/data \
      openexplorer/ai_toolchain_ubuntu_20_x3j5_gpu:"${version}"
  ```
:::info Note

  When executing the above commands:

  - ``dataset_path`` is the dataset file directory. If this directory does not exist, it will cause loading issues; you need to create it before running the command.

  - Public datasets can be downloaded from the following links:

      VOC: http://host.robots.ox.ac.uk/pascal/VOC/ (use VOC2012 version)

      COCO: https://cocodataset.org/#download

      ImageNet: https://www.image-net.org/download.php

      Cityscapes: https://github.com/mcordts/cityscapesScripts

      CIFAR-10: http://www.cs.toronto.edu/~kriz/cifar.html

      FlyingChairs: https://lmb.informatik.uni-freiburg.de/resources/datasets/FlyingChairs.en.html

      KITTI3D: https://www.cvlibs.net/datasets/kitti/eval_object.php?obj_benchmark=3d

      CULane: https://xingangpan.github.io/projects/CULane.html

      nuScenes: https://www.nuscenes.org/nuscenes
:::
At this point, you have successfully entered the complete algorithm toolchain development environment via the Docker image.
You can type the ``hb_mapper --help`` command to verify that you can get the help information normally:

```bash
  [root@d67382e74eea open_explorer]# hb_mapper --help
  Usage: hb_mapper [OPTIONS] COMMAND [ARGS]...

    hb_mapper is an offline model transform tool provided by horizon.

  Options:
    --version  Show the version and exit.
    --help     Show this message and exit.

  Commands:
    checker    check whether the model meet the requirements.
    infer      inference and dump output feature as float vector.
    makertbin  transform caffe model to quantization model, generate runtime...
```
If the hb_mapper tool outputs logs normally, it means the environment has been successfully installed and deployed. Please proceed to the **Development Board Deployment** section to install the environment on the development board.

### Development Board Deployment

For development board deployment, you need to update the development board image to the latest version according to the flashing instructions. Please refer to the [**Install OS**](../../../../current/01_Quick_start/install_os/rdk_x3/01_system_burn.md) section for the upgrade method. After the upgrade is complete, copy the relevant supplementary files to the development board.

#### Supplementary File Preparation

Some supplementary tools of the algorithm toolchain are not included in the system image. These tools are placed in the ``horizon_xj3_open_explorer_vX.X.X-XXXXX/ddk/package/`` installation package.
Navigate to ``horizon_xj3_open_explorer_vX.X.X-XXXXX/ddk/package/board/`` and execute the install script.
Execute the command as follows:

```bash
  // If using the RDK X3 development board, execute the command
  bash install.sh ${board_ip}
```
:::info Note

  Here, ``${board_ip}`` is the IP address you set for the development board. Please ensure this IP is accessible from the development machine.
  After successful installation, restart the development board. Execute ``hrt_model_exec`` on the development board to verify if the installation was successful.
:::

</DocScope>

<DocScope versions=">= 3.5.0" products="RDK-X5">

## RDK-X5
### <span id="ai_toolchain_package"/>Deliverable Usage Instructions

:::tip

This chapter only demonstrates how to use the algorithm toolchain. The latest version of the toolchain installation package and offline documentation can be obtained by visiting [**D-Robotics X5 Algorithm Toolchain Version Release**](https://developer.d-robotics.cc/forumDetail/251934919646096384).

:::

Before deploying the environment for the algorithm toolchain, please download the **Embedded Application Development Sample Delivery Package** provided by D-Robotics into your Linux development machine environment.

Download the Embedded Application Development Sample Delivery Package:

```bash
  // Example version is V1.2.8

  wwget https://d-robotics-aitoolchain.oss-cn-beijing.aliyuncs.com/oe_x5/1.2.8/horizon_x5_open_explorer_v1.2.8-py310_20240926.tar.gz


  // Download more model conversion examples as needed!
  //wget -c ftp://oeftp@sdk.d-robotics.cc/model_convert_sample/horizon_model_convert_sample.tar.xz --ftp-password=Oeftp~123$%
```

#### Sample Package Source Directory Structure Description

Extract the algorithm toolchain SDK source package:

```bash
  // Example version is V1.2.8

  tar -xvf horizon_x5_open_explorer_v1.2.8-py310_20240926.tar.gz
```

The extracted directory structure is as follows:

```
├── package  # This directory contains some basic libraries and components for running the deliverables
│   ├── board
│   │   ├── hrt_tools  # Contains source code and executables for hrt_model_exec and hrt_bin_dump
│   │   └── install.sh # One-click installation script to install hrt tools to a specified development board
│   └── host
│       ├── ai_toolchain
│       ├── host_package
│       ├── hrt_tools
│       ├── install.sh
│       └── resolve.sh  # Used to download dependencies like cross-compilation tools, torch, etc.
├── README-CN
├── README-EN
├── resolve_all.sh # One-click download of all downloadable dependencies within the OE package
├── run_docker.sh # Docker image startup script
└── samples
    ├── ai_benchmark  # Provides evaluation examples for common classification, detection, and segmentation models, including performance evaluation and accuracy evaluation
    ├── ai_toolchain # Provides a series of model algorithm related examples
    │   ├── horizon_model_convert_sample
    │   ├── horizon_model_train_sample
    │   ├── horizon_runtime_sample
    │   └── model_zoo
    └── model_zoo -> ai_toolchain/model_zoo
```

### Development Machine Deployment

For the development machine environment deployment, the X5 algorithm toolchain supports using Docker deployment.

#### Development Machine Preparation

To use the algorithm toolchain smoothly, the X5 algorithm toolchain recommends that the development machine you choose meets the following requirements:

| Hardware/OS | Requirements |
|---------------|------|
| CPU | CPU I3 or above, or equivalent E3/E5 processor |
| Memory | 16GB or above |
| GPU (Optional) | CUDA 11.6, Driver version Linux: >= 510.39.01*<br/>Compatible graphics cards include but are not limited to:<br/>1) GeForce RTX 3090<br/>2) GeForce RTX 2080 Ti<br/>3) NVIDIA TITAN V<br/>4) Tesla V100S-PCIE-32GB <br/>5) A100 |
| OS | Ubuntu 20.04 |

For more information on CUDA and graphics card compatibility, please refer to [**NVIDIA Official Website Information**](https://docs.nvidia.com/deploy/cuda-compatibility/).

#### Using the Docker Environment

To help you quickly use the algorithm toolchain, the X5 algorithm toolchain provides a Docker image containing a complete development environment, greatly simplifying the deployment process.

Before reading this section, we assume that the Docker base environment is already pre-installed on your development machine.
The Docker base environment information required by the X5 algorithm toolchain is as follows:

- Docker (19.03 or higher, version 19.03 recommended), see [**Docker Installation Guide**](https://docs.docker.com/install/).
- NVIDIA Container Toolkit (1.13.1-1.13.5, version 1.13.5 recommended), see [**NVIDIA Container Toolkit Installation Guide**](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html).

After installing the Docker environment, you need to add non-root users to the Docker user group. Refer to the following command:

```bash
  sudo groupadd docker
  sudo gpasswd -a ${USER} docker
  sudo service docker restart
```

The addresses for the Docker images needed in this section are as follows:

- [**X5 Algorithm Toolchain Docker Hub CPU Docker**](https://hub.docker.com/r/openexplorer/ai_toolchain_ubuntu_20_x5_cpu)
- [**X5 Algorithm Toolchain Docker Hub GPU Docker**](https://hub.docker.com/r/openexplorer/ai_toolchain_ubuntu_20_x5_gpu)

The image file naming format is:

- CPU version docker: ``openexplorer/ai_toolchain_ubuntu_20_x5_cpu:{version}``
- GPU version docker: ``openexplorer/ai_toolchain_ubuntu_20_x5_gpu:{version}``


**Tips:**
>1. When executing commands, replace ``{version}`` with the **version information** you obtained from the **``X5 SDK Delivery Package's ai_toolchain_package``** directory.
>2. For the local Docker image package version, please contact the technical support team.
>3. The development machine does not necessarily need to have a GPU card; generally, using a CPU development machine with the Docker image loaded is sufficient for model conversion!

Each image file needs to be pulled before its first use.

- The command to pull the image is:

  ```bash
    docker pull openexplorer/ai_toolchain_ubuntu_20_x5_cpu:v1.2.8
  ```
Then execute the following command to run the Docker container.

- For a CPU development machine Docker container, execute the following command:

  ```bash
    // Command to run the docker image

    export version=v1.2.8

    export ai_toolchain_package_path=/home/users/xxx/ai_toolchain_package

    export dataset_path=/home/users/xxx/data/

    docker run -it --rm \
      -v "$ai_toolchain_package_path":/open_explorer \
      -v "$dataset_path":/data \
      openexplorer/ai_toolchain_ubuntu_20_x5_cpu:"${version}"
  ```
- For a GPU development machine Docker container, execute the following command:

  ```bash
    // Command to run the docker image

    export version=v1.2.8

    export ai_toolchain_package_path=/home/users/xxx/ai_toolchain_package

    export dataset_path=/home/users/xxx/data/

    docker run -it --rm \
      --gpus all \ # Add this flag when starting the container to enable access to GPU resources
      --shm-size=15g \ # Modify shared memory size
      -v "$ai_toolchain_package_path":/open_explorer \
      -v "$dataset_path":/data \
      openexplorer/ai_toolchain_ubuntu_20_x5_gpu:"${version}"
  ```

**Tips:**

- ``dataset_path`` is the dataset file directory. If this directory does not exist, it will cause loading issues; you need to create it before running the command.

- Public datasets can be downloaded from the following links:

  [**VOC (use VOC2012 version):**](http://host.robots.ox.ac.uk/pascal/VOC/)

  [**COCO:**](https://cocodataset.org/#download)

  [**ImageNet:**](https://www.image-net.org/download.php)

  [**Cityscapes:**](https://github.com/mcordts/cityscapesScripts)

  [**CIFAR-10:**](http://www.cs.toronto.edu/~kriz/cifar.html)

  [**FlyingChairs:**](https://lmb.informatik.uni-freiburg.de/resources/datasets/FlyingChairs.en.html)

  [**KITTI3D:**](https://www.cvlibs.net/datasets/kitti/eval_object.php?obj_benchmark=3d)

  [**CULane:**](https://xingangpan.github.io/projects/CULane.html)

  [**nuScenes:**](https://www.nuscenes.org/nuscenes)


At this point, you have successfully entered the complete algorithm toolchain development environment via the Docker image.
You can type the ``hb_mapper --help`` command to verify that you can get the help information normally:

```bash
  [root@d67382e74eea open_explorer]# hb_mapper --help
  Usage: hb_mapper [OPTIONS] COMMAND [ARGS]...

    hb_mapper is an offline model transform tool provided by horizon.

  Options:
    --version  Show the version and exit.
    --help     Show this message and exit.

  Commands:
    checker    check whether the model meet the requirements.
    infer      inference and dump output feature as float vector.
    makertbin  transform caffe model to quantization model, generate runtime...
```
If the hb_mapper tool outputs logs normally, it means the environment has been successfully installed and deployed. Please proceed to the **Development Board Deployment** section to install the environment on the development board.

### <span id="board_env_install"/>Development Board Deployment

For development board deployment, you need to update the development board image to the latest version according to the flashing instructions. Please refer to the [**Install OS**](../../../../current/01_Quick_start/system-burn/burn-sd-card.md) section for the upgrade method. After the upgrade is complete, copy the relevant supplementary files to the development board.

Some supplementary tools of the algorithm toolchain are not included in the system image. These tools are placed in the ``horizon_x5_open_explorer_vX.X.X-XXXXXXX/package/`` installation package.
Navigate to ``horizon_x5_open_explorer_vX.X.X-XXXXXXX/package/package/board`` and execute the install script.
Execute the command as follows:

```bash
  bash install.sh ${board_ip}
```
**Note:**
- ``${board_ip}`` is the IP address you set for the development board. Please ensure this IP is accessible from the development machine.
- After successful installation, restart the development board. Execute ``hrt_model_exec`` on the development board to verify if the installation was successful.

</DocScope>

## Version Management Tool Usage Instructions

This chapter mainly introduces the usage instructions for the ddk_vcs version management tool, which helps developers understand the version status of algorithm toolchain dependency packages in the current development machine environment.

:::tip Tip
  The version management tool is mainly used for DEBUG purposes when errors occur during model PTQ conversion using the Docker environment. If the model conversion function works normally, you can skip this chapter.
:::

The version management tool includes the following functions:

- ddk_vcs list;
- ddk_vcs install;
- ddk_vcs uninstall;
- ddk_vcs patch;
- ddk_vcs show;

### ddk_vcs list

ddk_vcs list is used to list installed software packages.

When executing this command without parameters, the result will display information about currently installed modules. Usage example:

```bash

  [horizon@gpu-dev067 ai_toolchain]$ ddk_vcs list
  Host package version: v2.0.3
  The following packages versions
  Platform        Package         Version MD5
  --------------- --------------- ------- -------------
  aarch_64        appsdk          032419  093e13b44e
  aarch_64        dnn             1.8.1g  aff0f6f4de
  x86_64_gcc5.4.0 dnn_x86         1.8.1g  e8e6bf9ed5
  x86             horizon-nn      0.13.3  origin:0.13.3
  x86             horizon-nn-gpu  0.13.3  origin:N/A
  x86             horizon-tc-ui   1.6.4   origin:1.6.4
  x86             hbdk            3.28.3  origin:3.28.3
```
:::info Note
  The origin information in the last few lines will be updated to the current environment version after each installation using the install script within the toolchain SDK package.
  It will not change when subsequently installed using ddk_vcs; only the Version value will change.
:::

Using the ``-p`` parameter will display the version status of modules currently available for installation, which can be installed using ``ddk_vcs install``. Usage example:

```bash

  [horizon@gpu-dev004]$ ddk_vcs list -p
  Host package version: 1.5.1
  The following packages versions
  Platform        Local Package                 Version MD5
  --------------- ----------- ------- ----------
  aarch_64        appsdk_1.9.0.tar.gz           1.9.0   bf01140c9d
  aarch_64        bpu_predict_1.10.2.tar.gz     1.10.2  5b6e5dd6c5
  aarch_64        dnn_1.1.2a.tar.gz             1.1.2a  fdb5729f4f
  x86_64_gcc5.4.0 bpu_predict_1.10.2.tar.gz     1.10.2  4dbdd980a7
  x86_64_gcc5.4.0 dnn_x86_1.1.2a.tar.gz         1.1.2a  5bf5fcd4fe
```

### ddk_vcs install

ddk_vcs install is used to install packages.
Users can directly install the corresponding module tar package using ``ddk_vcs install``. The platform needs to be specified during installation. Usage example:

```bash

  [horizon@gpu-dev004]$ ddk_vcs install bpu_predict_1.10.2.tar.gz -p aarch_64
  bpu_predict installed successfully, version: 1.10.2, platform: aarch_64
  [horizon@gpu-dev067 ai_toolchain]$ ddk_vcs install hbdk-3.28.3-py3-none-linux_x86_64.whl  horizon_nn-0.13.3-py3-none-any.whl
  hbdk-3.28.3-py3-none-linux_x86_64.whl installed successfully
  horizon_nn-0.13.3-py3-none-any.whl installed successfully
```
After using ``ddk_vcs list -p``, users can get the version information of each module package in their current host package.
Then, using ``ddk_vcs install`` makes it easy to switch between versions. Usage example:

```bash

  [horizon@gpu-dev004]$ ddk_vcs install bpu_predict==1.7.2  --platform aarch_64
  bpu_predict installed successfully, version: 1.7.2, platform: aarch_64
```
If the corresponding version is not available locally, you can specify the package location for installation.

### ddk_vcs uninstall

ddk_vcs uninstall is used to uninstall a specified module. Usage example:

```bash

  [horizon@gpu-dev004]$ ddk_vcs uninstall bpu_predict --platform aarch_64
  Start to uninstall modules, platform: aarch_64
  bpu_predict uninstalled successfully, version: 1.10.2, platform: aarch_64
```
### ddk_vcs patch

Using ``ddk_vcs patch ddk_patch.tar.gz`` allows you to install a pre-made patch package. Usage example:

```bash

  [horizon@gpu-dev004]$ ddk_vcs patch ddk_patch.tar.gz
  bpu_predict installed successfully, version: 1.7.2_patch0, platform: aarch64
```
### ddk_vcs show

ddk_vcs show is used to display information about installed software packages. Using ``ddk_vcs show [module_name]`` displays information for the corresponding module. Usage example:

```bash

  [horizon@gpu-dev004]$ ddk_vcs show bpu_predict
  Host package version 1.5.1
  The following packages versions
  Platform        Package     Version       MD5
  --------------- ----------- ------------- ----------
  aarch_64        bpu_predict 1.10.2        5b6e5dd6c5
  x86_64_gcc5.4.0 bpu_predict 1.10.2_patch1 d4f8e37921
```
If there are dependencies with the same name within two architectures, you can use ``-p/--platform`` to specify the architecture name for filtering. Usage example:

```bash

  [horizon@gpu-dev004]$ ddk_vcs show bpu_predict -p aarch_64
  Host package version 1.5.1
  The following packages versions
  Platform Package     Version MD5
  -------- ----------- ------- ----------
  aarch_64 bpu_predict 1.10.2  5b6e5dd6c5
```