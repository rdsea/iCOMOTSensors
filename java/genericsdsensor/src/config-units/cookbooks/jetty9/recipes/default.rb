#
# Cookbook Name:: jetty9
# Recipe:: default
#
# Copyright 2014, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#
#Jetty9 installer form our local repo 128.130.172.215/salsa/upload/files/jars/portable_webserver/jetty9.zip
#

include_recipe 'java::default'

directory "/home/ubuntu/jetty9" do
  owner "root"
  group "root"
  mode 00644
  action :create
end


remote_file "/home/ubuntu/jetty9/jetty9.tar.gz" do
    source "http://128.130.172.215/salsa/upload/files/jars/portable_webserver/jetty9.tar.gz"
	owner "root"
    group "root"
    mode 00644
	action :create_if_missing
end

bash 'run_jetty' do
    code <<-EOF
	# TODO drty :). Wrap it as service!
    if ! sudo screen -list | grep "jetty"; then
		tar -xf /home/ubuntu/jetty9/jetty9.tar.gz --directory /home/ubuntu/jetty9/
		cd /home/ubuntu/jetty9/
		sudo screen -dmS jetty java -jar start.jar
	fi
    EOF
end
