from __future__ import division
import json
import csv
import pandas as pd 
import sys

numrows = 500000 #number of rows threshold to be 100 MB
count = 0 #keep track of chunks
chunkrows = 100000 #read 100k rows at a time
df = pd.read_csv(str(sys.argv[1]), iterator=True, chunksize=chunkrows) 
file_name_count = 1
for chunk in df: #for each 100k rows
    
    if count <= (numrows/chunkrows) * file_name_count: #if 5GB threshold has not been reached 
        outname = f"{sys.argv[2]}/data_{file_name_count}.csv"
    else:
        file_name_count = file_name_count + 1

    if file_name_count > 10:
        break
    #append each output to same csv, using no header
    chunk.to_csv(outname, mode='a', header=None, index=None)
    count+=1