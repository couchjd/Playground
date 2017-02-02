#!/usr/bin/env python3

'''Tests for soy.models.Mesh

    This currently tests the ability to create a mesh from Vertex and Face
    objects and that the order of those objects remain predictable.

    Additional tests for Mesh are required including material add/del,
    Face removal when a Vertex it uses is removed, VertexList and FaceList
    slicing, merging two Mesh objects via add/sub, multiplying a Mesh to
    repeat a pattern such a mirroring, and other features we have not yet
    added but which will require a high degree of testing due to their complex
    and bug-prone nature.
'''
__credits__ = '''
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
'''

import soy
import unittest

P = soy.atoms.Position
V = soy.atoms.Vertex
R = soy.atoms.Vector
F = soy.atoms.Face

quad_vertices = [
        ( 1,-1, 0),
        ( 1, 1, 0),
        (-1, 1, 0),
        (-1,-1, 0)
        ]

quad2_vertices = [
        ( 1,-1,-1),
        ( 1, 1,-1),
        (-1, 1,-1),
        (-1,-1,-1)
        ]

quad_faces = [
        (0,1,2),
        (2,3,0)
        ]

quad_faces_alternate = [
        (1,2,3),
        (3,0,1)
        ]

def V1(x):
    return V(x, R((1, 1, 1)), x, R((1, 1, 1)))

class TestMesh(unittest.TestCase):
  def setUp(self):
    self.mesh = soy.bodies.Mesh()
    self.material = soy.materials.Colored()

  def F1(self, x):
    return F(*x, material=self.material)

  def test_addition_mesh(self):
    verts = list(map(V1, map(P, quad_vertices)))
    face_vert = [ list(map(lambda x : verts[x], y)) for y in quad_faces]
    faces = map(self.F1, face_vert)

    for face in faces:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),2)

    verts2 = list(map(V1, map(P, quad2_vertices)))
    face_vert2 = [ list(map(lambda x : verts2[x], y)) for y in quad_faces]
    faces2 = map(self.F1, face_vert2)

    for face in faces2:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),4)
    # material should not change, even in the newly added ones
    self.assertEqual(self.mesh[0].material, self.material)
    self.assertEqual(self.mesh[2].material, self.material)

  def test_modification_mesh(self):
    verts = list(map(V1, map(P, quad_vertices)))
    face_vert = [ list(map(lambda x : verts[x], y)) for y in quad_faces]
    faces = map(self.F1, face_vert)

    verts2 = list(map(V1, map(P, quad2_vertices)))
    face_vert2 = [ list(map(lambda x : verts2[x], y)) for y in quad_faces]
    faces2 = map(self.F1, face_vert2)

    for face in faces:
        self.mesh.append(face)
    for face in faces2:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),4)

    face_vert3 = [ list(map(lambda x : verts[x], x)) for x in quad_faces_alternate]
    faces3 = list(map(self.F1, face_vert3))

    for i in range(2,4):
        self.mesh[i] = faces3[i-2]

  def test_substraction_mesh(self):
    verts = list(map(V1, map(P, quad_vertices)))
    face_vert = [ list(map(lambda x : verts[x], y)) for y in quad_faces]
    faces = map(self.F1, face_vert)

    for face in faces:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),2)

    verts2 = list(map(V1, map(P, quad2_vertices)))
    face_vert2 = [map(lambda x : verts2[x], y) for y in quad_faces]
    faces2 = list(map(self.F1,face_vert2))

    for i in range(2):
        self.mesh[i] = faces2[i]

    self.assertEqual(len(self.mesh),2)

  def test_reuse_mesh(self):
    verts = list(map(V1, map(P, quad_vertices)))
    face_vert = [map(lambda x : verts[x], y) for y in quad_faces]
    faces = map(self.F1, face_vert)

    for face in faces:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),2)

    verts2 = list(map(V1, map(P, quad_vertices)))
    face_vert2 = [ map(lambda x : verts2[x], x) for x in quad_faces_alternate]
    faces2 = map(self.F1, face_vert2)

    for face in faces2:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),4)


  def test_association_mesh(self):
    P1 = lambda x : P(x)
    V1 = lambda x : V(x,R((1,1,1)),x,R((1,1,1)))
    F1 = lambda x : F(*x, material=self.material)

    verts = list(map(V1, map(P, quad_vertices)))
    face_vert = [ map(lambda x : verts[x], y) for y in quad_faces]
    faces = list(map(self.F1, face_vert))

    for face in faces:
        self.mesh.append(face)

    verts2 = list(map(V1, map(P, quad2_vertices)))
    face_vert2 = [list(map(lambda x: verts2[x], y)) for y in quad_faces]
    faces2 = list(map(self.F1, face_vert2))

    mesh2 = soy.bodies.Mesh()
    for face in faces2:
      mesh2.append(face)

    mesh1 = self.mesh

    f1 = mesh1[0]
    f2 = mesh2[0]

    # associate f1[0] and f2[1] through v
    v = f1[0]
    f2[1] = v

    v.position.x = 5

    self.assertEqual(f1[0].position.x, f2[1].position.x)

    # delete the associating object
    del(v)
    f1[0].position.x = 10
    self.assertEqual(f1[0].position.x, f2[1].position.x)

    self.mesh[1][1] = self.mesh[0][0]
    self.mesh[0][0].position.x = 10
    self.assertEqual(self.mesh[1][1].position.x, self.mesh[0][0].position.x)

    # two vertices in the same mesh with the same data should not be the same
    # internal vertices unless they are actually the same vertex
    v1 = V1(P((1,1,1)))
    v2 = V1(P((1,1,1)))

    self.mesh[0][0] = self.mesh[0][1] = v1

    # mesh[0][0] and mesh[0][1] are the same vertex
    #self.assertIs(self.mesh[0][0], self.mesh[0][1])
    self.assertEqual(self.mesh[0][0], self.mesh[0][1])

    # same data, but different vertices
    self.mesh[0][0] = v1
    self.mesh[0][1] = v2

    self.assertIsNot(self.mesh[0][0], self.mesh[0][1])
    self.assertEqual(self.mesh[0][0], self.mesh[0][1])

    # the same vertex should not be reffed by two meshes even if it is
    # originally the same vertex

    mesh1[0][0] = mesh2[0][0] = v1
    self.assertIsNot(mesh1[0][0], mesh2[0][0])
    self.assertEqual(mesh1[0][0], mesh2[0][0])

    # replacing a face with associated vertices shouldn't change vertices of
    # the face still in the mesh
    self.mesh[0][0] = self.mesh[1][0] = v1
    self.mesh[1] = faces2[0]

    self.assertEqual(self.mesh[0][0], v1)

    mat = soy.materials.Material()
    self.mesh[0].material = mat
    self.assertEqual(self.mesh[0].material, mat)
    self.assertEqual(self.mesh[1].material, self.material)

    mesh1 = self.mesh
    del(mesh1[0])
    self.assertEqual(mesh1[0], self.mesh[0])
    self.assertIs(mesh1[0], self.mesh[0])

    mesh1[0].material = mat

    del(mesh1)
    self.assertEqual(self.mesh[0].material, mat)

    mesh = soy.bodies.Mesh()
    for face in faces:
      mesh.append(face)

    mat1 = soy.materials.Material()
    mat2 = soy.materials.Material()
    mesh[0].material = mat1
    mesh[1].material = mat2

    for face in faces2:
      mesh.append(face)

    self.assertEqual(mesh[0].material, mat1)
    self.assertEqual(mesh[1].material, mat2)

    f = mesh[1]
    del(mesh[0])
    self.assertIs(f, mesh[0])

    mesh.append(f)

    mesh[0] = mesh[1]
    mesh[0][0].position.x = 11
    del(mesh[0])
    self.assertEqual(mesh[0][0].position.x, 11)

    mesh = soy.bodies.Mesh()
    for face in faces:
      mesh.append(face)
      mesh.append(face)

    mesh[1].material = mesh[2].material
    mesh[2].material = mat1
    self.assertEqual(mesh[1].material, mat1)
    del(mesh[2])
    self.assertEqual(mesh[1].material, mat1)

    self.assertIs(mesh[0], mesh[0])
    self.assertIs(mesh[0][0], mesh[0][0])

    v = mesh[1][0]
    del(mesh[0])
    self.assertIs(v, mesh[0][0])

    mesh = soy.bodies.Mesh()
    for face in faces:
      mesh.append(face)

    v = mesh[0][0]
    mesh[1][0] = v
    del(mesh[0])
    self.assertIs(v, mesh[0][0])

def TestMeshSuite() :
  return unittest.TestLoader().loadTestsFromTestCase(TestMesh)


if __name__=='__main__':
  unittest.main()
