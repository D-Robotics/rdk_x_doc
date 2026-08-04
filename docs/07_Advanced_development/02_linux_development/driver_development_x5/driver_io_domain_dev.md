---
sidebar_position: 7
---

# IO-DOMAIN 调试指南

IO-Domain 用来配置 X5 部分模块的电压域，以 RGMII 接口为例，如果电路设计时外接电压域为 3.3V，则需要配置 RGMII 模块的 IO-DOMAIN 为 3.3V，如果电路设计时外接电压域为 1.8V，则需要配置为 1.8v，需要注意的是：

-   外接电压域为 3.3V 而对应的 IO-DOMAIN 配置为 1.8V 时，可能会对芯片有损伤；
-   外接电压域为 1.8V 而对应的 IO-DOMAIN 配置为 3.3V 时，相应的模块可能无法正常工作；

## 驱动代码

### 代码位置

```bash
drivers/pinctrl/hobot/ # pinctrl 驱动代码源文件所在文件夹
include/linux/platform_data/pinctrl-single.h # pinctrl 驱动代码头文件
```

### IO-DOMAIN 的 DTS

X5 的 Pinctrl 功能相关定义位于 SDK 包 kernel 文件夹下的 arch/arm64/boot/dts/hobot/pinmux-func.dtsi 文件内。

由于 IO-Domain 在 pinctrl-single 的框架下实现，因此其 DTS 和 pinctrl 的类似，在 IO-Domain 的 DTS 里已经列出了所有模块 1.8V 和 3.3V 的配置组，客户一般不需要修改，在具体开发时根据实际情况选择使用即可。

比较特殊的是 SD 和 SDIO 两组 IO-Domain 的配置。由于在芯片 PAD 上 SD 与 SDIO 的电压域会被同时配置，我们默认使用 SD 及 SDIO 的 MMC 控制器来独立控制 SD/SDIO 的 PIN 的电压域，配置选项为自定义的“power-source”宏，如下所示：

```c
...
	pconf_sd_sdio_ds12_padctrl_3v3: pconf-sd-sdio-ds12-padctrl-3v3 {
		bias-pull-up;
		power-source = <HORIZON_IO_PAD_CTRL_VOLTAGE_3V3>;
		drive-strength = <12>;
	};

	pconf_sd_sdio_pu_ds12_padctrl_1v8: pconf-sd-sdio-ds12-padctrl-1v8 {
		bias-pull-up;
		power-source = <HORIZON_IO_PAD_CTRL_VOLTAGE_1V8>;
		drive-strength = <12>;
	};
...

	pinctrl_sd: sdgrp {
		horizon,pins = <
			HSIO_SD_WP		HSIO_PINMUX_2	BIT_OFFSET24	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SD_CLK		HSIO_PINMUX_2	BIT_OFFSET22	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SD_CMD		HSIO_PINMUX_2	BIT_OFFSET20	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SD_CDN		HSIO_PINMUX_2	BIT_OFFSET18	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SD_DATA0	HSIO_PINMUX_2	BIT_OFFSET16	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SD_DATA1	HSIO_PINMUX_2	BIT_OFFSET14	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SD_DATA2	HSIO_PINMUX_2	BIT_OFFSET12	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SD_DATA3	HSIO_PINMUX_2	BIT_OFFSET10	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
		>;
	};

	pinctrl_sdio: sdiogrp {
		horizon,pins = <
			HSIO_SDIO_WP	HSIO_PINMUX_2	BIT_OFFSET8	MUX_ALT0		&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SDIO_CLK	HSIO_PINMUX_0	BIT_OFFSET30	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SDIO_CMD	HSIO_PINMUX_0	BIT_OFFSET28	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SDIO_DATA0	HSIO_PINMUX_1	BIT_OFFSET0		MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SDIO_DATA1	HSIO_PINMUX_2	BIT_OFFSET30	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SDIO_DATA2	HSIO_PINMUX_2	BIT_OFFSET28	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
			HSIO_SDIO_DATA3	HSIO_PINMUX_2	BIT_OFFSET26	MUX_ALT0	&pconf_sd_sdio_pu_ds12_ipctrl
		>;
	};
...
```

### 驱动调用时 DTS 配置

首先，在 DTS 内定义当前硬件特殊的电压域配置，以配置 pwm0 ch1 为 1.8V 为例：

```c
&lsio_iomuxc {
    pinctrl_pwm0_1_1v8: pinctrl-pwm0-1_1v8 {
        horizon,pins = <
            LSIO_SPI2_SSN	LSIO_PINMUX_1	BIT_OFFSET18	MUX_ALT3	&pconf_pwm_1v8
        >;
    };
}
```

和 pinctrl 的使用方法类似，驱动在自己的 DTS 中引用需要配置的 IO-Domain，以 pwm 驱动为例，配置如下：

```c
&pwm0 {
    ...
    pinctrl-names = "default";
    pinctrl-0 = <&pinctrl_pwm0_1_1v8>; /* 将pwm0 Ch1 配置为1.8V电压域，PWM0功能 */
    ...
};
```

### 驱动调用示例代码

和 Pinctrl 调用方法一致，驱动先通过 Pinctrl-names 查找对应的 pinctrl state，然后再切换到对应的 state。

```c
static int hobot_xxx_probe(struct platform_device *pdev)
{
    ...
    g_xxx_dev->pinctrl = devm_pinctrl_get(&pdev->dev);
    if (IS_ERR(g_xxx_dev->pinctrl)) {
        dev_warn(&pdev->dev, "pinctrl get none\n");
        g_xxx_dev->pins_voltage = NULL;
    }
    ...
        /* 按照pinctrl-names lookup state */
        g_xxx_dev->pins_voltage = pinctrl_lookup_state(g_xxx_dev->pinctrl,
                "xxx_voltage_func");
    if (IS_ERR(g_xxx_dev->pins_voltage)) {
        dev_info(&pdev->dev, "xxx_voltage_func get error %ld\n",
                PTR_ERR(g_xxx_dev->pins_voltage));
        g_xxx_dev->pins_voltage = NULL;
    }
    ...
        /* select state */
        if (g_xxx_dev->pins_voltage) {
            ret = pinctrl_select_state(g_xxx_dev->pinctrl, g_xxx_dev->pins_voltage);
            if (ret) {
                dev_info(&pdev->dev, "xxx_voltage_func set error %d\n", ret);
            }
        }
    ...
}
```

## uboot 下修改电压域

X5 的 Uboot 内已实现了 Pinctrl 驱动，使用方法与内核一致，均通过 DTS 来定义具体的 Pin 的属性。
