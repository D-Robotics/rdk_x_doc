---
sidebar_position: 4
---

# SPI 压力测试

## 测试方法

1. 进入`test_tools/07_spi_test`目录
2. 测试脚本分成`master`和`salve`两种模式，根据 spi 驱动配置的模式运行相应模式下的脚本
3. 可以采用两块 RDK X3 开发板，一块把 spi 配置成`master`模式，一块配置成`salve`模式,配置流程可以参考[SPI 调试指南](../driver_development/driver_spi_dev.md)。先执行 master 端测试脚本：`sh spitest_master.sh &`后执行 salve 端测试脚本：`sh spitest_salve.sh &`,两个脚本执行间隔应尽可能短。

## 测试标准

1. 高温：45°、低温：-10°、常温下，程序正常执行，不会出现重启挂死的情况。
2. LOG 中没有`fail`、`error`、`timeout`等异常打印。
3. 能稳定运行 48 小时。