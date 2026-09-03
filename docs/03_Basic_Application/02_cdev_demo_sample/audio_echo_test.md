---
sidebar_position: 7
sidebar_label: audio_echo_test 示例介绍
sidebar_versions: ">= 3.6.0"
sidebar_products: "RDK X5"
---

# audio_echo_test 示例介绍

## 示例简介

audio_echo_test 是一个位于 `/app/cdev_demo` 目录中的 **C 语言** 开发代码示例，用于演示如何在 **微雪 Audio Driver HAT REV2**（ES7210 + ES8156）上完成 **8 通道格式对齐的录音、播放与音频回采（echo / loopback）验证**。

示例通过 ALSA 接口，以固定格式（8ch、16 kHz、16-bit）完成两阶段测试：先采集人声，再在 duplex 模式下回放并同步采集全通道数据，最终自动判定回采通路是否正常。硬件安装与驱动配置请参考 [微雪 Audio Driver HAT REV2](https://developer.d-robotics.cc/rdk_x_doc/Basic_Application/audio/rdk_x5/audio_driver_hat2_rev2)。

## 效果展示

程序运行成功后，当前目录会生成两个 WAV 文件：

- `record_first.wav`：Phase 1 录制的 5 秒 8 通道音频
- `audio_echo_test.wav`：Phase 2 同步采集的约 12 秒 8 通道音频

使用 Audacity 等工具打开 `audio_echo_test.wav`，可观察到：

- **ch1–ch4**：麦克风通道（Phase 1 录制内容在回放时可能被扬声器拾取）
- **ch7–ch8**：板载回采参考通道（PCB 正常回采时，应能看到与播放对应的波形）

![audacity 回采波形示意](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/02_audio/image/image-x5-audio-echo-test-audacity.png)

终端输出 `PASS` 表示回采通路验证通过；`FAIL` 表示未检测到有效回采信号。

## 硬件准备

### 硬件连接

本示例需要 **RDK X5** 开发板搭配 **微雪 Audio Driver HAT REV2** 音频转接板：

1. 将 HAT 正确插入 40-pin header
2. **3 个拨码开关全部拨到 OFF**
3. 通过 `srpi-config` → `Interface Options` → `Audio` 选择 **Audio Driver HAT V2**，重启后确认声卡注册

![HAT 安装示意](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/02_audio/image/image-audio-driver-hat-setup.jpg)

确认声卡：

```shell
root@ubuntu:~# cat /proc/asound/cards
 0 [duplexaudioi2s1]: simple-card - duplex-audio-i2s1
                      duplex-audio-i2s1
 1 [duplexaudio    ]: simple-card - duplex-audio
                      duplex-audio
```

card 0（`duplex-audio-i2s1`）对应 HAT REV2，本示例使用的设备为 `plughw:0,0`（播放）和 `plughw:0,1`（采集）。

## 快速开始

### 代码以及板端位置

```
root@ubuntu:/app/cdev_demo/audio_echo_test# tree
.
├── Makefile
└── audio_echo_test.c
```

### 编译以及运行

在目录下执行 `make` 编译，依赖 `libasound` 和 `pthread`：

```
root@ubuntu:/app/cdev_demo/audio_echo_test# make
gcc -Wall -O2 -o audio_echo_test audio_echo_test.c -lasound -lpthread
```

本示例 **无命令行参数**，直接运行：

```
root@ubuntu:/app/cdev_demo/audio_echo_test# ./audio_echo_test
```

**操作提示：**

- Phase 1 提示 `speak into mic (5s)` 时，请对着 HAT 麦克风说话或播放测试音
- Phase 2 程序自动回放 Phase 1 录音并同步采集，无需手动操作

### 执行效果

```
root@ubuntu:/app/cdev_demo/audio_echo_test# ./audio_echo_test
OK: ALSA card 0 'duplex-audio-i2s1' matches Audio Driver HAT REV2 driver config.
     Driver/overlay check only confirm the mounted board is
     Waveshare Audio Driver HAT REV2 (ES7210+ES8156), 3x DIP OFF, then continue.
     playback plughw:0,0  capture plughw:0,1

format: 8ch 16000Hz 16bit period=512
=== phase 1: speak into mic (5s) ===


saved record_first.wav (80000 frames, 5.0s)
phase1 peak: ch1=10904 ch2=11271 ch3=13384 ch4=13647 ch5=18 ch6=5 ch7=5 ch8=9

=== phase 2: play voice x2 (gap 2s) + capture ===
capture length: 12.0s

saved audio_echo_test.wav (192000 frames, 12.0s)
phase2 peak: ch1=8072 ch2=7046 ch3=8708 ch4=7500 ch5=16 ch6=7 ch7=201 ch8=194

PASS: wired loopback ch1-ch4 (peak 8708)
note: ch7/ch8 peak 201 (use ch1-ch4 if speaker taps MIC)
root@ubuntu:/app/cdev_demo/audio_echo_test#

```

编译并运行成功后，目录结构示例：

```
root@ubuntu:/app/cdev_demo/audio_echo_test# tree
.
├── Makefile
├── audio_echo_test
├── audio_echo_test.c
├── record_first.wav
└── audio_echo_test.wav
```

## 详细介绍

### 程序配置说明

本示例无命令行参数，关键常量定义在 `audio_echo_test.c` 中：

| 宏 / 常量 | 值 | 说明 |
|-----------|-----|------|
| `CHANNELS` | 8 | 通道数 |
| `RATE` | 16000 | 采样率 (Hz) |
| `FORMAT` | S16_LE | 16-bit 小端 |
| `CAPTURE_DEV` | `plughw:0,1` | 采集设备 |
| `PLAYBACK_DEV` | `plughw:0,0` | 播放设备 |
| `DURATION_SEC` | 5 | Phase 1 录音时长 |
| `PLAY_REPEAT` | 2 | Phase 2 回放次数 |
| `GAP_SEC` | 2 | 两次回放间隔 |
| `PASS_THRESHOLD` | 500 | 回采峰值判定阈值 |

修改采样率、通道数或设备节点时，需保证 playback 与 capture **格式完全对齐**，否则回采通道可能出现错位或无声。

### 通道映射说明

| 通道 | 典型用途 |
|------|----------|
| ch1–ch4 | 环形 4 路麦克风 |
| ch7–ch8 | 播放回采参考信号（PCB 回采通路） |

程序在 Phase 2 结束后自动判定：

- **ch7/ch8 峰值 ≥ 阈值** → `PASS: PCB loopback`（板载回采正常）
- **ch1–ch4 峰值 ≥ 阈值** → `PASS: wired loopback`（扬声器声音被麦克风拾取，常见于外接喇叭回灌测试）
- 均不满足 → `FAIL`

### 软件架构说明


![software_arch](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/02_cdev_demo_sample/image/cdev_audio_echo_test_software_arch.png)


本示例基于 **ALSA PCM** 接口，不依赖 `spcdev` 多媒体框架。整体分为：

1. **声卡检测**：读取 `/proc/asound/cards`，确认 `duplex-audio-i2s1` 为 card 0
2. **Phase 1 单工采集**：打开 capture 设备，录制 5 秒并写入 `record_first.wav`
3. **Phase 2 双工测试**：`pthread` 双线程——播放线程回放录音（含静音间隔），采集线程同步录制全通道数据
4. **结果判定**：对各通道做 peak 分析，输出 PASS/FAIL

由于 ES8156 播放 Codec 仅支持 2 通道，无法直接用 `tinyplay` 播放 8 通道 WAV 做格式对齐回采；本示例在应用层构造 8 通道 interleaved PCM 数据，是 HAT REV2 回采开发的参考实现。

### API 流程说明


![API_Flow](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/02_cdev_demo_sample/image/cdev_audio_echo_test_software_arch.png)


```
启动
  └─ check_hat_sound_card()          // 检测 HAT 声卡
  └─ Phase 1
       ├─ open_pcm(capture)
       ├─ pcm_read_into() → voice[]
       ├─ write_wav(record_first.wav)
       └─ print_peaks("phase1")
  └─ Phase 2
       ├─ open_pcm(playback) + open_pcm(capture)
       ├─ pthread: capture_thread + playback_thread  (run_duplex)
       ├─ write_wav(audio_echo_test.wav)
       ├─ print_peaks("phase2")
       └─ peak_range 判定 → PASS / FAIL
```

主要 ALSA API：`snd_pcm_open`、`snd_pcm_hw_params_*`、`snd_pcm_readi`、`snd_pcm_writei`。

### FAQ

**Q：启动报 `FAIL: Audio Driver HAT REV2 not detected`？**  
**A：** 检查 HAT 是否插好、3 个 DIP 是否全 OFF、`srpi-config` 是否选了 Audio Driver HAT V2 并已重启。执行 `cat /proc/asound/cards` 确认存在 `duplex-audio-i2s1`。

**Q：Phase 2 显示 PASS 但 ch7/ch8 峰值很低？**  
**A：** 若扬声器声音经麦克风拾取，程序会走 `wired loopback ch1-ch4` 判定路径，属预期行为。用 Audacity 分别查看 ch1–ch4 与 ch7–ch8 即可区分。

**Q：与 `tinycap` + `tinyplay` 手动回采有何区别？**  
**A：** 手动方式需开两个终端且难以保证 8ch 格式对齐；本示例在单进程内完成 duplex，更适合作为应用开发的起点代码。
