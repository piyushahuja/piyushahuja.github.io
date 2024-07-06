---
layout: post-normal
title: Networking
date:   2021-05-03 09:00:11
tag: 
categories: infra
excerpt: 
permalink: /networking
comments: false

---

[IP Address and CIDR Notation](https://www.digitalocean.com/community/tutorials/understanding-ip-addresses-subnets-and-cidr-notation-for-networking)

[How IPs And Networks Are Setup: Laptop/Desktop/Modem (Ethernet + Wifi)](https://unix.stackexchange.com/questions/232944/device-vs-network-interface-ip-addresses)  

[List of Default Ports and their Protocols](https://www.examcollection.com/certification-training/network-plus-overview-of-common-tcp-and-udp-default-ports.html)


198.168.x.x (subnet mask 255.255.0.0) is one of the three Private IP ranges that allow devices on the network to know where to send data packets - basicaly communicate. These are sets of numbers assigned to your individual computer, printer, actually any device (aka node) that you can assign IP numbers to on your internal network. Networks being groups of computers behind (attached) to routers.
Think of a Post office - The town is the first number ‘198′, the second number ‘168’ is your neighborhood the first ‘X’ is your street, the second ‘X’ is your house. The router is the post office connecting you to the Public network - ie Internet.
Most manufacturers of home and SOHO routers and other networking equipment use this range with 198.168.0.1 as a standard. Normally there is an automatic assignment by a service called DHCP so you don’t have to worry about it. If you feel a little geekie you can assign the numbers yourself - but, unless there is a particular reason and you’ve had some training or done some reading, it’s easier just to allow the software to handle it for you.

10/8 (10.0.0.0 through 10.255.255.255)
172.16/12 (172.16.0.0 through 172.31.255.255)
192.168/16 (192.168.0.0 through 192.168.255.255)
e.g 192.168.2.2 (My machine) 
192.168.1.1 (Router IP address)


The 127.0.0.0/8 range of addresses are reserved for loopback testing. 
Usecase: Simulating a large number of different computers in a fast network (simply bring up more interfaces and bind services to them) without using virtual machines. This might be helpful if you wanted to have a number of different web servers running locally on port 80 for some reason. e.g make other private servers appear to be on localhost via SSH tunneling
localhost aka 127.0.0.1
127.0.0.53 is the systemd-resolved stub resolver

-----

[The Layering Model 1](https://www.digitalocean.com/community/tutorials/an-introduction-to-networking-terminology-interfaces-and-protocols)


[The Layering Model 2](https://www.networkworld.com/article/3239677/the-osi-model-explained-how-to-understand-and-remember-the-7-layer-network-model.html
)


There are 5 elements that identify a connection. They call them 5-tuple
* Protocol. 
* Source IP address.
* Source port.
* Target P address.
* Target port.



A **network socket** is an internal endpoint for sending or receiving data within a node on a computer network. Concretely, it is a representation of this endpoint in networking software (protocol stack), such as an entry in a table (listing communication protocol, destination, status, etc.), and is a form of system resource.


A **Unix domain socket** or IPC socket (inter-process communication socket) is a data communications endpoint for exchanging data between processes executing on the same host operating system

A Floating IP is an IP address that can be instantly moved from one Droplet to another Droplet in the same datacenter. Part of a highly available infrastructure is being able to immediately point an IP address to a redundant server. 

A DNS record is a database record used to map a URL to an IP address. DNS records are stored in DNS servers and work to help users connect their websites to the outside world. When the URL is entered and searched in the browser, that URL is forwarded to the DNS servers and then directed to the specific Web server.

Some name resolution is done by internal DNS resolver (metadata server within the instance, configured for use on an instance via DCHP). The metadata handles all queries for local network, and routes everything else to external servers.   internal DNS server maintains a lookup table which maps the external IP dresses to  internal IP address of the relevant address.   


A Router is a logical component that forwards data packets between networks. It also provides Layer 3 and NAT forwarding to provide external network access for servers on project networks.

A **network interface** is the point of interconnection between a computer and a private or public network. A network interface will usually have some form of network address (not necessarily IP address, which is part of Layer 4 TCP/IP, but can be an address following some other Layer 4 protocol). This may consist of a node identifier and a port number or may be a unique node ID in its own right.

A network interface is generally a network interface card (NIC), but does not have to have a physical form. Instead, the network interface can be implemented in software. For example, the loopback interface (127.0.0.1 for IPv4 and ::1 for IPv6) is not a physical device but a piece of software simulating a network interface. The loopback interface is commonly used in test environments.


[About Network Interfaces](https://jvns.ca/blog/2017/09/03/network-interfaces/)

A gateway is a potential path to a remote network. It needs to be in reach of one or more interfaces, ie. be part of the same subnet. The default gateway is the path to 'everything we don't have a better path for'. 

Gateway is the functional name from the perspective of a local segment where a gateway leads 'elsewhere'.  Router is the very same thing from the overall perspective of the larger network - a connection between two or more subnets.

IP routing tables assume the device has multiple network interfaces, although most PCs have only one. When there is more than one, the device needs to know which interface to use to reach the gateway. The interface column defines that.

**Routing Table**

The routing table contains information used by the network stack to decide where each packet should be sent next. This decision may result in the packet being delivered locally, or forwarded to another machine, or rejected as unroutable. For packets that are forwarded the routing table is concerned only with selection of the next ‘hop’, at which point another routing decision will be made.

Within the routing table is a list of routes. Each route specifies an address range (expressed as a network address and a netmask), the interface to which packets matching that address range should be sent, and (optionally) the address of a gateway machine.

The route that is used for a given packet is the most specific one with an address range that matches the ultimate destination address. If the route has a gateway then the packet is forwarded to that gateway, otherwise it is forwarded directly to its final destination.

If the network address and netmask of a route are both zero then it will match packets with any destination address, but only if there is no other route that matches. Most routing tables have such an entry, which is known as the ‘default route’.

There are a number of different ways in which routes may be created. [More here](http://www.microhowto.info/troubleshooting/troubleshooting_the_routing_table.html)



**Limits of TCP Connections**

TCP protocol uses headers, where 16 bits (two bytes) are reserved for source and destination ports each. Therefore the maximum number of connections any given client can have to any given host port is 2^16-1, or 65535. However, multiple clients can each have up to 64K connections to some server’s port, and if the server has multiple ports or either is multi-homed then you can multiply that further.

So the real limit on the number of connections a server can open up is file descriptors. Each individual socket connection is given a file descriptor. The maximum limit is typically up over 300K, but is configurable e.g. with sysct.


When server receive connection request from client (by receiving SYN), it will then response with SYN, ACK, hence cause successful TCP handshake. But this request are stills in backlog queue. But, if the application process exceeds the limit of max file descriptors it can use, then when server calls accept, then it realizes that there are no file descriptors available to be the allocated for the socket and fails the accept call and the TCP connection sending a FIN to other side



[Socket Programming using C's Socket API: Implementing A TCP Client-Server](https://www.cs.dartmouth.edu/~campbell/cs50/socketprogramming.html)

**Socket Programming in Java: Sending Data To A Particular Interface using Java's Socket API**


The java language libraries have classes to represent the networking stack as an object in a java program so we can interface with it. 

Usually there are several interfaces on a specific machine, i.e. the pseudo-interface loopback where the machine can reach itself, ethernet, WLAN, VPN... . Each of these interfaces can have multiple IP addresses assigned. For example, loopback usually has 127.0.0.1 and with IPv6 also ::1, but you can assign others too. Ethernet or WLAN have the IP addresses on the local network, i.e. 172.16.0.34 or whatever

The java.net.NetworkInterface class represents both types of interfaces. You can query the system for a particular one:
```java
NetworkInterface nif = NetworkInterface.getByName("bge0");
```

Here nif represents the “bge0” network interface. A single network interface can have multiple IP addresses associated to it. You can get them by:
```java
Enumeration<InetAddress> nifAddresses = nif.getInetAddresses();
```

Say you create a socket:
```java
Socket soc = new java.net.Socket();
```

You usually bind a socket to an IP address and port so that you can send and receive data. If you bind a socket for receiving data to a specific address you can only receive data sent to this specific IP address. For example, if you bind to 127.0.0.1 you will be able to receive data from your own system but not from some other system on the local network, because they cannot send data to your 127.0.0.1: for one any data to 127.0.0.1 will be sent to their own 127.0.0.1 and second your 127.0.0.1 is an address on your internal loopback interface which is not reachable from outside. You can also bind a socket to a catch-all address like 0.0.0.0 (Ipv4) and :: (Ipv6). In this case it is not bound to a specific IP address but will be able to receive data send to any IP address of the machine.

To send  data from your machine, say from a software, the system automatically determines which interface is used. However, if you have a preference or otherwise need to specify which NIC to use, you can query the system for the appropriate interfaces and find an address on the interface you want to use. When you create the socket and bind it to that address, the system uses the associated interface. 

```java
soc.bind(new InetSocketAddress(nifAddresses.nextElement(), 0));
soc.connect(new InetSocketAddress(address, port));
```


You can also use NetworkInterface to identify the local interface on which a multicast group is to be joined. For example:

NetworkInterface nif = NetworkInterface.getByName("bge0");
MulticastSocket ms = new MulticastSocket();
ms.joinGroup(new InetSocketAddress(hostname, port), nif);


**Connections Using Linux Utilities**

**nc** (or telnet): tcp client/server for everything related to tcp or udp: sending, receiving. Alternative to telnet


* scan if a port is open on a remote system. ```nc -vz localhost 9000```
* pull the banner information (helpful information about operating system and services versions) from a remote system;
* connect to a network service manually with listening
* remote administration for transferring of files: "pipe" into TCP for batch data transfer, because it will not alter any byte sent through it. If you need something like cat but for TCP, use nc


**netstat**: show currently-active connections as well as their status ( ESTABLISH, LISTENING, TIME_WAIT…) 

```netstat | grep LISTEN``` check if server is listening (or ```lsof -i: <port>``` )
* network interface statistics
* ```netstat -r``` for routing table

**ip**: ip routing, network devices, interfaces and tunnels
```ip route``` (or ifconfig)

**iptables**: tables of packet filter rules 
nat -nvL

**tcpdump**: to capture packets


```socat tcp-listen:8001,reuseaddr,fork tcp:localhost:8000```

this is great since you do not have to have a local ssh server running. For the server listening on port 8000, the connection will appear as coming from the proxy, not the original client. You'd need to use DNAT approaches (but which requires superuser privileges) for the server to be able to tell who's the client

```ssh -g -L 8001:localhost:8000 -f -N user@remote-server.com```
This forwards the local port 8001 on your workstation to the localhost address on remote-server.com port 8000. -g means allow other clients on my network to connect to port 8001 on my workstation. Otherwise only local clients on your workstation can connect to the forwarded port. -N means all I am doing is forwarding ports, don't start a shell. -f means fork into background after a successful SSH connection and log-in. Port 8001 will stay open for many connections, until ssh dies or is killed. If you happen to be on Windows, the excellent SSH client PuTTY can do this as well. Use 8001 as the local port and localhost:8000 and the destination and add a local port forwarding in settings. You can add it after a successful connect with PuTTY.


