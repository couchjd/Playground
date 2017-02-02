#c:\Python33\python.exe setup.py build

from cx_Freeze import setup, Executable
setup(
    name = "Text Adventure",
    version = "1.0",
    description = "Text Adventure Test",
    executables = [Executable("main.py")],
    )
