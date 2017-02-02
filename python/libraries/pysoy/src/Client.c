/*
  PySoy - soy.Client Type
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
#define SELF PySoy_Client_Object*

static char
tp_doc[] = "soy.Client Type\n"
"\n"
"    PySoy clients manage the state of a specific game instance including\n"
"    windows, audio input/output, controllers, and object data state.\n"
"\n"
"    Instances of this type represent PySoy clients, either local or remote.\n"
"    Local clients are created by instantating a new soy.Client object and\n"
"    adding it to a Server.  Remote clients are added by the Server itself\n"
"    when a request is made over XMPP.\n"
"\n"
"    Local clients are intended primarily for developing and debugging games\n"
"    though they may be used for playing downloaded games or local 3D access\n"
"    for server administrators.\n"
"\n"
"    Due to differing hardware, some properties (position, size, title, etc)\n"
"    may be read-only for some clients where these values cannot be changed.\n"
"    An exception will be raised when a Client property cannot be changed.\n"
"\n";


///////////////////////////////////////////////////////////////////////////////
// Callbacks

static void
on_close (gpointer d, gpointer e, gpointer g) {
    SELF self = g_object_get_qdata(g, GPyObject);

    // Don't unref twice
    if (!self->g) return;

    // Unref soy.Client object, this should free it
    g_object_unref(self->g);
    self->g = NULL;
}


///////////////////////////////////////////////////////////////////////////////
// Type Functions

static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    GModule* module;
    gpointer client_new;
    static char* kw[] = {NULL};

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "", kw,
                                     &PySoy_scenes_Scene_Type))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    // Open global module
    module = g_module_open(NULL, 0);
    if (!module) {
        PyErr_SetString(PyExc_RuntimeError, "Could not open global module");
        return NULL;
    }

    // Get soy_client_new symbol
    if (!g_module_symbol(module, "soy_client_new", &client_new)) {
        PyErr_SetString(PyExc_RuntimeError, "No PySoy Client module available");
        return NULL;
    }

    // new gobject
    self->g = ((gpointer(*)(void)) client_new)();
    
    // Backlink
    g_object_set_qdata(self->g, GPyObject, self);

    // Connect on_close
    g_signal_connect_object(self->g, "on-close", (GCallback) on_close, self->g,
                            0);

    // return successfully
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    if (self->g)
        // return string as unicode object
        return PyUnicode_FromString("<PySoy Client (Active)>");

    return PyUnicode_FromString("<PySoy Client (Inactive)>");
}


///////////////////////////////////////////////////////////////////////////////
// Number Functions

static int
nb_bool (SELF self) {
    return (self->g != NULL);
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static PyObject*
window_getter (SELF self, void* closure) {
    GModule* module;
    gpointer client_get_window;
    gpointer g;
    PySoy__G_Object* ret;

    // If Client has been closed, return None
    if (!self->g) Py_RETURN_NONE;

    // Open global module
    module = g_module_open(NULL, 0);
    if (!module) {
        PyErr_SetString(PyExc_RuntimeError, "Could not open global module");
        return NULL;
    }   

    // Get soy_client_new symbol
    if (!g_module_symbol(module, "soy_client_get_window", &client_get_window)) {
        PyErr_SetString(PyExc_RuntimeError, "No PySoy Client module available");
        return NULL;
    }

    g = ((gpointer(*)(gpointer)) client_get_window) ((gpointer) self->g);
    if (!g) Py_RETURN_NONE;
    ret = (PySoy__G_Object*)
          PyType_GenericNew(g_type_get_qdata(G_OBJECT_TYPE(g), GPyObject),
                            NULL, NULL);
    if (!ret) return NULL;
    ret->g = g;
    g_object_ref(g);
    return (PyObject*) ret;
}


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyNumberMethods tp_as_number = {
    0,                                                     // nb_add
    0,                                                     // nb_subtract
    0,                                                     // nb_multiply
    0,                                                     // nb_remainder
    0,                                                     // nb_divmod
    0,                                                     // nb_power
    0,                                                     // nb_negative
    0,                                                     // nb_positive
    0,                                                     // nb_absolute
    (inquiry) nb_bool,                                     // nb_bool
    0,                                                     // nb_invert
    0,                                                     // nb_lshift
    0,                                                     // nb_rshift
    0,                                                     // nb_and
    0,                                                     // nb_xor
    0,                                                     // nb_or
    0,                                                     // nb_int
    0,                                                     // nb_reserved
    0,                                                     // nb_float
    0,                                                     // nb_inplace_add
    0,                                                     // nb_inplace_subt..
    0,                                                     // nb_inplace_mult..
    0,                                                     // nb_inplace_rema..
    0,                                                     // nb_inplace_power
    0,                                                     // nb_inplace_lshift
    0,                                                     // nb_inplace_rshift
    0,                                                     // nb_inplace_and
    0,                                                     // nb_inplace_xor
    0,                                                     // nb_inplace_or
    0,                                                     // nb_floor_divide
    0,                                                     // nb_true_divide
    0,                                                     // nb_inplace_floo..
    0,                                                     // nb_inplace_true..
    0,                                                     // nb_index
};


static PyMethodDef tp_methods[] = {
    {NULL},                                                // sentinel
};


static PyGetSetDef tp_getset[] = {
    /*
    {"address",                                            // name
     (getter) PySoy_Client_address_getter,                 // getter
     NULL,                                                 // setter
     "Client address",                                     // doc
     NULL},                                                // closure
    */
    {"window",                                             // name
     (getter) window_getter,                               // getter
     NULL,                                                 // setter
     "Client window",                                      // doc
     NULL},                                                // closure
    /*

    {"controllers",                                        // name
     (getter) PySoy_Client_controllers_getter,             // getter
     NULL,                                                 // setter
     "Enumeration of attached input devices",              // doc
     NULL},                                                // closure

    {"pointer",                                            // name
     (getter) PySoy_Client_pointer_getter,                 // getter
     NULL,                                                 // setter
     "Pointer controller",                                 // doc
     NULL},                                                // closure

    {"keyboard",                                           // name
     (getter) PySoy_Client_keyboard_getter,                // getter
     NULL,                                                 // setter
     "Keyboard controller",                                // doc
     NULL},                                                // closure
    */
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_Client_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.Client",                                          // tp_name
    sizeof(PySoy_Client_Object),                           // tp_basicsize
    0,                                                     // tp_itemsize
    0,                                                     // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) tp_repr,                                    // tp_repr
    &tp_as_number,                                         // tp_as_number
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
    &PySoy__G_Type,                                        // tp_base
    0,                                                     // tp_dict
    0,                                                     // tp_descr_get
    0,                                                     // tp_descr_set
    0,                                                     // tp_dictoffset
    0,                                                     // tp_init
    0,                                                     // tp_alloc
    tp_new,                                                // tp_new
    0,                                                     // tp_free
    0,                                                     // tp_is_gc
};
