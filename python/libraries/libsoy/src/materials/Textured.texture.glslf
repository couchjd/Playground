/*
 *  libsoy - soy.materials.Textured.texture_glslf
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
uniform vec4 mat_ambient, mat_diffuse, mat_specular;
uniform vec4 mat_emission;
uniform float mat_shininess;
uniform sampler2D colormap, glowmap, bumpmap;
uniform samplerCube colormap_cube, glowmap_cube, bumpmap_cube;
uniform vec3 light_pos[8];
uniform int light_num;
varying vec3 vVertex, vVertexRaw, vNormal, vTangent;
varying vec2 vTexCoordColor, vTexCoordGlow, vTexCoordBump;

void main() {
    vec3 texN = vec3(textureCube(bumpmap_cube, normalize(
                vVertexRaw))+texture2D(bumpmap,vTexCoordBump))
                * 2.0 - 1.0;
    vec3 tangentN = normalize(vNormal);
    vec3 tangentT = normalize(vTangent);
    vec3 tangentB = normalize(cross(tangentN,tangentT));
    vec3 n = mat3(tangentT,tangentB,tangentN) * texN;
    vec3 v = normalize(-vVertex);

    vec4 totalDiffuse = mat_ambient * scene_ambient;
    vec4 totalSpecular = vec4(0.0);

    // FIXME raising loop count breaks on RPI
    for (int i = 0; i < 4; i++) {
        if (i >= light_num) {break;}
        vec3 l = light_pos[i]-vVertex;
        float d = length(l);
        if (d > 20.0) {continue;}
        l /= d;
        vec3 h = normalize(l+v);
        float d2 = d/(1.0-pow(d/20.0,2.0));
        float attenuation = 1.0/pow(1.0 + 0.01*d2,2.0);
        totalDiffuse += max(dot(l, n), 0.0) * mat_diffuse *
                        light_diffuse[i] * attenuation;
        totalSpecular += pow(max(dot(n, h), 0.0), mat_shininess)
                            * mat_specular * light_specular[i] *
                            attenuation;
    }

    vec3 vertexNorm = normalize(vVertexRaw);
    gl_FragColor = (totalDiffuse*(textureCube(colormap_cube
                    ,vertexNorm)+texture2D(colormap,
                    vTexCoordColor)) + totalSpecular) +
                    mat_emission + textureCube(glowmap_cube,
                    vertexNorm) + texture2D(glowmap,
                    vTexCoordGlow);
}

