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
	var columnsToExtract = [0, 2, 3, 4, 5, 6];		// Time, Temperature, Humidity, Pressure, Gas
	/* Convert time axis into unix and extract HH:mm:ss */
	var dateTimeString = columns[columnsToExtract[0]].replace(' (UTC)', '');
	var unixMilli = Date.parse(dateTimeString);
	
	/* Check if the row is for sensor 1 or sensor 2 */
	if (columns[columnsToExtract[1]] == 1){
		/* Sensor 1 */
		/* Temperature plot */
		var T_X0 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var T_Y0 = DataUtil.createDoubleArray(1);		// Temperature trace 0 array
		T_X0[0] = unixMilli;						// Time axis 
		T_Y0[0] = columns[columnsToExtract[2]];		// Temperature axis 
		T_X0PV.setValue(T_X0);	// Time axis trace 0
		T_Y0PV.setValue(T_Y0);	// Temperature axis trace 0
		
		/* Pressure plot */
		var P_X0 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var P_Y0 = DataUtil.createDoubleArray(1);		// Pressure trace 0 array
		P_X0[0] = unixMilli;						// Time axis 
		P_Y0[0] = columns[columnsToExtract[3]];		// Pressure axis 
		P_X0PV.setValue(P_X0);	// Time axis trace 0
		P_Y0PV.setValue(P_Y0);	// Pressure axis trace 0
			
		/* Humidity plot */
		var H_X0 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var H_Y0 = DataUtil.createDoubleArray(1);		// Humidity trace 0 array
		H_X0[0] = unixMilli;						// Time axis
		H_Y0[0] = columns[columnsToExtract[4]];		// Humidity axis
		H_X0PV.setValue(H_X0);	// Time axis trace 0
		H_Y0PV.setValue(H_Y0);	// Humidity axis trace 0
			
		var G_X0 = DataUtil.createDoubleArray(1);		// Time trace 0 array
		var G_Y0 = DataUtil.createDoubleArray(1);		// Gas trace 0 array
		G_X0[0] = unixMilli;						// Time axis 
		G_Y0[0] = columns[columnsToExtract[5]];		// Gas axis 
		G_X0PV.setValue(G_X0);	// Time axis trace 0
		G_Y0PV.setValue(G_Y0);	// Gas axis trace 0
			
		//ConsoleUtil.writeInfo('\n timeAxis0[0]: ' + timeAxis0[0]);
		//ConsoleUtil.writeInfo('\n tempAxis0[0] ' + tempAxis0[0]);			
			
	} else if (columns[columnsToExtract[1]] == 2){
		/* Sensor 2 */
		/* Temperature plot */
		var T_X1 = DataUtil.createDoubleArray(1);		// Time trace 1 array
		var T_Y1 = DataUtil.createDoubleArray(1);		// Temperature trace 1 array
		T_X1[0] = unixMilli;						// Time axis
		T_Y1[0] = columns[columnsToExtract[2]];		// Temperature axis
		T_X1PV.setValue(T_X1);	// Time axis trace 1
		T_Y1PV.setValue(T_Y1);	// Temperature axis trace 1
		
		/* Pressure plot */
		var P_X1 = DataUtil.createDoubleArray(1);		// Time trace 1 array
		var P_Y1 = DataUtil.createDoubleArray(1);		// Pressure trace 1 array
		P_X1[0] = unixMilli;						// Time axis 
		P_Y1[0] = columns[columnsToExtract[3]];		// Pressure axis 
		P_X1PV.setValue(P_X1);	// Time axis trace 1
		P_Y1PV.setValue(P_Y1);	// Pressure axis trace 1
			
		/* Humidity plot */
		var H_X1 = DataUtil.createDoubleArray(1);		// Time trace 1 array
		var H_Y1 = DataUtil.createDoubleArray(1);		// Humidity trace 1 array
		H_X1[0] = unixMilli;						// Time axis
		H_Y1[0] = columns[columnsToExtract[4]];		// Humidity axis
		H_X1PV.setValue(H_X1);	// Time axis trace 1
		H_Y1PV.setValue(H_Y1);	// Humidity axis trace 1
			
		/* Gas plot */
		var G_X1 = DataUtil.createDoubleArray(1);		// Time trace 1 array
		var G_Y1 = DataUtil.createDoubleArray(1);		// Gas trace 1 array
		G_X1[0] = unixMilli;						// Time axis 
		G_Y1[0] = columns[columnsToExtract[5]];		// Gas axis 
		G_X1PV.setValue(G_X1);	// Time axis trace 1
		G_Y1PV.setValue(G_Y1);	// Gas axis trace 1
			
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
	var filePath = 'C:\\Users\\gusvi\\yamcs-studio\\Test\\Scripts\\RandomEnviro.csv'; // File to be watched
	
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