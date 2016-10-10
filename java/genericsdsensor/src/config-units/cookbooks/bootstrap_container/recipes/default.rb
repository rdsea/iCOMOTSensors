#
# Cookbook Name:: bootstrap_container
# Recipe:: default
#
# Copyright 2014, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

directory "/home/ubuntu/chef_jars" do
  owner "root"
  group "root"
  mode 00644
  action :create
end

remote_file "/home/ubuntu/chef_jars/spring-context.jar" do
    source "http://128.130.172.215/salsa/upload/files/container/spring-context.jar"
	owner "root"
    group "root"
    mode 00644
	action :create_if_missing
end