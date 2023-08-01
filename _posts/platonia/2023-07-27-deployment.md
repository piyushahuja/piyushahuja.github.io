---

layout: post-normal
title: Deployment
date:   2023-07-27 09:00:12
tag: 
categories: platonia-tech
excerpt: 
permalink: /deployment
comments: true

---
# Properties you want

healthchecks
autoscaling
zero downtime deploys

# Using Docker

Size of the image [Node images](https://github.com/nodejs/docker-node)

The environmental variable NODE_ENV=production



# Logs

People mount /dev/log into a container, or send logs to logger daemon or /dev/null. You probably want to store logs externally: in a volume or mounted host directory, and have a separate container take care of logs.
Or use Log Rotate.

Containers are no vm's, if you have to log in on a container running in production - you're doing something wrong - unless that container's only job is running SSH (which can be useful for example for Jenkins build slaves). 

vs 

The SSH server is incredibly useful for diagnosing problems in production, so I for one applaud it (although it's not really necessary anymore with docker exec).

Cron - again - same thing: run in a separate container and give access to the exact things your cronjob needs.

[Dicussion](https://news.ycombinator.com/item?id=10782897)

# Analytics

Clickhealth


