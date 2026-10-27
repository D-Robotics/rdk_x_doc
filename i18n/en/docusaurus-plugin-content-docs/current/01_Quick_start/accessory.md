---
sidebar_position: 8
---

# 1.8 Accessory List

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

This section summarizes the third-party accessory list officially certified by D-Robotics, which is compatible with RDK series development boards. Classified by different board types, it includes basic accessories (power supply, case, heat sink), cameras, displays, adapter boards and other categories, and provides detailed resolution support information. The accessory list will be updated from time to time to gradually add more accessory models.

<DocScope versions=">= 3.0.0" products="RDK-X3">
## RDK X3 Accessory List

### Basic Accessories

| Type | Adapted Product|Supplier | Model | Description | Purchase Link |Note|
| --- | --------- | -------- | --------------- | --------- |--------- |-------|
| Power | RDK X3|Waveshare | ORD-PSU-5V3A-USB-C-US | Type-C interface 5V/3A custom power supply | [Purchase Link](https://www.waveshare.com/catalogsearch/result/?q=ORD-PSU-5V3A-USB-C-US)  |-|
| Power | RDK X3 Module|Waveshare   | ORD-PSU-12V2A-5.5-2.1-US | 12V/2A custom power supply              | [Purchase Link](https://www.waveshare.com/ord-psu-12v2a-5.5-2.1.htm?sku=19175) |-|
| Case | RDK X3|YAHBOOM | N/A | Aluminum alloy custom case | [Purchase Link](https://category.yahboom.net/products/rdk-x5-case?_pos=1&_sid=d9e5fbc8f&_ss=r)  |-|
| Case | RDK X3|NTREX | RDK X3 Case | Made of ferrous metal, it is sturdy and offers <br/>excellent heat dissipation performance | [Purchase Link](https://www.devicemart.co.kr/goods/view?no=15617174)  |Korea region|
| Case | RDK X3|Switch Science | RDK X3 Case | Frosted black finish. The I/O interface and antenna area <br/>feature precision openings and are secured with four screws. | [Purchase Link](https://www.switch-science.com/products/9837?_pos=3&_sid=8abe13fe9&_ss=r)  |Japan region|
| Heat Sink | RDK X3|Waveshare | N/A | Cooling fan expansion board | [Purchase Link](https://www.waveshare.com/x3-pi-fan-hat.htm)  |-|
| Heat Sink | RDK X3 Module|Waveshare   | CM4-HEATSINK-B           | Heat sink                       | [Purchase Link](https://www.waveshare.com/cm4-heatsink-b.htm) |-|
| Wi-Fi Antenna | RDK X3<br/>RDK X3 Module|Waveshare | ORD-CM4-ANTENNA | SMA antenna supporting 2.4G/5G WiFi bands | [Purchase Link](https://www.waveshare.com/catalogsearch/result/?q=ORD-CM4-ANTENNA)  |-|
| 4G Communication Module | RDK X3<br/>RDK X3 Module|Waveshare | SIM7600G-H 4G DTU | Industrial-grade 4G communication module, <br/>supports USB/UART/RS232/RS485 interfaces, 4G/3G/2G networks and GNSS positioning | [Purchase Link](https://www.waveshare.com/catalogsearch/result/?q=SIM7600G-H+4G+DTU)  |-|
| Carrier Board | RDK X3 Module|Waveshare   | CM4-IO-BASE-B            | Custom carrier board                   | [Purchase Link](https://www.waveshare.com/cm4-io-base-c.htm) |-|

### Cameras

| Type | Adapted Product|Supplier | Model | Description | Supported Resolutions | Purchase Link |
| --- | --------- | -------- | --------------- | --------- | --------- |-------|
| MIPI | RDK X3<br/>RDK X3 Module|Waveshare | OV5647 Camera | OV5647 sensor, 5MP, FOV diagonal 160° | 1920x1080@30fps(default), <br/>640x480@60fps, <br/>1280x960@30fps, <br/>2592x1944@15fps(max) | [Purchase Link](https://www.waveshare.com/rpi-camera-g.htm)  |
| MIPI | RDK X3<br/>RDK X3 Module|Waveshare | IMX219 Camera | IMX219 sensor, 8MP, FOV diagonal 200° | 1920x1080@30fps(default), <br/>640x480@30fps, <br/>1632x1232@30fps, <br/>3264x2464@15fps(max) | [Purchase Link](https://www.waveshare.com/imx219-160-camera.htm?sku=16679)  |
| MIPI | RDK X3<br/>RDK X3 Module|Waveshare | IMX477 Camera | IMX477 sensor, 12.3MP, FOV diagonal 160° | 1920x1080@50fps(default), <br/>1280x960@120fps, <br/>2016x1520@40fps, <br/>4000x3000@10fps(max) | [Purchase Link](https://www.waveshare.com/imx477-160-12.3mp-camera.htm)  |
| MIPI | RDK X3|Waveshare | Camera Adapter | For use with Waveshare cameras, 15pin to 24pin adapter | N/A | [Purchase Link](https://www.waveshare.com/x3-pi-csi-adapter.htm)  |
| MIPI | RDK X3<br/>RDK X3 Module|YAHBOOM | IMX219 Camera | IMX219 sensor, 8MP, FOV diagonal 77° | 1920x1080@30fps(default), <br/>640x480@30fps, <br/>1632x1232@30fps, <br/>3264x2464@15fps(max) | [Purchase Link](https://category.yahboom.net/products/rdk-x3-camera?_pos=3&_sid=0071c72e5&_ss=r)  |
| USB | RDK X3<br/>RDK X3 Module|YAHBOOM | USB Camera | Driver-free USB microphone camera, 720p | 1280x720@30fps | [Purchase Link](https://category.yahboom.net/products/camera-mic?_pos=2&_sid=77f956b6d&_ss=r)  |


### Displays

| Type | Adapted Product|Supplier | Model | Description | Resolution | Purchase Link |
| --- | --------- | -------- | --------------- | --------- | --------- |-------|
| HDMI | RDK X3<br/>RDK X3 Module|Waveshare | 5-inch Touch Screen  | 800×480 resolution, tempered glass panel, touch support | 800×480 | [Purchase Link](https://www.waveshare.com/product/displays/5inch-hdmi-lcd-h.htm#none)  |
| HDMI | RDK X3<br/>RDK X3 Module|Waveshare | 7-inch Touch Screen | 1024x600 resolution, tempered glass panel, touch support | 1024×600 | [Purchase Link](https://www.waveshare.com/7inch-hdmi-lcd-h.htm)  |
| HDMI | RDK X3<br/>RDK X3 Module|Waveshare | 10-inch Touch Screen | 1280x800 resolution, tempered glass panel, wide color gamut touch screen | 1280×800 | [Purchase Link](https://www.waveshare.com/10.1hp-caplcd-monitor.htm)  |
| HDMI | RDK X3<br/>RDK X3 Module|Waveshare | 13.3-inch Touch Screen | 1920x1080 resolution, tempered glass panel, wide color gamut touch screen | 1920×1080 | [Purchase Link](https://www.waveshare.com/13.3inch-hdmi-lcd-h-with-case-v2.htm?sku=16316)  |
| MIPI | RDK X3<br/>RDK X3 Module|Waveshare | 4.3-inch MIPI LCD | 800×480 resolution, IPS wide viewing angle, MIPI DSI interface  | 800×480 | [Purchase Link](https://www.waveshare.com/4.3inch-dsi-lcd.htm)  |

### Adapter Boards

| Type | Adapted Product|Supplier | Model | Description | Purchase Link |
| --- | --------- | -------- | --------------- | --------- |-------|
| Audio Adapter | RDK X3<br/>RDK X3 Module|Waveshare | Audio Driver HAT  | Supports 4-MIC ring recording, dual-channel playback, audio loopback | [Purchase Link](https://www.waveshare.com/audio-driver-hat.htm)  |
| Audio Adapter | RDK X3<br/>RDK X3 Module|Waveshare | WM8960 Audio HAT | Supports dual-channel recording and playback, <br/>compatible with RDK X3 2.0, RDK X3 Module | [Purchase Link](https://www.waveshare.com/wm8960-audio-hat.htm)  |

</DocScope>

<DocScope versions=">= 3.5.0" products="RDK-X5">

## RDK X5 Accessory List

### Basic Accessories

| Type | Supplier | Model | Description | Purchase Link |Note|
| --- | --------- | -------- | --------------- | --------- |--------- |
| Case | Switch Science | RDK X5 Case | Metal black casing for effective heat dissipation, stable signal transmission, and plug-and-play functionality. <br/>Includes a mounting bracket compatible with the RDK X5 camera module and various other camera modules | [Purchase Link](https://www.switch-science.com/products/10501?_pos=3&_sid=c0f5a4285&_ss=r)  |Japan region|
| Case | NTREX | RDK X5 Case | Metal black casing for effective heat dissipation, stable signal transmission, and plug-and-play functionality. <br/>Includes a mounting bracket compatible with the RDK X5 camera module and various other camera modules | [Purchase Link](https://www.devicemart.co.kr/goods/view?no=15763605)  |Korea region|
| Case | Cytron | RDK X5 Case | Metal black casing for effective heat dissipation, stable signal transmission, and plug-and-play functionality. <br/>Includes a mounting bracket compatible with the RDK X5 camera module and various other camera modules | [Purchase Link](https://my.cytron.io/p-rdk-x5-metal-case-black)  |Southeast Asia Region|
| Wi-Fi Antenna | Waveshare | ORD-CM4-ANTENNA | SMA antenna supporting 2.4G/5G WiFi bands | [Purchase Link](https://www.waveshare.com/ord-cm4-antenna.htm)  |-|
| 4G Communication Module | Waveshare | SIM7600G-H 4G DTU | Industrial-grade 4G communication module, supports USB/UART/RS232/RS485 interfaces, 4G/3G/2G networks and GNSS positioning | [Purchase Link](https://www.waveshare.com/sim7600g-h-4g-dtu.htm?sku=21137)  |-|
| 4G Communication Module | Waveshare | SIM7600G-H 4G DONGLE | Industrial-grade 4G communication module, supports USB/UART interfaces, 4G/3G/2G networks and GNSS positioning | [Purchase Link](https://www.waveshare.com/sim7600g-h-4g-dongle.htm)  |-|
| PoE Power Supply Module | Waveshare | RDK X5 PoE Module | Based on the 40PIN GPIO interface connection, compatible with IEEE 802.3af/at network standards, <br/>featuring a fully isolated switch-mode power supply (SMPS) design, equipped with an onboard high-speed active cooling fan and metal heat sink| [Purchase Link](https://www.waveshare.com/rdk-poe-module.htm)  |-|
| PoE Power Supply Module | Switch Science | RDK X5 PoE Module | Based on the 40PIN GPIO interface connection, compatible with IEEE 802.3af/at network standards, <br/>featuring a fully isolated switch-mode power supply (SMPS) design, equipped with an onboard high-speed active cooling fan and metal heat sink| [Purchase Link](https://www.switch-science.com/products/10504?_pos=1&_sid=9114e57e6&_ss=r)  |-|
| PoE Power Supply Module | Waveshare | RDK X5 PoE Module | Based on the 40PIN GPIO interface connection, compatible with IEEE 802.3af/at network standards, <br/>featuring a fully isolated switch-mode power supply (SMPS) design, equipped with an onboard high-speed active cooling fan and metal heat sink| [Purchase Link](https://www.waveshare.com/rdk-poe-module.htm)  |-|

### Cameras

| Type | Supplier | Model | Description | Supported Resolutions | Purchase Link |
| --- | --------- | -------- | --------------- | --------- | --------- |
| MIPI | Third-party | OV5647 Camera | Effect library optimized, OV5647 sensor, 5MP, FOV diagonal 160° | 1920x1080@30fps(default), <br/>640x480@60fps, <br/>1280x960@30fps, <br/>2592x1944@15fps(max) | [Purchase Link](https://item.taobao.com/item.htm?id=798392753457&skuId=5440216832503)  |
| MIPI | Waveshare | OV5647 Camera | OV5647 sensor, 5MP, FOV diagonal 160° | 1920x1080@30fps(default), <br/>640x480@60fps, <br/>1280x960@30fps, <br/>2592x1944@15fps(max) | [Purchase Link](https://www.waveshare.com/rpi-camera-g.htm)  |
| MIPI | Waveshare | IMX219 Camera | Effect library optimized, IMX219 sensor, 8MP, FOV diagonal 160°| 1920x1080@30fps(default), <br/>640x480@30fps, <br/>1632x1232@30fps, <br/>3264x2464@15fps(max) | [Purchase Link](https://www.waveshare.com/imx219-160-camera.htm?sku=16662)  |
| MIPI | Waveshare | IMX477 Camera | IMX477 sensor, 12.3MP, FOV diagonal 160° | 1920x1080@50fps(default), <br/>1280x960@120fps, <br/>2016x1520@40fps, <br/>4000x3000@10fps(max) | [Purchase Link](https://www.waveshare.com/imx477-160-12.3mp-camera.htm)  |
| MIPI | YAHBOOM | IMX219 Camera | IMX219 sensor, 8MP, FOV diagonal 77° | 1920x1080@30fps(default), <br/>640x480@30fps, <br/>1632x1232@30fps, <br/>3264x2464@15fps(max) | [Purchase Link](https://category.yahboom.net/products/rdk-x5-camera?_pos=4&_sid=eea3cf7b9&_ss=r)  |
| USB | YAHBOOM | USB Camera | Driver-free USB microphone camera, 720p | 1280x720@30fps | [Purchase Link](https://category.yahboom.net/products/camera-mic?_pos=2&_sid=272c303b0&_ss=r)  |


### Stereo Cameras

| Type | Supplier | Model | Description | Supported Resolutions| User Guide| Purchase Link |
| --- | --------- | -------- | --------------- | --------- | --------- |--------- |
| MIPI | D-Robotics | RDK Stereo Camera Module | SmartSens SC230AI, 1/2.8-inch CMOS, rolling shutter, 2MP, diagonal 178° / horizontal 150° / vertical 80° | 1920×1080 | [Click to View](https://developer.d-robotics.cc/tros_doc/en/boxs/spatial/hobot_stereonet?v=3.5.0&p=RDK+X5) | [Purchase Link](https://item.taobao.com/item.htm?id=854591367752&mi_id=0000vEM7hxW2z-nLLTEOwsSqHTMyfw56sg0mU79IxSOWpEs&spm=a21xtw.29978516.0.0&xxc=shop&skuId=5656880664831) |
| MIPI | D-Robotics | RDK Stereo Camera GS130W | SC132GS Global Shutter Sensor, 1.3MP, FOV diagonal 157.2°,Interpupillary distance 80mm| 1280×1080@120fps |[Click to view](https://developer.d-robotics.cc/accessories_doc/en/stereo_camera_gs130w/product_overview)|[Purchase Link](https://detail.tmall.com/item.htm?id=991101307919&spm=a211lz.success.0.0.7dea2b901R1WG0&skuId=6129733154197) |
| MIPI | D-Robotics | RDK Stereo Camera GS130WI | SC132GS Global Shutter Sensor, ICM-42688-P 6-Axis IMU, 130W pixels, High Dynamic Range (HDR),<br/> High Signal-to-Noise Ratio (40 dB), and 850/940 nm Near-Infrared Enhancement Capability | 1280×1080@120fps |[Click to view](https://developer.d-robotics.cc/accessories_doc/en/stereo_camera_gs130wi/product_overview)|[Purchase Link](https://detail.tmall.com/item.htm?abbucket=5&id=893698797289&mi_id=0000QSdp5Vnx08HtwI1xW2HMVxaiOmsY_Q-pd2ZO-oP-d70&ns=1&priceTId=2147845517802871023938638e12cd&skuId=6222102446268&spm=a21n57.1.hoverItem.2&utparam=%7B%22aplus_abtest%22%3A%22309bdef8edfd93c86e723b42515cdec9%22%7D&xxc=taobaoSearch)|

### Displays

| Type | Supplier | Model | Description | Resolution | Purchase Link |
| --- | --------- | -------- | --------------- | --------- | --------- |
| HDMI | Waveshare | 5-inch Touch Screen  | 800×480 resolution, tempered glass panel, touch support | 800×480 | [Purchase Link](https://www.waveshare.com/5inch-hdmi-lcd-h.htm)  |
| HDMI | Waveshare | 7-inch Touch Screen | 1024x600 resolution, tempered glass panel, touch support | 1024×600 | [Purchase Link](https://www.waveshare.com/7inch-hdmi-lcd-h.htm)  |
| HDMI | Waveshare | 10-inch Touch Screen | 1280x800 resolution, tempered glass panel, wide color gamut touch screen | 1280×800 | [Purchase Link](https://www.waveshare.com/10.1hp-caplcd-monitor.htm)  |
| HDMI | Waveshare | 13.3-inch Touch Screen | 1920x1080 resolution, tempered glass panel, wide color gamut touch screen | 1920×1080 | [Purchase Link](https://www.waveshare.com/13.3inch-hdmi-lcd-h-with-case-v2.htm)  |
| MIPI | Waveshare | 4.3-inch MIPI LCD | 800×480 resolution, IPS wide viewing angle, MIPI DSI interface  | 800×480 | [Purchase Link](https://www.waveshare.com/4.3inch-dsi-lcd.htm)  |

MIPI DSI screens require driver adaptation before use. The supported MIPI DSI screen models are listed below:

| Type | Supplier | Model | Description | Resolution | Purchase Link | User Guide |
| --- | --------- | -------- | --------------- | --------- | --------- | --------- |
| MIPI | Waveshare | 2.8-inch MIPI LCD | IPS fully laminated capacitive touch screen | 480×640 | [Purchase Link](https://www.waveshare.com/2.8inch-dsi-lcd.htm) | [2.8inch DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | Waveshare | 3.4-inch MIPI LCD | Round capacitive touch screen, IPS display panel, 10-point touch | 800×800 | [Purchase Link](https://www.waveshare.com/3.4inch-dsi-lcd-c.htm) | [3.4inch DSI LCD](./display_use/display_rdkx5.md) | 
| MIPI | Waveshare | 4.3-inch MIPI LCD | Capacitive touch screen, IPS wide viewing angle | 800×480 | [Purchase Link](https://www.waveshare.com/4.3inch-dsi-lcd.htm) | [4.3inch DSI LCD](./display_use/display_rdkx5.md) | 
| MIPI | Waveshare | 7-inch MIPI LCD | Capacitive touch screen, IPS wide viewing angle | 1024×600 | [Purchase Link](https://www.waveshare.com/7inch-dsi-lcd-c.htm) | [7inchC DSI LCD](./display_use/display_rdkx5.md) | 
| MIPI | Waveshare | 7.9-inch MIPI LCD | Capacitive touch screen, IPS wide viewing angle, ultra-long screen | 400×1280 | [Purchase Link](https://www.waveshare.com/7.9inch-dsi-lcd.htm) | [7.9inch DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | Waveshare | 8-inch MIPI LCD | Capacitive touch screen, IPS wide viewing angle | 1280×800 | [Purchase Link](https://www.waveshare.com/8inch-dsi-lcd-c.htm) | [8inch DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | Waveshare | 10.1-inch MIPI LCD | Capacitive touch screen, IPS wide viewing angle | 1280×800 | [Purchase Link](https://www.waveshare.com/10.1inch-dsi-lcd-c.htm) | [10.1inch DSI LCD](./display_use/display_rdkx5.md) |
| MIPI | Waveshare | 11.9-inch MIPI LCD | Capacitive touch screen, IPS wide viewing angle, ultra-long screen | 320×1480 | [Purchase Link](https://www.waveshare.com/11.9inch-dsi-lcd.htm) | [11.9inch DSI LCD](./display_use/display_rdkx5.md) |

### Adapter Boards

| Type | Supplier | Model | Description | Purchase Link |
| --- | --------- | -------- | --------------- | --------- |
| Audio Adapter | Waveshare | Audio Driver HAT  | Supports 4-MIC ring recording, dual-channel playback, audio loopback | [Purchase Link](https://www.waveshare.com/audio-driver-hat.htm)  |
| Audio Adapter | Waveshare | WM8960 Audio HAT | Supports dual-channel recording and playback, compatible with RDK X3 2.0, RDK X3 Module | [Purchase Link](https://www.waveshare.com/wm8960-audio-hat.htm)  |

</DocScope>


## Detailed Camera Resolution Support List

The following is the detailed resolution support for each camera model on different RDK platforms:

### IMX219 Camera Resolution Support

- **Default Resolution**: 1920x1080@30fps
- **Other Supported Resolutions**:
  - 640x480@30fps
  - 1632x1232@30fps
  - 3264x2464@15fps (maximum resolution)

### IMX477 Camera Resolution Support

- **Default Resolution**: 1920x1080@50fps
- **Other Supported Resolutions**:
  - 1280x960@120fps
  - 2016x1520@40fps
  - 4000x3000@10fps (maximum resolution)

### OV5647 Camera Resolution Support

- **Default Resolution**: 1920x1080@30fps
- **Other Supported Resolutions**:
  - 640x480@60fps
  - 1280x960@30fps
  - 2592x1944@15fps (maximum resolution)

### F37 Camera Resolution Support

- **Default Resolution**: 1920x1080@30fps

### GC4663 Camera Resolution Support

- **Default Resolution**: 2560x1440@30fps

:::tip 💡 Usage Tips

1. **Resolution Switching**: IMX477 requires manual reset when switching from 1080P resolution to other resolutions. You can execute `hobot_reset_camera.py` on the board to complete the reset operation.

2. **Multi-output**: Supports camera multi-group different resolution output, with a maximum of 4 groups for downscaling and 1 group for upscaling, with a scaling range between 1/8~1.5 times the camera's original resolution.

3. **Alignment Requirements**: X3 chip has 32-byte alignment requirements for VPS output width. If the set width does not meet the alignment requirement, it will be automatically rounded up.

4. **Wiring Instructions**: When connecting MIPI camera cables, keep the blue side facing up (for Raspberry Pi compatible cameras).

:::

:::info 📋 Accessory Compatibility Notes

- All listed accessories have been officially certified and tested by D-Robotics
- The accessory list will be updated regularly based on the latest test results
- Please confirm accessory compatibility with your RDK model before purchase
- If you have any questions, please refer to the detailed specifications from each accessory supplier

:::