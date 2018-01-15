# -*- coding: utf-8 -*-
"""
Created on Fri Mar 21 14:07:10 2014

@author: Georgiana
"""
import sys, httplib, uuid, random,time,os
import csv
from multiprocessing import Process
from threading import Thread
import datetime,time
from dateutil import parser
from operator import itemgetter

import ReadWriteOperationsWebCalls as RWWebCalls

EXPERIMENT_PERIOD=1 #IN HOURS

def readFile(FileName):
    #return file content & headers
    array=[]  
    index=0
    headersOfFile=[]
    with open(FileName, 'rbU') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in spamreader:
            if (headersOfFile==[]):
                headersOfFile=row
            else:
                values = row
                array.insert(index,values)
                index+=1
    return (headersOfFile, array)
def addSeconds(tm, s):
    fulldate = datetime.datetime(100, 1, 1, tm.hour, tm.minute, tm.second)
    fulldate = fulldate + datetime.timedelta(seconds=s)
    return fulldate
def contractTimestampsForFile(dataSetList, headers, neededNbHours):
    index=0
    minDate = None
    maxDate = None
    for h in headers:
        if h.find("timestamp")!=-1 or h.find("Timestamp")!=-1:
            #Date example 1/1/2013 15:01
            for dataSet in dataSetList:            
                for row in dataSet:            
                    try:
                        date= parser.parse(row[index])
                        if minDate==None or minDate>date:
                            minDate=date
                        if maxDate==None or maxDate<date:
                            maxDate=date
                    except :
                        pass

        index+=1
    totalRecordedTime = (maxDate-minDate).total_seconds()
    totalSeconds= totalRecordedTime
    neededSeconds= neededNbHours * 3600
    timeStampIndex=0    
    for h in headers:
        if h.find("timestamp")!=-1 or h.find("Timestamp")!=-1 or h.find("TimeStamp")!=-1 or h.find("Timestamp")!=-1:
            #Date example 1/1/2013 15:01
            dataSetIndex=0
            for dataSet in dataSetList:            
                rowIndex=0                
                for row in dataSet:            
                    try:              
                        date=parser.parse(row[timeStampIndex])
                        seconds=(date-minDate).total_seconds()
                        resultedSeconds=int ((seconds*neededSeconds)/totalSeconds)                       
                        dataSetList[dataSetIndex][rowIndex][timeStampIndex]= datetime.datetime.now()+datetime.timedelta(seconds=resultedSeconds)
                        #print dataSetList[dataSetIndex][rowIndex][timeStampIndex]
                    except:
                        pass
                    rowIndex+=1
                dataSetIndex+=1
        timeStampIndex+=1
    return dataSetList
def doWritesToDatabase(dataSet,headers,sensorName):
    print "Starting process for sensor ",sensorName
    timestampIndex=0
    headerIndex=0
    for h in headers:
        if h=="timestamp" or h=="Timestamp" or h=="TimeStamp":
            timestampIndex=headerIndex
        headerIndex+=1
    for row in sorted(dataSet, key=itemgetter(timestampIndex)):
        if row[timestampIndex]>datetime.datetime.now():
            delta = row[timestampIndex] - datetime.datetime.now()
            print "[", sensorName,"] ,sleeping ",delta, "which is in seconds ",delta.seconds
            if (delta.seconds>0):        
                time.sleep(delta.seconds)    
                
        try:
            RWWebCalls._issueWriteRequest(sensorName,"m2m",headers,row)
        except:
            pass
def startTheCallsForAllFilesFromCurrentDir():        
    files = [f for f in os.listdir('.') if os.path.isfile(f) and f.endswith(".csv")]
    processes=[]
    for f in files:
        (headers,dataSet) = readFile (f)
        dataSetList=contractTimestampsForFile([dataSet], headers, EXPERIMENT_PERIOD)
        print os.path.splitext(f)[0]
        p = Thread(target=doWritesToDatabase,args=(dataSetList[0], headers,os.path.splitext(f)[0]))
        p.start()       
        processes.append(p)
    for p in processes:
        p.join()
if __name__=='__main__':
    startTheCallsForAllFilesFromCurrentDir()
    """  (headers,alkaAlarms) = readFile ("datasets/bms/OPM_AlarmHistory_with BMS_BD-ALKA-0000471.csv")
    (_,alstAlarms1)=readFile("datasets/bms/OPM_AlarmHistory_with BMS_BD-ALST-0000553.csv")
    (_,alstAlarms2) = readFile("datasets/bms/OPM_AlarmHistory_with BMS_BD-ALST-0000553.csv")
    
    dataSetList=contractTimestampsForFile([alkaAlarms,alstAlarms1,alstAlarms2], headers, 1)
    processes=[]
    p1 = Thread(target=doWritesToDatabase,args=(dataSetList[0], headers,"BMS_BD-ALKA-0000471"))    
    p2 = Thread(target=doWritesToDatabase,args=(dataSetList[1], headers,"BMS_BD-ALST-0000553"))
    p3 = Thread(target=doWritesToDatabase,args=(dataSetList[2], headers,"BMS_BD-ALST-0000553"))
    p1.start()
    p2.start()    
    p3.start()
    p1.join()
    p2.join()
    p3.join()"""
    