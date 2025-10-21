---
layout: post-normal
title: Policy Gradient Methods
date:   2025-07-28 09:00:11
tag:
categories: ml
excerpt:
permalink: /reinforce
comments: false
---

 One way to solve RL tasks is by estimating how "good" a state or state/action pair is, and then we could have our agent behave greedily. Here, by state, one can think of finding out the best board configurations of Chess and Go. 

The other way is to model and optimize the policy directly (rather than indirectly). The value of the reward function depends on this policy and then various algorithms can be applied to optimize for the best reward. These are policy based methods. 


How does backprop work with RL? https://x.com/dwarkesh_sp/status/1969120074104783270

Application: https://cursor.com/en/blog/tab-rl

-----

Policy based methods are better in the following settings:
* There are situations where it is more efficient to represent policy than value functions. If the state space is continuous or too large, it would be difficult to store value functions.  In continuous action spaces* (e.g., robot control, trying to show the perfect advert): Value-based methods require finding the maximum, which can be prohibitively expensive.
* If you are only partially observing the environment, or your features limit your view of the world, then it can be optimal to use a stochastic policy, in which case policy search methods can be better than value methods. 
* Value-based methods can oscillate or diverge. With policy gradients, you smoothly update your policy. You don't get dramatic changes in what action you are going to take. You make incremental changes to policy in the direction that makes policy better.

----
**Policy gradients help us find direction of improving reward in an environment that involves non-differentiable computation** 

The objective in RL is to maximize the expected return over trajectories:

$$J(\theta) = E_{\tau \sim \pi_{\theta}} [R(\tau)]$$

Where a trajectory $$\tau = (s_0, a_0, s_1, a_1, ..., s_T, a_T)$$.


We would like to find the parameters that maximize this, and for that we would like to find the gradient of the function with respect to $$\theta$$.  But we can't find the gradient here, because the function involves non-differentiable computation, in particular, (stochastic sampling from unknown transition dynamics)


How come? 

An RL episode consists of:

* The policy $$\pi_{\theta}$$ maps the state $$s_t$$ to an action $$a_t$$ (this could be stochastic).
* The environment then transitions to $$s_{t+1}$$ and provides a reward $$r_t$$.

$$s_t → π_θ(a_t) → Environment → s_{t+1}, r_t$$

This is non-differentiable, naive backpropogation doesn't work, because:

* Action is sampled (discrete or stochastic). There is no gradient through sampling. 
* The transition in the environment $$s_t, a_t ↦ s_{t+1}$$ is a black box, implying that we do not have knowledge how the environment selects state based on action. 
* Similarly, the reward $$r_t = R(s_t, a_t)$$ is also a black box, indicating that we do not have knowledge of the reward that the environment provides based on our action and the state. We cannot compute $$∂R/∂a$$


We are unable to apply the chain rule from the reward back to $$θ$$ in a continuous manner because we cannot determine how the sampling or environmental reward changes with $$θ$$.

So how do we find the gradient?



**First trick: Pull the gradient outside the sampling process.**

$$\nabla_{\theta} J(\theta) = E_{\tau \sim \pi_{\theta}} [R(\tau) \cdot \nabla_{\theta} \log \pi_{\theta}(\tau)]$$

Often, we are aware of the policy's gradient because we can select it to be differentiable (e.g., Gaussian, softmax, differentiable neural network, etc.). Through the log trick: $$\nabla_{\theta} \pi_{\theta} = \pi_{\theta} \cdot \nabla_{\theta} \log \pi_{\theta}$$, we can also compute the gradient of the log policy, which simplifies the mathematics involved.


**Second trick: Factorizing the trajectory probability:**


The trajectory probability is a product of policy probabilities over time, the log of a product becomes a sum of logs. Only the policy depends on $$\theta$$, so we ignore the rest when computing gradients.

$$\pi_{\theta}(\tau) = p(s_0) \prod_{t=0}^{T} \pi_{\theta}(a_t | s_t) p(s_{t+1} | s_t, a_t)$$


$$\nabla_{\theta} J(\theta) = \mathbb{E}_{\tau} \left[ \sum_{t=0}^{T-1} \nabla_{\theta} \log \pi_{\theta}(a_t | s_t) \cdot R(\tau) \right]$$


**Third Trick: Credit assignment** (this also reduces the variance)

Instead of using the same R(τ) for all timesteps, we can refine credit assignment by using the return from each step onward:

$$R_t = Σ_{k=t}^{T} γ^{k−t} * r_k$$


The trajectory return  $$R(τ)$$ and stepwise return  forms are mathematically equivalent in expectation

Then the gradient becomes:


$$∇_θ J(θ) = E_{τ∼π_θ} [ Σ_{t=0}^{T} R_t * ∇_θ log π_θ(a_t | s_t) ]$$



Using full  $$𝑅(𝜏)$$ gives the same weight to every action that can high variance in long episodes. Using stepwise  gives more precise credit assignment to actions closer to the rewards. This is variance reduction but keeps the estimator unbiased.

We could calculate the expectation above by Monte Carlo sampling of trajectories. 
As we sample the trajectory,  we can compute the log-prob  of each action and per step return, to calculate the gradient. Now we know the direction in which to update the parameters. 

This gives the first algorithm: REINFORCE

for each episode till end of episode:
* take the observation
* action = policy(observation)
* reward, next observation  = environment(action)
* collect_reward(reward)
* collect_log_prob_action(action)
* go back to front

After episode finishes:
* calculate stepwise returns from list of rewards
* calculate loss function as described by equation above = stepwise return* log prob action
* calculate gradient and make parameter update in gradient direction, scaled by learning rate. 



----------

What if we could model the environment and reward function as differentiable?

If we could model the environment and reward function as differentiable (as in differentiable simulators)

$$
f: s_{t+1} = f(s_t, a_t)
$$
$$s_{t+1}$$ is differentiable

$$
r_t = g(s_t, a_t)
$$

$$r_t$$ is differentiable

Then you could skip policy gradient and just do end-to-end backpropagation:

$$
\nabla_{\theta} R = \sum_{t} \frac{\partial R}{\partial a_t} \frac{\partial a_t}{\partial \theta}
$$

This is much more sample-efficient because you use true gradients instead of REINFORCE’s noisy estimates.


----

## Illustration: Softmax Policy for Discrete Actions

In value based methods, we follow the policy of $$\epsilon$$-greedy. Here is an alternative stochastic policy, where we sample each action with the following probability. 

$$\pi_i = \frac{e^{z_i}}{\sum_j e^{z_j}}$$

$$\log(\pi_i) = z_i - \log\left(\sum_j e^{z_j}\right)$$

The gradient with respect to each logit $$z_k$$ is:

$$\frac{\partial \log(\pi_i)}{\partial z_k} = 
\begin{cases} 
1 - \pi_i & \text{if } k = i \\
-\pi_k & \text{if } k \neq i 
\end{cases}$$

In a linear softmax policy, logits are:

$$z_a(s) = \theta_a^T s$$

$$\log(\pi_{\theta}(i|s)) = \theta_i^T s - \log\left(\sum_b e^{\theta_b^T s}\right)$$

Derivative w.r.t parameters $$\theta_k$$:

$$\frac{\partial \log(\pi_{\theta}(i|s))}{\partial \theta_k} = 
\begin{cases} 
s \cdot (1 - \pi_{\theta}(i|s)), & \text{if } k = i \\
-s \cdot \pi_{\theta}(k|s), & \text{if } k \neq i 
\end{cases}$$

For a single step with return $$R_t$$ and learning rate $$\alpha$$:

The update rule for the parameters $$\theta_k$$ is given by:

$$\theta_k \leftarrow \theta_k + \alpha \cdot R_t \cdot \nabla_{\theta_k} \log(\pi_{\theta}(a_t | s_t))$$

This implies:

If the chosen action is $$k = a_t$$:

$$\theta_{a_t} \leftarrow \theta_{a_t} + \alpha \cdot R_t \cdot (1 - \pi_{\theta}(a_t | s_t)) \cdot s_t$$

For other actions:

$$\theta_k \leftarrow \theta_k - \alpha \cdot R_t \cdot \pi_{\theta}(k | s_t) \cdot s_t$$

The Policy Gradient theorem tells us that to maximize the expected reward, we need to pull our parameters in the direction that increases the probability of good actions, and decreases the probability of bad actions. 

The direction of the gradient is the state feature vector s.If a trajectory gives high reward, we push the weights towards the features of that state, so the policy will pick this action more often in similar states.

If taking an action in a state leads to high reward, we adjust the policy parameters to increase the probability of taking that action in similar states (i.e., states with similar features) [^Note]

[^Note]: The linear model is very limited, because  it cannot capture complex, non-linear decision regions. it represents a single flat hyperplane divides state space into “prefer action i” vs. “prefer action j”, If the environment is simple and separable, this works.  In practice, we use neural networks, whose layers warps the state space into a feature space. In feature space, the final decision is still linear → hyperplanes in feature space When mapped back to the original state space, those hyperplanes become curved, flexible surfaces. 

--------



The big problem with REINFORCE is variance:

$$R_t$$ is a single noisy Monte Carlo sample of the return.  Especially early on, a single high-return trajectory can push the policy too far, hurting generalization. Lucky or unlucky episodes can cause big policy swings. Risk of catastrophic forgetting caused by over-updating from a single trajectory. 


We can reduce variance by subtracting a baseline:

Instead of $$R_t$$, use:

$$A_t = R_t - b(s_t)$$

$$b(s_t)$$ is a baseline ($$V(s_t)$$ in Actor-Critic)


This is called Actor-Critic: Reduces variance because only deviations from expected return drive updates.  Smaller, more targeted updates, less destabilizing global shifts in policy weights.

All modern policy gradient methods (PPO, A2C, A3C, SAC) include a critic.

We can further reduce variance by advantage normalization and using mini-batch updates.


The second problem is Monte Carlo estimates require waiting for the episode to finish to compute the true 
step wise returns. Learning is slow and unstable if episodes are long. rwards far in the future still propagate back with high variance. For tasks like robot locomotion or Atari games with 10,000+ steps. 

A2C/A3C were breakthrough algorithms for: Continuous learning in long episodes


-----




## PyTorch Implementation of REINFORCE for Cartpole and Pong


## The Policy Network


**Cartpole** 

Here we define a two layer policy network that outputs logits (on which we can apply softmax). 

```python
class PolicyNetwork(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim, dropout):
        super().__init__()
        self.layer1 = nn.Linear(input_dim, hidden_dim)
        self.layer2 = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(dropout)
    def forward(self, x):
        x = self.layer1(x)
        x = self.dropout(x)
        x = F.relu(x)
        x = self.layer2(x)
        return x
```

**Pong** 

Here we define a two layer policy network that outputs the probability of action UP. 

```python
class PolicyNetwork(nn.Module):
    def __init__(self, input_dim=6400, hidden_dim=512):
        super().__init__()
        self.layer1 = nn.Linear(input_dim, hidden_dim, bias=False)
        self.leaky_relu = nn.LeakyReLU()
        self.layer2 = nn.Linear(hidden_dim, 1, bias=False)
        self.sigmoid = nn.Sigmoid()
        # self.dropout = nn.Dropout(dropout)
    def forward(self, X):
        out = self.linear1(X)
        out = self.leaky_relu(out)
        out = self.linear2(out)
        out = self.sigmoid(out)
        return out
```

Dropout is a regularization technique to prevent overfitting: randomly "drops" (sets to zero) a fraction of neurons at each step, forces the network to not rely too heavily on specific neurons, encouraging robust feature learning, At inference (test time), dropout is turned off, and weights are scaled to reflect full capacity.

Leaky ReLU is a variant of ReLU activation. Problem with ReLu:  Neurons can "die" (always output 0 for negative inputs → gradients vanish). Leaky ReLU: allows a small, non-zero gradient for negative inputs

Other things you can do
Batch Normalization ```self.bn1 = nn.BatchNorm1d(hidden_dim)```
Weight Initialization: Control how weights are initialized for stability and convergence.
```
nn.init.xavier_uniform_(self.layer1.weight)
nn.init.zeros_(self.layer1.bias)
```

Other things you can do:
* Experiment with hidden sizes (e.g., 128, 256, 512).
* Monitor loss curves and gradients (TensorBoard/Matplotlib)
* Use normalized inputs (observations scaled to [0,1] or standardized), Consider reward normalization in RL training.
* Use GPU when possible (.to(device)), Save checkpoints frequently (torch.save).

------

## Step Returns from rewards

Given a trajectory of rewards, the folllowing function gives you discounted, normalized returns per step, ready for use in policy gradient loss calculation:
$$
G_t = r_t + γ*r_{t+1} + γ^2*r_{t+2}
$$



**Cartpole** 
```python
def calculate_stepwise_returns(rewards, discount_factor):
    returns = []
    R = 0
    for r in reversed(rewards):
         #  if r != 0: R = 0 reset the sum; game boundary (pong)
        R = r + R * discount_factor 
        returns.insert(0, R)
    returns = torch.tensor(returns)
    normalized_returns = (returns - returns.mean()) / returns.std()
    return normalized_returns
```
**Example:**
```python
rewards = [1, 0, 0, 2]
discount_factor = 0.9
# Raw returns: [2.458, 1.62, 1.8, 2]
# Discounted normalized returns: tensor([ 1.57, -1.13, -0.55,  0.11])
```



-----

## Forward Pass

**Cartpole**

In a forward pass, we collect an observation, run it through the stochastic policy that outputs a distribution over actions, then sample an action, collect the log probability of action and the reward, then use the collected rewards to find discounted normalized returns per step. 

```python
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
```




**Pong**

For Pong, we preprocess the input


```python
  # preprocess the observation, set input to network to be difference image
current_observation = image_preprocess(observation, device=device)
input_observation = cur_observation - prev_observation if prev_observation  is not None else torch.zeros(D).to(device)
prev_observation  = cur_observation 
```

get the output (action probabilities), sample the action, collect the reward.

```python
action_prob = model(input_observation)
dist = torch.distributions.Bernoulli(probs=action_prob)
action = dist.sample()
 # action = 1 if np.random.uniform() < output.item() else 0  roll the dice!    
 # record value
observations.append(input_observation )  # observation
gt_labels.append(action)  # label
 # step the environment and get new measurements
observation, reward, terminated, truncated, info = env.step(action)
cumulative_return += reward
rewards.append(reward)
if terminated or truncated:  # an episode finished, multiple played games
        episode_number += 1
        batch_mean_reward.append(reward_sum)
```


Pong episodes are very long compared to CartPole, so we batch episodes together, which helps with variance reduction. 

```python
# stack inputs, targets and rewards into a batch
inputs = torch.stack([torch.tensor(i) for i in observations]).to(device)
stepwise_returns = calculate_stepwise_returns(rewards, discount_factor, device=device)
targets = torch.stack([torch.tensor(i) for i in gt_labels]).to(device).float()
```

-----

**Calculating loss and backpropagation. That is the core learning step.**


Once we have stepwise returns and log probability of actions, we can calculate loss:

$$∇_θ J(θ) = E_{τ∼π_θ} [ Σ_{t=0}^{T} R_t * ∇_θ log π_θ(a_t | s_t) ]$$




 **Cartpole**
```python
def update_policy(stepwise_returns, log_prob_actions, optimizer):
    stepwise_returns = stepwise_returns.detach()
    loss = -(stepwise_returns * log_prob_actions).sum()
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    return loss.item()
```

You usually don’t want to track gradients during the environment interaction. You often recompute log-probs at training time for stability and because you may want to process the whole trajectory as a batch
When you call policy_forward, instead of discarding the raw logits, store them:

```python
output = model(preprocessed_observation)
logit_buffer.append(output)  # store logits for training
```
At training time, use the stored logits instead of calling model(inputs) again. Saves computation. Uses more memory (store one logit per timestep) and may complicate batching.

**Pong** 
```python
 # Calculate Loss and Grads
action_probs = model(inputs)
log_prob_actions = nn.BCELoss(reduction='none')(action_probs.squeeze(-1), targets) / batch_size  # batch_size == grad accumulation iterations
loss = log_prob_actions * stepwise_returns
loss = loss.sum()  # not average, since each episode is used as a one data sample
weighted_loss.backward()
```
batch_size represents number of episodes per update. If you divide by batch_size, each episode contributes a smaller gradient, effectively an average gradient, just a scaling to keep gradient magnitudes reasonable. equivalent to using a smaller learning rate.



In PyTorch: `log_prob_actions` is a differentiable tensor (requires grad). `loss.backward()` computes the REINFORCE. gradient
`Categorical(action_prob).log_prob(action)` already stores a computation graph w.r.t. the model parameters.





For a binary action with sigmoid output $$p$$, the log-likelihood of the policy is given by:

$$
\log(\pi(a|s)) = 
\begin{cases} 
\log(p) & \text{if action = 1} \\
\log(1 - p) & \text{if action = 0}
\end{cases}
$$



The Binary Cross-Entropy (BCE) loss function is defined as:

BCE(p, y) = -[y * log(p) + (1 - y) * log(1 - p)]

This can be broken down into two cases:

1. If y = 1, the BCE loss becomes -log(p)
2. If y = 0, the BCE loss becomes -log(1 - p)

Interestingly, this is exactly the same as the negative log probability used in the REINFORCE algorithm.
The BCE loss is equivalent to the negative log-likelihood for a Bernoulli distribution. 


The Pong version first calculates a supervised BCE loss (same as negative of log prob for two action space) and then weights it by step returns, creating a policy gradient. The supervised loss at time t, denoted as supervised_loss_t, is given by the cross entropy (BCE) of the model predictions at time t and the action at time t. This can be represented mathematically as:

$$supervised\_loss_t = BCE(actionprobs_t, a_t) = -log(\pi_\theta(a_t | s_t))$$

Where:
$$\pi_\theta(a_t | s_t)$$ is the probability of action $$a_t$$ given state $$s_t$$ under policy $$ \theta $$.

The loss per timestep $$L_t$$ is given by the product of the reward-to-go $$G_t$$ and the negative log probability of the action given the state. This can be represented mathematically as:

$$L_t = R_t * (-log(\pi_\theta(a_t | s_t)))$$

Where:
- $$R_t$$ is the reward-to-go (discounted return) at time t.



We could also do as in Cartpole:

```python
log_probs = torch.log_softmax(model_preds, dim=-1)
log_prob_actions = log_probs.gather(1, targets.unsqueeze(1)).squeeze(1)
loss = -(discounted_r * log_prob_actions).sum()
loss.backward()
```

Use Adam optimizer (with learning rate decay).
Try weight decay (L2 regularization).

-------


## Training Loop


First, you define your hyperparameters:

**Cartpole**

```python
MAX_EPOCHS = 500
DISCOUNT_FACTOR = 0.99
N_TRIALS = 25
REWARD_THRESHOLD = 475
PRINT_INTERVAL = 10
```

**Pong**
```python
# hyperparameters
hidden_dim = 200
batch_size = 64  # how many episodes to do a param update after
learning_rate = 0.01
DISCOUNT_FACTOR = 0.99  # discount factor for reward
weight_decay = 1e-4
```



Then you construct your network

```python
# Defines network architecture parameters based on environment’s state and action spaces.
INPUT_DIM = env.observation_space.shape[0] # Input dimension (state size)
HIDDEN_DIM = 128 # Number of neurons in hidden layer
OUTPUT_DIM = env.action_space.n # Number of actions (output dim)
DROPOUT = 0.5 # Dropout probability in policy network
policy = PolicyNetwork(INPUT_DIM, HIDDEN_DIM, OUTPUT_DIM, DROPOUT)
```


And then you run a loop that does (1) forward passes and (2) parameter updates.
Each forward pass can correspond to one episode. 
When the mean return for episodes is good enough, you can consider the agent trained. 

```python
episode_returns = []
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






-----

Resources:


* [Pong by Karpathy](https://karpathy.github.io/2016/05/31/rl/)
<!-- * [CartPole](https://www.datacamp.com/tutorial/reinforcement-learning-with-gymnasium) -->
<!-- * [OpenAI Problem Sets](https://spinningup.openai.com/en/latest/spinningup/exercises.html#problem-set-1-basics-of-implementation) -->



------
