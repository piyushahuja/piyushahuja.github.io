---
layout: post-normal
title: REINFORCE
date:   2024-05-28 09:00:11
tag:
categories: rl
excerpt:
permalink: /reinforce
comments: false
---

In some settings, it makes sense to have an agent follow a "policy" that outputs an action given a state. 
For example, if the state space is continuous or too large, it would be difficult to store value functions. 

There's always a deterministic policy for any MDP.

State aliasing: If you are only partially observing the environment, or your features limit your view of the world, then it can be optimal to use a stochastic policy, in which case policy search methods can be better than value methods.

## How do we improve the policy during training?

One way is a class of methods called "Policy gradient" (as opposed to PPO).

These model and optimize the policy directly (rather than indirectly). The policy is usually modeled with a parameterized function with respect to $\theta$. There are situations where it is more efficient to represent policy than value functions. 

The value of the reward (objective) function depends on this policy and then various algorithms can be applied to optimize for the best reward.

## Benefits

* **Better convergence properties**: Value-based methods can oscillate or diverge. With policy gradients, you smoothly update your policy. You don't get dramatic changes in what action you are going to take. You make incremental changes to policy in the direction that makes policy better.

* **Effective in continuous action spaces** (e.g., robot control, trying to show the perfect advert): Value-based methods require finding the maximum, which can be prohibitively expensive.

## Why does gradient of log of policy appear, not the policy itself?

The **log trick** (likelihood ratio trick): $$\nabla_{\theta} \pi_{\theta} = \pi_{\theta} \cdot \nabla_{\theta} \log \pi_{\theta}$$ makes the math work cleanly with sampling.

**Assumptions:**
1. The policy is differentiable (doesn't have to be differentiable everywhere, but only when it is actually picking actions, i.e., when it is non-zero)
2. We know the gradient because we created our policy (Gaussian, softmax — alternatively to $\epsilon$-greedy)

We want to optimize expected return:

$$\nabla_{\theta} J(\theta) = \nabla_{\theta} \mathbb{E}_{\tau} [R(\tau)] = \mathbb{E}_{\tau} \left[ R(\tau) \nabla_{\theta} \log p_{\theta}(\tau) \right]$$

This pulls the gradient outside the sampling process.

The trajectory probability is a product of policy probabilities over time, the log of a product becomes a sum of logs. Only the policy depends on $\theta$, so we ignore the rest when computing gradients.

$$\nabla_{\theta} J(\theta) = \mathbb{E}_{\tau} \left[ \sum_{t=0}^{T-1} \nabla_{\theta} \log \pi_{\theta}(a_t | s_t) \cdot R(\tau) \right]$$

## Softmax Policy for Discrete Actions

Alternative to $\epsilon$-greedy:

$$\pi_i = \frac{e^{z_i}}{\sum_j e^{z_j}}$$

$$\log(\pi_i) = z_i - \log\left(\sum_j e^{z_j}\right)$$

The gradient with respect to each logit $z_k$ is:

$$\frac{\partial \log(\pi_i)}{\partial z_k} = 
\begin{cases} 
1 - \pi_i & \text{if } k = i \\
-\pi_k & \text{if } k \neq i 
\end{cases}$$

In a linear softmax policy, logits are:

$$z_a(s) = \theta_a^T s$$

(Weight actions using linear combination of features)

$$\log(\pi_{\theta}(i|s)) = \theta_i^T s - \log\left(\sum_b e^{\theta_b^T s}\right)$$

Derivative w.r.t parameters $\theta_k$:

$$\frac{\partial \log(\pi_{\theta}(i|s))}{\partial \theta_k} = 
\begin{cases} 
s \cdot (1 - \pi_{\theta}(i|s)), & \text{if } k = i \\
-s \cdot \pi_{\theta}(k|s), & \text{if } k \neq i 
\end{cases}$$

For a single step with return $G_t$ and learning rate $\alpha$:

The update rule for the parameters $\theta_k$ is given by:

$$\theta_k \leftarrow \theta_k + \alpha \cdot G_t \cdot \nabla_{\theta_k} \log(\pi_{\theta}(a_t | s_t))$$

This implies:

If the chosen action is $k = a_t$:

$$\theta_{a_t} \leftarrow \theta_{a_t} + \alpha \cdot G_t \cdot (1 - \pi_{\theta}(a_t | s_t)) \cdot s_t$$

For other actions:

$$\theta_k \leftarrow \theta_k - \alpha \cdot G_t \cdot \pi_{\theta}(k | s_t) \cdot s_t$$

If a feature occurs and gets more reward, we want to adjust the policy to have more of that feature.

-----
Limitations of Linear modeL:
A single flat hyperplane divides state space into “prefer action i” vs. “prefer action j” If the environment is simple and separable, this works. But it cannot capture complex, non-linear decision regions



First layer warps the state space into a feature space. In feature space, the final decision is still linear → hyperplanes in feature space When mapped back to the original state space, those hyperplanes become curved, flexible surfaces. 


----




**Example**: Gaussian policy for continuous actions.

## Implementation

The function gives you discounted, normalized returns per step, ready for use in policy gradient loss calculation:

```python
def calculate_stepwise_returns(rewards, discount_factor):
    returns = []
    R = 0
    for r in reversed(rewards):
        R = r + R * discount_factor 
        returns.insert(0, R)
    returns = torch.tensor(returns)
    normalized_returns = (returns - returns.mean()) / returns.std()
    return normalized_returns

def calculate_loss(stepwise_returns, log_prob_actions):
    loss = -(stepwise_returns * log_prob_actions).sum()
    return loss

def forward_pass(env, policy, discount_factor):
    log_prob_actions = []
    rewards = []
    done = False
    episode_return = 0
    policy.train()
    observation, info = env.reset()
    while not done:
        observation = torch.FloatTensor(observation).unsqueeze(0)
        action_pred = policy(observation)
        action_prob = F.softmax(action_pred, dim = -1)
        dist = distributions.Categorical(action_prob)
        action = dist.sample()
        log_prob_action = dist.log_prob(action)
        observation, reward, terminated, truncated, info = env.step(action.item())
        done = terminated or truncated
        log_prob_actions.append(log_prob_action)
        rewards.append(reward)
        episode_return += reward
    log_prob_actions = torch.cat(log_prob_actions)
    stepwise_returns = calculate_stepwise_returns(rewards, discount_factor)
    return episode_return, stepwise_returns, log_prob_actions

def update_policy(stepwise_returns, log_prob_actions, optimizer):
    stepwise_returns = stepwise_returns.detach()
    loss = calculate_loss(stepwise_returns, log_prob_actions)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    return loss.item()

def main():
    MAX_EPOCHS = 500
    DISCOUNT_FACTOR = 0.99
    N_TRIALS = 25
    REWARD_THRESHOLD = 475
    PRINT_INTERVAL = 10
    INPUT_DIM = env.observation_space.shape[0]
    HIDDEN_DIM = 128
    OUTPUT_DIM = env.action_space.n
    DROPOUT = 0.5
    episode_returns = []
    policy = PolicyNetwork(INPUT_DIM, HIDDEN_DIM, OUTPUT_DIM, DROPOUT)
    LEARNING_RATE = 0.01
    optimizer = optim.Adam(policy.parameters(), lr = LEARNING_RATE)
    for episode in range(1, MAX_EPOCHS+1):
        episode_return, stepwise_returns, log_prob_actions = forward_pass(env, policy, DISCOUNT_FACTOR)
        _ = update_policy(stepwise_returns, log_prob_actions, optimizer)
        episode_returns.append(episode_return)
        mean_episode_return = np.mean(episode_returns[-N_TRIALS:])
        if episode % PRINT_INTERVAL == 0:
            print(f'| Episode: {episode:3} | Mean Rewards: {mean_episode_return:5.1f} |')
        if mean_episode_return >= REWARD_THRESHOLD:
            print(f'Reached reward threshold in {episode} episodes')
            break
```

This computes:  

$$
G_t = r_t + γ*r_{t+1} + γ^2*r_{t+2}
$$


**Example:**
```python
rewards = [1, 0, 0, 2]
discount_factor = 0.9
# Raw returns: [2.458, 1.62, 1.8, 2]
# Normalized: tensor([ 1.57, -1.13, -0.55,  0.11])
```


------

Linear REINFORCE updates are global in state space.

REINFORCE Has High Variance


- $$G_t$$ is a single noisy Monte Carlo sample of the return
- Updates are global — changing $\theta_a$ affects all states in a linear policy
- Learning is unstable. Especially early on, a single high-return trajectory can push the policy too far, hurting generalization. Lucky or unlucky episodes can cause big policy swings. Risk of catastrophic forgetting caused by over-updating from a single trajectory

We can reduce variance by subtracting a baseline:

Instead of $$G_t$$, use:

$$A_t = G_t - b(s_t)$$

$$b(s_t)$$ is a baseline ($$V(s_t)$$ in Actor-Critic)


If an action does as expected, no need to shift policy If it's better than expected, increase probability. If worse, decrease probability

Reduces variance because only deviations from expected return drive updates.  Smaller, more targeted updates, Less destabilizing global shifts in policy weights

Episode-based update (REINFORCE): High variance (needs normalization or baseline). Learning is slow if episodes are long

All modern policy gradient methods (PPO, A2C, A3C, SAC) include:

A critic, Advantage normalization, Or mini-batch updates



Step-based update (Actor-Critic):

Lower variance, More sample-efficient
A2C/A3C were breakthrough algorithms for: Continuous learning in long episodes, Scaling RL to Atari and 3D environments



Resources:


https://karpathy.github.io/2016/05/31/rl/


https://spinningup.openai.com/en/latest/spinningup/exercises.html#problem-set-1-basics-of-implementation