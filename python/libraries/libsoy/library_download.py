#!/usr/bin/python3

# libsoy - soy.atoms.Area
# Copyright (C) 2006-2014 Copyleft Games Group
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program; if not, see http://www.gnu.org/licenses

import urllib.request
from urllib.error import *
from subprocess import call
import sys
import os.path
from datetime import datetime

def do_download(url, download_path, untar_path):
    with open(download_path, "b+w") as f:
        f.write(lib.read())

    command = "tar -C %s -xJf %s" % (untar_path, download_path)

    call(command, shell=True)


if len(sys.argv) != 4:
    print("usage: library_download url download_folder untar_path")
    sys.exit(1)

url = sys.argv[1]
download_folder = sys.argv[2]
untar_path = sys.argv[3]

download_path = os.path.join(download_folder, "glib-2.0.tar.xz")

try:
    lib = urllib.request.urlopen(url)
except URLError as e:
    print("Could not download static libraries: " + e.reason)
    sys.exit(0)


if os.path.isfile(download_path):
    time_modified = datetime.strptime(
                                    lib.headers['last-modified'],
                                    "%a, %d %b %Y %H:%M:%S GMT")
    file_modified = datetime.utcfromtimestamp(os.path.getmtime(download_path))

    if file_modified < time_modified:
        do_download(url, download_path, untar_path)
else:
    do_download(url, download_path, untar_path)
