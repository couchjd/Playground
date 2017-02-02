/*
    PySoy - soy.widgets.Canvas Type
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
#define SELF PySoy_widgets_Canvas_Object*


static char
tp_doc[] = ".. py:class:: Canvas(texture)\n"
"\n"
"    Renders a :class:`~soy.textures.Texture`.\n"
"\n"
"    Since :class:`~soy.textures.Texture` can be any sort of bitmap including\n"
"    text, images, and video, adding a :class:`~soy.widgets.Canvas` to a\n"
"    :class:`~soy.widgets.Window` behind a :class:`~soy.widgets.Projector`\n"
"    allows for a background to the rendered :class:`~soy.scenes.Scene`.\n"
"\n"
"    Adding a :class:`~soy.widgets.Canvas` in a :class:`~soy.widgets.Window`\n"
"    after a :class:`~soy.widgets.Projector` can also be used to create an\n"
"    overlay display, such as text or an image.\n"
"\n"
"    :class:`~soy.widgets.Canvas` and widgets packed into nested \n"
"    :class:`~soy.widgets.Container` classes can create numerous effects \n"
"\n"
"    :param soy.textures.Texture texture: texture to be used \n"
"\n";

static SELF
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    PySoy_textures_Texture_Object* texture;
    static char* kw[] = {"texture", NULL};

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "|O!", kw,
                                     &PySoy_textures_Texture_Type, &texture))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
      return NULL;

    // new gobject
    if(texture == NULL)
        self->g = soy_widgets_canvas_new(NULL);
    else
        self->g = soy_widgets_canvas_new(texture->g);

    return self;
}


static PyObject*
tp_repr (SELF self) {
    PyObject* ret;

    // TODO this should report additional debug information such as size

    ret = PyUnicode_FromString("<Canvas>");

    // return string
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

PYSOY_PROP_OBJECT_DELETABLE(widgets, canvas, texture, textures_Texture)
static char
texture_doc[] = ".. py:attribute:: Texture\n"
"\n"
"    This is the current :class:`~soy.textures.Texture` to be rendered on\n"
"    the :class:`~soy.widgets.Canvas`.  Deleting this disables this :class:`~soy.widgets.Canvas`.\n"
"\n"
"    This property be changed at any time.\n"
"\n";

static char
x_doc[] = ".. py:attribute:: x\n"
"\n"
"    x coordinate of the Canvas, defaults to 0\n";
PYSOY_PROP_FLOAT(widgets, canvas, x);

static char
y_doc[] = ".. py:attribute:: y\n"
"\n"
"    y coordinate of the Canvas, defaults to 0\n";
PYSOY_PROP_FLOAT(widgets, canvas, y);

static char
scaleX_doc[] = ".. py:attribute:: scaleX\n"
"\n"
"    width scaling of the Canvas, defaults to 1\n";
PYSOY_PROP_FLOAT(widgets, canvas, scaleX);

static char
scaleY_doc[] = ".. py:attribute:: scaleY\n"
"\n"
"    height scaling of the Canvas, defaults to 1\n";
PYSOY_PROP_FLOAT(widgets, canvas, scaleY);

static char
align_doc[] = ".. py:attribute:: align\n"
"\n"
"    aligns the Canvas on the screen\n"
"    -1 is left, 0 is center and 1 is right.\n"
"    Intermediate values are also possible.\n";
PYSOY_PROP_FLOAT(widgets, canvas, align);

static char
keep_aspect_doc[] = ".. py:attribute:: keep_aspect\n"
"\n"
"    keep the aspect to the original size of the texture instead of the screen\n";
PYSOY_PROP_BOOL(widgets, canvas, keep_aspect);

static char
rotation_doc[] = ".. py:attribute:: rotation\n"
"\n"
"    rotation of the Canvas, defaults to 0\n";
PYSOY_PROP_FLOAT(widgets, canvas, rotation);

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(texture),
    PYSOY_PROPSTRUCT(x),
    PYSOY_PROPSTRUCT(y),
    PYSOY_PROPSTRUCT(scaleX),
    PYSOY_PROPSTRUCT(scaleY),
    PYSOY_PROPSTRUCT(keep_aspect),
    PYSOY_PROPSTRUCT(align),
    PYSOY_PROPSTRUCT(rotation),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_widgets_Canvas_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.widgets.Canvas",                                  // tp_name
    sizeof(PySoy_widgets_Canvas_Object),                   // tp_basicsize
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
    &PySoy_widgets_Widget_Type,                            // tp_base
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
