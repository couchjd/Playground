#!/usr/bin/env python
# encoding: utf-8

import os.path
from waflib import Task, Node
from waflib.TaskGen import extension

class glsl(Task.Task):
    """
    Task to compile glsl files.
    """

    def run(self):
        for index in range(len(self.inputs)):
            srcPath = self.inputs[index].abspath()
            bldPath = self.outputs[index].abspath()

            # create output dirs if non-existant
            dirs = os.path.split(bldPath)[0]
            if not os.path.exists(dirs):
                os.makedirs(dirs)

            inFile = open(srcPath, 'r')
            outFile = open(bldPath, 'w')

            # deduce variable name from directory and file name
            directory = os.path.dirname(bldPath).split(os.sep)[-1]
            filename = os.path.basename(bldPath).lower().replace('.', '_')[:-2]
            variableName = 'soy_' + directory + '_' + filename

            # start writing the string
            outFile.write('char* ' + variableName + ' = "')
            for line in inFile:
                line = line.strip() + "\n"
                line = str(line.encode("unicode_escape"),encoding="utf8")
                outFile.write(line)

            # close the string
            outFile.write('";')

            inFile.close()
            outFile.close()

        return 0

@extension('.glslv', '.glslf')
def glsl_file(self, node):
    """
    Compile a glsl file and bind the task to *self.glsltask*. If an existing glsl task is already set, add the node
    to its inputs.

    :param node: glsl file
    :type node: :py:class:`waflib.Node.Node`
    """

    # Do we need only one glsl task? Having multiple will speed up re-builds
    """
    glsltask = getattr(self, "glsltask", None)

    if not glsltask:
        glsltask = self.create_task('glsl')
        self.glsltask = glsltask # this assumes one glsl task by task generator
        glsltask.name = self.name
        glsltask.target = self.target
    """
    glsltask = self.create_task('glsl')
    glsltask.name = self.name
    glsltask.target = self.target

    # change output extension
    extension = os.path.splitext(os.path.basename(node.abspath()))[1];
    c_node = node.change_ext(extension + '.c')

    # append nodes to task
    glsltask.inputs.append(node)
    glsltask.outputs.append(c_node)

    # append the output node to sources in order for waf to pick it up
    self.source.append(c_node)
