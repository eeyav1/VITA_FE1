var RandomAccessFile = Java.type('java.io.RandomAccessFile');
var File = Java.type('java.io.File');
var Paths = Java.type("java.nio.file.Paths");
var FileSystems = Java.type("java.nio.file.FileSystems");
var StandardWatchEK = Java.type("java.nio.file.StandardWatchEventKinds");
var Runnable = Java.type("java.lang.Runnable");
var Thread = Java.type("java.lang.Thread");
var Executors = Java.type("java.util.concurrent.Executors");
var TimeUnit = Java.type("java.util.concurrent.TimeUnit");

/* Variables for CSV reading */
var lastKnownPosition = 0;
var lastModificationTime = 0;
var isFirstRead = true;

/* PROCESSED VARIABLES */
/* Device 1 */
var S1_X0PV = pvArray[0];	// Time axis trace 0
var S1_Y0PV = pvArray[1];	// Temperature axis trace 0
var S1_X1PV = pvArray[2];	// Time axis trace 1
var S1_Y1PV = pvArray[3];	// Temperature axis trace 1
var S1_X2PV = pvArray[4];	// Time axis trace 1
var S1_Y2PV = pvArray[5];	// Temperature axis trace 1
/* Device 2 */
var S2_X0PV = pvArray[6];	// Time axis trace 0
var S2_Y0PV = pvArray[7];	// Temperature axis trace 0
var S2_X1PV = pvArray[8];	// Time axis trace 1
var S2_Y1PV = pvArray[9];	// Temperature axis trace 1
var S2_X2PV = pvArray[10];	// Time axis trace 1
var S2_Y2PV = pvArray[11];	// Temperature axis trace 1
/* Device 3 */
var S3_X0PV = pvArray[12];	// Time axis trace 0
var S3_Y0PV = pvArray[13];	// Temperature axis trace 0
var S3_X1PV = pvArray[14];	// Time axis trace 1
var S3_Y1PV = pvArray[15];	// Temperature axis trace 1
var S3_X2PV = pvArray[16];	// Time axis trace 1
var S3_Y2PV = pvArray[17];	// Temperature axis trace 1
/* Device 4 */
var S4_X0PV = pvArray[18];	// Time axis trace 0
var S4_Y0PV = pvArray[19];	// Temperature axis trace 0
var S4_X1PV = pvArray[20];	// Time axis trace 1
var S4_Y1PV = pvArray[21];	// Temperature axis trace 1
var S4_X2PV = pvArray[22];	// Time axis trace 1
var S4_Y2PV = pvArray[23];	// Temperature axis trace 1



function ShutdownExecutor(executor){
	executor.shutdown();
	try{
		if (!executor.awaitTermination(400, TimeUnit.MILLISECONDS)){
			executor.shutdownNow();
		}
	} catch(e){
		executor.shutdownNow();
	}
}


function UpdatePV(columns){
	var columnsToExtract = [0, 2, 3, 4, 5];		// Time, Temperature, Humidity, Pressure, Gas
	/* Convert time axis into unix and extract HH:mm:ss */
	var dateTimeString = columns[columnsToExtract[0]].replace(' (UTC)', '');
	var unixMilli = Date.parse(dateTimeString);
	
	/* Check if the row is for sensor 1 or sensor 2 */
	if (columns[columnsToExtract[1]] == 1){
		/* Sensor 1 */
		/* Temperature plot */
		var S1_X0 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S1_Y0 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		var S1_X1 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S1_Y1 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		var S1_X2 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S1_Y2 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		S1_X0[0] = unixMilli;						// Time axis 
		S1_Y0[0] = columns[columnsToExtract[2]];		// Temperature axis 
		S1_X1[0] = unixMilli;						// Time axis 
		S1_Y1[0] = columns[columnsToExtract[3]];		// Temperature axis 
		S1_X2[0] = unixMilli;						// Time axis 
		S1_Y2[0] = columns[columnsToExtract[4]];		// Temperature axis 
		S1_X0PV.setValue(S1_X0);	// Time axis trace 0
		S1_Y0PV.setValue(S1_Y0);	// Temperature axis trace 0
		S1_X1PV.setValue(S1_X1);	// Time axis trace 0
		S1_Y1PV.setValue(S1_Y1);	// Temperature axis trace 0
		S1_X2PV.setValue(S1_X2);	// Time axis trace 0
		S1_Y2PV.setValue(S1_Y2);	// Temperature axis trace 0
		
		
			
		//ConsoleUtil.writeInfo('\n timeAxis0[0]: ' + timeAxis0[0]);
		//ConsoleUtil.writeInfo('\n tempAxis0[0] ' + tempAxis0[0]);			
			
	} else if (columns[columnsToExtract[1]] == 2){
		/* Sensor 2 */
		/* Temperature plot */
		var S2_X0 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S2_Y0 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		var S2_X1 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S2_Y1 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		var S2_X2 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S2_Y2 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		S2_X0[0] = unixMilli;						// Time axis 
		S2_Y0[0] = columns[columnsToExtract[2]];		// Temperature axis 
		S2_X1[0] = unixMilli;						// Time axis 
		S2_Y1[0] = columns[columnsToExtract[3]];		// Temperature axis 
		S2_X2[0] = unixMilli;						// Time axis 
		S2_Y2[0] = columns[columnsToExtract[4]];		// Temperature axis 
		S2_X0PV.setValue(S2_X0);	// Time axis trace 0
		S2_Y0PV.setValue(S2_Y0);	// Temperature axis trace 0
		S2_X1PV.setValue(S2_X1);	// Time axis trace 0
		S2_Y1PV.setValue(S2_Y1);	// Temperature axis trace 0
		S2_X2PV.setValue(S2_X2);	// Time axis trace 0
		S2_Y2PV.setValue(S2_Y2);	// Temperature axis trace 0
			
		//ConsoleUtil.writeInfo('\n timeAxis1[0]: ' + timeAxis1[0]);
		//ConsoleUtil.writeInfo('\n tempAxis1[0] ' + tempAxis1[0]);
	} else if (columns[columnsToExtract[1]] == 3){
		/* Sensor 2 */
		/* Temperature plot */
		var S3_X0 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S3_Y0 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		var S3_X1 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S3_Y1 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		var S3_X2 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S3_Y2 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		S3_X0[0] = unixMilli;						// Time axis 
		S3_Y0[0] = columns[columnsToExtract[2]];		// Temperature axis 
		S3_X1[0] = unixMilli;						// Time axis 
		S3_Y1[0] = columns[columnsToExtract[3]];		// Temperature axis 
		S3_X2[0] = unixMilli;						// Time axis 
		S3_Y2[0] = columns[columnsToExtract[4]];		// Temperature axis 
		S3_X0PV.setValue(S3_X0);	// Time axis trace 0
		S3_Y0PV.setValue(S3_Y0);	// Temperature axis trace 0
		S3_X1PV.setValue(S3_X1);	// Time axis trace 0
		S3_Y1PV.setValue(S3_Y1);	// Temperature axis trace 0
		S3_X2PV.setValue(S3_X2);	// Time axis trace 0
		S3_Y2PV.setValue(S3_Y2);	// Temperature axis trace 0
			
		//ConsoleUtil.writeInfo('\n timeAxis1[0]: ' + timeAxis1[0]);
		//ConsoleUtil.writeInfo('\n tempAxis1[0] ' + tempAxis1[0]);
	} else if (columns[columnsToExtract[1]] == 4){
		/* Sensor 2 */
		/* Temperature plot */
		var S4_X0 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S4_Y0 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		var S4_X1 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S4_Y1 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		var S4_X2 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var S4_Y2 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		S4_X0[0] = unixMilli;						// Time axis 
		S4_Y0[0] = columns[columnsToExtract[2]];		// Temperature axis 
		S4_X1[0] = unixMilli;						// Time axis 
		S4_Y1[0] = columns[columnsToExtract[3]];		// Temperature axis 
		S4_X2[0] = unixMilli;						// Time axis 
		S4_Y2[0] = columns[columnsToExtract[4]];		// Temperature axis 
		S4_X0PV.setValue(S4_X0);	// Time axis trace 0
		S4_Y0PV.setValue(S4_Y0);	// Temperature axis trace 0
		S4_X1PV.setValue(S4_X1);	// Time axis trace 0
		S4_Y1PV.setValue(S4_Y1);	// Temperature axis trace 0
		S4_X2PV.setValue(S4_X2);	// Time axis trace 0
		S4_Y2PV.setValue(S4_Y2);	// Temperature axis trace 0
			
		//ConsoleUtil.writeInfo('\n timeAxis1[0]: ' + timeAxis1[0]);
		//ConsoleUtil.writeInfo('\n tempAxis1[0] ' + tempAxis1[0]);
	}
}



function ProcessRows(rows, index, executor){
	if(index >= rows.length){
		ConsoleUtil.writeInfo('\n Processing complete ');
		ShutdownExecutor(executor);
		return;
	}
	
	if(isFirstRead){
		isFirstRead = false;
		index++;
		var row = rows[index];
	}else{
		var row = rows[index];
	}
	var columns = row.split(',');
	if(columns.length > 2)
		UpdatePV(columns);
		
	
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
	RAF.close();
	
	/* If there is some data read in*/
	if (newData.trim().length > 0){
		var rows = newData.split('\n');		// Divide into rows
		var executor = Executors.newScheduledThreadPool(1);
		
		ProcessRows(rows, 0, executor);
	}
}



/* Check if the modifications is an append on the file */
function CheckForUpdates(filePath) {
	var file = new File(filePath);		// File opening
	var currentModified = file.lastModified();	
	
	if (currentModified > lastModificationTime){
		lastModificationTime = currentModified;
		ReadNewData(file);		// Call function to actually read the data in 
	}
}



/* Main function to monitor folder */
function StartMonitoring(){
	var filePath = 'C:\\Users\\gusvi\\yamcs-studio\\Test\\Scripts\\RandomSpectro.csv'; // File to be watched
	
	//ConsoleUtil.writeInfo("Before running the task function 1");
	var watchService = FileSystems.getDefault().newWatchService();	// Create watch service 
	var path = Paths.get(filePath);
	var directory = path.getParent();
	directory.register(watchService, StandardWatchEK.ENTRY_MODIFY);
	//ConsoleUtil.writeInfo("\nStart");	
	
	var task = new Runnable({
		run: function() {
			var valid = true;
			while(valid){
				try{
					var key = watchService.take();
					var events = key.pollEvents().toArray();
					for (var i = 0; i < events.length; i++){
						var event = events[i];
						var kind = event.kind();
						
						/* Check if any modifications have occurred on the csv file */
						if(StandardWatchEK.ENTRY_MODIFY.equals(kind)){
							var eventContext = event.context().toString();
							
							if(eventContext.equals(path.getFileName().toString()))
								CheckForUpdates(filePath);
						}
					}
					valid = key.reset();
				} catch (e) {
					ConsoleUtil.writeInfo("Enviro ERROR. " + e.toString());
				}
			}
			//ConsoleUtil.writeInfo("\nInside function()");
		}
	});
	var thread = new Thread(task);
	thread.start();
}
			

StartMonitoring();