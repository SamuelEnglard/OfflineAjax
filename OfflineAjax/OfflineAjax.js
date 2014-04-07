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
        var $this = this;

        this._eventDiv = document.createElement("div");

        this._core = new xhrOriginal();

        this._core.addEventListener("timeout", function (e)
        {
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

        Object.defineProperties(this, {
            readyState:
                {
                    get: function ()
                    {
                        return $this._readyState;
                    }
                },
            timeout:
                {
                    get: function ()
                    {
                        return $this._core.timeout;
                    },
                    set: function (value)
                    {
                        $this._core.timeout = value;
                    }
                }
        });

        this._requests = [];
    };

    OfflineXHR.prototype.addEventListener = function (type, listener, useCapture)
    {
        return this._eventDiv.addEventListener(type, listener, useCapture);
    };

    OfflineXHR.prototype.removeEventListener = function (type, listener, useCapture)
    {
        return this._eventDiv.removeEventListener(type, listener, useCapture);
    };

    OfflineXHR.prototype._send = function ()
    {
        if ((this._requests.length > 0) && navigator.onLine)
        {
            var request = this._requests.shift();

            if (request.sent = false)
            {
                this._send();
                return;
            }

            this._core.open(request.method, request.url, true, request.user, request.password);
            for (var headerName in request.headers)
            {
                this._core.setRequestHeader(headerName, request.headers[headerName]);
            }
            this._core.send(request.body);
        }
    };

    OfflineXHR.prototype.getAllResponseHeaders = function ()
    {
        return this._core.getAllResponseHeaders();
    };

    OfflineXHR.prototype.getResponseHeader = function (header)
    {
        return this._core.getResponseHeader(header);
    };

    OfflineXHR.prototype.abort = function ()
    {
        this._readyState = xhrOriginal.UNSENT;
        this._requests.pop();
    };

    OfflineXHR.prototype.open = function (method, url, async, user, password)
    {
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
        this._requests[this._requests.length - 1].headers[header] = value;
    };

    OfflineXHR.prototype.send = function (body)
    {
        var request = this._requests[this._requests.length - 1];
        request.body = body;
        request.sent = true;
    };

    if (bool === true)
    {
        window.XMLHttpRequest = OfflineXHR;
    }
    else
    {
        return OfflineXHR;
    }
}));