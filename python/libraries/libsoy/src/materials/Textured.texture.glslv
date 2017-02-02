/*
 *  libsoy - soy.materials.Textured.texture_glslv
 *  Copyright (C) 2006-2014 Copyleft Games Group
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */

attribute vec3 vertex, normal, tangent;
attribute vec2 texcoord;
uniform mat4 mv_matrix, p_matrix, tc_matrix, tg_matrix;
uniform mat4 tb_matrix;
varying vec3 vVertex, vVertexRaw, vNormal, vTangent;
varying vec2 vTexCoordColor, vTexCoordGlow, vTexCoordBump;

void main() {
    gl_Position = p_matrix*mv_matrix*vec4(vertex,1.0);
    vNormal = vec3(mv_matrix*vec4(normal,0.0));
    vVertex = vec3(mv_matrix*vec4(vertex,1.0));
    vTangent = vec3(mv_matrix*vec4(tangent,0.0));
    vVertexRaw = vertex;
    vTexCoordColor = vec2(tc_matrix*vec4(texcoord,0.0,1.0));
    vTexCoordGlow = vec2(tg_matrix*vec4(texcoord,0.0,1.0));
    vTexCoordBump = vec2(tb_matrix*vec4(texcoord,0.0,1.0));
}

