---
sidebar_position: 4
---

# 8.4 Multimedia Processing and Applications

```mdx-code-block
import DocScope from '@site/src/components/DocScope';
```

This section mainly answers frequently asked questions related to video codec, audio processing, and other multimedia functions on the D-Robotics RDK board.

## Video Codec

### Q1: When decoding an RTSP video stream on the development board, an error is reported (as shown in the figure below). What could be the possible reason?
![RTSP decoding error image](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/08_FAQ/image/multimedia/image-20220728110439753.png)
**A:** Common causes and solutions for RTSP video stream decoding errors are as follows:
1.  **The stream lacks PPS and SPS parameter information:**
    * **Cause:** The RTSP stream (especially in H.264 format) pushed by the streaming server must contain `PPS` (Picture Parameter Set) and `SPS` (Sequence Parameter Set) information. The decoder requires this information to correctly parse the video.
    * **Solution:**
        * If you are using `ffmpeg` to stream from a video file (e.g., `.mp4`, `.avi`), it is recommended to add the `-bsf:v h264_mp4toannexb` (H.264 Bitstream Filter: MP4 to Annex B) option to the command (Note: In newer versions of ffmpeg, `-vbsf` has been replaced by `-bsf:v`). This filter automatically adds `PPS` and `SPS` information to the stream.
            **Example `ffmpeg` streaming command:**
            ```
            ffmpeg -re -stream_loop -1 -i xxx.mp4 -c:v copy -bsf:v h264_mp4toannexb -f rtsp rtsp://192.168.1.195:8554/h264_stream
            ```
            (Replace `xxx.mp4` with your video filename and the RTSP server address `rtsp://192.168.1.195:8554/h264_stream` with the actual address.)
2.  **Resolution support limitations:**
    * Currently, decoding of RTSP video streams on RDK boards may only support specific resolutions, such as **1080p (1920x1080)**. Please confirm whether your RTSP stream's resolution falls within this supported range. Consult the documentation for your specific board model for an accurate support list.
3.  **Streaming software compatibility:**
    * **Direct streaming with VLC is not recommended:** Using VLC software to directly push an RTSP stream may not be successfully decoded by the RDK. This is because VLC, in some configurations, may not actively add or ensure the presence of `PPS` and `SPS` information during streaming. It is recommended to use `ffmpeg` or other professional streaming tools that ensure the integrity of stream parameters.

## Audio FAQs

### Q1: The examples use tinyalsa. What do its various parameters represent, and how are they used?
**A:** `tinyalsa` is a lightweight audio library primarily used in Android and embedded Linux systems. It provides a simplified interface to ALSA (Advanced Linux Sound Architecture), making it easier for developers to perform audio processing.
Below are some commonly used `tinyalsa` commands and their parameter meanings:
1.  **List all sound cards:**
    ```bash
    tinymix -l
    ```
    This command lists all recognized sound cards and their controls in the system. If the `tinymix -l` command does not work, you can directly `cat /proc/asound/cards` to check.
2.  **List controls for a specific sound card:**
    ```bash
    tinymix -c <card_number> -l
    ```
    Here, `<card_number>` is the index of the sound card. This command lists all controls for the specified sound card. The exact command may vary depending on the version of tinymix; you can try commands like `tinymix -D <card_number> controls`.
3.  **Get the value of a specific control:**
    ```bash
    tinymix -c <card_number> <control_name>
    ```
    This command displays the current value of a control on the specified sound card. For example:
    ```bash
    tinymix -c 0 'ADC PGA Gain'
    ```
    This will display the current value of the control named `ADC PGA Gain` on sound card 0.
4.  **Set the value of a specific control:**
    ```bash
    tinymix -c <card_number> <control_name> <value>
    ```
    This command sets the value of a control on the specified sound card. For example:
    ```bash
    tinymix -c 0 'ADC PGA Gain' 80%
    ```
    This sets the `ADC PGA Gain` control on sound card 0 to 80%.
5.  **View current audio status:**
    ```bash
    tinymix -c <card_number> -s
    ```
    This command displays the current audio status of the specified sound card, including the current values of all controls.
6.  **Play an audio file:**
     ```bash
    tinyplay <file_name>
    ```
    This command plays the specified audio file. `<file_name>` is the path and name of the audio file.
    For example:
    ```bash
    tinyplay /path/to/audio.wav
    ```
    This will play the specified audio file.
7.  **Record audio:**
    ```bash
    tinycap <file_name> -D <card_number> -d <device_number> -c <channels> -b <bit_depth> -r <sample_rate> -p <period_size> -n <periods> -t <duration>
    ```
    This command records audio and saves it to the specified file. The parameter meanings are as follows:
    - `<file_name>`: The name of the recorded audio file.
    - `-D <card_number>`: Specifies the sound card index.
    - `-d <device_number>`: Specifies the device index (usually a PCM device).
    - `-c <channels>`: Specifies the number of recording channels (e.g., 2 for stereo, 4 for four-channel).
    - `-b <bit_depth>`: Specifies the audio bit depth (e.g., 16 for 16-bit).
    - `-r <sample_rate>`: Specifies the sample rate (e.g., 48000 for 48kHz).
    - `-p <period_size>`: Specifies the period size (in frames).
    - `-n <periods>`: Specifies the number of periods.
    - `-t <duration>`: Specifies the recording duration (in seconds).
    - **Example:**
    ```bash
    tinycap ./recorded_audio.wav -D 0 -d 1 -c 2 -b 16 -r 48000 -p 512 -n 4 -t 5
    ```
    This command records 2-channel, 16-bit, 48kHz audio using device 1 of sound card 0, for a duration of 5 seconds, and saves it as `recorded_audio.wav`.

### Q2: How to distinguish between and use USB sound cards and onboard sound cards on an RDK board, especially when multiple audio devices are connected simultaneously?
**A:** When both an onboard sound card (e.g., via an audio daughter board) and a USB sound card are connected to an RDK board, the Linux audio system (ALSA) assigns them different sound card indices. You need to know the correct sound card index to precisely control a specific audio device.

1.  **View recognized sound cards and their indices:**
    Use the following command to list all recognized sound cards in the system along with their corresponding indices and names:
    ```bash
    cat /proc/asound/cards
    ```
    **Example output (assuming the USB sound card is registered first, followed by the onboard sound card):**
    ```text
     0 [RC08          ]: USB-Audio - ROCWARE RC08
                          ROCWARE RC08 at usb-xhci-hcd.2.auto-1.2, high speed
     1 [duplexaudio   ]: simple-card - duplex-audio
                          duplex-audio
    ```
    In this example:
    * The USB sound card `ROCWARE RC08` is assigned sound card index **0**.
    * The onboard sound card `duplexaudio` (often the name for the RDK audio daughter board) is assigned sound card index **1**.
    * **Note:** The allocation order of sound card indices can change due to factors like device insertion order or driver loading order. If a USB sound card is inserted after system boot, it may receive a larger index.

2.  **Specify the sound card when using `amixer` or `tinymix`:**
    * When using tools like `amixer` (ALSA Mixer command-line utility) or `tinymix` to view or adjust audio parameters, if you do not specify the card and device numbers, they typically operate on the sound card with index 0 by default.
    * To operate on a specific sound card, use the `-c <card_number>` (or `-c<card_number>`) parameter to specify the sound card index, and possibly the `-D hw:<card_number>` or `-d <device_number>` parameters.
    * **View controls for a specific sound card (e.g., the onboard sound card with index 1 from the example above):**
        ```bash
        amixer -c 1 controls
        # Or using the hardware device name: amixer -D hw:1 controls
        ```
    * **Get or set the value of a control on a specific sound card (e.g., get the value of the first control named 'ADC PGA Gain' on onboard sound card index 1):**
        ```bash
        amixer -c 1 sget 'ADC PGA Gain',0
        ```
        To set the value, use `sset` instead of `sget`, for example: `amixer -c 1 sset 'ADC PGA Gain',0 80%`.

Using the methods above, you can accurately identify and control different audio devices connected to your RDK board.

<DocScope products="RDK-X3">

### Q3: How can the audio daughter board of the RDK X3 series coexist and be used simultaneously with a USB sound card (e.g., having PulseAudio recognize and manage them)?
**A:** If you wish to use both the onboard audio daughter board (e.g., based on the WM8960 chip) and an external USB sound card simultaneously on the RDK X3, and have higher-level audio services like PulseAudio recognize and manage them, some configuration may be necessary.

The following steps use the WM8960 audio daughter board and a USB full-duplex sound card as examples:

1.  **Ensure the audio daughter board works correctly:**
    * First, following the tutorial for the specific audio daughter board, ensure its driver is loaded correctly and that it can record and play audio normally when used alone.

2.  **Connect the USB sound card and identify newly added nodes:**
    * Connect the USB sound card to a USB port on the RDK X3. Wait for the system to load the driver.
    * Observe the newly added PCM device nodes in the `/dev/snd/` directory. ALSA creates nodes for each PCM device (playback, capture) of each sound card.
        ```bash
        ls /dev/snd/
        ```
        **Example output (assuming `controlC0`, `pcmC0D0c`, `pcmC0D0p`, `pcmC0D1c`, `pcmC0D1p` are nodes for the audio daughter board, and `pcmC1D0c`, `pcmC1D0p` are nodes for the newly connected USB sound card):**
        ```text
        by-path  controlC0  pcmC0D0c  pcmC0D0p  pcmC0D1c  pcmC0D1p  pcmC1D0c  pcmC1D0p  timer
        ```
        In this example:
        * `pcmC0...` typically corresponds to sound card 0 (card 0). `D0c` indicates the capture endpoint of device 0, `D0p` indicates the playback endpoint of device 0. `D1c`, `D1p` might represent a second PCM device on sound card 0 (e.g., HDMI audio output).
        * `pcmC1D0c`, `pcmC1D0p` correspond to sound card 1 (card 1), the newly connected USB sound card. If the USB sound card is full-duplex and has a single PCM device, it typically presents one capture endpoint and one playback endpoint.

3.  **Modify the PulseAudio configuration file (`/etc/pulse/default.pa`):**
    * To allow PulseAudio to load and use both sound cards simultaneously, you need to edit its default configuration file.
    * Locate the section of the file that loads the ALSA sound card sources (for capture) and sinks (for playback), typically within the `.ifexists module-udev-detect.so` block or the `.else` block.
    * After the existing `load-module module-alsa-source` and `load-module module-alsa-sink` lines, add new loading directives for your USB sound card (assuming it is sound card 1, device 0, confirm using `cat /proc/asound/cards`).

    **Example modification to `/etc/pulse/default.pa`:**
    ```apacheconf
    # ... (Rest of the file) ...

    .ifexists module-udev-detect.so
    # load-module module-udev-detect tsched=0 # Or a similar line

    ### Existing ALSA Sink/Source for onboard audio (card 0)
    ### Adjust device=hw:X,Y according to your actual onboard sound card configuration
    ### For example, if onboard playback is card 0, device 1; onboard capture is card 0, device 0
    load-module module-alsa-sink device=hw:0,1 mmap=false tsched=0 fragments=2 fragment_size=960 rate=48000 channels=2 rewind_safeguard=960
    load-module module-alsa-source device=hw:0,0 mmap=false tsched=0 fragments=2 fragment_size=960 rate=48000 channels=2

    ### Add these lines for the USB sound card (assuming it's card 1, device 0 for both playback and capture)
    ### Note: device=hw:1,0 here is based on the inference from `ls /dev/snd/` and `cat /proc/asound/cards`,
    ### You need to confirm the actual card number (X) for the USB sound card using `cat /proc/asound/cards`,
    ### and confirm its playback/capture device number (Y) using `aplay -l` / `arecord -l`.
    load-module module-alsa-sink device=hw:1,0 # For USB sound card playback
    load-module module-alsa-source device=hw:1,0 # For USB sound card capture

    .else
    # ... (Fallback configuration if udev-detect is not available) ...
    # You might need to add similar lines here if this block is active
    ### Fallback sink
    load-module module-alsa-sink # Default sink
    ### Fallback source
    load-module module-alsa-source device=hw:0,0 # Example for onboard capture

    ### Add for USB sound card if udev is not used
    # load-module module-alsa-sink device=hw:1,0
    # load-module module-alsa-source device=hw:1,0
    .endif

    # ... (Rest of the file) ...
    ```
    **Important Notes:**
    * `X` in `device=hw:X,Y` is the sound card number, and `Y` is the PCM device number. You need to determine the actual `X` and `Y` values for your USB sound card based on the output of `cat /proc/asound/cards` (to see card X) and `aplay -l` / `arecord -l` (to see device Y).
    * Parameters like `mmap=false tsched=0 fragments=2 fragment_size=960 rate=48000 channels=2 rewind_safeguard=960` in the example above are optimized for specific audio daughter boards. For a USB sound card, you may not need many of these parameters; you could try using only `device=hw:X,Y` first. If you encounter audio stuttering or popping, you can try adjusting these parameters.

4.  **Save the configuration and reboot:**
    * Save the modifications to the `/etc/pulse/default.pa` file.
    * Reboot the RDK development board to allow PulseAudio to reload the configuration.
    * Alternatively, try restarting the PulseAudio service (if you know how and your system supports it, e.g., `systemctl --user restart pulseaudio.service` or `pulseaudio -k && pulseaudio --start`), though rebooting the board might be cleaner.

After rebooting, you should be able to see input and output devices for both sound cards in the system's sound settings (if using a desktop environment) or via `pactl list sources` / `pactl list sinks`, and select which one to use.

</DocScope>
