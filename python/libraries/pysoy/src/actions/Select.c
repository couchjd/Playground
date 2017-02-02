/*
    PySoy - soy.actions.Select
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
#define SELF PySoy_actions_Select_Object*

static PyObject* py_onPress = NULL;
static PyObject* py_onRelease = NULL;

static char
tp_doc[] = "soy.actions.Select Type\n"
"\n"
"    TODO: tp_doc\n"
"\n";

void onPress(void* d_target)
{
    PyObject_CallObject(py_onPress,NULL);
}

static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds)
{
    SELF self;
    PySoy_actions_Action_Object* action;
    PySoy_scenes_Scene_Object* scene;

    // Ensure no keywords were given
    if (!_PyArg_NoKeywords("soy.actions.Select", kwds))
        return NULL;

    // Parse arguments
    if(!PyArg_ParseTuple(args, "O!O!", &PySoy_actions_Action_Type, &action,
                                       &PySoy_scenes_Scene_Type, &scene))
        return NULL;

    self = (SELF) PyType_GenericNew(type, args, kwds);
    if(!self)
        return NULL;

    // new object
    self->g = soy_actions_select_new( action->g, scene->g);

    return (PyObject*) self;
}

static PyObject*
tp_repr (SELF self)
{
    return PyUnicode_FromFormat("<Select>");
}

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyMethodDef
tp_methods[] = {
    {NULL},                                                // sentinel
};

PyTypeObject PySoy_actions_Select_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.actions.Select",                                  // tp_name
    sizeof(PySoy_actions_Select_Object),                   // tp_basicsize
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
    0,                                                     // tp_getset
    &PySoy_actions_Action_Type,                            // tp_base
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