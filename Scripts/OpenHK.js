var File = Java.type("java.io.File");
var Desktop = Java.type("java.awt.Desktop");

function openFile(filePath){
	var file = new File(filePath);
	
	if(!file.exists()){
		ConsoleUtil.writeInfo("\n File not found");
		return;
	}
	
	if(Desktop.isDesktopSupported()){
		Desktop.getDesktop().open(file);
	}else{
		ConsoleUtil.writeInfo("\n Desktop not suppported");
	}
}

openFile('C:\\Users\\gusvi\\yamcs-studio\\Test\\Scripts\\RandomPIV.csv');