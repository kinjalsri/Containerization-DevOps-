# Lab/Exp9

## Overview

This directory contains an Ansible inventory for a lab exercise using four local server entries. The setup is intended for testing Ansible connectivity against local containers or VMs running on different SSH ports.

## Files

- `inventory.ini`: Ansible inventory defining four servers.
- `ansible_key`: SSH private key used for authentication.
- `ansible_key.pub`: SSH public key.
- `Dockerfile`: Optional environment/build file for the lab.
- `playbook.yml`: Ansible playbook used to update and configure all servers.

## Inventory details

The inventory defines:

- `server1` on `localhost:2201`
- `server2` on `localhost:2202`
- `server3` on `localhost:2203`
- `server4` on `localhost:2204`

Common variables under `[servers:vars]`:

- `ansible_user=root`
- `ansible_ssh_private_key_file=./ansible_key`
- `ansible_python_interpreter=/usr/bin/python3`

## Usage

From this directory, run:

```bash
ansible all -i inventory.ini -m ping
```

If you want to target a single host:

```bash
ansible server1 -i inventory.ini -m ping
```

To run the playbook and apply configuration across all servers:

```bash
ansible-playbook -i inventory.ini playbook.yml
```

### What the playbook does

- updates apt package cache and performs a distribution upgrade on each host
- installs `vim`, `htop`, and `wget`
- creates `/root/ansible_test.txt` containing a confirmation message for each host

### Cleanup

To remove the generated test file from all servers:

```bash
ansible all -i inventory.ini -m file -a "path=/root/ansible_test.txt state=absent"
```

If you need to reset the environment, stop or remove any local containers or VMs used for the SSH hosts separately.

## Notes

- Ensure the SSH key file has correct permissions (`chmod 600 ansible_key`).
- The inventory assumes SSH access to `localhost` on ports `2201` through `2204`.

> If the playbook is run more than once, the apt and package installation tasks are idempotent, and the test file content will be overwritten.
