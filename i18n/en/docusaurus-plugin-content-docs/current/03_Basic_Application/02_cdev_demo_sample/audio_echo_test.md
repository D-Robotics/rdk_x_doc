---
sidebar_position: 7
sidebar_label: Introduction to the audio_echo_test Example
sidebar_versions: ">= 3.6.0"
sidebar_products: "RDK X5"
---

# Introduction to the audio_echo_test Example

## Example Overview

audio_echo_test is a **C language** development code example located in the `/app/cdev_demo` directory. It demonstrates how to perform **format-aligned 8-channel recording, playback, and audio loopback (echo / loopback) verification** on the **Waveshare Audio Driver HAT REV2** (ES7210 + ES8156).

Using the ALSA interface, the example runs a two-phase test in a fixed format (8 ch, 16 kHz, 16-bit): it first captures voice, then plays it back in duplex mode while capturing all channels synchronously, and finally determines automatically whether the loopback path works. For hardware installation and driver configuration, see [Waveshare Audio Driver HAT REV2](https://developer.d-robotics.cc/rdk_x_doc/Basic_Application/audio/rdk_x5/audio_driver_hat2_rev2).

## Effect Demonstration

After the program runs successfully, two WAV files are generated in the current directory:

- `record_first.wav`: 5-second 8-channel audio recorded in Phase 1
- `audio_echo_test.wav`: approximately 12-second 8-channel audio captured synchronously in Phase 2

Open `audio_echo_test.wav` with a tool such as Audacity, and you can observe:

- **ch1–ch4**: Microphone channels (the Phase 1 recording may be picked up by the speaker during playback)
- **ch7–ch8**: On-board loopback reference channels (when the PCB loopback path works, waveforms corresponding to playback should be visible)

The `PASS` output in the terminal indicates that the loopback path passed verification; `FAIL` indicates that no valid loopback signal was detected.

## Hardware Preparation

### Hardware Connection

This example requires an **RDK X5** development board with a **Waveshare Audio Driver HAT REV2** audio adapter board:

1. Insert the HAT correctly into the 40-pin header
2. **Set all 3 DIP switches to OFF**
3. Select **Audio Driver HAT V2** via `srpi-config` → `Interface Options` → `Audio`, then reboot and confirm that the sound card is registered

![HAT installation](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/02_audio/image/image-audio-driver-hat-setup.jpg)

Confirm the sound card:

```shell
root@ubuntu:~# cat /proc/asound/cards
 0 [duplexaudioi2s1]: simple-card - duplex-audio-i2s1
                      duplex-audio-i2s1
 1 [duplexaudio    ]: simple-card - duplex-audio
                      duplex-audio
```

Card 0 (`duplex-audio-i2s1`) corresponds to the HAT REV2. The devices used in this example are `plughw:0,0` (playback) and `plughw:0,1` (capture).

## Quick Start

### Code and Board-Side Location

```
root@ubuntu:/app/cdev_demo/audio_echo_test# tree
.
├── Makefile
└── audio_echo_test.c
```

### Build and Run

Run `make` in the directory to build. The example depends on `libasound` and `pthread`:

```
root@ubuntu:/app/cdev_demo/audio_echo_test# make
gcc -Wall -O2 -o audio_echo_test audio_echo_test.c -lasound -lpthread
```

This example takes **no command-line arguments**. Run it directly:

```
root@ubuntu:/app/cdev_demo/audio_echo_test# ./audio_echo_test
```

**Operation tips:**

- When Phase 1 prompts `speak into mic (5s)`, speak into the HAT microphone or play a test tone
- In Phase 2, the program automatically plays back the Phase 1 recording and captures synchronously; no manual operation is required

### Execution Result

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

After building and running successfully, the directory structure is as follows:

```
root@ubuntu:/app/cdev_demo/audio_echo_test# tree
.
├── Makefile
├── audio_echo_test
├── audio_echo_test.c
├── record_first.wav
└── audio_echo_test.wav
```

## Detailed Description

### Program Configuration

This example takes no command-line arguments. The key constants are defined in `audio_echo_test.c`:

| Macro / Constant | Value | Description |
|-----------|-----|------|
| `CHANNELS` | 8 | Number of channels |
| `RATE` | 16000 | Sampling rate (Hz) |
| `FORMAT` | S16_LE | 16-bit little-endian |
| `CAPTURE_DEV` | `plughw:0,1` | Capture device |
| `PLAYBACK_DEV` | `plughw:0,0` | Playback device |
| `DURATION_SEC` | 5 | Phase 1 recording duration |
| `PLAY_REPEAT` | 2 | Number of Phase 2 playbacks |
| `GAP_SEC` | 2 | Interval between playbacks |
| `PASS_THRESHOLD` | 500 | Loopback peak detection threshold |

When you change the sampling rate, channel count, or device node, make sure that the playback and capture **formats are fully aligned**; otherwise, the loopback channels may be misaligned or silent.

### Channel Mapping

| Channel | Typical Use |
|------|----------|
| ch1–ch4 | Ring of 4 microphones |
| ch7–ch8 | Playback loopback reference signal (PCB loopback path) |

After Phase 2 ends, the program determines the result automatically:

- **ch7/ch8 peak ≥ threshold** → `PASS: PCB loopback` (on-board loopback works)
- **ch1–ch4 peak ≥ threshold** → `PASS: wired loopback` (speaker sound picked up by the microphones, common in external speaker feedback tests)
- Neither condition met → `FAIL`

### Software Architecture


![software_arch](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/02_cdev_demo_sample/image/cdev_audio_echo_test_software_arch.png)


This example is based on the **ALSA PCM** interface and does not depend on the `spcdev` multimedia framework. It consists of:

1. **Sound card detection**: Read `/proc/asound/cards` and confirm that `duplex-audio-i2s1` is card 0
2. **Phase 1 simplex capture**: Open the capture device, record for 5 seconds, and write the data to `record_first.wav`
3. **Phase 2 duplex test**: Two `pthread` threads — the playback thread plays the recording (including silence intervals), and the capture thread records all channels synchronously
4. **Result determination**: Perform peak analysis on each channel and output PASS/FAIL

Because the ES8156 playback codec supports only 2 channels, you cannot use `tinyplay` to play an 8-channel WAV directly for format-aligned loopback. This example constructs 8-channel interleaved PCM data at the application layer and serves as a reference implementation for HAT REV2 loopback development.

### API Flow


![API_Flow](http://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/02_cdev_demo_sample/image/cdev_audio_echo_test_software_arch.png)


```
Start
  └─ check_hat_sound_card()          // Detect the HAT sound card
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
       └─ peak_range check → PASS / FAIL
```

Main ALSA APIs: `snd_pcm_open`, `snd_pcm_hw_params_*`, `snd_pcm_readi`, `snd_pcm_writei`.

### FAQ

**Q: `FAIL: Audio Driver HAT REV2 not detected` is reported at startup?**
**A:** Check whether the HAT is properly inserted, whether all 3 DIP switches are OFF, and whether Audio Driver HAT V2 is selected in `srpi-config`, then reboot. Run `cat /proc/asound/cards` to confirm that `duplex-audio-i2s1` exists.

**Q: Phase 2 shows PASS but the ch7/ch8 peaks are very low?**
**A:** If the speaker sound is picked up by the microphones, the program takes the `wired loopback ch1-ch4` determination path, which is expected behavior. Use Audacity to view ch1–ch4 and ch7–ch8 separately to distinguish them.

**Q: How is this different from manual loopback with `tinycap` + `tinyplay`?**
**A:** The manual approach requires two terminals and makes it difficult to guarantee 8-channel format alignment. This example completes duplex in a single process and is better suited as a starting point for application development.
