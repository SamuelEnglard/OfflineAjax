﻿(function (root, factory) {
    "use strict";

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.
    if (typeof define === "function") 
    {
        define("shmuelie/offlineAjax", [], factory);
    } 
    else if (typeof exports !== 'undefined') 
    {
        factory(exports);
    } 
    else 
    {
        factory((root.esprima = {}));
    }
}(this, function (exports)
{
    
}));