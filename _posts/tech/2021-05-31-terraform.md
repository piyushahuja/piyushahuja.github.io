---
layout: post-normal
title: Terraform
date:   2021-05-31 09:00:11
tag: 
categories: tech
excerpt: 
permalink: /terraform
comments: false

---


Terraform is a **tool for building, changing, and versioning infrastructure safely and efficiently**.  Terraform is an open source command line tool that can be used to provision any kind of infrastructure on dozens of different platforms and services. With Terraform you simply declare resources and how you want them configured and then Terraform will map out the dependencies and build everything for you.  Terraform is a great infrastructure provisioning tool, but you may have noticed that it doesn't come with a config management system. We use Terraform to stand up virtual machines or cloud instances, and then we hand over the reins to Ansible to finish up the configuration of our OS and applications.

Knowing that your infrastructure is exactly what you expect it to be can simplify your operations significantly. You can have confidence that if anything changes, any images crash or are accidentally deleted, that you can immediately re-build your infrastructure. 

**Terraform software is just an executable written and compiled in Golang. There are no plugins or drivers to install, no registries, no DLLs (dynamic link library file format). Makes it very portable.**

-----


# Changing your configuration

**Terraform can help with change management, planning and documentation.** 

Terraform makes the changes both predictable (terraform shows you what changes its going to make before it makes them) and consistent (1. iterations of deployment are idempotent. You can make the same deployment, and if nothing is different in the configuration, nothing will change 2. If you make the same deployment in different environments, each run of a new environment will match the previous ones. 

----
Language

Abstractions: State, Plan, Modules, Expressions, Variables

Declarative. The main purpose of the Terraform language is declaring resources. All other language features exist only to make the definition of resources more flexible and convenient.

**expressions** map to values. Values have a type. Except null value which has no type. null is most useful in conditional expressions, so you can dynamically omit an argument if a condition isn't met.
Values can be of type `string`, `number`, `bool`, `list`, `map`.


**Variables**:
* Store sensitive information like passwords or secret keys. 
* Placeholder for information that changes depending on deployment (production and dev have different values)

When variables are declared in the root module of your configuration, they can be set in a number of ways:
* In a Terraform Cloud workspace.
* Individually, with the -var command line option.
* In variable definitions (.tfvars) files, either specified on the command line or automatically loaded.
* As environment variables.

 ----

**Provisioning Resources**

**Terraform State**


When you work with Terraform it maintains the state of the infrastructure that contains everything including your instances. With a local backend, this state is stored in a JSON file that can be easily parsed and converted to the Ansible inventory. To make ansible-playbook work you have to have an Ansible code in the same directory

Statefile: Json file either stored locally or remotely. (Highly recommended not touching or changed it). 
Resource mappings and metadata: takes configuration file and puts them into a resource tree (helps orchestrate across multiple providers by making a resource tree and dependency tree between different resources. Also stores metadata (last good state, some of the computed information of the resource e.g. DNS address for your load balancer). 

When you are deploying a new instance of your configuration or making updating  state file becomes gets locked.  Important when working in teams and state file is  shared (say through NFS share in your local network or hosted  application in a remote location (S3 bucker e.g).

Statefile is created in the local folder 
State allows you to create multiple environments that are using the same configuration files. 
In a real world, you won’t be storing the production state at the same location where dev or test is scored. But you can have multiple dev environments, or a dev and stage environment. 


**Terraform Plan**

Inspects State, inspects the configuration file that you submit -> Creates a dependency graph e.g. if you are creating subnets in VPC, that can’t be created until VPC is created. As it walks through the dependency graph, it sees whether the updated configuration would require any additions or deletions 


**Provisioners**


Many provisioners require access to the remote resource. Terraform uses default while connecting to a resource, but these can be overridden using a connection block.
Connection block in resource: applies to all provisioners (Same ssh connection - user, host, private key)
Connection block in  provisione: scoped to that provisioner
Use case: have an initial provisioner connect as root user to setup user accounts, subsequent privistioners connect as a user with more limited provisioners. 

File provisioner: copy files from machine executing terraform to the remote
Local-exec provisioner: invokes a local executable after a resource is created, which invokes a process on the machine running Terraform, not on the resource. 
Rempote-exec provisioner: invokes a script on the remote resource after it is created. Use-cases: run a configuration management tool, bootstrap into a cluster, etc. 

----

**Modules**

A module is a container for multiple resources that are used together. A module is a container for multiple resources that are used together. Modules can be used to create lightweight abstractions, so that you can describe your infrastructure in terms of its architecture, rather than directly in terms of physical objects.


Syntax will work just for string variables. With others you have to specify the 'blank default':

```
variable "passed_list_var" {
    default = []
}

variable "passed_map_var" {
    default = {}
}
```

----

**Best Practices**


* https://medium.com/@pavloosadchyi/terraform-patterns-and-tricks-i-use-every-day-117861531173
* https://www.stratoscale.com/blog/openstack/tutorial-how-to-use-terraform-to-deploy-openstack-workloads/
* https://hackernoon.com/terraform-openstack-ansible-d680ea466e22
* https://galaxyproject.github.io/training-material/topics/admin/tutorials/terraform/tutorial.html
* https://medium.com/@hbarcelos
* how-i-learnt-to-love-and-hate-terraform-in-the-past-few-weeks-db085d012882
* https://itnext.io/things-i-wish-i-knew-about-terraform-before-jumping-into-it-43ee92a9dd65



Examples

https://github.com/diodonfrost/terraform-openstack-examples/tree/master/04-instance-with-loadbalancer 


**Common Bugs**


Hail deployment depends on terraform version 0.11:

* Reference to other resources must be with quotes and $
* depends_on cannot contain variables. Values must be hardcoded
* 'count' cannot be computed for resource within module based on list of interpolated values https://docs.cloudposse.com/troubleshooting/terraform-value-of-count-cannot-be-computed/ https://github.com/hashicorp/terraform/issues/18923  

-----


How To: 

Use Terraform template_file data source to generate a dynamic Ansible inventory from Terraform state file
 
data "template_file" "inventory" {
  template = "${file("templates/inventory.tpl")}"

  depends_on = [
    "google_compute_instance.managers",
    "google_compute_instance.workers",
  ]

  vars {
    managers = "${join("\n", google_compute_instance.managers.*.network_interface.0.access_config.0.nat_ip)}"
    workers  = "${join("\n", google_compute_instance.workers.*.network_interface.0.access_config.0.nat_ip)}"
  }
}

resource "null_resource" "cmd" {
  triggers {
    template_rendered = "${data.template_file.inventory.rendered}"
  }

  provisioner "local-exec" {
    command = "echo '${data.template_file.inventory.rendered}' > ../ansible/inventory"
  }
}

