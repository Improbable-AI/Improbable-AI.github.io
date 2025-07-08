---
title: "Is RL Truly Pushing LLM Reasoning Beyond its Base Capabilities?"
date: "2026-07-07"
author: "Idan Shenfeld"
tags: ["RL", "LLM"]
excerpt: "Reinforcement learning can boost existing responses in LLMs, but without extensive sampling, it struggles to generate truly novel reasoning behaviors beyond the base model."
featured: false
# image: "https://improbable-ai.github.io/images/constrained-rl-preview.jpg"
---


# Is RL Truly Pushing LLM Reasoning Beyond its Base Capabilities?

A recent paper from Tsinghua University [1] posed an intriguing and somewhat provocative question:

> "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?"
> 

To dig into this, the authors introduced an idea called the *reasoning capability boundary*. Here's the intuition:  They repeatedly generated responses from the base model to the same prompt. As they increase the number of samples (up to 1024), they get a set of all possible responses the model might give. This set of possible answers is the boundary of the model's current reasoning capability.

![While RL models shows better Pass@1, their advantage disappear at Pass@k for large k. Figure from [1].](posts/is-rl-truly-pushing-llm-reasoning/image.png)


What they found is that even after RL from Verifiable Rewards (RLVR) training, the model's answers were still inside the boundary of the base model. Or, in their words:

> “RLVR does not elicit fundamentally new reasoning patterns; instead, the reasoning capabilities of RLVR-trained models remain bounded by those of their base models.”
> 

In other words, RL seems mostly good at reweighing probabilities, not discovering entirely new answers.

Wait, hold on—this is strange! There are multiple works online where robots start cluelessly stumbling around before eventually mastering complicated tasks like walking or even backflips, using only RL. Clearly, RL can discover new behaviors in robotics. So why doesn’t it seem to do the same for language models?

### What's happening under the hood?

To clarify what's going on, let’s briefly dip our toes into theory. RL for language models usually involves optimizing a KL-regularized objective:

$$\max_\pi \mathbb{E}\_{y \sim \pi}[r(x, y)] - \beta D_{KL}(\pi \| \pi_0)$$

Here, $\pi$ is your learned policy, $\pi_0$ your base model, $x$ is your prompt, and $y$ your response.

Research from frameworks like DPO [2] or Korbak et al. [3] shows us that the optimal solution has a neat closed-form:

$$
\pi^*(y|x) \propto \pi_0(y|x) e^{\frac{1}{\beta} r(x,y)}
$$

At first glance, two points immediately stand out:

1. **Nothing is impossible:** Due to the softmax output in LLMs, no response has zero probability. It can, however, be infinitesimally small.
2. **Rewards massively amplify probabilities:** With typical reward values (like 1 for correct answers) and standard $\beta$ around 0.05 (Example from the default in the popular TRL library), probabilities of correct sequences are boosted astronomically, by factors up to billions (think $e^{20}\approx 5 \times 10^8$).

This theoretical insight leads us to an exciting conclusion: RL absolutely can elevate the probability of previously extremely unlikely sequences to meaningful levels.

But here's the catch—why aren't we seeing it happen?

### The hidden bottleneck: sampling

In practice, RL in language models relies heavily on sampling responses to learn from. The model adjusts probabilities based on sampled answers and associated rewards. However:

**You can't learn something you've never seen**. Therefore, if an answer is initially so improbable that it doesn’t show up in your sampled set, RL never gets the chance to boost it.

Thus, RL tends to operate in two regimes:

1. **Probability Re-weighting:** Small-scale setups reshuffle probabilities of answers already commonly sampled.
2. **Discovery of New Answers:** Large-scale setups with extensive sampling budgets start uncovering and learning entirely novel responses.

We actually have evidence for the existence of this second phase of discovering new behaviors. It appears when you scale enough. For instance, since R1 Zero [4] was trained on top of open-source models, we can directly compare its outputs with the reasoning boundary of its base models. Even experiments on small samples of prompts show that these answers are extremely unlikely under the base model and don’t resemble outputs in the boundary set.

Further, a recent paper from Nvidia [5] demonstrated that novel behaviors could emerge even in a relatively small 1.5B model, provided you scale the RL training sufficiently, both in task diversity and the number of gradient steps. Their analysis showed the model generating responses completely outside the reasoning boundary of its base model, achieving 100% pass@1 on prompts where the base model scored 0% pass@k, even for large k.

![            Scaling up RL can lead to model that surpass the base models even at Pass@k. Figure from [5].](posts/is-rl-truly-pushing-llm-reasoning/image%201.png)

            Scaling up RL can lead to model that surpass the base models even at Pass@k. Figure from [5].

### Looking to the future

RL isn't inherently limited; it’s practically constrained by our current sampling methods and compute budgets. While the big industrial labs push the boundary by scaling things up, not everyone has Google-scale resources. However, there are a few directions we can take to help mitigate the issue even at a smaller scale:

- **Better Exploration:** Exploration outside the capability boundary of the model is the fastest way to discover new behaviors. This isn’t a new challenge, RL researchers have worked on it for years, concluding there’s no universal solution. But what if we focused specifically on language models? Could domain-specific strategies help?
    
    An interesting point is that the exploration needed for language models presents a unique challenge. We aren’t just seeking new answers to known prompts - we are searching specifically for novel reasoning patterns and strategies.
    
- **Off-Policy Algorithms:** On-policy methods are popular, but off-policy methods, which reuse previously collected data, could vastly improve sample efficiency, leading to exceeding the capability boundary even at a smaller scale. Adopting off-policy approaches would also enable the use of different prompts and inference-time algorithms for exploration, currently restricted by the need to remain strictly on-policy.

[1] Yue, Yang, et al. "Does reinforcement learning really incentivize reasoning capacity in llms beyond the base model?." *arXiv preprint arXiv:2504.13837* (2025).

[2] Rafailov, Rafael, et al. "Direct preference optimization: Your language model is secretly a reward model." *Advances in Neural Information Processing Systems* 36 (2023): 53728-53741.

[3] Korbak, Tomasz, Ethan Perez, and Christopher Buckley. "RL with KL penalties is better viewed as Bayesian inference." *Findings of the Association for Computational Linguistics: EMNLP 2022*. (2022)

[4] Guo, Daya, et al. "Deepseek-r1: Incentivizing reasoning capability in llms via reinforcement learning." *arXiv preprint arXiv:2501.12948* (2025).

[5] Liu, Mingjie, et al. "ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models." *arXiv preprint arXiv:2505.24864* (2025).