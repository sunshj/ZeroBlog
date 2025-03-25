---
date: 2022-05-06 13:09
path: /articles/cuda-pytorch
tags:
  - Python
  - 教程
  - 总结
title: CUDA+PyTorch环境配置
---

Cuda和cuDNN以及pytorch安装<!--more-->

## 一、CUDA和cuDNN安装

### 1、查看系统信息

在win10的搜索框里搜索 NVIDIA Control Panel，左下角找到`系统信息`，在`组件`中查看`NVCUDA64.DLL`版本。

| ![](https://cdn.jsdelivr.net/gh/sunshj/Staticfile/img/cuda-01.png) |
| :----------------------------------------------------------------: |

### 2、CUDA下载链接

最新版本下载链接: https://developer.nvidia.com/zh-cn/cuda-downloads

找过去的版本，在上面的链接页面中找到CUDA早期版本档案，对应的链接是：https://developer.nvidia.com/cuda-toolkit-archive

找到后，选择对应的操作系统`Operating System`，架构`Architecture`（一般默认x86_64），系统版本（`version`）（10就是win10），安装类型`Installer Type`（网好就network，一般都选local）

### 3、安装

双击之后弹出的界面，选择的路径是临时解压文件夹，解压完成会自动删除文件夹，CUDA会安装在`C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\`。

### 4、环境变量

安装完成后会默认配置bin和libnvvp文件夹，还需要添加lib\x64文件夹。

| ![](https://cdn.jsdelivr.net/gh/sunshj/Staticfile/img/cuda-02.png) |
| :----------------------------------------------------------------: |

### 5、验证

在命令行输入：

```
nvcc -V
```

打印内容：

> nvcc: NVIDIA (R) Cuda compiler driver
> Copyright (c) 2005-2021 NVIDIA Corporation
> Built on Fri_Dec_17_18:28:54_Pacific_Standard_Time_2021
> Cuda compilation tools, release 11.6, V11.6.55
> Build cuda_11.6.r11.6/compiler.30794723_0s

### 6、下载cuDNN

下载链接：https://developer.nvidia.com/rdp/cudnn-download
需要注册一个NVIDA账号，登录之后才可以下载。

### 7、安装cuDNN

解压下载的文件后得到三个文件夹`bin、 include、 lib`，把这三个文件夹中的所有内容分别放到之前cuda对应的文件夹中，`bin->bin、include->include、lib->lib/x64/`。

## 二、pytorch安装

### 1、安装

pytorch官网：[pytorch](https://pytorch.org/)

选择自己合适的配置，然后去下载就好了

```
pip3 install torch==1.11.0+cu113 torchvision==0.12.0+cu113 torchaudio===0.11.0+cu113 -f https://download.pytorch.org/whl/cu113/torch_stable.html
```

### 2、验证

在python环境中输入以下代码：

```python
import torch
x = torch.rand(5, 3)
print(x)
```

输出类似于：

> tensor([[0.3380, 0.3845, 0.3217],
        [0.8337, 0.9050, 0.2650],
        [0.2979, 0.7141, 0.9069],
        [0.1449, 0.1132, 0.1375],
        [0.4675, 0.3947, 0.1426]])

如果想检查GPU驱动和CUDA是否可以被PyTorch使用，运行以下命令：

```python
import torch
torch.cuda.is_available()
```

输出为True，表示安装成功。
