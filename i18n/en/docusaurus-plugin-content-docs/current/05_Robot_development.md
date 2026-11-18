---
sidebar_position: 5
---

# 5 TogetheROS.Bot

TogetheROS.Bot is D-Robotics’ robot operating system for manufacturers and ecosystem developers. It is designed to unlock intelligent robotics scenarios and help teams build competitive products efficiently.

TogetheROS.Bot runs on RDK hardware and also provides an x86 simulator. RDK supports the full feature set shown below; the x86 simulator supports image replay for part of the stack to speed up algorithm bring-up before migrating to RDK.

![TROS-Diagram](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/05_Robot_development/image/TogetheROS.png)

Source code is hosted on GitHub under the [D-Robotics](https://github.com/D-Robotics) organization.

## Communication stack

Communication extends and optimizes the ROS 2 Foxy/Humble communication core.

Highlights (blue blocks in diagrams indicate optimizations and additions):

- **hobot_sensor** for common robot sensors—less integration time, more focus on differentiation
- **hobot_dnn** to simplify on-board inference and deployment, leveraging BPU compute
- **hobot_codec** for accelerated video encode/decode and lower CPU usage
- **hobot_cv** for accelerated CV primitives and better throughput
- **hobot Render** for Web/HDMI visualization of algorithm outputs (Web preview)
- **zero-copy** inter-process zero-copy transport for lower latency and resource use
- Rich middleware debugging and performance tooling
- **ROS 2 Foxy/Humble API compatibility** to reuse the ROS ecosystem
- Modular/minimal deployments for resource-constrained products

## Boxs algorithm packages

Boxs are intelligent algorithm packages built on TogetheROS.Bot to speed up integration on D-Robotics RDK-based systems.

Examples include:

- Detection: FCOS, YOLO, FasterRCNN, EfficientDet, MobileNet-SSD, etc.
- Classification: MobileNet and similar
- Segmentation: UNet and similar
- Application models: human detection/tracking, gesture recognition, hand landmarks, monocular height/3D, speech, and more

## Apps examples

Apps are end-to-end examples built with Communication and Boxs—covering sensing, perception, and policy—to showcase full pipelines and accelerate demos.

## Glossary

| Term | Meaning |
| ----------------------------------| --------------------------------------------------------|
| zero-copy | Zero-copy inter-process communication |
| hobot dnn | BPU-oriented model inference wrapper |
| SLAM | Simultaneous localization and mapping |
| DOA | Direction of arrival (sound source localization) |
| ASR | Automatic speech recognition |
| TogetheROS.Bot | TogetheROS.Bot robot operating system |
| tros.b | Short name for TogetheROS.Bot |

## User manual

[TogetheROS.Bot user manual](https://developer.d-robotics.cc/tros_doc/en/tros/)
