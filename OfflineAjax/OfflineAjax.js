(function (root, factory)
{
    "use strict";

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.
    if (typeof define === "function")
    {
        define("shmuelie/offlineAjax", [], factory);
    }
    else
    {
        factory(true);
    }
}(this, function (bool)
{
    "use strict";

    var xhrOriginal = XMLHttpRequest;

    var OfflineXHR = function ()
    {
        /// <summary>
        ///     Creates an Offline XHR instance.
        /// </summary>
        /// <field name="response">
        ///     Returns the response received from the server.
        /// </field>
        /// <field name="responseBody">
        ///     Retrieves the response body as an array of unsigned bytes. 
        /// </field>
        /// <field name="responseText" type="String">
        ///     Retrieves the response body as a string.
        /// </field>
        /// <field name="responseType" type="String">
        ///     Describes the data type of the response associated with the request.
        /// </field>
        /// <field name="responseXML">
        ///     Retrieves the response body as an XML Document Object Model (DOM) object. 
        /// </field>

        var $this = this;

        this._eventDiv = document.createElement("div");

        this._core = new xhrOriginal();

        this._core.addEventListener("timeout", function (e)
        {
            if (typeof $this.ontimeout === "function")
            {
                $this.ontimeout(e);
            }
            $this._eventDiv.dispatchEvent(e);
        });
        this._core.addEventListener("onreadystatechange", function (e)
        {
            if ($this._core.readyState === xhrOriginal.DONE)
            {
                $this.response = $this._core.response;
                $this.responseBody = $this._core.responseBody;
                $this.responseText = $this._core.responseText;
                $this.responseType = $this._core.responseType;
                $this.responseXML = $this._core.responseXML;
            }
            $this._readyState = $this._core.readyState;
            if (typeof $this.onreadystatechange === "function")
            {
                $this.onreadystatechange(e);
            }
            $this._eventDiv.dispatchEvent(e);
            $this._send();
        });

        window.addEventListener("online", function ()
        {
            $this._send();
        });

        this.ontimeout = null;
        this.onreadystatechange = null;

        this._readyState = xhrOriginal.UNSENT;

        this.timeout = 0;

        Object.defineProperty(this, "readState", {
            get: function ()
            {
                /// <value name="readyState" type="Number" integer="true">
                ///     Retrieves the current state of the request operation.
                /// </value>
                return $this._readyState;
            }
        });

        this._requests = [];
    };

    OfflineXHR.prototype.addEventListener = function (type, listener, useCapture)
    {
        /// <summary>
        ///     Registers an event handler for the specified event type
        /// </summary>
        /// <param name="type" type="String">
        ///     The type of event type to register.
        /// </param>
        /// <param name="listener" type="Function">
        ///     The event handler function to associate with the event.
        /// </param>
        /// <param name="useCapture" type="Boolean" optional="true">
        ///     A Boolean value that specifies the event phase to add the event handler for. 
        /// </param>

        return this._eventDiv.addEventListener(type, listener, useCapture);
    };

    OfflineXHR.prototype.removeEventListener = function (type, listener, useCapture)
    {
        /// <summary>
        ///     Removes an event handler that the addEventListener method registered.
        /// </summary>
        /// <param name="type" type="String">
        ///     The event type that the event handler is registered for.
        /// </param>
        /// <param name="listener" type="Function">
        ///     The event handler function to remove.
        /// </param>
        /// <param name="useCapture" type="Boolean" optional="true">
        ///     A Boolean value that specifies the event phase to remove the event handler from.
        /// </param>

        return this._eventDiv.removeEventListener(type, listener, useCapture);
    };

    OfflineXHR.prototype._send = function ()
    {
        if ((this._requests.length > 0) && navigator.onLine)
        {
            var request = this._requests.shift();

            if (request.sent === false)
            {
                this._send();
                return;
            }

            this._core.open(request.method, request.url, true, request.user, request.password);
            for (var headerName in request.headers)
            {
                this._core.setRequestHeader(headerName, request.headers[headerName]);
            }
            this._core.timeout = this.timeout;
            this._core.send(request.body);
        }
    };

    OfflineXHR.prototype.getAllResponseHeaders = function ()
    {
        /// <summary>
        ///     Returns the complete list of response headers from the last executed request.
        /// </summary>
        /// <returns type="String" />

        return this._core.getAllResponseHeaders();
    };

    OfflineXHR.prototype.getResponseHeader = function (header)
    {
        /// <summary>
        ///     Returns the specified response header from the last executed request.
        /// </summary>
        /// <param name="header" type="String">
        ///     String that specifies the response header name.
        /// </param>
        /// <returns type="String" />

        return this._core.getResponseHeader(header);
    };

    OfflineXHR.prototype.abort = function ()
    {
        /// <summary>
        ///     Cancel the last requested request.
        /// </summary>

        this._readyState = xhrOriginal.UNSENT;
        if (this._requests.length > 0)
        {
            this._requests.pop();
        }
        else
        {
            this._core.abort();
        }
    };

    OfflineXHR.prototype.open = function (method, url, async, user, password)
    {
        /// <summary>
        ///     Assigns method, destination URL, and other optional attributes of a new request.
        /// </summary>
        /// <param name="method" type="String">
        ///     String that specifies the HTTP method used to open the connection: such as GET, POST, or HEAD. This parameter is not case-sensitive.
        /// </param>
        /// <param name="url" type="String">
        ///     String that specifies either the absolute or a relative URL of the XML data or server-side Web services.
        /// </param>
        /// <param name="async" optional="true">
        ///     Ignored.
        /// </param>
        /// <param name="user" type="String">
        ///     String that specifies the name of the user for authentication. If this parameter is null ("") or missing and the site requires authentication, the component displays a logon window.
        /// </param>
        /// <param name="password" type="String">
        ///     String that specifies the password for authentication. This parameter is ignored if the user parameter is null ("") or missing.
        /// </param>

        this._requests.push({
            method: method,
            url: url,
            user: user,
            password: password,
            sent: false,
            headers: {}
        });
    };

    OfflineXHR.prototype.setRequestHeader = function (header, value)
    {
        /// <summary>
        ///     Adds custom HTTP headers to the last requested request.
        /// </summary>
        /// <param name="header" type="String">
        ///     String that specifies the header name.
        /// </param>
        /// <param name="value" type="String">
        ///     String that specifies the header value.
        /// </param>

        this._requests[this._requests.length - 1].headers[header] = value;
    };

    OfflineXHR.prototype.send = function (body)
    {
        /// <summary>
        ///     Set the body for last requested request and gives it the ok to send.
        /// </summary>
        /// <param name="body" optional="true">
        ///     Any that specifies the body of the message being sent with the request.
        /// </param>
        /// <remarks>
        ///     Note that if send([body]) is called in a separate execution time the request might be lost.
        /// </remarks>

        var request = this._requests[this._requests.length - 1];
        request.body = body;
        request.sent = true;
        this._send();
    };

    if (bool === true)
    {
        window.OfflineXHR = OfflineXHR;
    }
    else
    {
        return OfflineXHR;
    }
}));