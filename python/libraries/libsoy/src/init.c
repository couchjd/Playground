/*
 *  libsoy - soy._init
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
#include <gmodule.h>
#include <stdlib.h>
#include <string.h>
#include <gee.h>
#include "src/soy-1/soy.h"

static gboolean
load_soy_module (gchar* name) {
    gchar* filename;
    GModule* module;
    gpointer symbol;

    if (name) {
        filename = g_module_build_path(NULL, name);
        module = g_module_open(filename, 0);
        g_free(filename);
    }
    else
        module = g_module_open(NULL, 0);

    if (module) {
        if (g_module_symbol(module, "soy_client_new", &symbol))
            return TRUE;
    }
    else
        g_print("%s\n", g_module_error());

    return FALSE;
}

void soy_init (void) {
#if !defined(GLIB_VERSION_2_36)
    g_type_init();
#endif

    // Initialize soy_loadable hashmap
    soy_loadable = gee_hash_map_new (G_TYPE_STRING, (GBoxedCopyFunc) g_strdup,
                                     g_free, G_TYPE_POINTER, NULL, NULL, NULL,
                                     NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

    // soy.atoms.Color
    gee_abstract_map_set ((GeeAbstractMap*) soy_loadable,
                          "soy.atoms.Color",
                          soy_atoms_color_new_load);

    // Check whether soy.Client is already loaded
    if (load_soy_module(NULL)) {
        // soy.Client already loaded by frontend, nothing more to do
        return;
    }

    const gchar* gtksoy_sid = g_getenv("GTKSOY_SID");
    if (gtksoy_sid) {
        if (load_soy_module("soy-gtk")) {
            // GTK Client module loaded
            return;
        }
        
        // Error while loading GtkSoy plugin
        g_print("Error while loading GtkSoy plugin. "
                "Did you build libsoy with --platform=gtk option?\n");
    }

    if (load_soy_module("soy-x11")) {
        // X11 Client module loaded
        return;
    }

    if (load_soy_module("soy-videocore")) {
        // VideoCore Client module loaded
        return;
    }

    g_print("soy.Client not loaded\n");
}

