# See http://docs.opscode.com/config_rb_knife.html for more information on knife configuration options

current_dir = File.dirname(__FILE__)
log_level                :info
log_location             STDOUT
node_name                "snastic"
client_key               "#{current_dir}/snastic.pem"
validation_client_name   "tuwien-validator"
validation_key           "#{current_dir}/tuwien-validator.pem"
chef_server_url          "https://api.opscode.com/organizations/tuwien"
cache_type               'BasicFile'
cache_options( :path => "#{ENV['HOME']}/.chef/checksums" )
cookbook_path            ["#{current_dir}/../cookbooks"]


