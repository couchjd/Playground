/*
    PySoy - soy.scenes.Space Type
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
#define SELF PySoy_scenes_Space_Object*


static char
tp_doc[] = "soy.scenes.Scene Type\n"
"\n"
"    ''Space is big. Really, really big. You just won't believe how vastly,\n"
"    mind-boggling big it is. I mean you think it's a long way down the\n"
"    street to the chemist's, but that's just peanuts to Space.''\n"
"    ~ Douglas Adams\n"
"\n"
"    Space is a specialized scene class for astronomical environments.\n"
"    Planetary/stellar bodies and a starfield background are implemented\n"
"    through multi-stage rendering and an optimized octtree for collision\n"
"    are a few of this classes enhancements.\n"
"\n"
"    If a game includes multiple star systems each system should be\n"
"    implemented as an instance of this class.\n"
"\n"
"    It is currently incomplete.  In fact, right now, its just docs!\n"
"\n";

static SELF
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    double size = 0;
    float scale = 0;

    // parse the size
       // Parse arguments
    if (!PyArg_ParseTuple(args,"df", &size, &scale))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
      return NULL;

    // new gobject
    self->g = soy_scenes_space_new(size, scale);

    return self;
}


static PyObject*
tp_repr (SELF self) {
    PyObject* ret;

    ret = PyUnicode_FromString("<Space>");

    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Methods

static char
getDistance_doc[] = "Return the maximum activity distance of an objectin\n"
    " the scene\n";

static PyObject*
getDistance (SELF self, PyObject* args) {
    char* name;
    
    // Parse arguments
    if (!PyArg_ParseTuple(args, "s", &name))
        return NULL;
    
    float distance = soy_scenes_space_get_distance(self->g, name);

    PyObject* ret = Py_BuildValue("f", distance);

    return (PyObject*) ret;
}

static char
setDistance_doc[] = "Set the maximum activity distance of an objectin\n"
    " the scene\n";

static PyObject*
setDistance (SELF self, PyObject* args) {
    char* name;
    float distance;
    
    // Parse arguments
    if (!PyArg_ParseTuple(args, "sf", &name, &distance))
        return NULL;
    
    soy_scenes_space_set_distance(self->g, name, distance);

    Py_RETURN_NONE;
}

static char
getKeep_doc[] = "Return whether the object should be kept when it reaches\n"
    " it's maximum activity distance the scene\n";

static PyObject*
getKeep (SELF self, PyObject* args) {
    char* name;
    
    // Parse arguments
    if (!PyArg_ParseTuple(args, "s", &name))
        return NULL;
    
    int keep = soy_scenes_space_get_keep(self->g, name);

    PyObject* ret = PyBool_FromLong(keep);

    return (PyObject*) ret;
}

static char
setKeep_doc[] = "Sets whether the object should be kept when it reaches\n"
    " it's maximum activity distance the scene\n";

static PyObject*
setKeep (SELF self, PyObject* args) {
    char* name;
    PyObject* keep;
    
    // Parse arguments
    if (!PyArg_ParseTuple(args, "sO", &name, &keep))
        return NULL;
    
    soy_scenes_space_set_keep(self->g, name, PyObject_IsTrue(keep));

    Py_RETURN_NONE;
}

static char
getActive_doc[] = "Return whether the object is active\n";

static PyObject*
getActive (SELF self, PyObject* args) {
    char* name;
    
    // Parse arguments
    if (!PyArg_ParseTuple(args, "s", &name))
        return NULL;
    
    int active = soy_scenes_space_get_active(self->g, name);

    PyObject* ret = PyBool_FromLong(active);

    return (PyObject*) ret;
}

static char
getPosition_doc[] = "Return the current camera cell based position of an object\n";

static PyObject*
getPosition (SELF self, PyObject* args) {
    char* name;
    
    // Parse arguments
    if (!PyArg_ParseTuple(args, "s", &name))
        return NULL;
    
    float x, y, z;
    x = y = z = 0;
    soy_scenes_space_get_position(self->g, name, &x, &y, &z);

    PyObject* ret = Py_BuildValue("(fff)", x, y, z);

    return (PyObject*) ret;
}

static char
setPosition_doc[] = "Sets the camera cell based position of an object\n";

static PyObject*
setPosition (SELF self, PyObject* args) {
    char* name;
    float x, y, z;
    
    // Parse arguments
    if (!PyArg_ParseTuple(args, "sfff", &name, &x, &y, &z))
        return NULL;
    
    soy_scenes_space_set_position(self->g, name, x, y, z);

    Py_RETURN_NONE;
}

static char
pollRemoved_doc[] = "Returns removed objects that got removed due to reaching"
    " their maximum distance\n";

static PyObject*
pollRemoved (SELF self, PyObject* args) {
    // Parse arguments
    if (!PyArg_ParseTuple(args, ""))
        return NULL;
    
    PyObject* ret = PyList_New(0);
    
    char* removed;
    while((removed = soy_scenes_space_poll_removed(self->g)))
        PyList_Append(ret, Py_BuildValue("s", removed));

    return (PyObject*) ret;
}

static char
pollCells_doc[] = "Returns cell transitions that happened since the last call"
    " to this function\n";

static PyObject*
pollCells (SELF self, PyObject* args) {
    // Parse arguments
    if (!PyArg_ParseTuple(args, ""))
        return NULL;
    
    PyObject* ret = PyList_New(0);
    
    soyscenesSpaceCell* cell;
    while((cell = soy_scenes_space_poll_transitions(self->g)))
        PyList_Append(ret, Py_BuildValue("(iii)", cell->x, cell->y, cell->z));

    return (PyObject*) ret;
}

///////////////////////////////////////////////////////////////////////////////
// Properties

/*
static char
walls_doc[] = "Material of the room walls\n"
"\n"
"If set, the room will render 6 walls with the specified material.\n"
"\n"
"    Examples::\n"
"\n"
"        >>> r = soy.scenes.Room(1.0)\n"
"        >>> r.walls = soy.materials.Colored('green')\n"
"        >>> r.walls\n"
"        <Colored>\n"
"        >>> r.walls = soy.materials.Material()\n"
"        >>> r.walls\n"
"        <Material>\n"
"\n";
PYSOY_PROP_OBJECT(scenes, room, walls, materials_Material)
*/

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyMethodDef tp_methods[] = {
    {"getDistance",                                        // ml_name
     (PyCFunction) getDistance,                            // ml_meth
     METH_VARARGS,                                         // ml_flags
     getDistance_doc},                                     // ml_doc
    {"setDistance",                                        // ml_name
     (PyCFunction) setDistance,                            // ml_meth
     METH_VARARGS,                                         // ml_flags
     setDistance_doc},                                     // ml_doc
    {"setKeep",                                            // ml_name
     (PyCFunction) setKeep,                                // ml_meth
     METH_VARARGS,                                         // ml_flags
     setKeep_doc},                                         // ml_doc
    {"getKeep",                                            // ml_name
     (PyCFunction) getKeep,                                // ml_meth
     METH_VARARGS,                                         // ml_flags
     getKeep_doc},                                         // ml_doc
    {"getActive",                                          // ml_name
     (PyCFunction) getActive,                              // ml_meth
     METH_VARARGS,                                         // ml_flags
     getActive_doc},                                       // ml_doc
    {"getPosition",                                        // ml_name
     (PyCFunction) getPosition,                            // ml_meth
     METH_VARARGS,                                         // ml_flags
     getPosition_doc},                                     // ml_doc
    {"setPosition",                                        // ml_name
     (PyCFunction) setPosition,                            // ml_meth
     METH_VARARGS,                                         // ml_flags
     setPosition_doc},                                     // ml_doc
    {"pollRemoved",                                        // ml_name
     (PyCFunction) pollRemoved,                            // ml_meth
     METH_VARARGS,                                         // ml_flags
     pollRemoved_doc},                                     // ml_doc
    {"pollCells",                                          // ml_name
     (PyCFunction) pollCells,                              // ml_meth
     METH_VARARGS,                                         // ml_flags
     pollCells_doc},                                       // ml_doc
    {NULL},                                                // sentinel
};

static PyGetSetDef tp_getset[] = {
    //PYSOY_PROPSTRUCT(walls),
    {NULL}                                                 // sentinel
};

PyTypeObject PySoy_scenes_Space_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.scenes.Space",                                    // tp_name
    sizeof(PySoy_scenes_Space_Object),                     // tp_basicsize
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
