var File = Java.type("java.io.File");			// Manipulate file objects
var Desktop = Java.type("java.awt.Desktop");	// Desktop 

/* Open specific CSV file */
function openFile(filePath){
	var file = new File(filePath);		// Initialise instance 
	
	/* Check if the specified CSV file exists */
	if(!file.exists()){
		ConsoleUtil.writeInfo("\n File not found");
		return;
	}
	
	/* If the file exists, check if supported*/
	if(Desktop.isDesktopSupported()){
		Desktop.getDesktop().open(file);	// Open file on default editor
	}else{
		ConsoleUtil.writeInfo("\n Desktop not suppported");
	}
}
/* File to be opened */
openFile('C:\\Users\\gusvi\\yamcs-studio\\VITA_FE1\\Scripts\\RandomDataGeneration\\RandomPIV.csv');