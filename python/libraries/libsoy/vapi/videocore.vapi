/*
 *  libsoy - Vala API for VideoCore
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


[CCode (lower_case_cprefix="", cheader_filename="bcm_host.h")]
namespace VideoCore {
    /////////////////////////////////////////////////////////////////////////
    // bcm_host.h

    public static void bcm_host_init ( );
    public static void bcm_host_deinit ( );
    public static int32 graphics_get_display_size ( int display_number,
                                                    out int width,
                                                    out int height  );


    /////////////////////////////////////////////////////////////////////////
    // interface/vctypes/vc_image_types.h

    [CCode (cname="VC_RECT_T")]
    public struct Rect {
        int x;
        int y;
        int width;
        int height;
    }

    // VC_IMAGE_T is opaque

    [CCode (cname="VC_IMAGE_TYPE_T", cprefix="VC_IMAGE_")]
    public enum ImageType {
        MIN = 0,
        RGB565,
        1BPP,
        YUV420,
        48BPP,
        RGB888,
        8BPP,
        4BPP,
        3D32,
        3D32B,
        3D32MAT,
        RGB2X9,
        RGB666,
        PAL4_OBSOLETE,
        PAL8_OBSOLETE,
        RGBA32,
        YUV422,
        RGBA565,
        RGBA16,
        YUV_UV,
        TF_RGBA32,
        TF_RGBX32,
        TF_FLOAT,
        TF_RGBA16,
        TF_RGBA5551,
        TF_RGB565,
        TF_YA88,
        TF_BYTE,
        TF_PAL8,
        TF_PAL4,
        TF_ETC1,
        BGR888,
        BGR888_NP,
        BAYER,
        CODEC,
        YUV_UV32,
        TF_Y8,
        TF_A8,
        TF_SHORT,
        TF_1BPP,
        OPENGL,
        YUV444I,
        YUV422PLANAR,
        ARGB8888,
        XRGB8888,
        YUV422YUYV,
        YUV422YVYU,
        YUV422UYVY,
        YUV422VYUY,
        RGBX32,
        RGBX8888,
        BGRX8888,
        YUV420SP,
        YUV444PLANAR,
        MAX,
        FORCE_ENUM_16BIT
    }

    [CCode (cname="VC_IMAGE_TRANSFORM_T", cprefix="VC_IMAGE_")]
    public enum ImageTransform {
        ROT0 = 0,
        MIRROR_ROT0,
        MIRROR_ROT180,
        ROT180,
        MIRROR_ROT90,
        ROT270,
        ROT90,
        MIRROR_ROT270
    }

    // VC_IMAGE_BAYER_ORDER_T not used
    // VC_IMAGE_BAYER_FORMAT_T not used


    /////////////////////////////////////////////////////////////////////////
    // interface/vmcs_host/vc_dispmanx*

    [CCode (cprefix="DISPMANX_", lower_case_cprefix="vc_dispmanx_")]
    namespace DisplayManager {

        [CCode (cprefix="DISPMANX_ID_")]
        namespace ID {
            public const int MAIN_LCD;
            public const int AUX_LCD;
            public const int HDMI;
            public const int SDTV;
        }

        [CCode (cname="DISPMANX_TRANSFORM_T", cprefix="DISPMANX_")]
        public enum Transform {
            NO_ROTATE = 0,
            ROTATE_90,
            ROTATE_180,
            ROTATE_270,
            FLIP_HRIZ,
            FLIP_VERT
        }

        [SimpleType]
        [CCode (cname="DISPMANX_DISPLAY_HANDLE_T",
                cprefix="VC_DISPMANX_DISPLAY_",
                lower_case_cprefix="vc_dispmanx_display_",
                destroy_function="vc_dispmanx_display_close")]
        public struct Display : int {
            [CCode (cname="vc_dispmanx_display_open")]
            public Display (int device);
            [CCode (cname="vc_dispmanx_display_open_mode")]
            public Display.Mode (int device, int mode);
            //[CCode (cname="vc_dispmanx_display_open_offscreen")]
            //public Display.OffScreen (DISPMANX_RESOURCE_HANDLE_T dest,
            //                          VC_IMAGE_TRANSFORM_T orientation)
            public bool reconfigure (int mode);
            //public bool set_destination (DISPMANX_RESOURCE_HANDLE_T dest);
            //public bool get_info(out DISPMANX_MODEINFO_T pinfo );
        }

        [IntegerType]
        [CCode (cname="DISPMANX_UPDATE_HANDLE_T",
                lower_case_cprefix= "vc_dispmanx_update_")]
        public struct Update {
            [CCode (cname="vc_dispmanx_update_start")]
            public Update (int32 priority);
            [CCode (cname="vc_dispmanx_display_set_background")]
            public bool set_background (Display display,
                                        uint8 red, uint8 green, uint8 blue);
            public void submit_sync ( );
        }

        [IntegerType]
        [CCode (cname="DISPMANX_ELEMENT_HANDLE_T",
                lower_case_cprefix="vc_dispmanx_element_",
                delegate_target_pos=1.1)]
        public struct Element {
            [CCode (cname="vc_dispmanx_element_add")]
            public Element (Update update, Display display, int layer,
                            ref Rect dest_rect, int src, ref Rect src_rect,
                            int protection, void* alpha, void* clamp,
                            Transform transform);
            public int change_source (Update update, int src);
            public int change_layer (Update update, int layer);
            public int element_modified (Update update, ref Rect rect);
            public int remove (Update update);
        }

        [SimpleType]
        [CCode (cname="EGL_DISPMANX_WINDOW_T",
                cheader_filename="EGL/eglplatform.h")]
        public struct EGLWindow {
            Element element;
            int width;
            int height;
        }
    }
}
