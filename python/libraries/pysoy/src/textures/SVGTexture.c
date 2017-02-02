/*
    PySoy - soy.textures.SVGTexture Type
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
#define SELF PySoy_textures_SVGTexture_Object*


static char
tp_doc[] = ".. py:class:: SVGTexture()\n";

static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    GError* error = NULL;

    // Ensure no keywords were provided
    if (!_PyArg_NoKeywords("soy.textures.SVGTexture", kwds))
        return NULL;

    // Parse arguments
    if (!PyArg_ParseTuple(args, "")) {
        return NULL;
    }

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    self->g = soy_textures_svg_texture_new();

     // Check if error is raised
    if (error != NULL) {
        if (error->domain == MEMORY_ERROR) {
            PyErr_SetString(PyExc_MemoryError, error->message);
        }
        else {
            PyErr_SetString(PyExc_Exception, error->message);
        }
        g_clear_error (&error);
        return NULL;
    }

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    gchar* str;
    PyObject* ret;

    // generate "<SVGTexture>" string
    str = g_strdup_printf("<SVGTexture>");

    // return string as unicode object
    ret = PyUnicode_FromString(str);
    g_free(str);
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
// Properties

static char
source_doc[] = ".. py:attribute:: source\n"
"\n"
"    SVG Source Code of the texture\n";
PYSOY_PROP_STRING(textures, svg_texture, source);

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(source),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_textures_SVGTexture_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.textures.SVGTexture",                             // tp_name
    sizeof(PySoy_textures_SVGTexture_Object),               // tp_basicsize
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
    0,                                                     // tp_methods
    0,                                                     // tp_members
    tp_getset,                                             // tp_getset
    &PySoy_textures_Texture_Type,                          // tp_base
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

