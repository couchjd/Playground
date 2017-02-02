/* Button.c generated by valac 0.22.1, the Vala compiler
 * generated from Button.gs, do not modify */

/*
 *  libsoy - soy.events.Button
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

#include <glib.h>
#include <glib-object.h>
#include <float.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>


#define SOY_EVENTS_TYPE_BUTTON (soy_events_button_get_type ())

#define SOY_TYPE_EVENT_TYPE (soy_event_type_get_type ())

#define SOY_WIDGETS_TYPE_WIDGET (soy_widgets_widget_get_type ())
#define SOY_WIDGETS_WIDGET(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_WIDGETS_TYPE_WIDGET, soywidgetsWidget))
#define SOY_WIDGETS_WIDGET_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_WIDGETS_TYPE_WIDGET, soywidgetsWidgetClass))
#define SOY_WIDGETS_IS_WIDGET(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_WIDGETS_TYPE_WIDGET))
#define SOY_WIDGETS_IS_WIDGET_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_WIDGETS_TYPE_WIDGET))
#define SOY_WIDGETS_WIDGET_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_WIDGETS_TYPE_WIDGET, soywidgetsWidgetClass))

typedef struct _soywidgetsWidget soywidgetsWidget;
typedef struct _soywidgetsWidgetClass soywidgetsWidgetClass;

#define SOY_WIDGETS_TYPE_CONTAINER (soy_widgets_container_get_type ())
#define SOY_WIDGETS_CONTAINER(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_WIDGETS_TYPE_CONTAINER, soywidgetsContainer))
#define SOY_WIDGETS_CONTAINER_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_WIDGETS_TYPE_CONTAINER, soywidgetsContainerClass))
#define SOY_WIDGETS_IS_CONTAINER(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_WIDGETS_TYPE_CONTAINER))
#define SOY_WIDGETS_IS_CONTAINER_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_WIDGETS_TYPE_CONTAINER))
#define SOY_WIDGETS_CONTAINER_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_WIDGETS_TYPE_CONTAINER, soywidgetsContainerClass))

typedef struct _soywidgetsContainer soywidgetsContainer;
typedef struct _soywidgetsContainerClass soywidgetsContainerClass;

#define SOY_WIDGETS_TYPE_WINDOW (soy_widgets_window_get_type ())
#define SOY_WIDGETS_WINDOW(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_WIDGETS_TYPE_WINDOW, soywidgetsWindow))
#define SOY_WIDGETS_WINDOW_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_WIDGETS_TYPE_WINDOW, soywidgetsWindowClass))
#define SOY_WIDGETS_IS_WINDOW(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_WIDGETS_TYPE_WINDOW))
#define SOY_WIDGETS_IS_WINDOW_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_WIDGETS_TYPE_WINDOW))
#define SOY_WIDGETS_WINDOW_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_WIDGETS_TYPE_WINDOW, soywidgetsWindowClass))

typedef struct _soywidgetsWindow soywidgetsWindow;
typedef struct _soywidgetsWindowClass soywidgetsWindowClass;
typedef struct _soyeventsButton soyeventsButton;
#define _g_object_unref0(var) ((var == NULL) ? NULL : (var = (g_object_unref (var), NULL)))
#define _g_free0(var) (var = (g_free (var), NULL))

typedef enum  {
	SOY_EVENT_TYPE_KeyPress,
	SOY_EVENT_TYPE_KeyDown,
	SOY_EVENT_TYPE_KeyRelease,
	SOY_EVENT_TYPE_Motion,
	SOY_EVENT_TYPE_ButtonPress,
	SOY_EVENT_TYPE_ButtonRelease,
	SOY_EVENT_TYPE_Scroll,
	SOY_EVENT_TYPE_WiimoteButtonPress
} soyEventType;

struct _soyeventsButton {
	soyEventType type;
	soywidgetsWindow* window;
	guint32 time;
	gfloat x;
	gfloat y;
	gfloat x_root;
	gfloat y_root;
	guint button;
	gchar* wiibutton;
};



GType soy_events_button_get_type (void) G_GNUC_CONST;
GType soy_event_type_get_type (void) G_GNUC_CONST;
GType soy_widgets_widget_get_type (void) G_GNUC_CONST;
GType soy_widgets_container_get_type (void) G_GNUC_CONST;
GType soy_widgets_window_get_type (void) G_GNUC_CONST;
soyeventsButton* soy_events_button_dup (const soyeventsButton* self);
void soy_events_button_free (soyeventsButton* self);
void soy_events_button_copy (const soyeventsButton* self, soyeventsButton* dest);
void soy_events_button_destroy (soyeventsButton* self);


static gpointer _g_object_ref0 (gpointer self) {
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	return self ? g_object_ref (self) : NULL;
#line 108 "Button.c"
}


void soy_events_button_copy (const soyeventsButton* self, soyeventsButton* dest) {
	soyEventType _tmp0_ = 0;
	soywidgetsWindow* _tmp1_ = NULL;
	soywidgetsWindow* _tmp2_ = NULL;
	guint32 _tmp3_ = 0U;
	gfloat _tmp4_ = 0.0F;
	gfloat _tmp5_ = 0.0F;
	gfloat _tmp6_ = 0.0F;
	gfloat _tmp7_ = 0.0F;
	guint _tmp8_ = 0U;
	const gchar* _tmp9_ = NULL;
	gchar* _tmp10_ = NULL;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp0_ = (*self).type;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	(*dest).type = _tmp0_;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp1_ = (*self).window;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp2_ = _g_object_ref0 (_tmp1_);
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_g_object_unref0 ((*dest).window);
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	(*dest).window = _tmp2_;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp3_ = (*self).time;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	(*dest).time = _tmp3_;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp4_ = (*self).x;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	(*dest).x = _tmp4_;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp5_ = (*self).y;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	(*dest).y = _tmp5_;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp6_ = (*self).x_root;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	(*dest).x_root = _tmp6_;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp7_ = (*self).y_root;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	(*dest).y_root = _tmp7_;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp8_ = (*self).button;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	(*dest).button = _tmp8_;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp9_ = (*self).wiibutton;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_tmp10_ = g_strdup (_tmp9_);
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_g_free0 ((*dest).wiibutton);
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	(*dest).wiibutton = _tmp10_;
#line 168 "Button.c"
}


void soy_events_button_destroy (soyeventsButton* self) {
#line 26 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_g_object_unref0 ((*self).window);
#line 43 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	_g_free0 ((*self).wiibutton);
#line 177 "Button.c"
}


soyeventsButton* soy_events_button_dup (const soyeventsButton* self) {
	soyeventsButton* dup;
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	dup = g_new0 (soyeventsButton, 1);
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	soy_events_button_copy (self, dup);
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	return dup;
#line 189 "Button.c"
}


void soy_events_button_free (soyeventsButton* self) {
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	soy_events_button_destroy (self);
#line 22 "/home/jeff/Documents/libraries/libsoy/src/events/Button.gs"
	g_free (self);
#line 198 "Button.c"
}


GType soy_events_button_get_type (void) {
	static volatile gsize soy_events_button_type_id__volatile = 0;
	if (g_once_init_enter (&soy_events_button_type_id__volatile)) {
		GType soy_events_button_type_id;
		soy_events_button_type_id = g_boxed_type_register_static ("soyeventsButton", (GBoxedCopyFunc) soy_events_button_dup, (GBoxedFreeFunc) soy_events_button_free);
		g_once_init_leave (&soy_events_button_type_id__volatile, soy_events_button_type_id);
	}
	return soy_events_button_type_id__volatile;
}


