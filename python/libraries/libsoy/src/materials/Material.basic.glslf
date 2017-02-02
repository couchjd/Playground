/*
 *  libsoy - soy.materials.Material.basic_glslf
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

// https://imdoingitwrong.wordpress.com/2011/02/10/improved-light-attenuation/

precision mediump float;
uniform vec4 scene_ambient;
uniform vec4 light_diffuse[8], light_specular[8];
uniform vec3 light_pos[8];
uniform int light_num;
varying vec3 vVertex, vNormal;

void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(-vVertex);

    vec4 total = scene_ambient;

    for (int i = 0; i < 8; i++) {
        if (i >= light_num) {break;}
        vec3 l = light_pos[i]-vVertex;
        float d = length(l);
        if (d > 20.0) {continue;}
        l /= d;
        vec3 h = normalize(l+v);
        float d2 = d/(1.0-pow(d/20.0,2.0));
        float attenuation = 1.0/pow(1.0 + 0.01*d2,2.0);
        vec4 diffuse = max(dot(l, n), 0.0) * light_diffuse[i];
        vec4 specular = pow(max(dot(n, h), 0.0), 32.0)
                        * light_specular[i];
        total += (diffuse+specular)*attenuation;
    }

    gl_FragColor = total;
}

