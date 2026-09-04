---
sidebar_position: 6
---
# 1.6 Image Classification Algorithm Example

The `mobilenetv2.py` program is installed on the development board for testing the image classification algorithm functionality of MobileNet V2. This program reads the static image `zebra_cls.jpg` as the model input and outputs the classification results on the command-line terminal.

Execute the `mobilenetv2.py` program:

  ```bash
  sunrise@ubuntu:~$ cd /app/pydev_demo/01_classification_sample/02_mobilenetv2/
  sunrise@ubuntu:/app/pydev_demo/01_classification_sample/02_mobilenetv2$ sudo python3 ./mobilenetv2.py
  ```

### Expected Output
The prediction results of the image classification algorithm are output. `zebra_cls.jpg` is an image of a zebra. According to the `ImageNet` dataset classification, the returned result shows that the confidence for "zebra" is 0.9936.

```shell
=== Scheduling Parameters ===
mobilenetv2_224x224_nv12:
  priority    : 0
  customId    : 0
  bpu_cores   : [0]
  deviceId    : 0
Top-5 Predictions:
zebra: 0.9936
tiger, Panthera tigris: 0.0039
hartebeest: 0.0007
tiger cat: 0.0007
impala, Aepyceros melampus: 0.0003
```

![zebra_cls](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/04_Algorithm_Application/01_pydev_dnn_demo/image/pydev_dnn_demo/zebra_cls.jpg)
