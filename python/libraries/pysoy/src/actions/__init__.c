/*
    PySoy - soy.actions module
    Copyright (C) 2006-2014 Copyleft Games Group

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program; if not, see http://www.gnu.org/licenses
*/

#include "pysoy.h"


static char
m_doc[] = ".. py:module:: soy.actions\n"
"\n"
"    The classes of this module provide high-level player controls.\n"
"\n"
"    Each action may potentially be performed in a wide variety of different\n"
"    ways based on the Human Interface Devices (HIDs) configured for a given\n"
"    player and that player's preferences.\n"
"\n"
"    Its expected that game developers will subclass these generalized\n"
"    action types to provide both immediate client-side effects and callback\n"
"    methods for game-specific code.\n"
"\n"
"    Keep in mind that all Python game code is expected to run on a server\n"
"    so the result of callback methods are subject to network latency.\n"
"\n";


static PyMethodDef m_methods[] = {
    {NULL, NULL}
};


static struct PyModuleDef module_def = {
    PyModuleDef_HEAD_INIT,
    "soy.actions",                                         // m_name
    m_doc,                                                 // m_doc
    0,                                                     // m_size
    m_methods,                                             // m_methods
    NULL,                                                  // m_reload
    NULL,                                                  // m_traverse
    NULL,                                                  // m_clear
    NULL                                                   // m_free
};


PyMODINIT_FUNC
PyInit_soy_actions(void) {
    PyObject *module;
    /////////////////////////////////////////////////////////////////////////
    // Initialize all types prior to module creation
    //
    //  int PyType_Ready(PyTypeObject*)
    //    Finalize a type object. This should be called on all type objects to
    //    finish their initialization. This function is responsible for adding
    //    inherited slots from a type's base class.
    //    Return 0 on success, or return -1 and sets an exception on error.

    // init Action type
    PYSOY_TYPEINIT(actions, Action);

    // init Hover type
    PYSOY_TYPEINIT(actions, Hover);

    // init Jump type
    PYSOY_TYPEINIT(actions, Jump);

    // init Look type
    PYSOY_TYPEINIT(actions, Look);

    // init Select type
    PYSOY_TYPEINIT(actions, Select);

    // init Thrust type
    PYSOY_TYPEINIT(actions, Thrust);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    module = PyModule_Create(&module_def);

    // add additional pydoc strings
    PyModule_AddStringConstant(module, "__credits__", PYSOY_CREDITS);
    PyModule_AddStringConstant(module, "__version__", SOY_VERSION);


    /////////////////////////////////////////////////////////////////////////
    // add each type to the module object

    // add Action type
    PYSOY_TYPEADD_G(actions, action, Action);

    // add Hover type
    PYSOY_TYPEADD_G(actions, hover, Hover);

    // add Jump type
    PYSOY_TYPEADD_G(actions, jump, Jump);

    // add Look type
    PYSOY_TYPEADD_G(actions, look, Look);

    // add Select type
    PYSOY_TYPEADD_G(actions, select, Select);

    // add Thrust type
    PYSOY_TYPEADD_G(actions, thrust, Thrust);
    
    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    if (PyErr_Occurred()) {
        PyErr_SetString(PyExc_ImportError, "PyInit_soy_actions: init failed");
        return NULL;
    }

    return module;
}

