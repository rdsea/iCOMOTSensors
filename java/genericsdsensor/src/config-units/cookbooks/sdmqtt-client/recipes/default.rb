#
# Cookbook Name:: sdmqtt-client
# Recipe:: default
#
# Copyright 2014, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'bootstrap_container::default'

remote_file "/home/ubuntu/chef_jars/mqtt-client-0.0.1-SNAPSHOT-jar-with-dependencies.jar" do
    source "http://128.130.172.215/salsa/upload/files/jars/mqtt-client-0.0.1-SNAPSHOT-jar-with-dependencies.jar"
	owner "root"
    group "root"
    mode 00644
	action :create_if_missing
end