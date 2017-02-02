/*
 *  libsoy - soy.scenes.Scene.collide_glslf
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

precision mediump float;
uniform sampler2D bodies;
varying vec2 vVertex;

void main()
{
    vec2 c1 = vec2(fract(4.0*vVertex.x),
                    floor(4.0*vVertex.x)/4.0);
    vec2 c2 = vec2(fract(4.0*vVertex.y),
                    floor(4.0*vVertex.y)/4.0);
    vec4 body1 = texture2D(bodies,c1);
    vec4 body2 = texture2D(bodies,c2);
    float x = body1.r - body2.r;
    float y = body1.g - body2.g;
    float z = body1.b - body2.b;
    float r_sum = body1.a + body2.a;
    if (x*x + y*y + z*z > r_sum*r_sum) {
        discard;
    }
    gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}
