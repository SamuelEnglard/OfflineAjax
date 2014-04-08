Offline Ajax
===========

Offline Ajax is a library to make sending data to a server when you might be 
offline easier. Implementing most of the XHR1 interface you can use it just 
like you would XHR. In fact you can replace the XHR with the OfflineXHR with 
little issue. The difference is that instead of sending the request immediately 
like XHR does, the request is added to a queue and processed if browser is 
online. If the browser is not online then the request stays on the queue till 
the browser goes online. Once online again all stored requests are sent out.

The following parts of the interface are implemented

#####Events:

* ontimeout (and the corresponding event)
* onreadystatechange (and the corresponding event)

#####Methods:

* addEventListener(String, Function, Boolean)
* removeEventListener(String, Function, Boolean)
* getAllResponseHeaders()
* getResponseHeaders(String)
* abort()
* open(String, String, [Boolean], [String], [String])
* setRequestHeader(String, String)
* send([body])

#####Properties:

* response
* responseBody
* responseText
* responseType
* responseXML
* readyState
* timeout

####Known Issues

* Because Offline Ajax sends requests via a queue the "state" of the properties 
  is always the of the last successfully executed request. To get around this 
  one can create one instance per request so that the events and state must be 
  for that request.

* All requests must be asynchronous since they may not be immediately executed. 
  Even though the async parameter is in the open call it is ignored.