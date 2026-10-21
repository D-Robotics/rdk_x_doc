---
sidebar_position: 3
---

# Encoder Object

## Module Description

The Encoder object implements video data encoding and compression functions. It includes several methods such as `encode`, `close`, `send_frame`, `encode_file`, `get_frame`, and `get_img`. Detailed descriptions are as follows:

## Basic Specifications
- RDK supports H.265/HEVC encoder, H.264/AVC encoder, H.265/HEVC decoder, H.264/AVC decoder, JPEG and MJPEG encoder/decoder.

## Reference Example
For example code of the Encoder object, refer to the usage in the `mipi_camera_web.py` example.

## API Reference

| API Interface | Function Description |
| ---- | ----- |
| encode | **Open the encoder** |
| close | **Close the encoder** |
| send_frame | **Send image data to the encoder** |
| encode_file | **Send an image file to the encoder** |
| get_frame | **Stop the video stream and close the camera** |
| get_img | **Stop the video stream and close the camera** |

### encode

<font color='Blue'>Function Description</font>

Configures and enables the encoding module.

<font color='Blue'>Function Declaration</font>

```python
Encoder.encode(video_chn, encode_type, width, height, bits)
```

<font color='Blue'>Parameter Description</font>  

| Parameter Name | Description | Value Range |
| --------- | --------------- | ------------------- |
| video_chn | Specifies the video encoder channel number | Range 0~31 |
| encode_type | Video encoding type | Range 1~3, corresponding to `H264`, `H265`, `MJPEG` respectively |
| width | Width of the image input to the encoding module | Not exceeding 4096 |
| height | Height of the image input to the encoding module | Not exceeding 4096 |
| bits | Bitrate of the encoding module | Default 8000 kbps |

<font color='Blue'>Usage</font>

```python
#create encode object
encode = libsrcampy.Encoder()

#enable encode channel 0, solution: 1080p, format: H264
ret = encode.encode(0, 1, 1920, 1080)
```

<font color='Blue'>Return Value</font>  

| Return Value | Description |                 
| ------ | ----- |
| 0      | Success |
| -1     | Failure |

<font color='Blue'>Notes</font>

None

### close

<font color='Blue'>Function Description</font>

Closes the enabled encoding channel.

<font color='Blue'>Function Declaration</font>  

```python
Encoder.close()
```

<font color='Blue'>Parameter Description</font>  

None

<font color='Blue'>Usage</font> 

None

<font color='Blue'>Return Value</font>  

| Return Value | Description |
| ------ | ----- |
| 0      | Success |
| -1     | Failure |

<font color='Blue'>Notes</font> 

This interface should be used after calling `Encoder.encode()` to create the encoding channel.

### send_frame

<font color='Blue'>Function Description</font>

Sends image data to the encoder.

<font color='Blue'>Function Declaration</font>  

```python
Encoder.send_frame(img)
```

<font color='Blue'>Parameter Description</font>  

None

<font color='Blue'>Usage</font> 

None

<font color='Blue'>Return Value</font>  

| Return Value | Description |
| ------ | ----- |
| 0      | Success |
| -1     | Failure |

<font color='Blue'>Notes</font> 

This interface should be used after calling `Encoder.encode()` to create the encoding channel.

### encode_file

<font color='Blue'>Function Description</font>

Sends an image file to the enabled encoding channel and encodes it in the specified format.

<font color='Blue'>Function Declaration</font> 

```python
Encoder.encode_file(img)
```

<font color='Blue'>Parameter Description</font>  

| Parameter Name | Description | Value Range |
| -------- | ----------------- | --------------------- |
| img      | Image data to be encoded, must be in NV12 format | None |

<font color='Blue'>Usage</font> 

```python
fin = open("output.img", "rb")
input_img = fin.read()
fin.close()

#input image data to encode
ret = encode.encode_file(input_img)
```

<font color='Blue'>Return Value</font>  

| Return Value | Description |                 
| ------ | ----- |
| 0      | Success |
| -1     | Failure |

<font color='Blue'>Notes</font> 

None

### get_frame

<font color='Blue'>Function Description</font>

Retrieves the encoded data.

<font color='Blue'>Function Declaration</font>  

```python
Encoder.get_frame()
```

<font color='Blue'>Usage</font> 

None

<font color='Blue'>Parameter Description</font>  

None

<font color='Blue'>Return Value</font>  

| Return Value | Description |                 
| ------ | ----- |
| 0      | Success |
| -1     | Failure |

<font color='Blue'>Notes</font> 

This interface should be used after calling `Encoder.encode()` to create the encoding channel.

### get_img

<font color='Blue'>Function Description</font>

Retrieves the encoded data.

<font color='Blue'>Function Declaration</font>  

```python
Encoder.get_img()
```

<font color='Blue'>Usage</font> 

None

<font color='Blue'>Parameter Description</font>  

None

<font color='Blue'>Return Value</font>  

| Return Value | Description |                 
| ------ | ----- |
| 0      | Success |
| -1     | Failure |

<font color='Blue'>Notes</font> 

This interface should be used after calling `Encoder.encode()` to create the encoding channel.

<font color='Blue'>Reference Code</font>  

```python
import sys, os, time

import numpy as np
import cv2
from hobot_vio import libsrcampy

def test_encode():
    #create encode object
    enc = libsrcampy.Encoder()
    ret = enc.encode(0, 1, 1920, 1080)
    print("Encoder encode return:%d" % ret)

    #save encoded data to file
    fo = open("encode.h264", "wb+")
    a = 0
    fin = open("output.img", "rb")
    input_img = fin.read()
    fin.close()
    while a < 100:
        #send image data to encoder
        ret = enc.encode_file(input_img)
        print("Encoder encode_file return:%d" % ret)
        #get encoded data
        img = enc.get_img()
        if img is not None:
            fo.write(img)
            print("encode write image success count: %d" % a)
        else:
            print("encode write image failed count: %d" % a)
        a = a + 1

    enc.close()
    print("test_encode done!!!")

test_encode()
```