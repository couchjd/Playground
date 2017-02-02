/*
    PySoy - soy.events.ButtonPress
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
#define SELF PySoy_events_ButtonPress_Object*

static char
tp_doc[] = "soy.events.ButtonPress Type\n"
"\n"
"    TODO: Documentation for ButtonPress\n"
"\n";

static SELF
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {

    SELF self;
    PySoy_controllers_Pointer_Object* pointer;
    guint py_target;

    // Ensure no keywords were provided
    if(!_PyArg_NoKeywords("soy.events.ButtonPress", kwds))
        return NULL;

    // Parse arguments
    if(!PyArg_ParseTuple(args, "iO!", &py_target, &PySoy_controllers_Pointer_Type, &pointer))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
      return NULL;

    // new gobject
    self->g = soy_events_button_press_new(py_target, pointer->g);
}

static PyObject*
tp_repr (SELF self) {
    PyObject* ret;

    ret = PyUnicode_FromFormat("<ButtonPress>");

    // return string as unicode object
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
// Methods

static char
addAction_doc[] = ".. py:method:: ButtonPress.addAction(button, action)\n"
"\n"
"    Binds an action to it's respective button press event.\n"
"\n"
"    :param string button: String of the respective button\n"
"    :param soy.actions.Action action: action to bind\n"
"\n";

static PyObject*
addAction (SELF self, PyObject* args)
{
    PySoy_actions_Action_Object* action;
    const gchar* button;

    // parse argumets
    if (!PyArg_ParseTuple(args, "sO!", &button, &PySoy_actions_Action_Type, &action))
        return NULL;
    
    soy_events_button_press_addAction( button, action->g);

    Py_RETURN_NONE;
}

static char
init_doc[] = ".. py:method:: ButtonPress.init()\n"
"\n"
"    Initializes ButtonPress Event.\n"
"\n";

static PyObject*
init (SELF self, PyObject* args)
{
    // parse no argumets
    if (!PyArg_ParseTuple(args, ""))
        return NULL;

    soy_events_button_press_init();
    
    Py_RETURN_NONE;
}

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyMethodDef 
tp_methods[] = {
    {"addAction",                                          // ml_name
    (PyCFunction)addAction,                                // ml_meth
    METH_VARARGS | METH_STATIC,                            // ml_flags
    "Bind an action to a button press event"},             // ml_doc
    {"init",                                               // ml_name
    (PyCFunction)init,                                     // ml_meth
    METH_VARARGS | METH_STATIC,                            // ml_flags
    "Initializes ButtonPress"},                            // ml_doc
    {NULL},                                                // sentinel
};

static PyGetSetDef tp_getset[] = {
    {NULL},                                                // sentinel
};

PyTypeObject PySoy_events_ButtonPress_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.events.ButtonPress",                              // tp_name
    sizeof(PySoy_events_ButtonPress_Object),               // tp_basicsize
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
    &PySoy_events_Event_Type,                              // tp_base
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