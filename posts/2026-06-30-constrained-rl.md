---
title: "Constrained RL"
date: "2026-06-30"
author: "Idan Shenfeld"
tags: ["tutorial"]
excerpt: "A step-by-step guide for adding new blog posts, with examples of images, equations, and formatting."
featured: false
image: "https://improbable-ai.github.io/images/constrained-rl-preview.jpg"
---

# A short Introduction to Constrained RL

![Bad illustration of Constrained RL, thanks to DALLE](posts/constrained_rl/image.png)

Bad illustration of Constrained RL, thanks to DALLE

In many real-world applications of reinforcement learning — from robotics to healthcare to finance — it's not enough to simply maximize reward. Agents must also operate safely, ethically, or within resource limits. For example, a robot vacuum should clean as efficiently as possible without damaging furniture; a trading algorithm might seek profit while limiting risk exposure. These kinds of *constraints* are essential but often hard to encode directly into standard RL objectives. This is where **Constrained Reinforcement Learning (CRL)** comes in — a principled framework that extends classic RL to handle hard or soft limits on agent behavior. In this post, we'll explore how CRL works, why it's tricky, and the tools that help make it practical.

## Background - Constrained Optimization

### The Lagrangian Method

A typical constrained optimization problem can be written as:

$$
\min_x f(x) \quad s.t \quad g_i(x)\leq0, \forall i=1,…,m
$$

For simplicity we only write inequality constraints, but this can be easily extended to equality constraints.

- $f(x)$: Objective function to minimize.
- $g_i(x)$: Inequality constraints.

---

To solve this problem, we introduce the **Lagrangian function**:

$$
L(x,\lambda)=f(x)+\sum_{i=1}^m \lambda_i g_i(x)
$$

- $\lambda_i \geq 0$: Lagrange multipliers for the constraints.

The Lagrange multipliers $\lambda$ measure the sensitivity of the objective function $f(x)$ to changes in the constraints. A key insight is that a constrained optimum can often be identified by finding the stationary points of the Lagrangian.

---

### Karush-Kuhn-Tucker (KKT) Conditions

The **KKT conditions** extend the Lagrangian method to inequality constraints and define the necessary conditions for optimality. At an optimum $(x^*,\lambda^*)$, the following must hold:

1. **Stationarity**:
    
    $\nabla_x \mathcal{L} (x^\star, \lambda^\star, \mu^\star)= \nabla f(x^\star) + \sum_{i=1}^m \lambda_i^\star \nabla g_i(x^\star) = 0$
    
2. **Primal feasibility**:
    
    $g_i(x^*) \leq 0 \, \text{for all } i$
    
3. **Dual feasibility**:
    
    $\lambda_i^* \geq 0 \, \text{for all } i$
    
4. **Complementary slackness**:
    
    $\lambda_i^* g_i(x^*) = 0 \, \text{for all } i$
    

---

### The Primal and Dual problems

Notice that the original problem, with hard constraints, is equivalent to taking the lagrangian multipliers to infinity. Therefore, we can write it in the following way, which is called the **primal problem**:

$$
\min_x\max_\lambda L(x,\lambda)
$$

Instead of solving the primal problem directly, we can solve its **dual problem:**

$$
\max_\lambda \min_x L(x,\lambda)
$$

In general, solving these two problems doesn't always leads to the same solution. However, in constrained RL, under mild assumptions, **the solutions of the primal and dual problems are identical** ([Paternain et al. 2019](https://proceedings.neurips.cc/paper/2019/file/c1aeb6517a1c7f33514f7ff69047e74e-Paper.pdf), [Rozada et al. 2023](https://arxiv.org/pdf/2408.10015)). 

---

### Solving the Lagrangian problem

In cases where analytical solution of the KKT conditions is not possible (like when working with NNs), we can use iterative methods. In the case where the solution of the primal and dual problems are identical, it implies that an optimal primal-dual pair $(x^⋆, \lambda^⋆)$ is a saddle point of the Lagrangian $L(x, \lambda)$, and satisfies the mini-max condition

$$
L(x, \lambda^⋆) \leq L(x^⋆, \lambda^⋆) \leq L(x^⋆, \lambda)
$$

To find this saddle point, we can use an iterative approach, alternating between minimizing $L$ with respect to $x$, while keeping $\lambda$ fixed, and maximizing $L$ with respect to $\lambda$ while keeping $x$ fixed. For some problems (most RL problems in them [Chamon et al. 2022](https://arxiv.org/abs/2103.05134)), this process will converge to the saddle point. 

## Constrained Reinforcement Learning

Constrained Reinforcement Learning (CRL) extends the principles of constrained optimization to reinforcement learning. Now instead of optimizing $x$ we optimize the policy $\pi$. The main objective, $\min_x f(x)$ becomes the discounted reward objective:

$$
\max_\pi J(\pi) =\max_\pi\mathbb E_{\pi}\left[\sum_{t=1}\gamma^tr(s_t,a_t)\right]
$$

The constraints also need to be a function of $\pi$, and the most common way to express them is as an expectation:

$$
C_i(\pi) =\mathbb E_{\pi}\left[\sum_{t=1}\gamma_i^tc_i(s_t,a_t)\right]\leq0 \quad \forall i=1,...,m
$$

The function $c_i(s_t,a_t)$ is the instantaneous constraint function, and $\gamma_i$ is the discount factor of constraint $i$. The Lagrangian of the CRL is:

$$
L(\pi, \lambda) =\mathbb E_{\pi}\left[\sum_{t=1}\gamma^tr(s_t,a_t)\right]+\sum_{i=1}^m\lambda_i\mathbb E_{\pi}\left[\sum_{t=1}\gamma_i^tc_i(s_t,a_t)\right]
$$

### Dual-Primal method for CRL

Notice that Assuming $\gamma_i=\gamma$ for each one of the constraints, then the Lagrangian becomes:

$$
L(\pi, \lambda) =\mathbb E_{\pi}\left[\sum_{t=1}\gamma^t\left(r(s_t,a_t)+\sum_{i=1}^m\lambda_ic_i(s_t,a_t)\right)\right]
$$

For a fixed set of Lagrangian multipliers, this is a non-constrained RL problem with an augmented reward function $\tilde r(s_t,a_t)=r(s_t,a_t)+\sum_{i=1}^m\lambda_ic_i(s_t,a_t)$. This lead to the following iterative algorithm:

1. Solve for $\pi$ using the reward $\tilde r$ using any model-free RL algorithm.
2. Update each Lagrange multiplier using the gradient step $\nabla\lambda_i= \mathbb E_\pi[\sum_t\gamma^tc_i(s_t,a_t)]$

This is the most standard way to handle CRL ([Borkar et al. 2005](https://www.sciencedirect.com/science/article/pii/S0167691104001276?casa_token=VhQ5ghdt1ogAAAAA:MyWhCsrltqnTRuGnKOt80euQiJUbbZ0i81CHmypB31w1gOPlopPnrbu_2VdRDCqSA5hUdXVG2A), [Tessler et al. 2019](https://arxiv.org/pdf/1805.11074)) , and what people usually mean when they say "solving with Lagrangian". Usually, step 1 will not be solved until convergence, but only for a few optimization steps (see [Paternain et al. 2022](https://arxiv.org/pdf/1911.09101) for an analysis of this approximation).

<aside>
💡

A useful trick is to have a separate Q network (or Value network in algorithms like PPO) for every reward and constraint. Then use the property that:

$$
Q_{\tilde r}(s,a)=Q_r(s,a)+\sum_{i=1}^m\lambda_iQ_{c_i}(s,a)
$$

That way the Q network doesn't need to be changed every time we change the Lagrange multipliers ([Achiam et al. 2017](https://arxiv.org/pdf/1705.10528)).

</aside>

### Problems with the Lagrangian Formulation in CRL

There are some known issues with the formulation presented above:

1. **Expectation Constraints and Instantaneous Violations.** While the constraints are expressed as expectations, this does not guarantee that the instantaneous constraint $c_i(s_t,a_t)\leq0$ is respected at every time step.
2. **Oscillations in the Primal-Dual Algorithm.** Oscillatory behavior in primal-dual updates arises from the interdependence between the primal variables (policy $\pi$ and dual variables (Lagrange multipliers $\lambda$). When the policy does not violates a constraint, the dual update decrease. This can cause the policy to constraint violations in the opposite direction, which will lead to the multiplier to increase. 
3. **Estimating constraint in off-policy RL**. To update the Lagrangian multiplier, an estimation of the expected violation of the constraint is needed. This can be hard to estimate in off-policy RL and requires OPE methods.

## Beyond Primal-Dual Descent

Below is a list of tricks\algorithms that fix some of the issues mentioned above, and the papers they were taken from.

### **The Augment Lagrangian Method**

The pure Lagrangian method struggles with numerical issues, especially when constraints are violated during optimization. The ALM improves stability and convergence by introducing **penalty terms** that discourage constraint violations during intermediate steps.

The **Augmented Lagrangian** adds penalty terms to the Lagrangian:

$$
L_A(\pi, \lambda, \rho) = J(\pi) + \sum_{i=1}^m \lambda_i C_i(\pi) + \frac{\rho}{2} \sum_{i=1}^m C_i(\pi)^2
$$

where $\rho > 0$: A penalty parameter. In addition, the Lagrangian multiplier update is changed to $\lambda_i \leftarrow \lambda_i + \rho C_i(\pi)$.

The Augmented Lagrangian Method enhances the regular Lagrangian methods by adding penalty terms that explicitly discourage constraint violations during optimization. This prevents instability or oscillations often seen in pure Lagrangian methods when constraints are far from being satisfied in intermediate steps.

### **Worst Case Constraints**

One of the main issues with the standard Lagrangian method is that it only enforces constraints **in expectation**. This means that while the average cost might satisfy the constraints, the policy can still produce episodes with severe violations. 

Some works tried to find alternatives, usually by using another statistical quantity, such as max or quantile instead of expectation. A good example is [WCSAC](http://www.st.ewi.tudelft.nl/mtjspaan/pub/Yang21aaai.pdf), where another quantity named **CVaR** is used as a constrained. CVaR is a risk measure that quantifies the expected cost in the *tail* of a distribution, beyond a certain threshold. Given a confidence level $\alpha \in (0, 1]$, CVaR calculates the average cost among the $1 - \alpha$ worst-case trajectories.

<aside>
💡

Although the math behind it can sound fancy, this is a very simple method to implement that helps reduce constraint violation tremendously. This will be my go-to if simple Lagrangian is not working well enough.

</aside>

### **Last-Iterate Convergence**

As we discussed earlier, the standard Lagrangian method solves constrained RL problems by formulating them as a min-max optimization. The policy optimization step tries to maximize the reward while the dual ascent updates ensure constraints are satisfied. While this approach works *in expectation*, it comes with a critical drawback: it only guarantees **average-iterate convergence**. In other words, the average behavior of the policy over training may satisfy the constraints, but the **final policy** — the one we care about in practice — might oscillate between maximizing rewards and enforcing constraints.

Some works offer more sophisticated algorithms, like [optimistic mirror descent](https://proceedings.mlr.press/v202/moskovitz23a/moskovitz23a.pdf), to solve this problem. This method anticipates the gradient's direction to prevent oscillations and guide the policy toward a stable solution that satisfies both the reward and constraint objectives.