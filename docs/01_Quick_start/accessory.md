---
sidebar_position: 8
---

# 1.8 配件清单

```mdx-code-block
import DocScope from '@site/src/components/DocScope';
```

<style>
{`
.theme-doc-markdown.markdown table {
  display: block;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: border-box;
  border-collapse: collapse;
  -webkit-overflow-scrolling: touch;
}

.theme-doc-markdown.markdown table th,
.theme-doc-markdown.markdown table td {
  white-space: nowrap;
}
`}
</style>

本章节汇总了经过 D-Robotics 官方认证，可以适配 RDK 系列开发板的第三方配件清单。按照不同板卡类型进行分类，包含基础配件(电源、外壳、散热器)、摄像头、显示屏、转接板等类别，并提供详细的分辨率支持信息。配件清单内容会不定期更新，逐步添加更多的配件型号。

<DocScope versions=">= 3.0.0" products="RDK-X3">
## RDK X3 系列配件清单

### 基础配件

| 类型| 适配产品 | 供应商 | 型号 | 描述  |购买链接 |
| --- | --------- | -------- | --------------- | --------- |----------|
| 电源 | RDK X3 | 微雪 | ORD-PSU-5V3A-USB-C-US | Type-C 接口 5V/3A 定制电源|[购买链接](https://www.waveshare.net/shop/ORD-PSU-5V3A-USB-C-US.htm)  |
| 电源 | RDK X3 | 亚博 | T03F-050300Z | Type-C 接口 5V/3A 定制电源 | [购买链接](https://detail.tmall.com/item.htm?abbucket=2&id=608661929691&rn=f64e2bbcef718a13a9f9c261124febd2&spm=a1z10.5-b-s.w4011-22651484606.154.4df82edcjJ7wap&skuId=4949624573441) |
| 电源  |RDK X3 Module | 微雪 | ORD-PSU-12V2A-5.5-2.1-US | 12V/2A 定制电源  | [购买链接](https://www.waveshare.net/shop/ORD-PSU-12V2A-5.5-2.1-US.htm) |
| 散热器 | RDK X3 |微雪 | N/A | 散热风扇扩展板 | [购买链接](https://www.waveshare.net/shop/X3-PI-FAN-HAT.htm)  |
| 散热器 | RDK X3 |亚博 | N/A | 主板风扇，支持 OLED 显示 | [购买链接](https://detail.tmall.com/item.htm?de_count=1&id=607959748338)  |
| 散热器  | RDK X3 Module| 微雪   | CM4-HEATSINK-B           | 散热器                       | [购买链接](https://www.waveshare.net/shop/CM4-HEATSINK-B.htm) |
| 散热器  | RDK X3 Module| 微雪   | CM4-HEATSINK             | 散热器带风扇                 | [购买链接](https://www.waveshare.net/shop/CM4-FAN-3007-5V.htm) |
| Wi-Fi 天线|RDK X3<br/>RDK X3 Module | 微雪 | ORD-CM4-ANTENNA | SMA 天线 支持 2.4G/5G WiFi 频段 | [购买链接](https://www.waveshare.net/shop/ORD-CM4-ANTENNA.htm)  |
| 4G 通信模块 |RDK X3<br/>RDK X3 Module |  微雪 | SIM7600G-H 4G DTU | 工业级 4G 通信模块，支持 USB/UART/RS232/RS485<br/>接口，4G/3G/2G 网络及 GNSS 定位 | [购买链接](https://www.waveshare.net/shop/SIM7600G-H-4G-DTU.htm)  |
| 外壳 | RDK X3 | 微雪 | RDK-Case-A| RDK X3 专用铝合金条纹散热外壳机箱<br/>内置鳍片式独立散热器 | [购买链接](https://www.waveshare.net/shop/RDK-Case-A.htm)  |
| 板级连接器 | 广濑   | DF40C-100DS-0.4V(51)     | 接口板连接器                 | N/A                                                          |


### IMU 
| 类型 | 适配产品 | 供应商 | 型号 | 描述 |使用指南|购买链接 |
| --- | --------- | -------- | --------------- | --------- | --------- |----------|
| IMU 模组 | RDK X3 | 地瓜机器人 | RDK IMU Module | 高性能 6 轴惯性测量单元（IMU）BMI088，包含一个三轴陀螺仪和一个三轴加速度计，使用 I2C 接口进行连接 |[点击查看](https://github.com/D-Robotics/rdk_imu)<br/>[点击查看](https://github.com/D-Robotics/rdk_imu/tree/library)|[购买链接](https://detail.tmall.com/item.htm?abbucket=11&id=950559188647&mi_id=0000y73ip0pJqD4bU7HI9v6_ueVB9SpvJQKtSGGzP2qQC4E&ns=1&priceTId=2147850217700998222523124e1266&skuId=5862025952973&spm=a21n57.1.hoverItem.3&utparam=%7B%22aplus_abtest%22%3A%22d17d854d12fb2c2c542d2e5885d44a3e%22%7D&xxc=taobaoSearch)  |

### 摄像头

| 类型 | 适配产品 | 供应商 | 型号 | 描述 | 支持分辨率 | 购买链接 |
| --- | --------- | -------- | --------------- | --------- | --------- |----------|
| MIPI | RDK X3<br/>RDK X3 Module | 微雪 | OV5647 摄像头 | OV5647 传感器，500W 像素，FOV 对角 160 度 | 1920x1080@30fps(default),<br/> 640x480@60fps, <br/>1280x960@30fps, <br/>2592x1944@15fps(max) | [购买链接](https://www.waveshare.net/shop/RPi-Camera-G.htm)  |
| MIPI | RDK X3<br/>RDK X3 Module | 微雪 | IMX219 摄像头 | IMX219 传感器，800W 像素，FOV 对角 200 度 | 1920x1080@30fps(default),<br/> 640x480@30fps,<br/> 1632x1232@30fps,<br/> 3264x2464@15fps(max) | [购买链接](https://www.waveshare.net/shop/IMX219-200-Camera.htm)  |
| MIPI | RDK X3<br/>RDK X3 Module | 微雪 | IMX477 摄像头 | IMX477 传感器，1230W 像素，FOV 对角 160 度 | 1920x1080@50fps(default), <br/>1280x960@120fps,<br/> 2016x1520@40fps,<br/> 4000x3000@10fps(max) | [购买链接](https://www.waveshare.net/shop/IMX477-160-12.3MP-Camera.htm)  |
| MIPI | RDK X3 | 微雪 | 摄像头转接板 | 搭配微雪摄像头使用，15pin 转 24pin 转接板 | N/A | [购买链接](https://www.waveshare.net/shop/X3-Pi-CSI-Adapter.htm)  |
| MIPI | RDK X3 <br/>RDK X3 Module | 亚博 | IMX219 摄像头 | IMX219 传感器，800W 像素，FOV 对角 77 度 | 1920x1080@30fps(default),<br/> 640x480@30fps,<br/> 1632x1232@30fps,<br/> 3264x2464@15fps(max) | [购买链接](https://detail.tmall.com/item.htm?abbucket=2&id=710344235988&rn=f64e2bbcef718a13a9f9c261124febd2&spm=a1z10.5-b-s.w4011-22651484606.110.4df82edcjJ7wap)  |
| USB | RDK X3 <br/>RDK X3 Module | 亚博 | USB 摄像头 | 免驱 USB 麦克风摄像头，720p | 1280x720@30fps | [购买链接](https://detail.tmall.com/item.htm?abbucket=2&id=633040443710&rn=ed9c7f0eecc103e742248e32a32ba62e&spm=a1z10.5-b-s.w4011-22651484606.152.c3406a83G6l62o)  |
| USB | RDK X3 <br/>RDK X3 Module | 轮趣 | USB 摄像头 | 免驱 USB 摄像头，金属外壳，1080p | 1920x1080@30fps | [购买链接](https://detail.tmall.com/item.htm?abbucket=12&id=666156389569&ns=1&spm=a230r.1.14.1.13e570f3eFF1sJ&skuId=4972914294771)  |

### 显示屏

| 类型 | 适配产品 | 供应商 | 型号 | 描述 | 分辨率 | 购买链接 |
| --- | --------- | -------- | --------------- | --------- | --------- |----------|
| HDMI | RDK X3 <br/>RDK X3 Module| 微雪 | 5 英寸触控屏  | 分辨率 800×480，钢化玻璃面板，支持触控 | 800×480 | [购买链接](https://www.waveshare.net/shop/5inch-HDMI-LCD-H.htm)  |
| HDMI | RDK X3 <br/>RDK X3 Module| 微雪 | 7 英寸触控屏 | 分辨率 1024x600，钢化玻璃面板，支持触控 | 1024×600 | [购买链接](https://www.waveshare.net/shop/7inch-HDMI-LCD-H.htm)  |
| HDMI | RDK X3 <br/>RDK X3 Module| 微雪 | 10 英寸触控屏 | 分辨率 1280x800，钢化玻璃面板，高色域触控屏 | 1280×800 | [购买链接](https://www.waveshare.net/shop/10.1HP-CAPLCD-Monitor.htm)  |
| HDMI | RDK X3 <br/>RDK X3 Module| 微雪 | 13.3 英寸触控屏 | 分辨率 1920x1080，钢化玻璃面板，高色域触控屏 | 1920×1080 | [购买链接](https://www.waveshare.net/shop/13.3inch-HDMI-LCD-H-with-Holder-V2.htm)  |
| MIPI | RDK X3 <br/>RDK X3 Module| 微雪 | 4.3 英寸 MIPI LCD | 分辨率 800×480，IPS 广视角，MIPI DSI 接口  | 800×480 | [购买链接](https://www.waveshare.net/shop/4.3inch-DSI-LCD.htm)  |

### 转接板

| 类型 | 适配产品 | 供应商 | 型号 | 描述 | 购买链接 |
| --- | --------- | -------- | --------------- | --------- |----------|
| 音频转接板 | RDK X3 <br/>RDK X3 Module| 微雪 | Audio Driver HAT  | 支持环形 4MIC 录音，双通道播放，音频回采 | [购买链接](https://www.waveshare.net/shop/Audio-Driver-HAT.htm)  |
| 音频转接板 | RDK X3 <br/>RDK X3 Module| 微雪 | WM8960 Audio HAT | 支持双通道录音、播放，适用于 RDK X3 2.0、RDK X3 Module | [购买链接](https://www.waveshare.net/shop/WM8960-Audio-HAT.htm)  |

</DocScope>


<DocScope versions=">= 3.5.0" products="RDK-X5">

## RDK X5 配件清单

### 基础配件

| 类型 | 供应商 | 型号 | 描述 | 购买链接 |
| --- | --------- | -------- | --------------- | --------- |
| 电源 | 微雪 | PSU-27W-USB-C-CN-B | Type-C 接口 5V/5A 定制电源 | [购买链接](https://www.waveshare.net/shop/PSU-27W-USB-C-CN-B.htm)  |
| Wi-Fi 天线 | 微雪 | ORD-CM4-ANTENNA | SMA 天线 支持 2.4G/5G WiFi 频段 | [购买链接](https://www.waveshare.net/shop/ORD-CM4-ANTENNA.htm)  |
| 4G 通信模块 | 微雪 | SIM7600G-H 4G DTU | 工业级 4G 通信模块，支持 USB/UART/RS232/RS485 接口，4G/3G/2G 网络及 GNSS 定位 | [购买链接](https://www.waveshare.net/shop/SIM7600G-H-4G-DTU.htm)  |
| 4G 通信模块 | 微雪 | SIM7600G-H 4G DONGLE | 工业级 4G 通信模块，支持 USB/UART 接口，4G/3G/2G 网络及 GNSS 定位 | [购买链接](https://www.waveshare.net/shop/SIM7600G-H-4G-DONGLE.htm)  |
| 外壳 | 地瓜机器人 | RDK X5 Case | 全金属黑色外壳 | [购买链接](https://item.taobao.com/item.htm?abbucket=11&id=623862263232&mi_id=0000TakHYTmsuMbPUMYV_dByLYk8Z3qEoQjHCjwjgpyQD58&ns=1&priceTId=213e032717694105383204838e131d&skuId=5633976856940&spm=a21n57.1.hoverItem.8&utparam=%7B%22aplus_abtest%22%3A%224d58468e1aea4fb2bc2fb94fb4afe5db%22%7D&xxc=taobaoSearch)  |
| 外壳 | 亚博 | RDK X5 外壳 | 全金属黑色外壳 | [购买链接](https://item.taobao.com/item.htm?abbucket=11&id=623862263232&mi_id=0000TakHYTmsuMbPUMYV_dByLYk8Z3qEoQjHCjwjgpyQD58&ns=1&priceTId=213e032717694105383204838e131d&skuId=5633976856940&spm=a21n57.1.hoverItem.8&utparam=%7B%22aplus_abtest%22%3A%224d58468e1aea4fb2bc2fb94fb4afe5db%22%7D&xxc=taobaoSearch)  |
| 以太网供电模块 | 微雪 | RDK X5 PoE Module | 40PIN GPIO 接口连接，兼容 IEEE 802.3af/at 网络标准，全隔离开关电源（SMPS）设计，<br/>具备板载高转速主动散热风扇和金属散热片|[购买链接](https://www.waveshare.net/shop/RDK-PoE-Module.htm)  |


### IMU 
| 类型 | 供应商 | 型号 | 描述 |使用指南|购买链接 |
| --- | --------- | -------- | --------------- | --------- | --------- |
| IMU 模组 | 地瓜机器人 | RDK IMU Module | 高性能 6 轴惯性测量单元（IMU）BMI088，包含一个三轴陀螺仪<br/>和一个三轴加速度计，使用 I2C 接口进行连接 |[点击查看](https://github.com/D-Robotics/rdk_imu)<br/>[点击查看](https://github.com/D-Robotics/rdk_imu/tree/library)|[购买链接](https://detail.tmall.com/item.htm?abbucket=11&id=950559188647&mi_id=0000y73ip0pJqD4bU7HI9v6_ueVB9SpvJQKtSGGzP2qQC4E&ns=1&priceTId=2147850217700998222523124e1266&skuId=5862025952973&spm=a21n57.1.hoverItem.3&utparam=%7B%22aplus_abtest%22%3A%22d17d854d12fb2c2c542d2e5885d44a3e%22%7D&xxc=taobaoSearch)  |


### 摄像头

| 类型 | 供应商 | 型号 | 描述 | 支持分辨率 | 购买链接 |
| --- | --------- | -------- | --------------- | --------- | --------- |
| MIPI | 第三方 | OV5647 摄像头 | 效果库优化，OV5647 传感器，500W 像素，FOV 对角 160 度 | 1920x1080@30fps(default),<br/> 640x480@60fps,<br/> 1280x960@30fps,<br/> 2592x1944@15fps(max) | [购买链接](https://item.taobao.com/item.htm?id=798392753457&skuId=5440216832503)  |
| MIPI | 微雪 | OV5647 摄像头 | OV5647 传感器，500W 像素，FOV 对角 160 度 | 1920x1080@30fps(default), <br/>640x480@60fps,<br/> 1280x960@30fps,<br/> 2592x1944@15fps(max) | [购买链接](https://www.waveshare.net/shop/RPi-Camera-G.htm)  |
| MIPI | 微雪 | IMX219 摄像头 | Jetson Nano，IMX219 传感器，800W 像素，FOV 对角 160 度(default)| 1920x1080@30fps(default), <br/>640x480@30fps,<br/> 1632x1232@30fps,<br/> 3264x2464@15fps(max) | [购买链接](https://www.waveshare.net/shop/IMX219-160-Camera.htm)  |
| MIPI | 微雪 | IMX219 摄像头 | Pi5，IMX219 传感器，800W 像素，FOV 对角 120 度(需要先使用 srpi-config 切换效果库)| 1920x1080@30fps(default), <br/>1632x1232@30fps,<br/> 3264x2464@15fps(max) | [购买链接](https://e.tb.cn/h.7lIWpbM80XTnoFu?tk=28dmU3MVDG4)  |
| MIPI | 微雪 | IMX477 摄像头 | IMX477 传感器，1230W 像素，FOV 对角 160 度 | 1920x1080@50fps(default), <br/>1280x960@120fps,<br/> 2016x1520@40fps,<br/> 4000x3000@10fps(max) | [购买链接](https://www.waveshare.net/shop/IMX477-160-12.3MP-Camera.htm)  |
| MIPI | 第三方 | IMX415 摄像头 | IMX415 传感器，800W 像素，FOV 对角 123 度，22PIN 无需转接板 | 待测试 | [购买链接](https://e.tb.cn/h.hNHZxXLFdgg6oHj?tk=b1Id4UgKNVn)  |
| MIPI | 亚博 | IMX219 摄像头 | IMX219 传感器，800W 像素，FOV 对角 77 度 | 1920x1080@30fps(default), <br/>640x480@30fps,<br/> 1632x1232@30fps,<br/> 3264x2464@15fps(max) | [购买链接](https://detail.tmall.com/item.htm?abbucket=11&id=839183655358&mi_id=0000mJPS-aUaSa1zzO5CvcLhQYgkjpazBFmo9ZGQ9_-A15E&ns=1&priceTId=2147801e17695881044207950e13fd&skuId=5770242754444&spm=a21n57.1.hoverItem.3&utparam=%7B%22aplus_abtest%22%3A%22ad38bcc0b3e9545ae7b168f9b42eb0eb%22%7D&xxc=taobaoSearch)  |
| USB | 亚博 | USB 摄像头 | 免驱 USB 麦克风摄像头，720p | 1280x720@30fps | [购买链接](https://detail.tmall.com/item.htm?abbucket=2&id=633040443710&rn=ed9c7f0eecc103e742248e32a32ba62e&spm=a1z10.5-b-s.w4011-22651484606.152.c3406a83G6l62o)  |
| USB | 轮趣 | USB 摄像头 | 免驱 USB 摄像头，金属外壳，1080p | 1920x1080@30fps | [购买链接](https://detail.tmall.com/item.htm?abbucket=12&id=666156389569&ns=1&spm=a230r.1.14.1.13e570f3eFF1sJ&skuId=4972914294771)  |

### 双目摄像头

| 类型 | 供应商 | 型号 | 描述 | 支持分辨率 |使用指南| 购买链接 |
| --- | --------- | -------- | --------------- | --------- | --------- |--------- |
| MIPI | 地瓜机器人 | RDK Stereo Camera Module | SmartSens SC230AI，1/2.8 英寸 CMOS，<br/>滚动快门，200W 像素，对角 178° / 水平 150° / 垂直 80° | 1920x1080 | [点击查看](https://developer.d-robotics.cc/tros_doc/boxs/spatial/hobot_stereonet?v=3.5.0&p=RDK+X5) |[购买链接](https://item.taobao.com/item.htm?id=854591367752&mi_id=0000vEM7hxW2z-nLLTEOwsSqHTMyfw56sg0mU79IxSOWpEs&spm=a21xtw.29978516.0.0&xxc=shop&skuId=5656880664831)  |
| MIPI | 地瓜机器人 | RDK Stereo Camera GS130W | SC132GS 全局快门传感器，130W 像素，<br/>FOV 对角 157.2°，双目间距 80mm | 1280×1080@120fps | [点击查看](https://developer.d-robotics.cc/accessories_doc/stereo_camera_gs130w/product_overview) |[购买链接](https://detail.tmall.com/item.htm?id=991101307919&spm=a211lz.success.0.0.7dea2b901R1WG0&skuId=6129733154197)  |
| MIPI | 地瓜机器人 | RDK Stereo Camera GS130WI | SC132GS 全局快门传感器，FOV 对角 157.2°，双目间距 70mm，ICM-42688-P 六轴 IMU，<br/>高动态范围（HDR）、高信噪比（40 dB）与 850/940 nm 近红外增强能力 | 1280×1080@120fps |[点击查看](https://developer.d-robotics.cc/accessories_doc/stereo_camera_gs130wi/product_overview)|[购买链接](https://detail.tmall.com/item.htm?abbucket=5&id=893698797289&mi_id=0000QSdp5Vnx08HtwI1xW2HMVxaiOmsY_Q-pd2ZO-oP-d70&ns=1&priceTId=2147845517802871023938638e12cd&skuId=6222102446268&spm=a21n57.1.hoverItem.2&utparam=%7B%22aplus_abtest%22%3A%22309bdef8edfd93c86e723b42515cdec9%22%7D&xxc=taobaoSearch)|


### 显示屏

理论上所有支持 HDMI 接口的屏幕都可以使用，以下是已实际测试过的几款小分辨率屏幕型号：

| 类型 | 供应商 | 型号 | 描述 | 分辨率 | 购买链接 |
| --- | --------- | -------- | --------------- | --------- | --------- |
| HDMI | 微雪 | 5 英寸触控屏  | 分辨率 800×480，钢化玻璃面板，支持触控 | 800×480 | [购买链接](https://www.waveshare.net/shop/5inch-HDMI-LCD-H.htm)  |
| HDMI | 微雪 | 7 英寸触控屏 | 分辨率 1024x600，钢化玻璃面板，支持触控 | 1024×600 | [购买链接](https://www.waveshare.net/shop/7inch-HDMI-LCD-H.htm)  |
| HDMI | 微雪 | 10 英寸触控屏 | 分辨率 1280x800，钢化玻璃面板，高色域触控屏 | 1280×800 | [购买链接](https://www.waveshare.net/shop/10.1HP-CAPLCD-Monitor.htm)  |
| HDMI | 微雪 | 13.3 英寸触控屏 | 分辨率 1920x1080，钢化玻璃面板，高色域触控屏 | 1920×1080 | [购买链接](https://www.waveshare.net/shop/13.3inch-HDMI-LCD-H-with-Holder-V2.htm)  |
| HDMI | 微雪 | 4.3 寸电容触控屏 | 分辨率 800×480，钢化玻璃面板 | 800×480 | [购买链接](https://www.waveshare.net/shop/4.3inch-DSI-LCD.htm)  |

MIPI DSI 屏幕在使用前需要驱动适配，已支持的 MIPI DSI 屏幕型号如下：

| 类型 | 供应商 | 型号 | 描述 | 分辨率 | 购买链接 | 使用指南 |
| --- | --------- | -------- | --------------- | --------- | --------- | --------- |
| MIPI | 微雪 | 2.8 英寸 MIPI LCD | IPS 全贴合电容触控屏 | 480×640 | [购买链接](https://www.waveshare.net/shop/2.8inch-DSI-LCD.htm)  | [2.8inch DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | 微雪 | 3.4 英寸 MIPI LCD | 圆形电容触控屏 IPS 显示面板 十点触控 | 800×800 | [购买链接](https://www.waveshare.net/shop/3.4inch-DSI-LCD-C.htm)  | [3.4inch DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | 微雪 | 4.3 英寸 MIPI LCD | 电容触控屏 IPS 广视角 | 800×480 | [购买链接](https://www.waveshare.net/shop/4.3inch-DSI-LCD.htm)  | [4.3inch DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | 微雪 | 7 英寸 MIPI LCD | 电容触控屏 IPS 广视角 | 1024×600 | [购买链接](https://www.waveshare.net/shop/7inch-DSI-LCD-C.htm)  | [7inchC DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | 微雪 | 7.9 英寸 MIPI LCD | 电容触控屏 IPS 广视角 超长屏幕 | 400×1280 | [购买链接](https://www.waveshare.net/shop/7.9inch-DSI-LCD.htm)  | [7.9inch DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | 微雪 | 8 英寸 MIPI LCD | 电容触控屏 IPS 广视角 | 1280×800 | [购买链接](https://www.waveshare.net/shop/8inch-DSI-LCD-C.htm)  | [8inch DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | 微雪 | 10.1 英寸 MIPI LCD | 电容触控屏 IPS 广视角 | 1280×800 | [购买链接](https://www.waveshare.net/shop/10.1inch-DSI-LCD-C.htm)  | [10.1inch DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | 微雪 | 11.9 英寸 MIPI LCD | 电容触控屏 IPS 广视角 超长屏幕 | 320×1480 | [购买链接](https://www.waveshare.net/shop/11.9inch-DSI-LCD.htm)  | [11.9inch DSI LCD](./display_use/display_rdkx5.md) |

### 转接板

| 类型 | 供应商 | 型号 | 描述 | 购买链接 |
| --- | --------- | -------- | --------------- | --------- |
| 音频转接板 | 微雪 | Audio Driver HAT  | 支持环形 4MIC 录音，双通道播放，音频回采 | [购买链接](https://www.waveshare.net/shop/Audio-Driver-HAT.htm)  |
| 音频转接板 | 微雪 | WM8960 Audio HAT | 支持双通道录音、播放，适用于 RDK X3 2.0、RDK X3 Module | [购买链接](https://www.waveshare.net/shop/WM8960-Audio-HAT.htm)  |

</DocScope>
## 摄像头分辨率详细支持列表

以下是各摄像头型号在不同 RDK 平台上的详细分辨率支持情况：

### IMX219 摄像头分辨率支持

- **默认分辨率**: 1920x1080@30fps
- **支持的其他分辨率**:
  - 640x480@30fps
  - 1632x1232@30fps
  - 3264x2464@15fps (最大分辨率)

### IMX477 摄像头分辨率支持

- **默认分辨率**: 1920x1080@50fps
- **支持的其他分辨率**:
  - 1280x960@120fps
  - 2016x1520@40fps
  - 4000x3000@10fps (最大分辨率)

### OV5647 摄像头分辨率支持

- **默认分辨率**: 1920x1080@30fps
- **支持的其他分辨率**:
  - 640x480@60fps
  - 1280x960@30fps
  - 2592x1944@15fps (最大分辨率)

### F37 摄像头分辨率支持

- **默认分辨率**: 1920x1080@30fps

### GC4663 摄像头分辨率支持

- **默认分辨率**: 2560x1440@30fps

:::tip 💡 使用提示

1. **分辨率切换**: IMX477 从 1080P 分辨率切换至其它分辨率需要进行手动复位，使用 RDK X3 时可以在板端执行`hobot_reset_camera.py`完成复位操作。

2. **多路输出**: 支持摄像头多组不同分辨率输出，最多支持 4 组缩小，1 组放大，缩放区间为摄像头原始分辨率的 1/8~1.5 倍之间。

3. **对齐要求**: X3 芯片对于 VPS 输出的宽度有 32 对齐需求，如果设置的宽度不满足对齐要求，会自动向上取整。

4. **接线说明**: MIPI 摄像头排线接入时，需保持蓝面朝上（针对树莓派兼容摄像头）。

:::

:::info 📋 配件兼容性说明

- 所有列出的配件均经过 D-Robotics 官方认证测试
- 配件清单会根据最新测试结果定期更新
- 购买前请确认配件与您的 RDK 型号兼容
- 如有疑问，请参考各配件供应商的详细规格说明

:::