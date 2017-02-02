/*
    PySoy - soy.scenes.Landscape Type
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
#define SELF PySoy_scenes_Landscape_Object*


static char
tp_doc[] = ".. py:class:: Landscape([heightmap, material, [detail, [size, [position]]]])\n"
"\n"
"    Examples::\n"
"\n"
"        >>> m = soy.textures.Texture()\n"
"        >>> m.channels = 1\n"
"        >>> mat = soy.materials.Colored('green')\n"
"        >>> s = soy.atoms.Size((10,10,10))\n"
"        >>> p = soy.atoms.Position((2,2,1))\n"
"        >>> landscape = soy.scenes.Landscape(m, mat, 1, s, p)\n"
"        >>> landscape\n"
"        <Landscape>\n"
"        >>> landscape.size\n"
"        <Size (10.000000, 10.000000, 10.000000)>\n"
"        >>> landscape.material\n"
"        <Colored>\n"
"        >>> landscape.position\n"
"        <Position (2.000000, 2.000000, 1.000000)>\n"
"        >>> landscape.heightmap\n"
"        <Texture>\n"
"\n";


static SELF
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    PySoy_textures_Texture_Object* py_heightmap = NULL;
    PySoy_materials_Material_Object* py_material = NULL;
    PySoy_atoms_Size_Object* py_size = NULL;
    PySoy_atoms_Position_Object* py_position = NULL;
    soytexturesTexture* heightmap = NULL;
    soymaterialsMaterial* material = NULL;
    soyatomsSize* size = NULL;
    soyatomsPosition* position = NULL;
    int detail = 1;

    static char* kw[] = {"heightmap", "material", "detail", "size", "position", NULL};

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "O!O!|iO!O!", kw,
            &PySoy_textures_Texture_Type, &py_heightmap,
            &PySoy_materials_Material_Type, &py_material,
            &detail,
            &PySoy_atoms_Size_Type, &py_size,
            &PySoy_atoms_Position_Type, &py_position))
        return NULL;

    // Grab optional material gobject
    heightmap = py_heightmap->g;
    material = py_material->g;
    size = (py_size) ? py_size->g : NULL;
    position = (py_position) ? py_position->g : NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    // new gobject
    self->g = soy_scenes_landscape_new(heightmap, material, detail, size, position);

    return self;
}

static PyObject*
tp_repr (SELF self) {
    PyObject* ret;

    ret = PyUnicode_FromString("<Landscape>");

    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
material_doc[] = ".. py:attribute:: material\n"
"\n"
"    Material to be used for the Landscape scene\n"
"\n"
"    Examples::\n"
"\n"
"        >>> m = soy.textures.Texture()\n"
"        >>> m.channels = 1\n"
"        >>> mat = soy.materials.Colored('green')\n"
"        >>> s = soy.atoms.Size((10,10,10))\n"
"        >>> p = soy.atoms.Position((2,2,1))\n"
"        >>> landscape = soy.scenes.Landscape(m, mat, 1, s, p)\n"
"        >>> landscape.material\n"
"        <Colored>\n"
"        >>> landscape.material = soy.materials.Material()\n"
"        >>> landscape.material\n"
"        <Material>\n"
"\n";
PYSOY_PROP_OBJECT(scenes, landscape, material, materials_Material)

static char
position_doc[] = ".. py:attribute:: position\n"
"\n"
"    Position of the Landscape scene\n"
"\n"
"    Examples::\n"
"\n"
"        >>> m = soy.textures.Texture()\n"
"        >>> m.channels = 1\n"
"        >>> mat = soy.materials.Colored('green')\n"
"        >>> s = soy.atoms.Size((10,10,10))\n"
"        >>> p = soy.atoms.Position((2,2,1))\n"
"        >>> landscape = soy.scenes.Landscape(m, mat, 1, s, p)\n"
"        >>> landscape.position\n"
"        <Position (2.000000, 2.000000, 1.000000)>\n"
"        >>> landscape.position = soy.atoms.Position((5,5,5))\n"
"        >>> landscape.position\n"
"        <Position (5.000000, 5.000000, 5.000000)>\n"
"\n";
PYSOY_PROP_OBJECT(scenes, landscape, position, atoms_Position)

static char
size_doc[] = ".. py:attribute:: size\n"
"\n"
"    Size of the Landscape scene\n"
"\n"
"    Examples::\n"
"\n"
"        >>> m = soy.textures.Texture()\n"
"        >>> m.channels = 1\n"
"        >>> mat = soy.materials.Colored('green')\n"
"        >>> s = soy.atoms.Size((10,10,10))\n"
"        >>> p = soy.atoms.Position((2,2,1))\n"
"        >>> landscape = soy.scenes.Landscape(m, mat, 1, s, p)\n"
"        >>> landscape.size\n"
"        <Size (10.000000, 10.000000, 10.000000)>\n"
"        >>> landscape.size = soy.atoms.Size((5,5,5))\n"
"        >>> landscape.size\n"
"        <Size (5.000000, 5.000000, 5.000000)>\n"
"\n";
PYSOY_PROP_OBJECT(scenes, landscape, size, atoms_Size)

static char
heightmap_doc[] = ".. py:attribute:: heightmap\n"
"\n"
"    Heightmap to be used for the Landscape scene\n"
"\n"
"    Examples::\n"
"\n"
"        >>> m = soy.textures.Texture()\n"
"        >>> m.channels = 1\n"
"        >>> mat = soy.materials.Colored('green')\n"
"        >>> s = soy.atoms.Size((10,10,10))\n"
"        >>> p = soy.atoms.Position((2,2,1))\n"
"        >>> landscape = soy.scenes.Landscape(m, mat, 1, s, p)\n"
"        >>> landscape.heightmap\n"
"        <Texture>\n"
"        >>> landscape.heightmap = soy.textures.Cubemap()\n"
"        >>> landscape.heightmap\n"
"        <Cubemap>\n"
"\n";
PYSOY_PROP_OBJECT(scenes, landscape, heightmap, textures_Texture)


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(material),
    PYSOY_PROPSTRUCT(position),
    PYSOY_PROPSTRUCT(size),
    PYSOY_PROPSTRUCT(heightmap),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_scenes_Landscape_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.scenes.Landscape",                                // tp_name
    sizeof(PySoy_scenes_Landscape_Object),                 // tp_basicsize
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
    &PySoy_scenes_Scene_Type,                              // tp_base
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

