#
# Cookbook Name:: apache
# Recipe:: default
#
# Copyright 2014, TUWIEN 
#
# All rights reserved - Do Not Redistribute
#

package "apache2" do
	action :install
end

service "apache2" do
	action [:start, :enable] #starts at reboot
end

cookbook_file "/var/www/index.html" do
	source "index.html"
	mode "0644"
end

# package "haproxy" do
	# action :install
# end

# template "/etc/haproxy/haproxy.cfg" do
	# source "haproxy.cfg.erb"
	# owner "root"
	# group "root"
	# mode "0644"
	# notifies :restart, "service[haproxy]"
# end

# service "haproxy" do
	# supports :restart => :true
	# action [:enable, :start]
# end