/*
    PySoy - soy.atoms.Rotation Type
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
#define SELF PySoy_atoms_Rotation_Object*


static char
tp_doc[] = ".. py:class:: Rotation((alpha, beta [, gamma = 0.0]))\n"
"\n"
"    This type stores the rotation of an object as three floats\n"
"    (alpha, beta, gamma) measured in radians.\n"
"\n"
"    Wherever a Rotation may be used, a sequence of 2 or 3 items may be used\n"
"    instead.  This is primarily a return value which modifies the object\n"
"    that created it when changed.\n"
"\n"
"    Example::\n"
"\n"
"       >>> rotation = soy.atoms.Rotation((1, 3.14, 2))\n"
"       >>> rotation\n"
"       <Rotation (1.000000, 3.140000, 2.000000)>\n"
"\n"
"    :param float alpha: angle of rotation in radians\n"
"    :param float beta: angle of rotation in radians\n"
"    :param float gamma: angle of rotation in radians\n"
"\n";
//"    If window.rotation returned a plain list changing one of its items\n"
//"    would not move the window by itself, you would instead have to:\n"
//"        window.rotation = (window.rotation[0] += 10, window.rotation[1], 0)\n"
//"\n"
//"    You may use the latter syntax if you prefer it, but its slower and not\n"
//"    as readable.  Embracing this little magic will make your code happier.\n"
//"\n";


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    float a, b, c, d = 0;
    int euler = 1;
    int axis_angle = 0;

    // Ensure no keywords were given
    if (!_PyArg_NoKeywords("soy.atoms.Rotation", kwds));

    // Try to parse euler, quaternion and axis angle dimensions
	if (!PyArg_ParseTuple(args, "(ff)", &a, &b)) {
		PyErr_Clear();
		if (!PyArg_ParseTuple(args, "(fff)", &a, &b, &c)) {
			PyErr_Clear();
			euler = 0;
	        if (!PyArg_ParseTuple(args, "(ffff)", &a, &b, &c, &d)) {
		    	PyErr_Clear();
		    	axis_angle = 1;
		    	if (!PyArg_ParseTuple(args, "(fff)f", &b, &c, &d, &a))
		        	return NULL;
	        }
		}
    }

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;
       

    if (euler) {
		float ca = cos( a * 0.5);
		float sa = sin(-a * 0.5);
		float cb = cos( b * 0.5);
		float sb = sin(-b * 0.5);
		float cc = cos( c * 0.5);
		float sc = sin(-c * 0.5);
		a = ca * cb * cc - sa * sb * sc;
		b = sa * sb * cc + ca * cb * sc;
		c = sa * cb * cc + ca * sb * sc;
		d = ca * sb * cc - sa * cb * sc;
	}

    if (axis_angle) {
        float s = sin(a * 0.5);
        a = cos(a * 0.5);
        b *= s;
        c *= s;
        d *= s;
    }

    // new gobject
    self->g = soy_atoms_rotation_new(a, b, c, d);

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    char* str;
    PyObject* ret;

    // We can't use PyUnicode_FromFormat because it doesn't support floats
    str = g_strdup_printf("<Rotation (%f, %f, %f, %f)>",
                          soy_atoms_rotation_get_w(self->g),
                          soy_atoms_rotation_get_x(self->g),
                          soy_atoms_rotation_get_y(self->g),
                          soy_atoms_rotation_get_z(self->g));
    ret = PyUnicode_FromString(str);

    // Free str and return
    g_free(str);
    return ret;
}


static PyObject*
tp_str (SELF self) {
    char* str;
    PyObject* ret;

    // We can't use PyUnicode_FromFormat because it doesn't support floats
    str = g_strdup_printf("(%f, %f, %f, %f)",
                          soy_atoms_rotation_get_w(self->g),
                          soy_atoms_rotation_get_x(self->g),
                          soy_atoms_rotation_get_y(self->g),
                          soy_atoms_rotation_get_z(self->g));
    ret = PyUnicode_FromString(str);

    // Free str and return
    g_free(str);
    return ret;
}


static PyObject*
tp_richcompare (PyObject *left, PyObject *right, int op) {
    GObject* c1 = NULL;
    GObject* c2 = NULL;

    if (!PySoy__G_Check(left) || !PySoy__G_Check(right))
        return Py_False;

    c1 = ((PySoy__G_Object*) left)->g;
    c2 = ((PySoy__G_Object*) right)->g;

    if (op == Py_EQ) {
        if (soy_atoms_rotation_cmp_eq(c1, c2))
            return Py_True;
    }
    else if (op == Py_NE) {
        if (soy_atoms_rotation_cmp_ne(c1, c2))
            return Py_True;
    }
    else {
        PyErr_SetString(PyExc_NotImplementedError,
                        "only == and != are supported for soy.atoms.Rotation");
        return NULL;
    }
    return Py_False;
}


///////////////////////////////////////////////////////////////////////////////
// Number Methods

static PyObject*
nb_add (PyObject* o1, PyObject* o2) {
    float o1w = 0, o1x = 0, o1y = 0, o1z = 0;
    float o2w = 0, o2x = 0, o2y = 0, o2z = 0;
    PyObject *args, *result;
    PySoy_atoms_Rotation_Object *so1, *so2;

    // parse object 1
    if (PyLong_Check(o1)) {
        o1w = o1x = o1y = o1z = PyLong_AsDouble(o1);
    }
    else if (PyFloat_Check(o1)) {
        o1w = o1x = o1y = o1z = PyFloat_AsDouble(o1);
    }
    else if (PySoy_atoms_Rotation_Check(o1)) {
        so1 = (PySoy_atoms_Rotation_Object*)o1;
        o1w = soy_atoms_rotation_get_w(so1->g);
        o1x = soy_atoms_rotation_get_x(so1->g);
        o1y = soy_atoms_rotation_get_y(so1->g);
        o1z = soy_atoms_rotation_get_z(so1->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // parse object 2
    if (PyLong_Check(o2)) {
        o2w = o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2w = o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2w = soy_atoms_rotation_get_w(so2->g);
        o2x = soy_atoms_rotation_get_x(so2->g);
        o2y = soy_atoms_rotation_get_y(so2->g);
        o2z = soy_atoms_rotation_get_z(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // build args with calculated values
    args = Py_BuildValue("((ffff))", o1w + o2w, o1x + o2x, o1y + o2y, o1z + o2z);

    // create result object
    result = tp_new(&PySoy_atoms_Rotation_Type, args, NULL);

    // decref args tuple and tmp
    Py_DECREF(args);

    // return calculated result
    return result;
}


static PyObject*
nb_subtract (PyObject* o1, PyObject* o2) {
    float o1w = 0, o1x = 0, o1y = 0, o1z = 0;
    float o2w = 0, o2x = 0, o2y = 0, o2z = 0;
    PyObject *args, *result;
    PySoy_atoms_Rotation_Object *so1, *so2;

    // parse object 1
    if (PyLong_Check(o1)) {
        o1w = o1x = o1y = o1z = PyLong_AsDouble(o1);
    }
    else if (PyFloat_Check(o1)) {
        o1w = o1x = o1y = o1z = PyFloat_AsDouble(o1);
    }
    else if (PySoy_atoms_Rotation_Check(o1)) {
        so1 = (PySoy_atoms_Rotation_Object*)o1;
        o1w = soy_atoms_rotation_get_w(so1->g);
        o1x = soy_atoms_rotation_get_x(so1->g);
        o1y = soy_atoms_rotation_get_y(so1->g);
        o1z = soy_atoms_rotation_get_z(so1->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // parse object 2
    if (PyLong_Check(o2)) {
        o2w = o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2w = o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2w = soy_atoms_rotation_get_w(so2->g);
        o2x = soy_atoms_rotation_get_x(so2->g);
        o2y = soy_atoms_rotation_get_y(so2->g);
        o2z = soy_atoms_rotation_get_z(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // build args with calculated values
    args = Py_BuildValue("((ffff))", o1w - o2w, o1x - o2x, o1y - o2y, o1z - o2z);

    // create result object
    result = tp_new(&PySoy_atoms_Rotation_Type, args, NULL);

    // decref args tuple and tmp
    Py_DECREF(args);

    // return calculated result
    return result;
}


static PyObject*
nb_multiply (PyObject* o1, PyObject* o2) {
    double o1w, o1x, o1y, o1z = 0;
    double o2w, o2x, o2y, o2z = 0;
    PyObject *args, *result;
    PySoy_atoms_Rotation_Object *so1, *so2;

    // parse object 1
    if (PyLong_Check(o1)) {
        o1w, o1x = o1y = o1z = PyLong_AsDouble(o1);
    }
    else if (PyFloat_Check(o1)) {
        o1w, o1x = o1y = o1z = PyFloat_AsDouble(o1);
    }
    else if (PySoy_atoms_Rotation_Check(o1)) {
        so1 = (PySoy_atoms_Rotation_Object*)o1;
        o1w = soy_atoms_rotation_get_w(so1->g);
        o1x = soy_atoms_rotation_get_x(so1->g);
        o1y = soy_atoms_rotation_get_y(so1->g);
        o1z = soy_atoms_rotation_get_z(so1->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // parse object 2
    if (PyLong_Check(o2)) {
        o2w = o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2w = o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2w = soy_atoms_rotation_get_w(so2->g);
        o2x = soy_atoms_rotation_get_x(so2->g);
        o2y = soy_atoms_rotation_get_y(so2->g);
        o2z = soy_atoms_rotation_get_z(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // build args with calculated values
    args = Py_BuildValue("((ffff))", o1w * o2w - o1x * o2x - o1y * o2y - o1z * o2z,
	                                 o1w * o2x + o1x * o2w + o1y * o2z - o1z * o2y,
	                                 o1w * o2y - o1x * o2z + o1y * o2w + o1z * o2x,
	                                 o1w * o2z + o1x * o2y - o1y * o2x + o1z * o2w);

    // create result object
    result = tp_new(&PySoy_atoms_Rotation_Type, args, NULL);

    // decref args tuple
    Py_DECREF(args);

    // return calculated result
    return result;
}


static PyObject*
nb_inplace_add (PyObject* this, PyObject* o2) {
    SELF self = (SELF) this;
    double o2w, o2x, o2y, o2z = 0;
    PySoy_atoms_Rotation_Object *so2;

    // parse object 2
    if (PyLong_Check(o2)) {
        o2w = o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2w = o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2w = soy_atoms_rotation_get_w(so2->g);
        o2x = soy_atoms_rotation_get_x(so2->g);
        o2y = soy_atoms_rotation_get_y(so2->g);
        o2z = soy_atoms_rotation_get_z(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // increment self object's x,y by the other object's x,y FIXME comment
    soy_atoms_rotation_set_w(self->g,
                                 soy_atoms_rotation_get_w(self->g) + o2w);
    soy_atoms_rotation_set_x(self->g,
                                 soy_atoms_rotation_get_x(self->g) + o2x);
    soy_atoms_rotation_set_y(self->g,
                                 soy_atoms_rotation_get_y(self->g) + o2y);
    soy_atoms_rotation_set_z(self->g,
                                 soy_atoms_rotation_get_z(self->g) + o2z);

    // incref self before returning
    Py_INCREF(this);

    // return self object with the new calculated values
    return this;
}


static PyObject*
nb_inplace_subtract (PyObject* this, PyObject* o2) {
    SELF self = (SELF) this;
    double o2w, o2x, o2y, o2z = 0;
    PySoy_atoms_Rotation_Object *so2;

    // parse object 2
    if (PyLong_Check(o2)) {
        o2w = o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2w = o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2w = soy_atoms_rotation_get_w(so2->g);
        o2x = soy_atoms_rotation_get_x(so2->g);
        o2y = soy_atoms_rotation_get_y(so2->g);
        o2z = soy_atoms_rotation_get_z(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // increment self object's x,y by the other object's x,y FIXME comment
    soy_atoms_rotation_set_w(self->g,
                                 soy_atoms_rotation_get_w(self->g) - o2w);
    soy_atoms_rotation_set_x(self->g,
                                 soy_atoms_rotation_get_x(self->g) - o2x);
    soy_atoms_rotation_set_y(self->g,
                                 soy_atoms_rotation_get_y(self->g) - o2y);
    soy_atoms_rotation_set_z(self->g,
                                 soy_atoms_rotation_get_z(self->g) - o2z);

    // incref self before returning
    Py_INCREF(this);

    // return self object with the new calculated values
    return this;
}


static PyObject*
nb_inplace_multiply (PyObject* this, PyObject* o2) {
    SELF self = (SELF) this;
    double o1w, o1x, o1y, o1z = 0;
    double o2w, o2x, o2y, o2z = 0;
    PySoy_atoms_Rotation_Object *so2;

    o1w = soy_atoms_rotation_get_w(self->g);
    o1x = soy_atoms_rotation_get_x(self->g);
    o1y = soy_atoms_rotation_get_y(self->g);
    o1z = soy_atoms_rotation_get_z(self->g);

    // parse object 2
    if (PyLong_Check(o2)) {
        o2w = o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2w = o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2w = soy_atoms_rotation_get_w(so2->g);
        o2x = soy_atoms_rotation_get_x(so2->g);
        o2y = soy_atoms_rotation_get_y(so2->g);
        o2z = soy_atoms_rotation_get_z(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // multiply self object's x,y by the other object's x,y
    soy_atoms_rotation_set_w(self->g,
                                 o1w * o2w - o1x * o2x - o1y * o2y - o1z * o2z);
    soy_atoms_rotation_set_x(self->g,
                                 o1w * o2x + o1x * o2w + o1y * o2z - o1z * o2y);
    soy_atoms_rotation_set_y(self->g,
                                 o1w * o2y - o1x * o2z + o1y * o2w + o1z * o2x);
    soy_atoms_rotation_set_z(self->g,
                                 o1w * o2z + o1x * o2y - o1y * o2x + o1z * o2w);

    // incref self before returning
    Py_INCREF(this);

    // return self object with the new calculated values
    return this;
}


///////////////////////////////////////////////////////////////////////////////
// Sequence Methods

static Py_ssize_t
sq_length(SELF self) {
    return 4;
}


static PyObject*
sq_item(SELF self, Py_ssize_t index) {
    if (index == 0)
        return PyFloat_FromDouble(soy_atoms_rotation_get_w(self->g));

    if (index == 1)
        return PyFloat_FromDouble(soy_atoms_rotation_get_x(self->g));

    if (index == 2)
        return PyFloat_FromDouble(soy_atoms_rotation_get_y(self->g));

    if (index == 3)
        return PyFloat_FromDouble(soy_atoms_rotation_get_z(self->g));

    PyErr_SetString(PyExc_IndexError, "Rotation index out of range");
    return NULL;
}


static int
sq_ass_item(SELF self, Py_ssize_t index, PyObject* value) {
    // Ensure value is a number
    if (!PyNumber_Check(value)) {
        PyErr_SetString(PyExc_TypeError, "value must be float");
        return -1;
    }

    if (index == 0)
        soy_atoms_rotation_set_w(self->g, PyFloat_AsDouble(value));

    else if (index == 1)
        soy_atoms_rotation_set_x(self->g, PyFloat_AsDouble(value));

    else if (index == 2)
        soy_atoms_rotation_set_y(self->g, PyFloat_AsDouble(value));

    else if (index == 3)
        soy_atoms_rotation_set_z(self->g, PyFloat_AsDouble(value));

    else {
        PyErr_SetString(PyExc_IndexError, "Rotation index out of range");
        return -1;
    }
    return 0;
}


///////////////////////////////////////////////////////////////////////////////
// Methods

static char
conjugate_doc[] = ".. py:method:: Rotation.conjugate()\n"
"\n"
"    Returns the same rotation but in the other direction.\n"
"\n"
"    :rtype: soy.atoms.Rotation\n"
"\n";

static PyObject*
conjugate (SELF self, PyObject* args, PyObject* kwds) {
    PySoy_atoms_Vector_Object* pyvector;
    soyatomsVector* vector;
    float x, y, z;

    // ensure no keywords were provided
    if (!_PyArg_NoKeywords("soy.atoms.Rotation", kwds))
        return NULL;

    // parse arguments
    if (!PyArg_ParseTuple(args, ""))
        return NULL;

    // inherit base type
    SELF result = (SELF) PyType_GenericNew(&PySoy_atoms_Rotation_Type, args, kwds);
    if (!result)
        return NULL;
       
    // new gobject
    result->g = soy_atoms_rotation_conjugate(self->g);

    // return self
    return (PyObject*) result;
}

static char
rotate_doc[] = ".. py:method:: Rotation.rotate(vector)\n"
"\n"
"    Rotates the specified vector and returns the rotated vector.\n"
"\n"
"    :param soy.atoms.Vector vector: the vector that gets rotated\n"
"    :rtype: 3 float tuple\n"
"\n";

static PyObject*
rotate (SELF self, PyObject* args) {
    PySoy_atoms_Vector_Object* pyvector;
    soyatomsVector* vector;
    float x, y, z;

    // parse arguments
    if (PyArg_ParseTuple(args, "O!",
                          &PySoy_atoms_Vector_Type, &pyvector))
        vector = pyvector->g;
    else {
        PyErr_Clear();
        if(PyArg_ParseTuple(args, "(fff)",
                            &x, &y, &z))
            vector = soy_atoms_vector_new(x, y, z);

        else
            return NULL;
    }

    soyatomsVector* ret = soy_atoms_rotation_rotate(self->g, vector);
    x = soy_atoms_vector_get_x(ret);
    y = soy_atoms_vector_get_y(ret);
    z = soy_atoms_vector_get_z(ret);

    return Py_BuildValue("(fff)", x, y, z);
}

static char
euler_doc[] = ".. py:method:: Rotation.euler()\n"
"\n"
"    Returns the Euler rotation angles.\n"
"\n"
"    :rtype: 3 float tuple\n"
"\n";

static PyObject*
euler (SELF self, PyObject* args) {
    soyatomsVector* ret = soy_atoms_rotation_toEuler(self->g);
    float x = soy_atoms_vector_get_x(ret);
    float y = soy_atoms_vector_get_y(ret);
    float z = soy_atoms_vector_get_z(ret);

    return Py_BuildValue("(fff)", x, y, z);
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
w_doc[] = ".. py:attribute:: w\n"
"\n"
"   Rotation Around X Axis";
PYSOY_PROP_FLOAT(atoms, rotation, w)


static char
x_doc[] = ".. py:attribute:: x\n"
"\n"
"   Rotation Around X Axis";
PYSOY_PROP_FLOAT(atoms, rotation, x)


static char
y_doc[] = ".. py:attribute:: y\n"
"\n"
"   Rotation Around X Axis";
PYSOY_PROP_FLOAT(atoms, rotation, y)


static char
z_doc[] = ".. py:attribute:: z\n"
"\n"
"   Rotation Around X Axis";
PYSOY_PROP_FLOAT(atoms, rotation, z)


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyNumberMethods tp_as_number = {
    nb_add,                                                // nb_add
    nb_subtract,                                           // nb_subtract
    nb_multiply,                                           // nb_multiply
    0,                                                     // nb_remainder
    0,                                                     // nb_divmod
    0,                                                     // nb_power
    0,                                                     // nb_negative
    0,                                                     // nb_positive
    0,                                                     // nb_absolute
    0,                                                     // nb_bool
    0,                                                     // nb_invert
    0,                                                     // nb_lshift
    0,                                                     // nb_rshift
    0,                                                     // nb_and
    0,                                                     // nb_xor
    0,                                                     // nb_or
    0,                                                     // nb_int
    0,                                                     // nb_reserved
    0,                                                     // nb_float
    nb_inplace_add,                                        // nb_inplace_add
    nb_inplace_subtract,                                   // nb_inplace_subt..
    nb_inplace_multiply,                                   // nb_inplace_mult..
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


static PySequenceMethods tp_as_sequence = {
    (lenfunc) sq_length,                                   // sq_length
    0,                                                     // sq_concat
    0,                                                     // sq_repeat
    (ssizeargfunc) sq_item,                                // sq_item
    0,                                                     // was_sq_slice
    (ssizeobjargproc) sq_ass_item,                         // sq_ass_item
    0,                                                     // was_sq_ass_slice
    0,                                                     // sq_contains
    0,                                                     // sq_inplace_concat
    0,                                                     // sq_inplace_repeat
};

static PyMethodDef tp_methods[] = {
    {"conjugate",                                          // ml_name
     (PyCFunction) conjugate,                              // ml_meth
     METH_VARARGS | METH_KEYWORDS,                         // ml_flags
     conjugate_doc},                                       // ml_doc
    {"rotate",                                             // ml_name
     (PyCFunction) rotate,                                 // ml_meth
     METH_VARARGS,                                         // ml_flags
     rotate_doc},                                          // ml_doc
    {"euler",                                              // ml_name
     (PyCFunction) euler,                                  // ml_meth
     METH_VARARGS,                                         // ml_flags
     euler_doc},                                           // ml_doc
    {NULL},                                                // sentinel
};

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(w),
    PYSOY_PROPSTRUCT(x),
    PYSOY_PROPSTRUCT(y),
    PYSOY_PROPSTRUCT(z),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_atoms_Rotation_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.atoms.Rotation",                                  // tp_name
    sizeof(PySoy_atoms_Rotation_Object),                   // tp_basicsize
    0,                                                     // tp_itemsize
    0,                                                     // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) tp_repr,                                    // tp_repr
    &tp_as_number,                                         // tp_as_number
    &tp_as_sequence,                                       // tp_as_sequence
    0,                                                     // tp_as_mapping
    0,                                                     // tp_hash
    0,                                                     // tp_call
    (reprfunc) tp_str,                                     // tp_str
    (getattrofunc) 0,                                      // tp_getattro
    (setattrofunc) 0,                                      // tp_setattro
    0,                                                     // tp_as_buffer
    Py_TPFLAGS_DEFAULT | Py_TPFLAGS_BASETYPE,              // tp_flags
    tp_doc,                                                // tp_doc
    0,                                                     // tp_traverse
    0,                                                     // tp_clear
    tp_richcompare,                                        // tp_richcompare
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

