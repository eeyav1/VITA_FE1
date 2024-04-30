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
/* Device 1. Graph: Spectro1 */
var S1_X0PV = pvArray[0];	// Time axis trace 0
var S1_Y0PV = pvArray[1];	// Intensity axis trace 0
var S1_X1PV = pvArray[2];	// Time axis trace 1
var S1_Y1PV = pvArray[3];	// Intensity axis trace 1
var S1_X2PV = pvArray[4];	// Time axis trace 2
var S1_Y2PV = pvArray[5];	// Intensity axis trace 2
/* Device 2. Graph: Spectro2 */
var S2_X0PV = pvArray[6];	// Time axis trace 0
var S2_Y0PV = pvArray[7];	// Intensity axis trace 0
var S2_X1PV = pvArray[8];	// Time axis trace 1
var S2_Y1PV = pvArray[9];	// Intensity axis trace 1
var S2_X2PV = pvArray[10];	// Time axis trace 2
var S2_Y2PV = pvArray[11];	// Intensity axis trace 2
/* Device 3. Graph: Spectro3 */
var S3_X0PV = pvArray[12];	// Time axis trace 0
var S3_Y0PV = pvArray[13];	// Intensity axis trace 0
var S3_X1PV = pvArray[14];	// Time axis trace 1
var S3_Y1PV = pvArray[15];	// Intensity axis trace 1
var S3_X2PV = pvArray[16];	// Time axis trace 2
var S3_Y2PV = pvArray[17];	// Intensity axis trace 2
/* Device 4. Graph: Spectro4 */
var S4_X0PV = pvArray[18];	// Time axis trace 0
var S4_Y0PV = pvArray[19];	// Intensity axis trace 0
var S4_X1PV = pvArray[20];	// Time axis trace 1
var S4_Y1PV = pvArray[21];	// Intensity axis trace 1
var S4_X2PV = pvArray[22];	// Time axis trace 2
var S4_Y2PV = pvArray[23];	// Intensity axis trace 2



/* Shutdown executor when no longer in use */
function ShutdownExecutor(executor) {
	executor.shutdown();
	try{
		if (!executor.awaitTermination(400, TimeUnit.MILLISECONDS)) {
			executor.shutdownNow();
		}
	} catch(e){
		executor.shutdownNow();
	}
}



/* Display on GUI */
function UpdatePV(columns) {
	var columnsToExtract = [0, 2, 3, 4, 5];		// Time, Sensor, 415, 480, 555
	/* Convert time axis into unix and extract HH:mm:ss */
	var dateTimeString = columns[columnsToExtract[0]].replace(' (UTC)', '');
	var unixMilli = Date.parse(dateTimeString);
	
	/* Check if the row is for device 1, 2, 3, or 4 */
	if (columns[columnsToExtract[1]] == 1) {
		/* Device 1. Graph: Spectro1 */
		
		/* Declare arrays */
		var S1_X0 = DataUtil.createDoubleArray(1);		
		var S1_Y0 = DataUtil.createDoubleArray(1);	
		var S1_X1 = DataUtil.createDoubleArray(1);	
		var S1_Y1 = DataUtil.createDoubleArray(1);	
		var S1_X2 = DataUtil.createDoubleArray(1);		
		var S1_Y2 = DataUtil.createDoubleArray(1);		
		/* Assign values */
		S1_X0[0] = unixMilli;						
		S1_Y0[0] = columns[columnsToExtract[2]];	
		S1_X1[0] = unixMilli;						
		S1_Y1[0] = columns[columnsToExtract[3]];	
		S1_X2[0] = unixMilli;						
		S1_Y2[0] = columns[columnsToExtract[4]];
		/* Update PVs*/
		S1_X0PV.setValue(S1_X0);	
		S1_Y0PV.setValue(S1_Y0);	
		S1_X1PV.setValue(S1_X1);	
		S1_Y1PV.setValue(S1_Y1);
		S1_X2PV.setValue(S1_X2);	
		S1_Y2PV.setValue(S1_Y2);
		
		
			
		//ConsoleUtil.writeInfo('\n timeAxis0[0]: ' + timeAxis0[0]);
		//ConsoleUtil.writeInfo('\n tempAxis0[0] ' + tempAxis0[0]);			
			
	} else if (columns[columnsToExtract[1]] == 2) {
		/* Device 2. Graph: Spectro2 */
		
		/* Declare arrays */
		var S2_X0 = DataUtil.createDoubleArray(1);	
		var S2_Y0 = DataUtil.createDoubleArray(1);
		var S2_X1 = DataUtil.createDoubleArray(1);	
		var S2_Y1 = DataUtil.createDoubleArray(1);	
		var S2_X2 = DataUtil.createDoubleArray(1);		
		var S2_Y2 = DataUtil.createDoubleArray(1);	
		/* Assign values */
		S2_X0[0] = unixMilli;						
		S2_Y0[0] = columns[columnsToExtract[2]];	
		S2_X1[0] = unixMilli;						
		S2_Y1[0] = columns[columnsToExtract[3]];	
		S2_X2[0] = unixMilli;						
		S2_Y2[0] = columns[columnsToExtract[4]];	
		/* Update PVs*/
		S2_X0PV.setValue(S2_X0);
		S2_Y0PV.setValue(S2_Y0);	
		S2_X1PV.setValue(S2_X1);
		S2_Y1PV.setValue(S2_Y1);	
		S2_X2PV.setValue(S2_X2);	
		S2_Y2PV.setValue(S2_Y2);	
			
		//ConsoleUtil.writeInfo('\n timeAxis1[0]: ' + timeAxis1[0]);
		//ConsoleUtil.writeInfo('\n tempAxis1[0] ' + tempAxis1[0]);
	} else if (columns[columnsToExtract[1]] == 3) {
		/* Device 3. Graph: Spectro3 */
		
		/* Declare arrays */
		var S3_X0 = DataUtil.createDoubleArray(1);		
		var S3_Y0 = DataUtil.createDoubleArray(1);		
		var S3_X1 = DataUtil.createDoubleArray(1);		
		var S3_Y1 = DataUtil.createDoubleArray(1);		
		var S3_X2 = DataUtil.createDoubleArray(1);		
		var S3_Y2 = DataUtil.createDoubleArray(1);		
		/* Assign values */
		S3_X0[0] = unixMilli;					 
		S3_Y0[0] = columns[columnsToExtract[2]];		
		S3_X1[0] = unixMilli;						
		S3_Y1[0] = columns[columnsToExtract[3]];		
		S3_X2[0] = unixMilli;						
		S3_Y2[0] = columns[columnsToExtract[4]];	
		/* Update PVs*/		
		S3_X0PV.setValue(S3_X0);	
		S3_Y0PV.setValue(S3_Y0);
		S3_X1PV.setValue(S3_X1);	
		S3_Y1PV.setValue(S3_Y1);	
		S3_X2PV.setValue(S3_X2);	
		S3_Y2PV.setValue(S3_Y2);	
			
		//ConsoleUtil.writeInfo('\n timeAxis1[0]: ' + timeAxis1[0]);
		//ConsoleUtil.writeInfo('\n tempAxis1[0] ' + tempAxis1[0]);
	} else if (columns[columnsToExtract[1]] == 4) {
		/* Device 4. Graph: Spectro4 */
		
		/* Declare arrays */
		var S4_X0 = DataUtil.createDoubleArray(1);	
		var S4_Y0 = DataUtil.createDoubleArray(1);		
		var S4_X1 = DataUtil.createDoubleArray(1);		
		var S4_Y1 = DataUtil.createDoubleArray(1);		
		var S4_X2 = DataUtil.createDoubleArray(1);	
		var S4_Y2 = DataUtil.createDoubleArray(1);		
		/* Assign values */
		S4_X0[0] = unixMilli;						
		S4_Y0[0] = columns[columnsToExtract[2]];		
		S4_X1[0] = unixMilli;						
		S4_Y1[0] = columns[columnsToExtract[3]];	
		S4_X2[0] = unixMilli;						
		S4_Y2[0] = columns[columnsToExtract[4]];	
		/* Update PVs*/		
		S4_X0PV.setValue(S4_X0);
		S4_Y0PV.setValue(S4_Y0);	
		S4_X1PV.setValue(S4_X1);
		S4_Y1PV.setValue(S4_Y1);
		S4_X2PV.setValue(S4_X2);
		S4_Y2PV.setValue(S4_Y2);
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
		isFirstRead = false;		// Update test variable 
		index++;		// Go to next row, skipping the headers
		var row = rows[index];		// Get row 
	}else{
		var row = rows[index];		// Get row 
	}
	var columns = row.split(',');		// Split row into columns
	
	/* Check that the row is not empty */
	if(columns.length > 2)
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
	if (newData.trim().length > 0){
		var rows = newData.split('\n');		// Divide into rows
		var executor = Executors.newScheduledThreadPool(1);		// Initialise executor
		
		ProcessRows(rows, 0, executor);			// Process newly extracted rows
	}
}



/* Check if the modifications is an append on the file */
function CheckForUpdates(filePath) {
	var file = new File(filePath);		// File opening
	var currentModified = file.lastModified();		// Get last modification time 
	
	/* Compare with known previous modification time */
	if (currentModified > lastModificationTime){
		lastModificationTime = currentModified;		// Update last known modification time 
		ReadNewData(file);		// Call function to read the data in 
	}
}



/* Main function to monitor folder */
function StartMonitoring(){
	var filePath = 'C:\\Users\\gusvi\\yamcs-studio\\VITA_FE1\\Scripts\\RandomDataGeneration\\RandomSpectro.csv'; // File to be watched
	var watchService = FileSystems.getDefault().newWatchService();	// Create watch service 
	var path = Paths.get(filePath);		// File path object 
	var directory = path.getParent();	// Get directory where the CSV file is located
	directory.register(watchService, StandardWatchEK.ENTRY_MODIFY);		// Register watch service to this directory 
	
	/* Task to be executed in thread as runnable */
	var task = new Runnable({
		run: function() {
			var valid = true;		// For validity of key
			
			while(valid){
				try{
					var key = watchService.take();		// Wait for an event 
					var events = key.pollEvents().toArray();		// Extract events as array 
					
					/* Iterate through array */
					for (var i = 0; i < events.length; i++) {
						var event = events[i];		// Extract an event 
						var kind = event.kind();	// Get event kind 
						
						/* Check if event kind is a file been modified */
						if(StandardWatchEK.ENTRY_MODIFY.equals(kind)){
							var eventContext = event.context().toString();		// Get path of modified file 
							
							/* Check if file modified is the specific CSV file been watched */
							if(eventContext.equals(path.getFileName().toString()))
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
	var thread = new Thread(task);		// Initialise thread with runnable 
	thread.start();		// Start thread
}
			

StartMonitoring();		// Start Monitoring 