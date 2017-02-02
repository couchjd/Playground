/*
    PySoy - soy.bodies module
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
m_doc[] = ".. py:module:: Bodies\n"
"\n"
"    Bodies are objects in a scene with a mass, velocity, and orientation.\n"
"\n"
"    Many bodies are renderable, in which case they are visible in their\n"
"    scene, and many support collision with other bodies.\n"
"\n"
"    Bodies can be connected to other bodies with using a soy.joints class.\n"
"\n";


static PyMethodDef m_methods[] = {
    {NULL, NULL}
};


static struct PyModuleDef module_def = {
    PyModuleDef_HEAD_INIT,
    "soy.bodies",                                          // m_name
    m_doc,                                                 // m_doc
    0,                                                     // m_size
    m_methods,                                             // m_methods
    NULL,                                                  // m_reload
    NULL,                                                  // m_traverse
    NULL,                                                  // m_clear
    NULL                                                   // m_free
};


PyMODINIT_FUNC
PyInit_soy_bodies(void) {
    PyObject *module;
    /////////////////////////////////////////////////////////////////////////
    // Initialize all types prior to module creation
    //
    //  int PyType_Ready(PyTypeObject*)
    //    Finalize a type object. This should be called on all type objects to
    //    finish their initialization. This function is responsible for adding
    //    inherited slots from a type's base class.
    //    Return 0 on success, or return -1 and sets an exception on error.

    // init Billboard type
    PYSOY_TYPEINIT(bodies, Billboard);

    // init Body type
    PYSOY_TYPEINIT(bodies, Body);

    // init Box type
    PYSOY_TYPEINIT(bodies, Box);

    // init Camera type
    PYSOY_TYPEINIT(bodies, Camera);

    // init Cylinder type
    PYSOY_TYPEINIT(bodies, Cylinder);

    // init Light type
    PYSOY_TYPEINIT(bodies, Light);

    // init Mesh type
    PYSOY_TYPEINIT(bodies, Mesh);

    // init Portal type
    PYSOY_TYPEINIT(bodies, Portal);

    // init Sphere type
    PYSOY_TYPEINIT(bodies, Sphere);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    module = PyModule_Create(&module_def);

    // add additional pydoc strings
    PyModule_AddStringConstant(module, "__credits__", PYSOY_CREDITS);
    PyModule_AddStringConstant(module, "__version__", SOY_VERSION);


    /////////////////////////////////////////////////////////////////////////
    // add each type to the module object

    // add Billboard type
    PYSOY_TYPEADD_G(bodies, billboard, Billboard);

    // add Body type
    PYSOY_TYPEADD_G(bodies, body, Body);

    // add Box type
    PYSOY_TYPEADD_G(bodies, box, Box);

    // add Camera type
    PYSOY_TYPEADD_G(bodies, camera, Camera);

    // add Cylinder type
    PYSOY_TYPEADD_G(bodies, cylinder, Cylinder);

    // add Light type
    PYSOY_TYPEADD_G(bodies, light, Light);

    // add Mesh type
    PYSOY_TYPEADD_G(bodies, mesh, Mesh);

    // add Portal type
    PYSOY_TYPEADD_G(bodies, portal, Portal);

    // add Sphere type
    PYSOY_TYPEADD_G(bodies, sphere, Sphere);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    if (PyErr_Occurred()) {
        PyErr_SetString(PyExc_ImportError, "PySoy_bodies: init failed");
        return NULL;
    }

    return module;
}

