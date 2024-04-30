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
/* Temperature */
var T_X0PV = pvArray[0];	// Time axis trace 0
var T_Y0PV = pvArray[1];	// Temperature axis trace 0
var T_X1PV = pvArray[2];	// Time axis trace 1
var T_Y1PV = pvArray[3];	// Temperature axis trace 1
/* Pressure */
var P_X0PV = pvArray[4];	// Time axis trace 0
var P_Y0PV = pvArray[5];	// Pressure axis trace 0
var P_X1PV = pvArray[6];	// Time axis trace 1
var P_Y1PV = pvArray[7];	// Pressure axis trace 1
/* Humidity */
var H_X0PV = pvArray[8];	// Time axis trace 0
var H_Y0PV = pvArray[9];	// Humidity axis trace 0
var H_X1PV = pvArray[10];	// Time axis trace 1
var H_Y1PV = pvArray[11];	// Humidity axis trace 1
/* Gas */
var G_X0PV = pvArray[12];	// Time axis trace 0
var G_Y0PV = pvArray[13];	// Gas axis trace 0
var G_X1PV = pvArray[14];	// Time axis trace 1
var G_Y1PV = pvArray[15];	// Gas axis trace 1



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
	var columnsToExtract = [0, 2, 3, 4, 5, 6];		// Time, Sensor, Temperature, Humidity, Pressure, Gas
	/* Convert time axis into unix and extract HH:mm:ss */
	var dateTimeString = columns[columnsToExtract[0]].replace(' (UTC)', '');
	var unixMilli = Date.parse(dateTimeString);
	
	/* Check if the row is for sensor 1 or sensor 2 */
	if (columns[columnsToExtract[1]] == 1) {
		/* Sensor 1. Trace 0 */
		
		/* Temperature plot */
		/* Declare arrays */
		var T_X0 = DataUtil.createDoubleArray(1);
		var T_Y0 = DataUtil.createDoubleArray(1);
		/* Assign values */
		T_X0[0] = unixMilli;						
		T_Y0[0] = columns[columnsToExtract[2]];		
		/* Update PVs */
		T_X0PV.setValue(T_X0);	
		T_Y0PV.setValue(T_Y0);
		
		/* Pressure plot */
		/* Declare arrays */
		var P_X0 = DataUtil.createDoubleArray(1);		
		var P_Y0 = DataUtil.createDoubleArray(1);
		/* Assign values */		
		P_X0[0] = unixMilli;						
		P_Y0[0] = columns[columnsToExtract[3]];
		/* Update PVs */
		P_X0PV.setValue(P_X0);	
		P_Y0PV.setValue(P_Y0);	
			
		/* Humidity plot */
		/* Declare arrays */
		var H_X0 = DataUtil.createDoubleArray(1);		
		var H_Y0 = DataUtil.createDoubleArray(1);	
		/* Assign values */			
		H_X0[0] = unixMilli;						
		H_Y0[0] = columns[columnsToExtract[4]];
		/* Update PVs */
		H_X0PV.setValue(H_X0);
		H_Y0PV.setValue(H_Y0);
		
		/* Gas plot */
		/* Declare arrays */
		var G_X0 = DataUtil.createDoubleArray(1);		
		var G_Y0 = DataUtil.createDoubleArray(1);
		/* Assign values */			
		G_X0[0] = unixMilli;						
		G_Y0[0] = columns[columnsToExtract[5]];	
		/* Update PVs */		
		G_X0PV.setValue(G_X0);	
		G_Y0PV.setValue(G_Y0);	
			
		/* Display some values on the console */
		//ConsoleUtil.writeInfo('\n timeAxis0[0]: ' + timeAxis0[0]);
		//ConsoleUtil.writeInfo('\n tempAxis0[0] ' + tempAxis0[0]);			
			
	} else if (columns[columnsToExtract[1]] == 2) {
		/* Sensor 2. Trace 1 */
		
		/* Temperature plot */
		/* Declare arrays */
		var T_X1 = DataUtil.createDoubleArray(1);	
		var T_Y1 = DataUtil.createDoubleArray(1);	
		/* Assign values */
		T_X1[0] = unixMilli;						
		T_Y1[0] = columns[columnsToExtract[2]];	
		/* Update PVs */
		T_X1PV.setValue(T_X1);
		T_Y1PV.setValue(T_Y1);	
		
		/* Pressure plot */
		/* Declare arrays */
		var P_X1 = DataUtil.createDoubleArray(1);
		var P_Y1 = DataUtil.createDoubleArray(1);	
		/* Assign values */
		P_X1[0] = unixMilli;						
		P_Y1[0] = columns[columnsToExtract[3]];	
		/* Update PVs */
		P_X1PV.setValue(P_X1);	
		P_Y1PV.setValue(P_Y1);	
			
		/* Humidity plot */
		/* Declare arrays */
		var H_X1 = DataUtil.createDoubleArray(1);	
		var H_Y1 = DataUtil.createDoubleArray(1);
		/* Assign values */
		H_X1[0] = unixMilli;					
		H_Y1[0] = columns[columnsToExtract[4]];		
		/* Update PVs */
		H_X1PV.setValue(H_X1);	
		H_Y1PV.setValue(H_Y1);	
			
		/* Gas plot */
		/* Declare arrays */
		var G_X1 = DataUtil.createDoubleArray(1);	
		var G_Y1 = DataUtil.createDoubleArray(1);		
		/* Assign values */
		G_X1[0] = unixMilli;					
		G_Y1[0] = columns[columnsToExtract[5]];		
		/* Update PVs */
		G_X1PV.setValue(G_X1);	
		G_Y1PV.setValue(G_Y1);
			
		/* Display some values on the console */
		//ConsoleUtil.writeInfo('\n timeAxis1[0]: ' + timeAxis1[0]);
		//ConsoleUtil.writeInfo('\n tempAxis1[0] ' + tempAxis1[0]);
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
		index++;	// Go to next row, skipping the headers
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
	while ((line = RAF.readLine()) !== null) {
		newData += new java.lang.String(line.getBytes("ISO-8859-1"), "UTF-8") + '\n';		// Convert to string and add newline character
	}
	lastKnownPosition = RAF.getFilePointer();		// Update to the end of the file
	RAF.close();		// Close pointer
	
	/* If there is some data read in*/
	if (newData.trim().length > 0) {
		var rows = newData.split('\n');		// Divide into rows
		var executor = Executors.newScheduledThreadPool(1);		// Initialise executor 
		
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
function StartMonitoring() {
	var filePath = 'C:\\Users\\gusvi\\yamcs-studio\\VITA_FE1\\Scripts\\RandomEnviro.csv'; // File to be watched
	var watchService = FileSystems.getDefault().newWatchService();	// Create watch service 
	var path = Paths.get(filePath);			// File path object 
	var directory = path.getParent();		// Get directory where the CSV file is located
	directory.register(watchService, StandardWatchEK.ENTRY_MODIFY);		// Register watch service to this directory 
	
	/* Task to be executed in thread as runnable */
	var task = new Runnable({
		run: function() {
			var valid = true;	// For validity of key 
			
			while (valid) {
				try{
					var key = watchService.take();		// Wait for an event 
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
					ConsoleUtil.writeInfo("Enviro ERROR. " + e.toString());
				}
			}
		}
	});
	var thread = new Thread(task);	// Initialise thread with runnable 
	thread.start();		// Start thread
}


StartMonitoring();	// Start Monitoring 