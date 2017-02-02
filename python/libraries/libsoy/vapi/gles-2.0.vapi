/* gles-2.0.vapi
 *
 *  Copyright (C) 2006-2014 Copyleft Games Group
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */

#if GLES2_AVAILABLE
[CCode (lower_case_cprefix="", cheader_filename="GLES2/gl2.h,GLES2/gl2ext.h")]
#else
#if WINDOWS
[CCode (cheader_filename="windows.h")]
#endif
[CCode (lower_case_cprefix="", cheader_filename="GLES2/gl2.h,GLES2/gl2ext.h")]
#endif

namespace GL {
    [CCode (cname="GLvoid")]
    public struct GLvoid { }
    [CCode (cname="GLchar")]
    public struct GLchar : char { }
    [CCode (cname="GLenum")]
    public struct GLenum : uint { }
    [CCode (cname="GLboolean")]
    public struct GLboolean : bool { }
    [CCode (cname="GLbitfield")]
    public struct GLbitfield : uint { }
    [CCode (cname="GLbyte")]
    public struct GLbyte : char { }
    [CCode (cname="GLshort")]
    public struct GLshort : short { }
    [CCode (cname="GLint")]
    public struct GLint : int { }
    [CCode (cname="GLsizei")]
    public struct GLsizei : int { }
    [CCode (cname="GLubyte")]
    public struct GLubyte : uchar { }
    [CCode (cname="GLushort")]
    public struct GLushort : ushort { }
    [CCode (cname="GLuint")]
    public struct GLuint : uint { }
    [CCode (cname="GLfloat")]
    [FloatingType (rank = 1)]
    public struct GLfloat : float { }
    [CCode (cname="GLclampf")]
    [FloatingType (rank = 1)]
    public struct GLclampf : float { }
    [CCode (cname="GLfixed")]
    public struct GLfixed : int { }
    [CCode (cname="GLintptr")]
    public struct GLintptr : int { }
    [CCode (cname="GLsizeiptr")]
    public struct GLsizeiptr : int { }

    // ClearBufferMask
    public const GLenum GL_DEPTH_BUFFER_BIT;
    public const GLenum GL_STENCIL_BUFFER_BIT;
    public const GLenum GL_COLOR_BUFFER_BIT;

    // Boolean
    public const GLboolean GL_FALSE;
    public const GLboolean GL_TRUE;

    // BeginMode
    public const GLenum GL_POINTS;
    public const GLenum GL_LINES;
    public const GLenum GL_LINE_LOOP;
    public const GLenum GL_LINE_STRIP;
    public const GLenum GL_TRIANGLES;
    public const GLenum GL_TRIANGLE_STRIP;
    public const GLenum GL_TRIANGLE_FAN;

    // BlendingFactorDest
    public const GLenum GL_ZERO;
    public const GLenum GL_ONE;
    public const GLenum GL_SRC_COLOR;
    public const GLenum GL_ONE_MINUS_SRC_COLOR;
    public const GLenum GL_SRC_ALPHA;
    public const GLenum GL_ONE_MINUS_SRC_ALPHA;
    public const GLenum GL_DST_ALPHA;
    public const GLenum GL_ONE_MINUS_DST_ALPHA;

    // BlendingFactorSrc
    public const GLenum GL_DST_COLOR;
    public const GLenum GL_ONE_MINUS_DST_COLOR;
    public const GLenum GL_SRC_ALPHA_SATURATE;

    // BlendEquationSeparate
    public const GLenum GL_FUNC_ADD;
    public const GLenum GL_BLEND_EQUATION;
    public const GLenum GL_BLEND_EQUATION_RGB;
    public const GLenum GL_BLEND_EQUATION_ALPHA;

    // BlendSubtract
    public const GLenum GL_FUNC_SUBTRACT;
    public const GLenum GL_FUNC_REVERSE_SUBTRACT;

    // Separate Blend Functions
    public const GLenum GL_BLEND_DST_RGB;
    public const GLenum GL_BLEND_SRC_RGB;
    public const GLenum GL_BLEND_DST_ALPHA;
    public const GLenum GL_BLEND_SRC_ALPHA;
    public const GLenum GL_CONSTANT_COLOR;
    public const GLenum GL_ONE_MINUS_CONSTANT_COLOR;
    public const GLenum GL_CONSTANT_ALPHA;
    public const GLenum GL_ONE_MINUS_CONSTANT_ALPHA;
    public const GLenum GL_BLEND_COLOR;

    // Buffer Objects
    public const GLenum GL_ARRAY_BUFFER;
    public const GLenum GL_ELEMENT_ARRAY_BUFFER;
    public const GLenum GL_ARRAY_BUFFER_BINDING;
    public const GLenum GL_ELEMENT_ARRAY_BUFFER_BINDING;
    public const GLenum GL_STREAM_DRAW;
    public const GLenum GL_STATIC_DRAW;
    public const GLenum GL_DYNAMIC_DRAW;
    public const GLenum GL_BUFFER_SIZE;
    public const GLenum GL_BUFFER_USAGE;
    public const GLenum GL_CURRENT_VERTEX_ATTRIB;

    // CullFaceMode
    public const GLenum GL_FRONT;
    public const GLenum GL_BACK;
    public const GLenum GL_FRONT_AND_BACK;

    // EnableCap
    public const GLenum GL_TEXTURE_2D;
    public const GLenum GL_CULL_FACE;
    public const GLenum GL_BLEND;
    public const GLenum GL_DITHER;
    public const GLenum GL_STENCIL_TEST;
    public const GLenum GL_DEPTH_TEST;
    public const GLenum GL_SCISSOR_TEST;
    public const GLenum GL_POLYGON_OFFSET_FILL;
    public const GLenum GL_SAMPLE_ALPHA_TO_COVERAGE;
    public const GLenum GL_SAMPLE_COVERAGE;

    // ErrorCode
    public const GLenum GL_NO_ERROR;
    public const GLenum GL_INVALID_ENUM;
    public const GLenum GL_INVALID_VALUE;
    public const GLenum GL_INVALID_OPERATION;
    public const GLenum GL_OUT_OF_MEMORY;

    // FogMode
    public const GLenum GL_EXP;
    public const GLenum GL_EXP2;

    // FogParameter
    public const GLenum GL_FOG_DENSITY;
    public const GLenum GL_FOG_START;
    public const GLenum GL_FOG_END;
    public const GLenum GL_FOG_MODE;
    public const GLenum GL_FOG_COLOR;

    // FrontFaceDirection
    public const GLenum GL_CW;
    public const GLenum GL_CCW;

    // GetPName
    public const GLenum GL_LINE_WIDTH;
    public const GLenum GL_ALIASED_POINT_SIZE_RANGE;
    public const GLenum GL_ALIASED_LINE_WIDTH_RANGE;
    public const GLenum GL_CULL_FACE_MODE;
    public const GLenum GL_FRONT_FACE;
    public const GLenum GL_DEPTH_RANGE;
    public const GLenum GL_DEPTH_WRITEMASK;
    public const GLenum GL_DEPTH_CLEAR_VALUE;
    public const GLenum GL_DEPTH_FUNC;
    public const GLenum GL_STENCIL_CLEAR_VALUE;
    public const GLenum GL_STENCIL_FUNC;
    public const GLenum GL_STENCIL_FAIL;
    public const GLenum GL_STENCIL_PASS_DEPTH_FAIL;
    public const GLenum GL_STENCIL_PASS_DEPTH_PASS;
    public const GLenum GL_STENCIL_REF;
    public const GLenum GL_STENCIL_VALUE_MASK;
    public const GLenum GL_STENCIL_WRITEMASK;
    public const GLenum GL_STENCIL_BACK_FUNC;
    public const GLenum GL_STENCIL_BACK_FAIL;
    public const GLenum GL_STENCIL_BACK_PASS_DEPTH_FAIL;
    public const GLenum GL_STENCIL_BACK_PASS_DEPTH_PASS;
    public const GLenum GL_STENCIL_BACK_REF;
    public const GLenum GL_STENCIL_BACK_VALUE_MASK;
    public const GLenum GL_STENCIL_BACK_WRITEMASK;
    public const GLenum GL_VIEWPORT;
    public const GLenum GL_SCISSOR_BOX;
    public const GLenum GL_COLOR_CLEAR_VALUE;
    public const GLenum GL_COLOR_WRITEMASK;
    public const GLenum GL_UNPACK_ALIGNMENT;
    public const GLenum GL_PACK_ALIGNMENT;
    public const GLenum GL_MAX_TEXTURE_SIZE;
    public const GLenum GL_MAX_VIEWPORT_DIMS;
    public const GLenum GL_SUBPIXEL_BITS;
    public const GLenum GL_RED_BITS;
    public const GLenum GL_GREEN_BITS;
    public const GLenum GL_BLUE_BITS;
    public const GLenum GL_ALPHA_BITS;
    public const GLenum GL_DEPTH_BITS;
    public const GLenum GL_STENCIL_BITS;
    public const GLenum GL_POLYGON_OFFSET_UNITS;
    public const GLenum GL_POLYGON_OFFSET_FACTOR;
    public const GLenum GL_TEXTURE_BINDING_2D;
    public const GLenum GL_SAMPLE_BUFFERS;
    public const GLenum GL_SAMPLES;
    public const GLenum GL_SAMPLE_COVERAGE_VALUE;
    public const GLenum GL_SAMPLE_COVERAGE_INVERT;
    public const GLenum GL_NUM_COMPRESSED_TEXTURE_FORMATS;
    public const GLenum GL_COMPRESSED_TEXTURE_FORMATS;

    // HintMode
    public const GLenum GL_DONT_CARE;
    public const GLenum GL_FASTEST;
    public const GLenum GL_NICEST;

    // HintTarget
    public const GLenum GL_GENERATE_MIPMAP_HINT;

    // DataType
    public const GLenum GL_BYTE;
    public const GLenum GL_UNSIGNED_BYTE;
    public const GLenum GL_SHORT;
    public const GLenum GL_UNSIGNED_SHORT;
    public const GLenum GL_FLOAT;
    public const GLenum GL_FIXED;

    // PixelFormat
    public const GLenum GL_DEPTH_COMPONENT;
    public const GLenum GL_ALPHA;
    public const GLenum GL_RGB;
    public const GLenum GL_RGBA;
    public const GLenum GL_LUMINANCE;
    public const GLenum GL_LUMINANCE_ALPHA;

    // PixelType
    public const GLenum GL_UNSIGNED_SHORT_4_4_4_4;
    public const GLenum GL_UNSIGNED_SHORT_5_5_5_1;
    public const GLenum GL_UNSIGNED_SHORT_5_6_5;

    // Shaders
    public const GLenum GL_FRAGMENT_SHADER;
    public const GLenum GL_VERTEX_SHADER;
    public const GLenum GL_MAX_VERTEX_ATTRIBS;
    public const GLenum GL_MAX_VERTEX_UNIFORM_VECTORS;
    public const GLenum GL_MAX_VARYING_VECTORS;
    public const GLenum GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS;
    public const GLenum GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS;
    public const GLenum GL_MAX_TEXTURE_IMAGE_UNITS;
    public const GLenum GL_MAX_FRAGMENT_UNIFORM_VECTORS;
    public const GLenum GL_SHADER_TYPE;
    public const GLenum GL_DELETE_STATUS;
    public const GLenum GL_LINK_STATUS;
    public const GLenum GL_VALIDATE_STATUS;
    public const GLenum GL_ATTACHED_SHADERS;
    public const GLenum GL_ACTIVE_UNIFORMS;
    public const GLenum GL_ACTIVE_UNIFORM_MAX_LENGTH;
    public const GLenum GL_ACTIVE_ATTRIBUTES;
    public const GLenum GL_ACTIVE_ATTRIBUTE_MAX_LENGTH;
    public const GLenum GL_SHADING_LANGUAGE_VERSION;
    public const GLenum GL_CURRENT_PROGRAM;

    // StencilFunction
    public const GLenum GL_NEVER;
    public const GLenum GL_LESS;
    public const GLenum GL_EQUAL;
    public const GLenum GL_LEQUAL;
    public const GLenum GL_GREATER;
    public const GLenum GL_NOTEQUAL;
    public const GLenum GL_GEQUAL;
    public const GLenum GL_ALWAYS;

    // StencilOp
    public const GLenum GL_KEEP;
    public const GLenum GL_REPLACE;
    public const GLenum GL_INCR;
    public const GLenum GL_DECR;
    public const GLenum GL_INVERT;
    public const GLenum GL_INCR_WRAP;
    public const GLenum GL_DECR_WRAP;

    // StringName
    public const GLenum GL_VENDOR;
    public const GLenum GL_RENDERER;
    public const GLenum GL_VERSION;
    public const GLenum GL_EXTENSIONS;

    // TextureMagFilter
    public const GLenum GL_NEAREST;
    public const GLenum GL_LINEAR;

    // TextureMinFilter
    public const GLenum GL_NEAREST_MIPMAP_NEAREST;
    public const GLenum GL_LINEAR_MIPMAP_NEAREST;
    public const GLenum GL_NEAREST_MIPMAP_LINEAR;
    public const GLenum GL_LINEAR_MIPMAP_LINEAR;

    // TextureParameterName
    public const GLenum GL_TEXTURE_MAG_FILTER;
    public const GLenum GL_TEXTURE_MIN_FILTER;
    public const GLenum GL_TEXTURE_WRAP_S;
    public const GLenum GL_TEXTURE_WRAP_T;

    // TextureTarget
    public const GLenum GL_TEXTURE;
    public const GLenum GL_TEXTURE_CUBE_MAP;
    public const GLenum GL_TEXTURE_BINDING_CUBE_MAP;
    public const GLenum GL_TEXTURE_CUBE_MAP_POSITIVE_X;
    public const GLenum GL_TEXTURE_CUBE_MAP_NEGATIVE_X;
    public const GLenum GL_TEXTURE_CUBE_MAP_POSITIVE_Y;
    public const GLenum GL_TEXTURE_CUBE_MAP_NEGATIVE_Y;
    public const GLenum GL_TEXTURE_CUBE_MAP_POSITIVE_Z;
    public const GLenum GL_TEXTURE_CUBE_MAP_NEGATIVE_Z;
    public const GLenum GL_MAX_CUBE_MAP_TEXTURE_SIZE;

    // TextureUnit
    public const GLenum GL_TEXTURE0;
    public const GLenum GL_TEXTURE1;
    public const GLenum GL_TEXTURE2;
    public const GLenum GL_TEXTURE3;
    public const GLenum GL_TEXTURE4;
    public const GLenum GL_TEXTURE5;
    public const GLenum GL_TEXTURE6;
    public const GLenum GL_TEXTURE7;
    public const GLenum GL_TEXTURE8;
    public const GLenum GL_TEXTURE9;
    public const GLenum GL_TEXTURE10;
    public const GLenum GL_TEXTURE11;
    public const GLenum GL_TEXTURE12;
    public const GLenum GL_TEXTURE13;
    public const GLenum GL_TEXTURE14;
    public const GLenum GL_TEXTURE15;
    public const GLenum GL_TEXTURE16;
    public const GLenum GL_TEXTURE17;
    public const GLenum GL_TEXTURE18;
    public const GLenum GL_TEXTURE19;
    public const GLenum GL_TEXTURE20;
    public const GLenum GL_TEXTURE21;
    public const GLenum GL_TEXTURE22;
    public const GLenum GL_TEXTURE23;
    public const GLenum GL_TEXTURE24;
    public const GLenum GL_TEXTURE25;
    public const GLenum GL_TEXTURE26;
    public const GLenum GL_TEXTURE27;
    public const GLenum GL_TEXTURE28;
    public const GLenum GL_TEXTURE29;
    public const GLenum GL_TEXTURE30;
    public const GLenum GL_TEXTURE31;
    public const GLenum GL_ACTIVE_TEXTURE;

    // TextureWrapMode
    public const GLenum GL_REPEAT;
    public const GLenum GL_CLAMP_TO_EDGE;
    public const GLenum GL_MIRRORED_REPEAT;

    // Uniform Types
    public const GLenum GL_FLOAT_VEC2;
    public const GLenum GL_FLOAT_VEC3;
    public const GLenum GL_FLOAT_VEC4;
    public const GLenum GL_INT_VEC2;
    public const GLenum GL_INT_VEC3;
    public const GLenum GL_INT_VEC4;
    public const GLenum GL_BOOL;
    public const GLenum GL_BOOL_VEC2;
    public const GLenum GL_BOOL_VEC3;
    public const GLenum GL_BOOL_VEC4;
    public const GLenum GL_FLOAT_MAT2;
    public const GLenum GL_FLOAT_MAT3;
    public const GLenum GL_FLOAT_MAT4;
    public const GLenum GL_SAMPLER_2D;
    public const GLenum GL_SAMPLER_CUBE;

    // Vertex Arrays
    public const GLenum GL_VERTEX_ATTRIB_ARRAY_ENABLED;
    public const GLenum GL_VERTEX_ATTRIB_ARRAY_SIZE;
    public const GLenum GL_VERTEX_ATTRIB_ARRAY_STRIDE;
    public const GLenum GL_VERTEX_ATTRIB_ARRAY_TYPE;
    public const GLenum GL_VERTEX_ATTRIB_ARRAY_NORMALIZED;
    public const GLenum GL_VERTEX_ATTRIB_ARRAY_POINTER;
    public const GLenum GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING;

    // Read Format
    public const GLenum GL_IMPLEMENTATION_COLOR_READ_TYPE;
    public const GLenum GL_IMPLEMENTATION_COLOR_READ_FORMAT;

    // Shader Source
    public const GLenum GL_COMPILE_STATUS;
    public const GLenum GL_INFO_LOG_LENGTH;
    public const GLenum GL_SHADER_SOURCE_LENGTH;
    public const GLenum GL_SHADER_COMPILER;

    // Shader Binary
    public const GLenum GL_SHADER_BINARY_FORMATS;
    public const GLenum GL_NUM_SHADER_BINARY_FORMATS;

    // Shader Precision-Specified Types
    public const GLenum GL_LOW_FLOAT;
    public const GLenum GL_MEDIUM_FLOAT;
    public const GLenum GL_HIGH_FLOAT;
    public const GLenum GL_LOW_INT;
    public const GLenum GL_MEDIUM_INT;
    public const GLenum GL_HIGH_INT;

    // Framebuffer Object
    public const GLenum GL_FRAMEBUFFER;
    public const GLenum GL_RENDERBUFFER;
    public const GLenum GL_RGBA4;
    public const GLenum GL_RGB5_A1;
    public const GLenum GL_RGB565;
    public const GLenum GL_DEPTH_COMPONENT16;
    public const GLenum GL_STENCIL_INDEX8;
    public const GLenum GL_RENDERBUFFER_WIDTH;
    public const GLenum GL_RENDERBUFFER_HEIGHT;
    public const GLenum GL_RENDERBUFFER_INTERNAL_FORMAT;
    public const GLenum GL_RENDERBUFFER_RED_SIZE;
    public const GLenum GL_RENDERBUFFER_GREEN_SIZE;
    public const GLenum GL_RENDERBUFFER_BLUE_SIZE;
    public const GLenum GL_RENDERBUFFER_ALPHA_SIZE;
    public const GLenum GL_RENDERBUFFER_DEPTH_SIZE;
    public const GLenum GL_RENDERBUFFER_STENCIL_SIZE;
    public const GLenum GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE;
    public const GLenum GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME;
    public const GLenum GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL;
    public const GLenum GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE;
    public const GLenum GL_COLOR_ATTACHMENT0;
    public const GLenum GL_DEPTH_ATTACHMENT;
    public const GLenum GL_STENCIL_ATTACHMENT;
    public const GLenum GL_NONE;
    public const GLenum GL_FRAMEBUFFER_COMPLETE;
    public const GLenum GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
    public const GLenum GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
    public const GLenum GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
    public const GLenum GL_FRAMEBUFFER_UNSUPPORTED;
    public const GLenum GL_FRAMEBUFFER_BINDING;
    public const GLenum GL_RENDERBUFFER_BINDING;
    public const GLenum GL_MAX_RENDERBUFFER_SIZE;
    public const GLenum GL_INVALID_FRAMEBUFFER_OPERATION;


    /*************************************************************/
    // GL core functions

    public static void glActiveTexture (GLenum texture);
    public static void glAttachShader (GLuint program, GLuint shader);
    public static void glBindAttribLocation (GLuint program, GLuint index,
                                             string name);
    public static void glBindBuffer (GLenum target, GLuint buffer);
    public static void glBindFramebuffer (GLenum target, GLuint framebuffer);
    public static void glBindRenderbuffer (GLenum target, GLuint renderbuffer);
    public static void glBindTexture (GLenum target, GLuint texture);
    public static void glBlendColor (GLclampf red, GLclampf green,
                                     GLclampf blue, GLclampf alpha);
    public static void glBlendEquation (GLenum mode);
    public static void glBlendEquationSeparate (GLenum modeRGB,
                                                GLenum modeAlpha);
    public static void glBlendFunc (GLenum sfactor, GLenum dfactor);
    public static void glBlendFuncSeparate (GLenum srcRGB, GLenum dstRGB,
                                            GLenum srcAlpha, GLenum dstAlpha);
    public static void glBufferData (GLenum target, GLsizeiptr size,
                                     GLvoid* data, GLenum usage);
    public static void glBufferSubData (GLenum target, GLintptr offset,
                                        GLsizeiptr size, GLvoid* data);
    public static GLenum glCheckFramebufferStatus (GLenum target);
    public static void glClear (GLbitfield mask);
    public static void glClearColor (GLclampf red, GLclampf green,
                                     GLclampf blue, GLclampf alpha);
    public static void glClearDepthf (GLclampf depth);
    public static void glClearStencil (GLint s);
    public static void glColorMask (GLboolean red, GLboolean green,
                                    GLboolean blue, GLboolean alpha);
    public static void glCompileShader (GLuint shader);
    public static void glCompressedTexImage2D (GLenum target, GLint level,
                                               GLenum internalformat,
                                               GLsizei width, GLsizei height,
                                               GLint border, GLsizei imageSize,
                                               GLvoid* data);
    public static void glCompressedTexSubImage2D (GLenum target, GLint level,
                                                  GLint xoffset, GLint yoffset,
                                                  GLsizei width, GLsizei height,
                                                  GLenum format,
                                                  GLsizei imageSize,
                                                  GLvoid* data);
    public static void glCopyTexImage2D (GLenum target, GLint level,
                                         GLenum internalformat, GLint x,
                                         GLint y, GLsizei width, GLsizei height,
                                         GLint border);
    public static void glCopyTexSubImage2D (GLenum target, GLint level,
                                            GLint xoffset, GLint yoffset,
                                            GLint x, GLint y,
                                            GLsizei width, GLsizei height);
    public static GLuint glCreateProgram ( );
    public static GLuint glCreateShader (GLenum type);
    public static void glCullFace (GLenum mode);
    public static void glDeleteBuffers ([CCode (array_length_pos = 0.9)]
                                        GLuint[] buffers);
    public static void glDeleteFramebuffers ([CCode (array_length_pos = 0.9)]
                                             GLuint[] framebuffers);
    public static void glDeleteProgram (GLuint program);
    public static void glDeleteRenderbuffers ([CCode (array_length_pos = 0.9)]
                                              GLuint[] renderbuffers);
    public static void glDeleteShader (GLuint shader);
    public static void glDeleteTextures ([CCode (array_length_pos = 0.9)]
                                         GLuint[] textures);
    public static void glDepthFunc (GLenum func);
    public static void glDepthMask (GLboolean flag);
    public static void glDepthRangef (GLclampf zNear, GLclampf zFar);
    public static void glDetachShader (GLuint program, GLuint shader);
    public static void glDisable (GLenum cap);
    public static void glDisableVertexAttribArray (GLuint index);
    public static void glDrawArrays (GLenum mode, GLint first, GLsizei count);
    public static void glDrawElements (GLenum mode, GLsizei count, GLenum type,
                                       GLvoid* indices);
    public static void glEnable (GLenum cap);
    public static void glEnableVertexAttribArray (GLuint index);
    public static void glFinish ( );
    public static void glFlush ( );
    public static void glFramebufferRenderbuffer (GLenum target,
                                                  GLenum attachment,
                                                  GLenum renderbuffertarget,
                                                  GLuint renderbuffer);
    public static void glFramebufferTexture2D (GLenum target, GLenum attachment,
                                               GLenum textarget, GLuint texture,
                                               GLint level);
    public static void glFrontFace (GLenum mode);
    public static void glGenBuffers ([CCode (array_length_pos = 0.9)]
                                     GLuint[] buffers);
    public static void glGenerateMipmap (GLenum target);
    public static void glGenFramebuffers ([CCode (array_length_pos = 0.9)]
                                          GLuint[] framebuffers);
    public static void glGenRenderbuffers ([CCode (array_length_pos = 0.9)]
                                           GLuint[] renderbuffers);
    public static void glGenTextures ([CCode (array_length_pos = 0.9)]
                                      GLuint[] textures);
    public static void glGetActiveAttrib (GLuint program, GLuint index,
                                          GLsizei bufsize, out GLsizei length,
                                          out GLint size, out GLenum type,
                                          string name);
    public static void glGetActiveUniform (GLuint program, GLuint index,
                                           GLsizei bufsize, out GLsizei length,
                                           out GLint size, out GLenum type,
                                           string name);
    public static void glGetAttachedShaders (GLuint program, GLsizei maxcount,
                                             out GLsizei count,
                                             out GLuint shaders);
    public static int glGetAttribLocation (GLuint program, string name);
    public static void glGetBooleanv (GLenum pname, [CCode (array_length = false)]
                                      GLboolean[] params);
    public static void glGetBufferParameteriv (GLenum target, GLenum pname,
                                               out GLint params);
    public static GLenum glGetError ( );
    public static void glGetFloatv (GLenum pname, [CCode (array_length = false)]
                                    GLfloat[] params);
    public static void glGetFramebufferAttachmentParameteriv (GLenum target,
                                                              GLenum attachment,
                                                              GLenum pname,
                                                              out GLint params);
    public static void glGetIntegerv (GLenum pname, [CCode (array_length = false)]
                                      GLint[] params);
    public static void glGetProgramiv (GLuint program, GLenum pname,
                                       out GLint params);
    public static void glGetProgramInfoLog (GLuint program, GLsizei bufsize,
                                            out GLsizei length,
                                            [CCode (array_length = false)]
                                            GLchar[] infolog);
    public static void glGetRenderbufferParameteriv (GLenum target,
                                                     GLenum pname,
                                                     out GLint params);
    public static void glGetShaderiv (GLuint shader, GLenum pname,
                                      out GLint params);
    public static void glGetShaderInfoLog (GLuint shader, GLsizei bufsize,
                                           out GLsizei length,
                                           [CCode (array_length = false)]
                                           GLchar[] infolog);
    public static void glGetShaderPrecisionFormat (GLenum shadertype,
                                                   GLenum precisiontype,
                                                   out GLint range,
                                                   out GLint precision);
    public static void glGetShaderSource (GLuint shader, GLsizei bufsize,
                                          out GLsizei length, string source);
    public static string glGetString (GLenum name);
    public static void glGetTexParameterfv (GLenum target, GLenum pname,
                                            out GLfloat params);
    public static void glGetTexParameteriv (GLenum target, GLenum pname,
                                            out GLint params);
    public static void glGetUniformfv (GLuint program, GLint location,
                                       [CCode (array_length = false)] GLfloat[]
                                       params);
    public static void glGetUniformiv (GLuint program, GLint location,
                                       [CCode (array_length = false)] GLint[]
                                       params);
    public static int glGetUniformLocation (GLuint program, string name);
    public static void glGetVertexAttribfv (GLuint index, GLenum pname,
                                            out GLfloat params);
    public static void glGetVertexAttribiv (GLuint index, GLenum pname,
                                            out GLint params);
    public static void glGetVertexAttribPointerv (GLuint index, GLenum pname,
                                                  out GLvoid* pointer);
    public static void glHint (GLenum target, GLenum mode);
    public static GLboolean glIsBuffer (GLuint buffer);
    public static GLboolean glIsEnabled (GLenum cap);
    public static GLboolean glIsFramebuffer (GLuint framebuffer);
    public static GLboolean glIsProgram (GLuint program);
    public static GLboolean glIsRenderbuffer (GLuint renderbuffer);
    public static GLboolean glIsShader (GLuint shader);
    public static GLboolean glIsTexture (GLuint texture);
    public static void glLineWidth (GLfloat width);
    public static void glLinkProgram (GLuint program);
    public static void glPixelStorei (GLenum pname, GLint param);
    public static void glPolygonOffset (GLfloat factor, GLfloat units);
    public static void glReadPixels (GLint x, GLint y, GLsizei width,
                                     GLsizei height, GLenum format, GLenum type,
                                     GLvoid* pixels);
    public static void glReleaseShaderCompiler ( );
    public static void glRenderbufferStorage (GLenum target,
                                              GLenum internalformat,
                                              GLsizei width, GLsizei height);
    public static void glSampleCoverage (GLclampf value, GLboolean invert);
    public static void glScissor (GLint x, GLint y, GLsizei width,
                                  GLsizei height);
    public static void glShaderBinary (GLsizei n, GLuint* shaders,
                                       GLenum binaryformat, GLvoid* binary,
                                       GLsizei length);
    public static void glShaderSource (GLuint shader, GLsizei count,
                                       [CCode (type="const GLchar * const*",
                                               array_length = false)]
                                       GLchar* str[],
                                       [CCode (array_length = false)]
                                       GLint[] length);
    public static void glStencilFunc (GLenum func, GLint refer, GLuint mask);
    public static void glStencilFuncSeparate (GLenum face, GLenum func,
                                              GLint ref, GLuint mask);
    public static void glStencilMask (GLuint mask);
    public static void glStencilMaskSeparate (GLenum face, GLuint mask);
    public static void glStencilOp (GLenum fail, GLenum zfail, GLenum zpass);
    public static void glStencilOpSeparate (GLenum face, GLenum fail,
                                            GLenum zfail, GLenum zpass);
    public static void glTexImage2D (GLenum target, GLint level,
                                     GLint internalformat, GLsizei width,
                                     GLsizei height, GLint border,
                                     GLenum format, GLenum type, GLvoid* data);
    public static void glTexParameterf (GLenum target, GLenum pname,
                                        GLfloat param);
    public static void glTexParameterfv (GLenum target, GLenum pname,
                                         [CCode (array_length = false)]
                                         GLfloat[] params);
    public static void glTexParameteri (GLenum target, GLenum pname,
                                        GLint param);
    public static void glTexParameteriv (GLenum target, GLenum pname,
                                         [CCode (array_length = false)]
                                         GLint[] params);
    public static void glTexSubImage2D (GLenum target, GLint level,
                                        GLint xoffset, GLint yoffset,
                                        GLsizei width, GLsizei height,
                                        GLenum format, GLenum type,
                                        GLvoid* data);
    public static void glUniform1f (GLint location, GLfloat x);
    public static void glUniform1fv (GLint location, GLsizei count,
                                     GLfloat* v);
    public static void glUniform1i (GLint location, GLint x);
    public static void glUniform1iv (GLint location, GLsizei count, GLint* v);
    public static void glUniform2f (GLint location, GLfloat x, GLfloat y);
    public static void glUniform2fv (GLint location, GLsizei count, GLfloat* v);
    public static void glUniform2i (GLint location, GLint x, GLint y);
    public static void glUniform2iv (GLint location, GLsizei count, GLint* v);
    public static void glUniform3f (GLint location, GLfloat x, GLfloat y,
                                    GLfloat z);
    public static void glUniform3fv (GLint location, GLsizei count,
                                     GLfloat* v);
    public static void glUniform3i (GLint location, GLint x, GLint y, GLint z);
    public static void glUniform3iv (GLint location, GLsizei count, GLint* v);
    public static void glUniform4f (GLint location, GLfloat x, GLfloat y,
                                    GLfloat z, GLfloat w);
    public static void glUniform4fv (GLint location, GLsizei count, GLfloat* v);
    public static void glUniform4i (GLint location, GLint x, GLint y, GLint z,
                                    GLint w);
    public static void glUniform4iv (GLint location, GLsizei count, GLint* v);
    public static void glUniformMatrix2fv (GLint location, GLsizei count,
                                           GLboolean transpose, GLfloat* v);
    public static void glUniformMatrix3fv (GLint location, GLsizei count,
                                           GLboolean transpose, GLfloat* v);
    public static void glUniformMatrix4fv (GLint location, GLsizei count,
                                           GLboolean transpose, GLfloat* v);
    public static void glUseProgram (GLuint program);
    public static void glValidateProgram (GLuint program);
    public static void glVertexAttrib1f (GLuint indx, GLfloat x);
    public static void glVertexAttrib1fv (GLuint indx, GLfloat* values);
    public static void glVertexAttrib2f (GLuint indx, GLfloat x, GLfloat y);
    public static void glVertexAttrib2fv (GLuint indx, GLfloat* values);
    public static void glVertexAttrib3f (GLuint indx, GLfloat x, GLfloat y,
                                         GLfloat z);
    public static void glVertexAttrib3fv (GLuint indx, GLfloat* values);
    public static void glVertexAttrib4f (GLuint indx, GLfloat x, GLfloat y,
                                         GLfloat z, GLfloat w);
    public static void glVertexAttrib4fv (GLuint indx, GLfloat* values);
    public static void glVertexAttribPointer (GLuint indx, GLint size,
                                              GLenum type, GLboolean normalized,
                                              GLsizei stride, GLvoid* ptr);
    public static void glViewport (GLint x, GLint y, GLsizei width,
                                   GLsizei height);

    /*************************************************************/
    // GL extensions

    // GL_EXT_texture_storage
    // (with GL_OES_texture_float only)

    public const GLenum GL_TEXTURE_IMMUTABLE_FORMAT_EXT;
    public const GLenum GL_ALPHA8_EXT;
    public const GLenum GL_LUMINANCE8_EXT;
    public const GLenum GL_LUMINANCE8_ALPHA8_EXT;
    public const GLenum GL_RGBA32F_EXT;
    public const GLenum GL_RGB32F_EXT;
    public const GLenum GL_ALPHA32F_EXT;
    public const GLenum GL_LUMINANCE32F_EXT;
    public const GLenum GL_LUMINANCE_ALPHA32F_EXT;

    public static void TexStorage1DEXT (GLenum target, GLsizei levels,
                                        GLenum internalformat,
                                        GLsizei width);
    public static void TexStorage2DEXT (GLenum target, GLsizei levels,
                                        GLenum internalformat,
                                        GLsizei width, GLsizei height);
    public static void TexStorage3DEXT (GLenum target, GLsizei levels,
                                        GLenum internalformat,
                                        GLsizei width, GLsizei height,
                                        GLsizei depth);
    public static void TextureStorage1DEXT (GLuint texture, GLenum target,
                                            GLsizei levels,
                                            GLenum internalformat,
                                            GLsizei width);
    public static void TextureStorage2DEXT (GLuint texture, GLenum target,
                                            GLsizei levels,
                                            GLenum internalformat,
                                            GLsizei width, GLsizei height);
    public static void TextureStorage3DEXT (GLuint texture, GLenum target,
                                            GLsizei levels,
                                            GLenum internalformat,
                                            GLsizei width, GLsizei height,
                                            GLsizei depth);

    public delegate void PFNGLTEXSTORAGE1DEXTPROC (GLenum target,
                                                   GLsizei levels,
                                                   GLenum internalformat,
                                                   GLsizei width);
    public delegate void PFNGLTEXSTORAGE2DEXTPROC (GLenum target,
                                                   GLsizei levels,
                                                   GLenum internalformat,
                                                   GLsizei width,
                                                   GLsizei height);
    public delegate void PFNGLTEXSTORAGE3DEXTPROC (GLenum target,
                                                   GLsizei levels,
                                                   GLenum internalformat,
                                                   GLsizei width,
                                                   GLsizei height,
                                                   GLsizei depth);
    public delegate void PFNGLTEXTURESTORAGE1DEXTPROC (GLuint texture,
                                                       GLenum target,
                                                       GLsizei levels,
                                                       GLenum internalformat,
                                                       GLsizei width);
    public delegate void PFNGLTEXTURESTORAGE2DEXTPROC (GLuint texture,
                                                       GLenum target,
                                                       GLsizei levels,
                                                       GLenum internalformat,
                                                       GLsizei width,
                                                       GLsizei height);
    public delegate void PFNGLTEXTURESTORAGE3DEXTPROC (GLuint texture,
                                                       GLenum target,
                                                       GLsizei levels,
                                                       GLenum internalformat,
                                                       GLsizei width,
                                                       GLsizei height,
                                                       GLsizei depth);

}
