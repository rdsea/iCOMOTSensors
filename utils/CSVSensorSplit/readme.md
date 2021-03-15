## CSV sensor splitter

This utility script splits a large sensor `.csv` file efficiently into chuncks of 100000 lines[^1]. This should be done to enable parallel stream of sensors (for example in the GPOn scenario)/

Alternatively, we can also use https://csvkit.readthedocs.io/en/latest/  for splitting the files


#### requirements
* python3
* pandas

#### usage
* run split.py using python.
* arguments: 
  - location of file
  - output directory where the split sensor files will be present.
   
   
example:
```bash
$ python3 split.py "onu_data.csv" "/home/user/data"
```
---

[^1]: this parameter can be changed by editing the `chunkrows` variable in `split.py`
