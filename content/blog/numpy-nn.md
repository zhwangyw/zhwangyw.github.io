---
title: "用 NumPy 手写一个两层神经网络"
date: "2026-08-02"
tags: ["PyTorch", "深度学习"]
summary: "从张量乘法到反向传播，用 60 行代码跑通 MNIST 一个 batch。"
---

# 用 NumPy 手写一个两层神经网络

理解深度学习最快的方式，是抛开框架手写一遍前向与反向传播。

## 前向传播

$z = W_2 \cdot \mathrm{ReLU}(W_1 x + b_1) + b_2$

## 反向传播

对输出层计算梯度，再通过链式法则回传到第一层。

```python
import numpy as np

def forward(x, W1, b1, W2, b2):
    h = np.maximum(0, x @ W1 + b1)
    y = h @ W2 + b2
    return h, y
```

跑通一个 batch 后，再换成 PyTorch 的 `nn.Module` 就能理解框架帮你做了什么。
