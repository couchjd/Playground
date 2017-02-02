uses
	GLib
	GL
	GLib.Math
	Cairo
	
class soy.widgets.Console : soy.widgets.Widget
	io 		: list of string
	canvas	 	: soy.widgets.Canvas
	standard_output : int
	standard_error  : int
	command		: string
	working_directory : string
	child_pid	: int
	output		: IOChannel
	error		: IOChannel

	construct (working_directory : string?, command : string?)
		self.command = command;
		self.working_directory = working_directory;
		io = new list of string
	
	def override add (parent : soy.widgets.Container)
		var spawn_args = command.split(" ");
		var spawn_env = Environ.get ();
		try
			Process.spawn_async_with_pipes (working_directory,
			spawn_args,
			spawn_env,
			SpawnFlags.SEARCH_PATH | SpawnFlags.DO_NOT_REAP_CHILD,
			null,
			out child_pid,
			null,
			out standard_output,
			out standard_error);
			output = new IOChannel.unix_new (standard_output);

			error = new IOChannel.unix_new (standard_error);

			canvas = new soy.widgets.Canvas(null);
		except e:GLib.SpawnError
			print "%s\n", e.message

	def override remove ()
		return

	def override render (x : int, y : int, width : int, height : int)
		length : size_t
		text : string
		output.read_line(out text, out length, null);
		io.add(text);
		renderText(x, y, width, height);

	def override resize (x : int, y : int, width : int, height : int)
		canvas.resize(x, y, width, height);

	def renderText (x : int, y : int, width : int, height : int)
		var surface = new Cairo.ImageSurface (Cairo.Format.ARGB32, width, height);
		var context = new Cairo.Context (surface);
		context.set_source_rgb (1, 1, 1); 
		context.select_font_face ("Courier", Cairo.FontSlant.NORMAL, Cairo.FontWeight.BOLD);
		context.set_font_size (14);
		context.move_to (0, 0);
		for s in io
			xd : double;
			yd : double;
			context.get_current_point(out xd, out yd);
			context.rel_move_to(-xd,14);
			context.show_text(s);
		var texture = new soy.textures.Texture()
		texture.copySurface(surface);
		canvas.texture = texture;
		canvas.render(x, y, width, height);

