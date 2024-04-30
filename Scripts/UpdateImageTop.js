var File = Java.type('java.io.File');	// Manipulate file objects
var Paths = Java.type("java.nio.file.Paths");	// Manipulate path objects
var FileSystems = Java.type("java.nio.file.FileSystems");	// Access host file system
var StandardWatchEK = Java.type("java.nio.file.StandardWatchEventKinds");	// Event kinds
var Runnable = Java.type("java.lang.Runnable");		// Create tasks for threads
var Thread = Java.type("java.lang.Thread");		// Threading



/* Display image on GUI*/
function UpdateImageWidget(imagePath){
	/* Set up asyncExec to update Image widget as runnable */
	Display.getDefault().asyncExec(new Runnable({
		run: function() {
			widgetController.setPropertyValue("image_file", imagePath);	// Display image
		}
	}));
	
	return;
}



/* Check if file created in directory is an image */
function IsValidFile(fileName){
	
	return fileName.toLowerCase().endsWith('.png') ||
		   fileName.toLowerCase().endsWith('.jpg') ||
		   fileName.toLowerCase().endsWith('.jpeg');
}



/* Main function to monitor folder */
function StartMonitoring(){
	var folderPath = "C:\\Users\\gusvi\\yamcs-studio\\VITA_FE1\\Images";	// Folder to be watched
	var watchService = FileSystems.getDefault().newWatchService();		// Create watch service 
	var path = Paths.get(folderPath);		// File path object 
	path.register(watchService, StandardWatchEK.ENTRY_CREATE);		// Register watch service to this directory 
	
	/* Task to be executed in thread as runnable */
	var task = new Runnable({
		run: function() {
			var valid = true;	// For validity of key 
			
			while (valid) {
				try {
					var key = watchService.take();		// Wait for an event 
					var events = key.pollEvents().toArray();		// Extract events as array 
					
					/* Iterate through array */
					for (var i = 0; i < events.length; i++) {
						var event = events[i];		// Extract an event
						var kind = event.kind();	// Get event kind 
						
						/* Check if event kind is a file been modified */
						if (StandardWatchEK.ENTRY_CREATE.equals(kind)) {
							var eventContext = event.context().toString();		// Get path of modified file 
							var imagePath = path.resolve(eventContext).toString();		// Full path
							
							/* Check if file an image */
							if(IsValidFile(imagePath)){
								UpdateImageWidget(imagePath);	// Update widget 
							}
						}
					}
					valid = key.reset();		// Reset key to resume watching
					Thread.sleep(30000);
				} catch (e){
					ConsoleUtil.writeInfo("Image ERROR. " + e.toString());
				}
			}
		}
	});
	var thread = new Thread(task);	// Initialise thread with runnable 
	thread.start();		// Start thread
}


StartMonitoring();		// Start Monitoring 