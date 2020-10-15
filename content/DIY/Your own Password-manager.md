---
template: single
title: Your very own Password Manager
description: How you can create your very own password manager, 100% for free
date: 2020-09-29
---

Password managers like [Lastpass](https://lastpass.com) and [1Password](https://1password.com) have been gaining a lot of mainstream popularity over the past few years. And while those are very good alternatives to chrome's built-in Password Manager, they can be a bit pricy. 

## Requirements

- An internet connection
- A Computer that is connected to the internet
- Curiosity to learn new things

## 1. Step: Setting up the host

The host is the computer where your password manager will 'live'. From here on forward it will be referred to as the **Server**
 
This project does not require the server to be very powerful, you can even use an old laptop that's gotten too slow for everyday-use. Should you not own a such a device you can also look into purchasing a [Raspberry Pi](https://www.raspberrypi.org/), you should be able to find a Model 3 for under 40$ on Amazon or any other major Electronic's Reseller.

### Docker

To realize this, we will be using [Docker](https://docker.io), a containerisation platform. 

Docker works with containers. You can think of a container as a small computer that does exactly one thing. This way it doesn't use too much space and resources. The Password manager will be installed inside one of those containers, and when you connect to the password manager from your smartphone or computer, it will automatically connect to the container. This way your server is more secure, because if your password manager does get hacked, the attacker can only access the container, but not the server.

First off you'll need to install Docker on your Server

- [Windows](https://docs.docker.com/docker-for-windows/install/)
- [Mac](https://docs.docker.com/docker-for-mac/install/)
- [Linux](https://docs.docker.com/engine/install/ubuntu/)

## 2. Step: Getting the container running

As I mentioned before, we can use containers to do the exact thing we need. To create these containers we need _images_. Think of images as a recipe that tells docker, what our container needs. On the [docker hub](https://hub.docker.com/search?q=&type=image) you can find images for pretty much every use-case, but we will focus on [this image of bitwarden](https://hub.docker.com/r/bitwardenrs/server)

