#
# Cookbook Name:: vehicle-tracking-webapp
# Recipe:: default
#
# Copyright 2014, Stefan Nastic DSG@TUWIEN
#
# All rights reserved - Do Not Redistribute
#
include_recipe 'jetty9::default'

remote_file "/home/ubuntu/jetty9/webapps/vehicletracking.war" do
    source "http://128.130.172.215/salsa/upload/files/jars/vehicletracking.war"
	owner "root"
    group "root"
    mode 00644
	action :create_if_missing
end

