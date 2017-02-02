/*
    PySoy - soy.events module
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
m_doc[] = ".. py:module:: soy.events\n"
"\n"
"    The classes od this module provide events needed to execute actions. \n"
"\n"
"    TODO: Documentation"
"\n";

static PyMethodDef m_methods[] = {
    {NULL,NULL}
};

static struct PyModuleDef module_def = {
    PyModuleDef_HEAD_INIT,
    "soy.events",                                          // m_name
    m_doc,                                                 // m_doc
    0,                                                     // m_size
    m_methods,                                             // m_methods
    NULL,                                                  // m_reload
    NULL,                                                  // m_traverse
    NULL,                                                  // m_clear
    NULL                                                   // m_free
};

PyMODINIT_FUNC
PyInit_soy_events(void) {
    PyObject *module;
    /////////////////////////////////////////////////////////////////////////
    // Initialize all types prior to module creation
    //
    //  int PyType_Ready(PyTypeObject*)
    //    Finalize a type object. This should be called on all type objects to
    //    finish their initialization. This function is responsible for adding
    //    inherited slots from a type's base class.
    //    Return 0 on success, or return -1 and sets an exception on error.

    // init Event type
    PYSOY_TYPEINIT(events, Event);

    // init ButtonPress type
    PYSOY_TYPEINIT(events, ButtonPress);

    // init ButtonRelease type
    PYSOY_TYPEINIT(events, ButtonRelease);

    // init KeyPress type
    PYSOY_TYPEINIT(events, KeyPress);

    // init KeyRelease type
    PYSOY_TYPEINIT(events, KeyRelease);

    // init Motion type
    PYSOY_TYPEINIT(events, Motion);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////

    module = PyModule_Create(&module_def);

    // add additional pydoc strings
    PyModule_AddStringConstant(module, "__credits__", PYSOY_CREDITS);
    PyModule_AddStringConstant(module, "__version__", SOY_VERSION);

    /////////////////////////////////////////////////////////////////////////
    // add each type to the module object

    // add Event type
    PYSOY_TYPEADD_G(events, event, Event);

    // add ButtonPress type
    PYSOY_TYPEADD_G(events, button_press, ButtonPress);

    // add ButtonRelease type
    PYSOY_TYPEADD_G(events, button_release, ButtonRelease);

    // add KeyPress type
    PYSOY_TYPEADD_G(events, key_press, KeyPress);

    // add KeyRelease type
    PYSOY_TYPEADD_G(events, key_release, KeyRelease);

    // add Motion type
    PYSOY_TYPEADD_G(events, motion, Motion);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////

    if (PyErr_Occurred()) {
        PyErr_SetString(PyExc_ImportError, "PyInit_soy_events: init failed");
        return NULL;
    }

    return module;
}