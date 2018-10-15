# Run tests

We have some test programs. For example:


Test a resource lifecycle:

* python3 resource-lifecycle-test.py --datatransformer_provider http://localhost:3004/datatransformer --num_test 10 --num_client 10 --test_output googlecloud-from_home-to-us_east1_1-to-us_central1_1-9clients.csv

Test instance limit:

* python3 instance_limit_test.py --datatransformer_provider http://localhost:3004/datatransformer --num_test 4
