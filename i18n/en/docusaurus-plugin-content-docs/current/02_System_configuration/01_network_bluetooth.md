---
sidebar_position: 1
---

# 2.1 Network and Bluetooth Configuration

This section mainly introduces the methods for modifying the wired and wireless network configurations of the development board.

## Wired Network: RDK X5 (>= 3.3.0) RDK X3 (>= 3.0.2)

Video: https://www.youtube.com/watch?v=omaAU6sab2A&list=PLSxjn4YS2IuFUWcLGj2_uuCfLYnNYw6Ld&index=8

The development board's wired network uses a static IP configuration by default, with an initial IP address of `192.168.127.10`. Users can switch between static and DHCP modes using the following methods.

### [Shell] Modifying Static IP Configuration

The static network configuration of the development board is saved in the `/etc/NetworkManager/system-connections/netplan-eth0.nmconnection` file. By modifying the `address1` field, you can change the static IP configuration. The `route-metric` field is for network priority configuration; setting it to `700` gives the wired network a lower priority, so when both wired and wireless networks are enabled, the wireless network will be used first.

```shell
sudo vim /etc/NetworkManager/system-connections/netplan-eth0.nmconnection
```

```shell
[connection]
id=netplan-eth0
uuid=f6f8b5a7-9e23-49b2-a792-dc589b3d3e88
type=ethernet
interface-name=eth0
timestamp=1754294545

[ethernet]
wake-on-lan=0

[ipv4]
address1=192.168.127.10/24,192.168.127.1
dns=8.8.8.8;8.8.4.4;
method=manual
route-metric=700

[ipv6]
addr-gen-mode=eui64
method=ignore

[proxy]
```

After making the changes, run the `sudo restart_network` command to apply the configuration.

### [Shell] Modifying DHCP Configuration

Modify the `[ipv4]` field, keeping only `method=auto` and `route-metric=700`.

```shell
[ipv4]
method=auto
route-metric=700
```

After making the changes, run the `sudo restart_network` command to apply the configuration.

### [Shell] Modifying MAC Address Configuration

Modify the `[ethernet]` field, adding `cloned-mac-address=12:34:56:78:9A:BA`.

```shell
[ethernet]
cloned-mac-address=12:34:56:78:9A:BA
wake-on-lan=0
```

After making the changes, reboot to apply the configuration.

### [Desktop] Modifying Static IP Configuration

![image-edid](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/network/image-edid.png)

![image-edid2](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/network/image-edid2.png)

![image-setip](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/network/image-setip.png)

### [Desktop] Modifying DHCP Configuration

![image-dhcp](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/network/image-dhcp.png)

### [Desktop] Modifying MAC Address Configuration

![image-mac](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/network/image-mac.png)

### [Desktop] Applying the Configuration

Select `netplan-eth0` to apply the configuration.

![image-enable](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/network/image-enable.png)

## Wired Network: RDK X5 (< 3.3.0) RDK X3 (< 3.0.2) {#config_ethnet}

Video: https://www.bilibili.com/video/BV1rm4y1E73q/?p=11

The development board's wired network uses a static IP configuration by default, with an initial IP address of `192.168.127.10`. Users can switch between static and DHCP modes using the following methods.

### Modifying Static IP Configuration

The static network configuration of the development board is saved in the `/etc/network/interfaces` file. By modifying fields such as `address`, `netmask`, and `gateway`, you can change the static IP configuration. The `metric` field is for network priority configuration; setting it to `700` gives the wired network a lower priority, so when both wired and wireless networks are enabled, the wireless network will be used first. For example:

```shell
sudo vim /etc/network/interfaces
```

```shell
# interfaces(5) file used by ifup(8) and ifdown(8)
# Include files from /etc/network/interfaces.d:
source-directory /etc/network/interfaces.d
auto eth0
iface eth0 inet static
    pre-up /etc/set_mac_address.sh
    address 192.168.127.10
    netmask 255.255.255.0
    gateway 192.168.127.1
    metric 700
```

After making the changes, run the `sudo restart_network` command to apply the configuration.

### Modifying DHCP Configuration

DHCP (Dynamic Host Configuration Protocol) is commonly used in local area network environments. Its main function is to centrally manage and assign IP addresses, allowing hosts on the network to dynamically obtain IP addresses, gateway addresses, DNS server addresses, and other information, thereby improving address utilization.

The DHCP network configuration of the development board is saved in the `/etc/network/interfaces` file. By modifying the eth0-related configuration, you can switch to DHCP mode. For example:

```shell
sudo vim /etc/network/interfaces
```

```shell
source-directory /etc/network/interfaces.d
auto lo
iface lo inet loopback
auto eth0
iface eth0 inet dhcp
    metric 700
```

After making the changes, run the `sudo restart_network` command to apply the configuration.

### Modifying MAC Address Configuration

To modify the default MAC address of the development board, you can add `pre-up` configuration information in the `/etc/network/interfaces` file to specify the desired MAC address. For example:

```shell
sudo vim /etc/network/interfaces
```

```shell
# interfaces(5) file used by ifup(8) and ifdown(8)
# Include files from /etc/network/interfaces.d:
source-directory /etc/network/interfaces.d
auto eth0
iface eth0 inet static
    pre-up /etc/set_mac_address.sh
    address 192.168.127.10
    netmask 255.255.255.0
    gateway 192.168.127.1
    metric 700
    pre-up ifconfig eth0 hw ether 00:11:22:9f:51:27
```

After making the changes, reboot to apply the configuration.

## Wireless Network

Video: https://www.bilibili.com/video/BV1rm4y1E73q/?p=12

The development board integrates a 2.4GHz wireless WiFi module, supporting both Soft AP and Station modes. It runs in Station mode by default. The following sections describe how to use both modes.

### Station Mode

In Station mode, the development board acts as a client, connecting to a router's wireless hotspot for network access.

- For users of the Ubuntu Desktop version, click the Wi-Fi icon in the top-right corner of the desktop, select the desired hotspot, and enter the password to complete the network configuration, as shown below:  
![image-wifi-config](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/network/image-wifi-config.jpeg)

- For users of the Ubuntu Server version, you can configure the wireless network via the command line. The steps are as follows:

1. Use the `sudo nmcli device wifi rescan` command to scan for hotspots. If the following message appears, the scan is too frequent, and you should try again later.
    ```shell
    root@ubuntu:~# sudo nmcli device wifi rescan
    Error: Scanning not allowed immediately following previous scan.
    ```
2. Use the `sudo nmcli device wifi list` command to list the detected hotspots.
3. Use the `sudo wifi_connect "SSID" "PASSWD"` command to connect to a hotspot. The following message indicates a successful connection.
    ```shell
    root@ubuntu:~# sudo wifi_connect "WiFi-Test" "12345678" 
    Device 'wlan0' successfully activated with 'd7468833-4195-45aa-aa33-3d43da86e1a7'.
    ```
    :::tip
    If the following message appears after attempting to connect to a hotspot, it means the hotspot was not found. You can run `sudo nmcli device wifi rescan` to rescan and try connecting again.
    
    ```shell
    root@ubuntu:~# sudo wifi_connect "WiFi-Test" "12345678" 
    Error: No network with SSID 'WiFi-Test' found.
    ```
    :::

### Soft AP Mode

The development board's wireless network runs in Station mode by default. To use Soft AP mode, follow the steps below.

1. Install `hostapd` and `isc-dhcp-server`.

    ```shell
    sudo apt update
    sudo apt install hostapd
    sudo apt install isc-dhcp-server
    ```

2. Run the `sudo vim /etc/hostapd.conf` command to configure `hostapd.conf`, paying attention to the following fields:

    ```shell
    interface=wlan0 # Network card acting as the AP hotspot
    ssid=Sunrise # WiFi name
    wpa=2 # 0 for WPA, 2 for WPA2, typically 2
    wpa_key_mgmt=WPA-PSK # Encryption algorithm, typically WPA-PSK
    wpa_passphrase=12345678 # Password
    wpa_pairwise=CCMP # Encryption protocol, typically CCMP
    ```

      - For a hotspot without a password, add the following content to the `hostapd.conf` file:

    ```shell
    interface=wlan0
    driver=nl80211
    ctrl_interface=/var/run/hostapd
    ssid=Sunrise
    channel=6
    ieee80211n=1
    hw_mode=g
    ignore_broadcast_ssid=0
    ```

      - For a hotspot with a password, add the following content to the `hostapd.conf` file:

    ```shell
    interface=wlan0
    driver=nl80211
    ctrl_interface=/var/run/hostapd
    ssid=Sunrise
    channel=6
    ieee80211n=1
    hw_mode=g
    ignore_broadcast_ssid=0
    wpa=2
    wpa_key_mgmt=WPA-PSK
    wpa_pairwise=CCMP
    wpa_passphrase=12345678
    ```

      - For RDK X5, you can configure a 5GHz hotspot by modifying the `hw_mode` and `channel` fields in the `hostapd.conf` file:

    ```shell
    channel=36
    hw_mode=a
    ```

3. Configure the `isc-dhcp-server` file as follows:

    - Run `sudo vim /etc/default/isc-dhcp-server` to modify the `isc-dhcp-server` file, adding the defined network interface:
    ```shell
    INTERFACESv4="wlan0"
    ```
    - Run `sudo vim /etc/dhcp/dhcpd.conf` to modify the `dhcpd.conf` file, uncommenting the following field:
    ```shell
      authoritative;
    ```
    - Then add the following configuration at the end of the `/etc/dhcp/dhcpd.conf` file:
    ```shell
      subnet 10.5.5.0 netmask 255.255.255.0 { # Subnet and netmask
      range 10.5.5.100 10.5.5.254; # Usable IP range
      option subnet-mask 255.255.255.0; # Netmask
      option routers 10.5.5.1; # Default gateway
      option broadcast-address 10.5.5.31; # Broadcast address
      default-lease-time 600; # Default lease time, in seconds
      max-lease-time 7200; # Maximum lease time, in seconds
    }
    ```

4. Stop the `wpa_supplicant` service and restart `wlan0`.

    ```bash
    systemctl mask wpa_supplicant
    systemctl stop wpa_supplicant

    ip addr flush dev wlan0
    sleep 0.5
    ifconfig wlan0 down
    sleep 1
    ifconfig wlan0 up
    ```

5. Start the `hostapd` service as follows:
   - Run the `sudo hostapd -B /etc/hostapd.conf` command.
   ```bash
    root@ubuntu:~# sudo hostapd -B /etc/hostapd.conf
   
    Configuration file: /etc/hostapd.conf
    Using interface wlan0 with hwaddr 08:e9:f6:af:18:26 and ssid "sunrise"
    wlan0: interface state UNINITIALIZED->ENABLED
    wlan0: AP-ENABLED
   ```
   - Use the `ifconfig` command to configure the IP and subnet of the wireless interface `wlan0`, ensuring consistency with the configuration in step 3.
    ```bash
    sudo ifconfig wlan0 10.5.5.1 netmask 255.255.255.0
    ```
   - Finally, start the DHCP server. When connected to the hotspot, the client will be assigned an IP address ranging from `10.5.5.100` to `10.5.5.255`.
    ```bash
    sudo ifconfig wlan0 10.5.5.1 netmask 255.255.255.0
    sudo systemctl start isc-dhcp-server
    sudo systemctl enable isc-dhcp-server
    ```

6. Connect to the development board's hotspot, e.g., `sunrise`.   
![image-20220601203025803](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/network/image-20220601203025803.png)  

7. To switch back to Station mode, follow the steps below:

    [RDK X5]

    ```bash
    # Stop hostapd
    killall -9 hostapd
    
    # Clear wlan0 address
    ip addr flush dev wlan0
    sleep 0.5
    ifconfig wlan0 down
    sleep 1
    ifconfig wlan0 up
    
    # Restart wpa_supplicant
    systemctl unmask wpa_supplicant
    systemctl restart wpa_supplicant

    # Reload wifi driver
    rmmod aic8800_fdrv 
    modprobe aic8800_fdrv

    # Connect to hotspot. Refer to the previous section "Wireless Network" for details.
    wifi_connect "WiFi-Test" "12345678"
    ```

    [Other]

    ```bash
    # Stop hostapd
    killall -9 hostapd
    
    # Clear wlan0 address
    ip addr flush dev wlan0
    sleep 0.5
    ifconfig wlan0 down
    sleep 1
    ifconfig wlan0 up
    
    # Restart wpa_supplicant
    systemctl unmask wpa_supplicant
    systemctl restart wpa_supplicant
    
    # Connect to hotspot. Refer to the previous section "Wireless Network" for details.
    wifi_connect "WiFi-Test" "12345678"
    ```

### Soft AP Mode (NetworkManager): RDK X5 (>= 3.3.0) RDK X3 (>= 3.0.2)

Newer system versions can also use NetworkManager to create a WiFi hotspot.

Click the wireless network icon in the top-right corner of the desktop and select `Edit Connections...`

![image-wifi1](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-wifi1.png)

Click the `+` button in the bottom-left corner, and select `Wi-Fi` as the Connection Type.

![image-wifi2](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-wifi2.png)

Under the `Wi-Fi` tab, fill in the SSID, Mode, and Band.

Enter your desired hotspot name in the SSID field.

Select `Hotspot` as the Mode.

For Band, you can choose `Automatic`, `A (5 GHz)`, or `B/G (2.4 GHz)`.

![image-wifi3](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-wifi3.png)

Under the `Wi-Fi Security` tab, select the encryption method and enter the password.

![image-wifi4](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-wifi4.png)

Reboot the board or run `restart_network` to apply the configuration.

## DNS Service

Video: https://www.bilibili.com/video/BV1rm4y1E73q/?p=13

DNS (Domain Name Server) is a server that translates domain names into their corresponding IP addresses.

The DNS configuration of the development board is managed through the `/etc/systemd/resolved.conf` file. Users can modify this file to configure DNS settings. The steps are as follows:

1. Modify the `resolved.conf` file to add DNS server addresses, for example:

    ```bash
    DNS=8.8.8.8 114.114.114.114
    ```

2. Apply the DNS configuration using the following commands:

    ```bash
    sudo systemctl restart systemd-resolved
    sudo systemctl enable systemd-resolved
    sudo mv /etc/resolv.conf  /etc/resolv.conf.bak
    sudo ln -s /run/systemd/resolve/resolv.conf /etc/
    ```

## System Update

For system security and stability, it is recommended that users update the system using the `apt` command after installation.

The `/etc/apt/source.list` file contains the list of software sources for the `apt` command. Before installing software, you need to update the package list using the `apt` command.

First, open a terminal and enter the following command:
```bash
sudo apt update
```

Next, upgrade all installed packages to their latest versions using the following command:
```bash
sudo apt full-upgrade
```

:::tip
It is recommended to use the `full-upgrade` option instead of `upgrade`, as it will also update dependent packages when related dependencies change.

When running the `sudo apt full-upgrade` command, the system will prompt you about the data download size and disk usage. However, `apt` does not check if there is sufficient disk space. It is recommended that users manually check using the `df -h` command. Additionally, the deb files downloaded during the upgrade are saved in the `/var/cache/apt/archives` directory. Users can delete these cache files using the `sudo apt clean` command to free up disk space.
:::

After executing the `apt full-upgrade` command, drivers, kernel files, and some system software may be reinstalled. It is recommended that users manually reboot the device for the updates to take effect, using the following command:

```bash
sudo reboot
```

## Bluetooth Configuration

:::info Note
Starting from version 3.0.0, Bluetooth starts by default with the system, and no manual re-initialization is required. This behavior is consistent on both the RDK X3 and RDK X5 platforms.
:::

### Initialization

If the Bluetooth function on the development board is not enabled by default and the device is not visible with `hciconfig`, you can run the `/usr/bin/startbt.sh` script to initialize it. This script performs the following tasks:

- Initializes Bluetooth
- Runs `hciconfig hci0 up` to bring the Bluetooth link up
- Runs `hciconfig hci0 piscan` to perform Bluetooth scanning

Video: https://www.bilibili.com/video/BV1rm4y1E73q/?p=9

The log after a successful script execution is as follows:

![image-20220601172145987](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-20220601172145987.png)

Additionally, users can check if the Bluetooth process is running normally using the following command:

```bash
ps ax | grep "/usr/bin/dbus-daemon\|/usr/lib/bluetooth/bluetoothd"
/usr/bin/dbus-daemon

/usr/lib/bluetooth/bluetoothd
```

### Communication Interfaces

To fully leverage the expansion capabilities of the development board, the current hardware design integrates a variety of interfaces and peripheral resources.

Due to interface layout and hardware resource allocation constraints, the development board does not replicate all communication interfaces of the Bluetooth module.

Currently, only the `BT_RX` and `BT_TX` two-wire mode is provided, which can meet basic functions such as AT command interaction and data transmission without real-time requirements.

For Bluetooth modules based on the UART interface, the different interface connection methods and their corresponding functions are as follows:

- Basic Communication Mode (UART Only)
- - Interface Pins: `BT_RX`, `BT_TX`
- - Functional Features: Asynchronous serial data communication over UART (e.g., AT command interaction, low-rate data transmission). No flow control mechanism. Risk of data packet loss and buffer overflow during baud rate overload or continuous high-volume data transmission.
- Enhanced Transmission Mode (with Hardware Flow Control)
- - Interface Pins: `BT_RX`, `BT_TX`, `BT_CTS`, `BT_RTS`
- - Functional Features: Effectively avoids the risk of data packet loss and buffer overflow. Supports A2DP high-fidelity unidirectional audio streaming.
- Voice Communication Mode (PCM Synchronous Interface)
- - Interface Pins: `PCM_SYNC`, `PCM_DIN`, `PCM_CLK`, `PCM_DOUT`
- - Functional Features: Supports real-time bidirectional audio transmission over SCO links, e.g., HFP/HSP.

### USB Bluetooth

For advanced use of Bluetooth features, such as high-speed, stable communication in `SPP` (Bluetooth Virtual Serial Port) mode, bandwidth quality assurance in `PAN` (Bluetooth Virtual Network Adapter) mode, or avoiding audio interruptions in `A2DP` (High-Fidelity Unidirectional Audio Streaming) mode, it is recommended to use a `USB Bluetooth module`.

The development board integrates drivers for common Bluetooth modules such as `USB2.0-BT` and `CSR8510 A10`, which directly support most firmware-free USB Bluetooth modules.

![image-USB2.0-BT](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-USB2.0-BT.png)

![image-CSR8510](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-CSR8510.png)

![image-hci1](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-hci1.png)

For `Realtek` series Bluetooth modules, additional `firmware` support is required. Obtain the firmware adapted for the Linux platform from the module manufacturer and place it in the designated directory before normal use.

### Network Configuration and Connection

Run `sudo bluetoothctl` to enter the interactive Bluetooth configuration interface. Device information similar to the image below indicates that the Bluetooth device has been recognized. Use `show` to view Bluetooth information, paying attention to the `powered` and `discoverable` states.

![image-20220601172604051](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-20220601172604051.png)

Run `power on` to enable Bluetooth, as shown in the image below:

![image-20220601172501882](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-20220601172501882.png)

To make the Bluetooth device discoverable by nearby devices, run `discoverable on` to enable Bluetooth and turn on the discoverable property, as shown below:

![image-20220601172648853](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-20220601172648853.png)

Now, you can use a mobile phone or computer to scan for the Bluetooth device with the name `ubuntu`, as shown in the image below:

![image-20220601175322650](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-20220601175322650.jpg)

Next, test the active scanning function of Bluetooth. In the interactive interface of `bluetoothctl`, enter `scan on` to enable active scanning. It will periodically print nearby devices. You can see that my mobile phone device has been discovered. Enter `scan off` to disable the scanning function and summarize the scanned Bluetooth devices.

![image-20220601154131158](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-20220601154131158.png)

![image-20220601154253947](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-20220601154253947.png)

Then comes the pairing with other Bluetooth devices:

- Pairing command: `pair [targetMAC]`, after entering this command, follow the prompts to enter `yes`, and the remote Bluetooth device will select the `Pair` option to complete the pairing.

- After successful pairing, you can use `trust [targetMAC]` to automatically connect next time.

![image-20220601154414717](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/hardware_interface/image-20220601154414717.png)

After the above operations, the basic functions of Bluetooth scanning and pairing are completed. For more functions, please refer to the official help documentation of `BlueZ`.
