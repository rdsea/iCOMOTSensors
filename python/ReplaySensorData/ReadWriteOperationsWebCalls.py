#!/usr/bin/python

import sys, httplib, uuid, random,time


httplib.HTTPConnection.debuglevel = 0

KeyspaceName = 'm2m'
tablename = 'sensor'

HAProxyIP = '10.99.0.39'
HAProxyport = '8080'
BaseURL = HAProxyIP+':'+HAProxyport



def executeRESTCall(restMethod, serviceBaseURL, resourceName,  content):
        connection =  httplib.HTTPConnection(serviceBaseURL)
        #read composition rules file

        headers={
                'Content-Type':'application/xml; charset=utf-8'#,
#                'Accept':'application/xml, multipart/related'
        }

        connection.request(restMethod, '/'+resourceName, body=content,headers=headers,)
        result = connection.getresponse()

def _issueWriteRequest(Table, KeyspaceName, ColumnNames, Values):
            Table=tablename
            createRowStatement='<CreateRowsStatement><Table name="'+Table+'"><Keyspace name="' + KeyspaceName + '"/></Table><Row>'
            for i in range(0, len(ColumnNames)):
              createRowStatement=createRowStatement+('<Column name="%s" value="%s"/>' % (ColumnNames[i],Values[i]))
            createRowStatement=createRowStatement + '</Row></CreateRowsStatement>'
            executeRESTCall('PUT', BaseURL, 'DaaS/api/xml/table/row', createRowStatement)

def _issueReadQuery(Table, KeyspaceName, ColumnName, KeyColumn,KeysToRead):
            read = '<Query><Table name="'+Table+'"><Keyspace name="' + KeyspaceName + '"/></Table><Condition>'+KeyColumn+' in ('+KeysToRead+')</Condition></Query>'
            executeRESTCall('POST', BaseURL, 'DaaS/api/xml/table/row', read)


    
   
    
