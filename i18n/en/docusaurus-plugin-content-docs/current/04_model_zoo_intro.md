---
sidebar_position: 4
---

# 4 Model Zoo

```mdx-code-block
import DocScope from '@site/src/components/DocScope';
```

## Product overview

This is the Model Zoo for RDK series boards: a collection of ready-to-deploy model examples for developers.

:::tip Tip

Model Zoo on GitHub: https://github.com/D-Robotics/rdk_model_zoo
:::

Through this repository you can access:

1. **D-Robotics heterogeneous models**: `.bin` models for classification, detection, segmentation, NLP, and more—selected and tuned for efficient on-board performance.
2. **Hands-on guides**: Each model ships with a Jupyter Notebook (introduction, usage, sample code, and comments). Some models also include performance notes and tuning suggestions.
3. **Integrated tooling**: Use the Python `bpu_infer_lib` API on RDK boards for fast deployment. The notebooks (including preprocessing scripts and inference flows) help you learn the API quickly.

## User manual

<DocScope versions=">= 3.0.0" products="RDK-X3">
  [Model Zoo User Manual](https://developer.d-robotics.cc/model_zoo_doc/en/model_zoo_intro?v=3.0.0&p=RDK+X3)
</DocScope>

<DocScope versions=">= 3.0.0" products="RDK-X5">
  [Model Zoo User Manual](https://developer.d-robotics.cc/model_zoo_doc/en/model_zoo_intro?v=3.5.0&p=RDK+X5)
</DocScope>
