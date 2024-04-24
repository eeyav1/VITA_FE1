var RandomAccessFile = Java.type('java.io.RandomAccessFile');						
var File = Java.type('java.io.File');												
var Paths = Java.type("java.nio.file.Paths");										//
var FileSystems = Java.type("java.nio.file.FileSystems");							//
var StandardWatchEK = Java.type("java.nio.file.StandardWatchEventKinds");	//
var Runnable = Java.type("java.lang.Runnable");										//
var Thread = Java.type("java.lang.Thread");											//
var Executors = Java.type("java.util.concurrent.Executors");
var TimeUnit = Java.type("java.util.concurrent.TimeUnit");

/* Variables for CSV reading */
var lastKnownPosition = 0;
var lastModificationTime = 0;
var isFirstRead = true;

/* PROCESSED VARIABLES */
/* 5 V_line */
var P_5PV = pvArray[0];	// Time axis trace 1
var I_5PV = pvArray[1];	// Temperature axis trace 0
var V_5PV = pvArray[2];	// Time axis trace 0
var T_5PV = pvArray[3];	// Temperature axis trace 1
/* 12 V_line */
var P_12PV = pvArray[4];	// Time axis trace 1
var I_12PV = pvArray[5];	// Temperature axis trace 0
var V_12PV = pvArray[6];	// Time axis trace 0
var T_12PV = pvArray[7];	// Temperature axis trace 1


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
	var columnsToExtract = [0, 2, 3, 4, 5];		// Time, V_line, P, I, V
	/* Convert time axis into unix and extract HH:mm:ss */
	var dateTimeString = columns[columnsToExtract[0]].replace(' (UTC)', '');
	var unixMilli = Date.parse(dateTimeString);
	
	//ConsoleUtil.writeInfo('1 \n');
	
	/* Check if the row is for sensor 1 oCr sensor 2 */
	if (columns[columnsToExtract[1]] == 5){
		/* 5 V_line */
		
		P_5PV.setValue(columns[columnsToExtract[2]]);	// Temperature axis trace 0
		I_5PV.setValue(columns[columnsToExtract[3]]);	// Temperature axis trace 0
		V_5PV.setValue(columns[columnsToExtract[4]]);	// Temperature axis trace 0
		T_5PV.setValue(dateTimeString);	// Temperature axis trace 0
			
		//ConsoleUtil.writeInfo('\n timeAxis0[0]: ' + timeAxis0[0]);
		//ConsoleUtil.writeInfo('\n tempAxis0[0] ' + tempAxis0[0]);			
			
	} else if (columns[columnsToExtract[1]] == 12){
		/* 5 V_line */
		P_12PV.setValue(columns[columnsToExtract[2]]);	// Temperature axis trace 0
		I_12PV.setValue(columns[columnsToExtract[3]]);	// Temperature axis trace 0
		V_12PV.setValue(columns[columnsToExtract[4]]);	// Temperature axis trace 0
		T_12PV.setValue(dateTimeString);	// Temperature axis trace 0
			
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
	var filePath = 'C:\\Users\\gusvi\\yamcs-studio\\Test\\Scripts\\RandomPIV.csv'; // File to be watched
	
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
					ConsoleUtil.writeInfo("PIV ERROR. " + e.toString());
				}
			}
			//ConsoleUtil.writeInfo("\nInside function()");
		}
	});
	var thread = new Thread(task);
	thread.start();
}
			

StartMonitoring();