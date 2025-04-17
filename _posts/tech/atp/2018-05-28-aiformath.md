---
layout: post-normal
title: AI for Math
date:   2024-05-28 09:00:11
tag:
categories: atp
excerpt:
permalink: /aimath
comments: false


---


**What is the State of The Art on AI enabled Automated Theorem Proving? What models, datasets, and techniques do they use?**

**What is performance of LLMs stand vs other approaches?**

**What are the main datasets and benchmarks?**  Frontier Math, MathArena, MiniF2F

**How is automated theorem proving different from automated formal verification?**


Automated formal veriication: imagine a world where no critical software or hardware has any bugs. 

---

AlphaGeometry was shown to solve mathematical geometry problems on the level of the International Math Olympiad (IMO).

We present AlphaGeometry2, a significantly improved version of AlphaGeometry introduced in Trinh et al. (2024), which has now surpassed an average gold medalist in solving Olympiad geometry problems. mproved the coverage rate of the AlphaGeometry language on International Math Olympiads (IMO) 2000-2024 geometry problems from 66% to 88%. The search process of AlphaGeometry2 has also been greatly improved through the use of Gemini architecture for better language modeling, and a novel knowledge-sharing mechanism that combines multiple search trees. Together with further enhancements to the symbolic engine and synthetic data generation, we have significantly boosted the overall solving rate of AlphaGeometry2 to 84% for all geometry problems over the last 25 years, compared to 54% previously.


AIMO Prize: The AIMO Prize is a $10mn challenge fund, founded and supported by XTX Markets, designed to spur the open development of AI models that can reason mathematically, leading to the creation of a publicly shared AI model capable of winning a gold medal in the International Mathematical Olympiad (IMO). A grand prize of $5M will be awarded to whoever can create an AI model that can win a gold medal in the IMO



----


The first progress prize included problems at intermediate-level high school mathematics competitions, tricky math problems written in LaTeX format, high school students use to train for the International Math Olympiad. This competition includes 110 problems similar to an intermediate-level high school math challenge. The dataset encompasses a range of difficulty levels, from simple arithmetic to algebraic thinking and geometric reasoning. 

    

 A unique dataset of 800k+ competitive level problems and solutions was a key success factor for winning and we are thrilled to release it to the public. We now look forward to seeing far better models built upon the Numina dataset.The Gemma 7B benchmark for these problems is 3/50 on the public and private test sets  29 out of 50 problems on the private test set.  
 - A recipe to fine-tune DeepSeekMath-Base 7B to act as a "reasoning agent" that can solve mathematical problems via a mix of natural language reasoning and the use of the Python REPL to compute intermediate results.
 - A novel decoding algorithm for tool-integrated reasoning (TIR) with code execution feedback to generate solution candidates during inference
 - A variety of internal validation sets that we used to guide model selection and avoid overfitting to the public leaderboard.
 - Our fine-tuning recipe was largely based on the MuMath-Code paper, which involves training the model in two stages


Major challenge: The assessment of AI models' mathematical reasoning skills faces a significant hurdle, the issue of train-test leakage. Models trained on Internet-scale datasets may inadvertently encounter test questions during training, skewing the evaluation process.

 Math 7B model

---
Math-Specialized Gemini 1.5 Pro [Reid et al., 2024], a commercial model by Google not available to the public, has been reported to have an accuracy of over 90% on the MATH datase. This score has recently been replicated by an open-weight model, QwQ.4 Attaining
such a high score is equivalent to achieving the ability of an IMO gold medallist

References:
- []()

----






