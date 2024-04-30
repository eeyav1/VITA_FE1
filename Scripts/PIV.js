var RandomAccessFile = Java.type('java.io.RandomAccessFile');	// File reading from random parts
var File = Java.type('java.io.File');	// Manipulate file objects
var Paths = Java.type("java.nio.file.Paths");	// Manipulate path objects
var FileSystems = Java.type("java.nio.file.FileSystems");	// Access host file system
var StandardWatchEK = Java.type("java.nio.file.StandardWatchEventKinds");	// Event kinds
var Runnable = Java.type("java.lang.Runnable");		// Create tasks for threads
var Thread = Java.type("java.lang.Thread");		// Threading
var Executors = Java.type("java.util.concurrent.Executors");	// Dynamic modification of runnable
var TimeUnit = Java.type("java.util.concurrent.TimeUnit");	// Executor delay

/* Variables for CSV reading */
var lastKnownPosition = 0;
var lastModificationTime = 0;
var isFirstRead = true;

/* PROCESSED VARIABLES */
/* 5 V_line */
var P_5PV = pvArray[0];		// Power from 5V_line
var I_5PV = pvArray[1];		// Current from 5V_line
var V_5PV = pvArray[2];		// Voltage from 5V_line
var T_5PV = pvArray[3];		// Time from 5V_line
/* 12 V_line */
var P_12PV = pvArray[4];	// Power from 12V_line
var I_12PV = pvArray[5];	// Current from 12V_line
var V_12PV = pvArray[6];	// Voltage from 12V_line
var T_12PV = pvArray[7];	// Time from 12V_line



/* Shutdown executor when no longer in use */
function ShutdownExecutor(executor) {
	executor.shutdown();
	try{
		if (!executor.awaitTermination(400, TimeUnit.MILLISECONDS)){
			executor.shutdownNow();
		}
	} catch(e){
		executor.shutdownNow();
	}
}



/* Display on GUI */
function UpdatePV(columns) {
	var columnsToExtract = [0, 2, 3, 4, 5];		// Time, V_line, P, I, V
	/* Convert time axis into unix and extract HH:mm:ss */
	var dateTimeString = columns[columnsToExtract[0]].replace(' (UTC)', '');
	var unixMilli = Date.parse(dateTimeString);
	
	/* Check if the row is 5V_line or 12V_line*/
	if (columns[columnsToExtract[1]] == 5) {
		/* 5 V_line */
		
		P_5PV.setValue(columns[columnsToExtract[2]]);	// Update power 
		I_5PV.setValue(columns[columnsToExtract[3]]);	// Update current 
		V_5PV.setValue(columns[columnsToExtract[4]]);	// Update voltage 
		T_5PV.setValue(dateTimeString);		// Update time 
		
		
		//ConsoleUtil.writeInfo('\n Power 5V_line: ' + columns[columnsToExtract[2]]);
		//ConsoleUtil.writeInfo('\n Current 5V_line: ' + columns[columnsToExtract[3]]);
		//ConsoleUtil.writeInfo('\n Voltage 5V_line: ' + columns[columnsToExtract[4]]);
		//ConsoleUtil.writeInfo('\n Time 5V_line: ' + dateTimeString);
		
	} else if (columns[columnsToExtract[1]] == 12) {
		/* 5 V_line */
		
		P_12PV.setValue(columns[columnsToExtract[2]]);	// Update power 
		I_12PV.setValue(columns[columnsToExtract[3]]);	// Update current 
		V_12PV.setValue(columns[columnsToExtract[4]]);	// Update voltage
		T_12PV.setValue(dateTimeString);	// Update time 
			
		//ConsoleUtil.writeInfo('\n Power 12V_line: ' + columns[columnsToExtract[2]]);
		//ConsoleUtil.writeInfo('\n Current 12V_line: ' + columns[columnsToExtract[3]]);
		//ConsoleUtil.writeInfo('\n Voltage 12V_line: ' + columns[columnsToExtract[4]]);
		//ConsoleUtil.writeInfo('\n Time 12V_line: ' + dateTimeString);
	}
}



/* Process rows into columns. Set executor for delay */
function ProcessRows(rows, index, executor) { 
	/* Check if index is the correct value */
	if (index >= rows.length) {
		/* No more rows to process */
		ConsoleUtil.writeInfo('\n Processing complete ');
		ShutdownExecutor(executor);		// Terminate executor
		return;
	}
	
	/* Check if first time reading CSV file to skip headers */
	if (isFirstRead) {
		isFirstRead = false;	// Update test variable
		index++;		// Go to next row, skipping the headers
		var row = rows[index];	// Get row
	} else {
		var row = rows[index];	// Get row
	}
	var columns = row.split(',');	// Split row into columns
	
	/* Check that the row is not empty */
	if (columns.length > 2)
		UpdatePV(columns);		// Display data on GUI
		
	/* Set up executor to process next row by increasing index */
	/*    as a runnable. 10 ms delay						   */
	executor.schedule(new JavaAdapter(Runnable, {
		run: function() {
		ProcessRows(rows, ++index, executor);
	}
	}), 10, TimeUnit.MILLISECONDS);
}



/* Read the data from the csv file */
function ReadNewData(file) {
	var RAF = new RandomAccessFile(file, 'r');		// Set to read
	RAF.seek(lastKnownPosition);		// Go to the last known point
	
	/* Variables to read data */
	var line;			
	var newData = '';
	
	/* While we haven't reached an empty (last) line */
	while((line = RAF.readLine()) !== null){
		newData += new java.lang.String(line.getBytes("ISO-8859-1"), "UTF-8") + '\n';		// Convert to string and add newline character
	}
	lastKnownPosition = RAF.getFilePointer();		// Update to the end of the file
	RAF.close();		// Close pointer
	
	/* If there is some data read in*/
	if (newData.trim().length > 0) {
		var rows = newData.split('\n');		// Divide into rows
		var executor = Executors.newScheduledThreadPool(1);	// Initialise executor 
		
		ProcessRows(rows, 0, executor);		// Process newly extracted rows 
	}
}



/* Check if the modifications is an append on the file */
function CheckForUpdates(filePath) {
	var file = new File(filePath);		// File opening
	var currentModified = file.lastModified();		// Get last modification time 
	
	/* Compare with known previous modification time */
	if (currentModified > lastModificationTime) {
		lastModificationTime = currentModified;		// Update last known modification time 
		ReadNewData(file);		// Call function to read the data in 
	}
}



/* Main function to monitor folder */
function StartMonitoring(){
	var filePath = 'C:\\Users\\gusvi\\yamcs-studio\\VITA_FE1\\Scripts\\RandomDataGeneration\\RandomPIV.csv'; // File to be watched
	var watchService = FileSystems.getDefault().newWatchService();	// Create watch service 
	var path = Paths.get(filePath);			// File path object
	var directory = path.getParent();		// Get directory where the CSV file is located
	directory.register(watchService, StandardWatchEK.ENTRY_MODIFY);		// Register watch service to this directory
	
	/* Task to be executed in thread as runnable */
	var task = new Runnable({
		run: function() {
			var valid = true;	// For validity of key 
			
			while(valid){
				try{
					var key = watchService.take(); 	// Wait for an event 
					var events = key.pollEvents().toArray();	// Extract events as array 
					
					/* Iterate through array */
					for (var i = 0; i < events.length; i++) {
						var event = events[i];		// Extract an event 
						var kind = event.kind();	// Get event kind 
						
						/* Check if event kind is a file been modified */
						if (StandardWatchEK.ENTRY_MODIFY.equals(kind)) {
							var eventContext = event.context().toString();	// Get path of modified file 
							
							/* Check if file modified is the specific CSV file been watched */
							if (eventContext.equals(path.getFileName().toString()))
								CheckForUpdates(filePath);	// Check if modifications is an append on the file
						}
					}
					valid = key.reset();		// Reset key to resume watching 
				} catch (e) {
					ConsoleUtil.writeInfo("PIV ERROR. " + e.toString());
				}
			}
		}
	});
	var thread = new Thread(task);	// Initialise thread with runnable 
	thread.start();		// Start thread
}
			

StartMonitoring();	// Start Monitoring 