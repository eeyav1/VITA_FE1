var Paths = Java.type("java.nio.file.Paths");
var FileSystems = Java.type("java.nio.file.FileSystems");
var StandardWatchEK = Java.type("java.nio.file.StandardWatchEventKinds");
var UIBundlingThread = Java.type("org.csstudio.ui.util.thread.UIBundlingThread");
var Display = Java.type("org.eclipse.swt.widgets.Display");
var Runnable = Java.type("java.lang.Runnable");
var Thread = Java.type("java.lang.Thread");



function UpdateImageWidget(imagePath){
	Display.getDefault().asyncExec(new Runnable({
		run: function() {
			widgetController.setPropertyValue("image_file", imagePath);
			widgetController.setPropertyValue("stretch_to_fit", true);
		}
	}));
	
	//ConsoleUtil.writeInfo("Update image widget function");
	
	return;
}

function IsValidFile(fileName){
	//ConsoleUtil.writeInfo("Is valid file function");
	
	return fileName.toLowerCase().endsWith('.png') ||
		   fileName.toLowerCase().endsWith('.jpg') ||
		   fileName.toLowerCase().endsWith('.jpeg');
}

function StartMonitoring(pathToWatch){
	//ConsoleUtil.writeInfo("Before running the task function 1");
	var watchService = FileSystems.getDefault().newWatchService();
	var path = Paths.get(pathToWatch);
	path.register(watchService, StandardWatchEK.ENTRY_CREATE);
	
	var task = new Runnable({
		run: function() {
			var valid = true;
			while (valid) {
				try {
					//ConsoleUtil.writeInfo("Try loop");
					var key = watchService.take();
					var events = key.pollEvents().toArray();
					for (var i = 0; i < events.length; i++) {
						var event = events[i];
						var kind = event.kind();
						if (StandardWatchEK.ENTRY_CREATE.equals(kind)) {
							var eventContext = event.context().toString();
							var imagePath = path.resolve(eventContext).toString();
							//ConsoleUtil.writeInfo("New file created");
							if(IsValidFile(imagePath)){
								//ConsoleUtil.writeInfo("Is valid file return: " + IsValidFile(imagePath).toString());
								UpdateImageWidget(imagePath);
							}
						}
					}
					valid = key.reset();
					Thread.sleep(30000);
				} catch (e){
					ConsoleUtil.writeInfo("Image ERROR. " + e.toString());
				}
			}
		}
	});
	
	var thread = new Thread(task);
	thread.start();
}

var folderPath = "C:\\Users\\gusvi\\yamcs-studio\\Test\\Images";
StartMonitoring(folderPath);