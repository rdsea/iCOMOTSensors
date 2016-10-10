#
# Cookbook Name:: sdsensor
# Recipe:: default
#
# Copyright 2014, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

#split configuration from the executable (config is managed by Chef. Cookbook should not depend on software-defined executable version)
#make dependancy to mqtt client
#download jar 
#execute jar 

include_recipe 'bootstrap_container::default'

chef_jars = "/home/ubuntu/chef_jars"

# directory "#{chef_jars}/sdsensor" do
  # owner "root"
  # group "root"
  # mode 00644
  # action :create
# end

#TODO make jar name configurable. Currently all versions have the same name.
exec = "sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar"
remote_file "#{chef_jars}/#{exec}" do
    source "http://128.130.172.215/salsa/upload/files/jars/sdsensor/#{exec}"
	owner "root"
    group "root"
    mode 00644
	action :create_if_missing
end

bash 'run_jar' do
    code <<-EOF
	# TODO drty :). Wrap it as service!
    if ! sudo screen -list | grep "sensor"; then
		sudo screen -dmS sensor java -jar "#{chef_jars}/#{exec}"
	fi
	

    EOF
end
# sudo java -jar "#{chef_jars}/#{exec}" > #{chef_jars}/sdsensor.log 2>&1 &
# sucreen -dmS sensor tail -f #{chef_jars}/sdsensor.log
#wget -nH -e robots=off --cut-dirs=3 --user-agent=Mozilla/5.0 --reject=index.html* --no-parent --recursive --relative --level=0 http://128.130.172.215/salsa/upload/files/jars/