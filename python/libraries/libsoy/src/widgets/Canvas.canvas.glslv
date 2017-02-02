/*
 *  libsoy - soy.widgets.Canvas.canvas_glslv
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

attribute vec2 vertex;
attribute vec2 texcoord;
uniform mat4 tc_matrix;
uniform mat4 m_matrix;
varying vec2 vTexCoord;
void main()
{
    gl_Position = m_matrix * vec4(vertex,0.0,1.0);
    vTexCoord = vec2(tc_matrix * vec4(texcoord,0.0,1.0));
}
