/*
    PySoy - soy.controllers.BaseNavigator
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
#define SELF PySoy_controllers_BaseNavigator_Object*

static char
tp_doc[] = "soy.controllers.BaseNavigator Type\n"
"\n"
"    The navigator (soy.controllers.*Navigator) - the special type directing movement of a body\n"
"    in a specified way.\n"
"    In the module there are some types of navigators. Navigators often use soy.controlers.graph.*\n"

"    This class is the base class for all the other soy.controllers.*Navigator types.\n"
"\n"
"    The class cannot be initialized directly.\n"
"\n"
"The initializer for this class has the following signature::\n"
"\n"
"    soy.controllers.BaseNavigator(scene, controlled, speed, fuzziness, graph, end, updates, paused)\n"
"\n"
"================ ====================================== ================================================================================================================================\n"
"Argument         Type                                   Explanation\n"
"================ ====================================== ================================================================================================================================\n"
"scene            soy.scenes.Scene                       The scene being simulated.\n"
"controlled       soy.bodies.Body                        The body being controlled.\n"
"speed            float                                  The speed of the object.\n"
"fuzziness        float                                  The distance around a waypoint that one is to consider being part of the waypoint. If None it is set to 1/100 the speed.\n"
"graph            soy.controllers.graph.IGraph           Way graph.\n"
"end              soy.atoms.Position                     The desired destination.\n"
"updates          bool                                   True if this controller should periodically check that its path remains clear, false otherwise.\n"
"paused           bool                                   True when this controller should be initially paused, and False when should not be.\n"
"================ ====================================== ================================================================================================================================\n"
"\n"
"    :param destination: Destination property\n"
"    :type destination: soy.atoms.Position\n"
"\n";
//TODO Add documentation


static PyObject*
tp_new (PyTypeObject *type, PyObject *args, PyObject *kwds) {
    PyErr_SetString(PyExc_TypeError, "This class cannot be used directly.");
    return NULL;
}


static PyObject*
tp_repr (PyObject* self) {
    PyObject *result;

    result = PyUnicode_FromFormat("<BaseNavigator>");

    return result;
}

///////////////////////////////////////////////////////////////////////////////
// Methods

static char
update_path_doc[] = "Force this controller to recalculate the path it will take "
"to its destination.";

static PyObject*
update_path(SELF self, PyObject* args) {
    soy_controllers_base_navigator_update_path(self->g);

    Py_RETURN_NONE;
} 

///////////////////////////////////////////////////////////////////////////////
// Properties

static char
destination_doc[] = "destination property\n"
"\n"
"The location this controller is moving the controlled object to.\n"
"\n";
PYSOY_PROP_OBJECT(controllers, base_navigator, destination, atoms_Position)

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyMethodDef tp_methods[] = {
    {"update_path", 
     (PyCFunction) update_path,
     METH_NOARGS,
     update_path_doc},
    {NULL, NULL}
};

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(destination),
    {NULL}
};

PyTypeObject PySoy_controllers_BaseNavigator_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.controllers.BaseNavigator",                           // tp_name
    sizeof(PySoy_controllers_BaseNavigator_Object),            // tp_basicsize
    0,                                                     // tp_itemsize
    0,                                                     // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) tp_repr,                                    // tp_repr
    0,                                                     // tp_as_number
    0,                                                     // tp_as_sequence
    0,                                                     // tp_as_mapping
    0,                                                     // tp_hash
    0,                                                     // tp_call
    0,                                                     // tp_str
    (getattrofunc) 0,                                      // tp_getattro
    (setattrofunc) 0,                                      // tp_setattro
    0,                                                     // tp_as_buffer
    Py_TPFLAGS_DEFAULT | Py_TPFLAGS_BASETYPE,              // tp_flags
    tp_doc,                                                // tp_doc
    0,                                                     // tp_traverse
    0,                                                     // tp_clear
    0,                                                     // tp_richcompare
    0,                                                     // tp_weaklistoffset
    0,                                                     // tp_iter
    0,                                                     // tp_iternext
    tp_methods,                                            // tp_methods
    0,                                                     // tp_members
    tp_getset,                                             // tp_getset
    &PySoy_controllers_Pathfollower_Type,                  // tp_base
    0,                                                     // tp_dict
    0,                                                     // tp_descr_get
    0,                                                     // tp_descr_set
    0,                                                     // tp_dictoffset
    0,                                                     // tp_init
    0,                                                     // tp_alloc
    (newfunc) tp_new,                                      // tp_new
    0,                                                     // tp_free
    0,                                                     // tp_is_gc
};
