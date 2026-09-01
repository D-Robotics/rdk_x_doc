---
sidebar_position: 3
---

# 1.3 入门配置

:::tip

本章节介绍的入门配置方式仅支持在 RDK X3 、RDK X5 和 RDK X3 Module 型号的开发板上使用；

系统版本不低于 `2.1.0`。

:::

:::info 📋 配置前请先完成系统安装

配置前请先完成系统安装，系统镜像下载请参考：[下载资源汇总](./download)

:::

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## 连接 Wi-Fi

<Tabs groupId="rdk-type">
<TabItem value="desktop" label="Desktop">

使用菜单栏右上角的 Wi-Fi 管理工具连接 Wi-Fi，如下图所示，点击需要连接的 Wi-Fi 名，然后在弹出的对话框中输入 Wi-Fi 密码。


![image-20231127111045649](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/20250507-160653.jpg)


![image-20231127111253803](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/20250507-160732.jpg)

</TabItem>

<TabItem value="server" label="Server">

使用 srpi-config 工具连接 Wi-Fi。

执行 `sudo srpi-config` 命令，选择 System Options -> Wireless LAN ，根据提示依次输入 Wi-Fi 名（`SSID`） 和 密码（`passwd`）。

![image-20231127112139204](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/image-20231127112139204.png)

</TabItem>
</Tabs>

## 开启 SSH 服务

当前系统版本默认开启 SSH 登录服务，用户可以使用本方法开、关 SSH 服务。

<Tabs groupId="rdk-type">
<TabItem value="desktop" label="Desktop">

通过菜单栏找到`RDK Configuration` 项，点击打开。

![image-20231127112029088](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/srpi-config/20250507-160737.jpg)

选择 Interface Options -> SSH 项，根据提示选择使能或者关闭 `SSH` 服务。

![image-20231127115151834](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/20250507-160740.jpg)

</TabItem>

<TabItem value="server" label="Server">

执行 `sudo srpi-config`命令进入配置菜单。选择 Interface Options -> SSH 项，根据提示选择使能或者关闭 `SSH` 服务。

![image-20231127115009424](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/srpi-config/20250507-160737.jpg)

</TabItem>

</Tabs>

SSH 的使用请查看 [远程登录 - SSH 登录](./remote_login#ssh)。

## 开启 VNC 服务

<Tabs groupId="rdk-type">
<TabItem value="desktop" label="Desktop">

通过菜单栏找到`RDK Configuration` 项，点击打开。

![image-20231127112029088](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/02_System_configuration/image/srpi-config/20250507-160737.jpg)

选择 Interface Options -> VNC 项，根据提示选择使能或者关闭`VNC` 服务。选择使能 `VNC` 时需要设置登录密码，密码必须是一个 8 位长度的由字符组成的字符串。

![image-20231127112202713](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/20250507-160744.jpg)

</TabItem>
</Tabs>

VNC 的使用请查看 [远程登录 - VNC 登录](./remote_login#vnc-登录)。

## 设置登录模式

<Tabs groupId="rdk-type">
<TabItem value="desktop" label="Desktop">

桌面图形化系统，支持四种登录模式：

1. 开启图形化界面，自动登录
2. 开启图形化界面，用户手动登录
3. 字符终端，自动登录
4. 字符终端，用户手动登录

X5 系列板卡暂时不支持字符终端登录模式。

通过菜单栏找到`RDK Configuration` 项，点击打开。选择 System Options -> Boot / Auto Login 项进入如下配置项。根据需求选择对应项。

![image-20231127112703844](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/image-20231127112703844.png)

重启后生效。

</TabItem>

<TabItem value="server" label="Server">

字符终端，支持两种登录模式：

1. 字符终端，自动登录
2. 字符终端，用户手动登录

执行 `sudo srpi-config`命令进入配置菜单。选择 System Options -> Boot / Auto Login 项进入如下配置项。根据需求选择对应项。

重启后生效。

</TabItem>
</Tabs>

## 设置中文环境

<Tabs groupId="rdk-type">
<TabItem value="desktop" label="Desktop">

通过菜单栏找到`RDK Configuration` 项，点击打开。选择 Localisation Options -> Locale 项进入如下配置。

第一步：选择选择需要用到的语言环境（多选），一般选中 `en_US.UTF-8 UTF-8` 和 `zh_CN.UTF-8 UTF-8`两项即可。回车确认进入下一步。

![image-20231127113356503](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/image-20231127113356503.png)

第二步：选择默认的语言环境，中文环境选择 `zh_CN.UTF-8 UTF-8` 即可。回车确认后需要等待一会完成配置。

第三步：重启开发板，使最新配置生效。`sudo reboot`

:::tip

开机会提示：要不要更新 home 目录下的几个常用文件夹的名称。
建议选择 `Don't ask me again` `Keep Old Name`， 这样可以保持用户工作目录下的 `Desktop  Documents  Downloads` 等目录名不随语言环境发生变化。

:::

</TabItem>

<TabItem value="server" label="Server">

执行 `sudo srpi-config`命令进入配置菜单。选择 Localisation Options -> Locale 项进入如下配置。

第一步：选择选择需要用到的语言环境（多选），一般选中 `en_US.UTF-8 UTF-8` 和 `zh_CN.UTF-8 UTF-8`两项即可。回车确认进入下一步。

![image-20231127113356503](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/image-20231127113356503.png)

第二步：选择默认的语言环境，中文环境选择 `zh_CN.UTF-8 UTF-8` 即可。回车确认后需要等待一会完成配置。

第三步：重启开发板，使最新配置生效。`sudo reboot`

</TabItem>
</Tabs>

## 设置中文输入法

<Tabs groupId="rdk-type">
<TabItem value="desktop" label="Desktop">

第一步：在桌面端找到 EN 输入法标志，右键点击首选项

![QQ_1IGglEVRSO.png](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/20250507-160754.jpg)

第二步：点击输入法——>右侧添加——>选择中文

![QQ_MxWDZrZ7Wk.png](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/20250507-160757.jpg)

第三步：选择智能拼音，最后右上角 EN 就可以右键选择智能拼音

![QQ_rICn3iU1Vc.png](https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/01_Quick_start/image/configuration_wizard/20250507-160805.jpg)

</TabItem>
</Tabs>



## 用户管理

**修改用户名**

以新用户名为 usertest 为例

```shell
#关闭sunrise用户所有进程
sudo pkill -u sunrise
#sunrise用户改名为usertest
sudo usermod -l usertest sunrise
#用户的家目录改为/home/usertest
sudo usermod -d /home/usertest -m usertest
#修改用户密码
sudo passwd usertest
```

最后将`/etc/lightdm/lightdm.conf.d/22-hobot-autologin.conf`文件中的 `autologin-user=sunrise` 改为`autologin-user=usertest`，更新自动登录的用户名称

**增加新用户**

以新增用户为 usertest 为例

```shell
sudo useradd -U -m -d /home/usertest -k /etc/skel/ -s /bin/bash -G disk,kmem,dialout,sudo,audio,video,render,i2c,lightdm,vpu,gdm,weston-launch,graphics,jpu,ipu,vps,misc,gpio usertest
sudo passwd usertest
sudo cp -aRf /etc/skel/. /home/usertest
sudo chown -R usertest:usertest /home/usertest
```

也可以参考修改用户名，将新增用户设为自动登录用户
