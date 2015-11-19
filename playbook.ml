---
- hosts: digitalocean
  vars_files:
    - vars.yml
  sudo: true

  tasks:  
    - name: Create the project directory.
      file: state=directory path={{ project_root }}

    - name: Install required system packages.
      apt: pkg={{ item }} state=installed update-cache=yes
      with_items: "{{ system_packages }}"

