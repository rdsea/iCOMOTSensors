#
# Cookbook Name:: sdsensor-config-mqtt
# Recipe:: default
#
# Copyright 2014, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'bootstrap_container::default'

remote_directory "/home/ubuntu/chef_jars/" do
  source "configuration"
  files_backup 10
  files_owner "root"
  files_group "root"
  files_mode 00644
  owner "nobody"
  group "nobody"
  mode 00755
end

