---
sidebar_position: 6
---

# 1.6 算法体验


开发板上安装了`mobilenetv2.py` 程序用于测试 mobilenet v2 图像分类算法功能，该程序读取 `zebra_cls.jpg` 静态图片作为模型的输入，并在命令行终端输出分类结果。


执行 `mobilenetv2.py` 程序

  ```bash
  sunrise@ubuntu:~$ cd /app/pydev_demo/01_classification_sample/02_mobilenetv2/
  sunrise@ubuntu:/app/pydev_demo/01_classification_sample/02_mobilenetv2$ sudo python3 ./mobilenetv2.py
  ```

### 预期效果
输出图像分类算法的预测结果，`zebra_cls.jpg` 是一张斑马的图片，按照 `ImageNet` 数据集的分类，返回结果 zebra 的置信度为 0.9936。

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






