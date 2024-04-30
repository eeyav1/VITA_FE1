var pv0String = PVUtil.getString(pvs[0]);			// Retrieve value from Input PVs
ConsoleUtil.writeInfo("pv0String = " + pv0String);	// Show value in console

/* Check Input PV and display value */
if (pv0String == 1 || pv0String == 'safe') {
	widget.setPropertyValue("pv_value", 1);		// 00001
} else if (pv0String == 2 || pv0String == 'standby') {
	widget.setPropertyValue("pv_value", 2);		// 00010
} else if (pv0String == 3 || pv0String == 'rehydrate') {
	widget.setPropertyValue("pv_value", 4);		// 00100
} else if (pv0String == 4 || pv0String == 'science') {
	widget.setPropertyValue("pv_value", 8);		// 01000
} else if (pv0String == 5 || pv0String == 'decommission') {
	widget.setPropertyValue("pv_value", 16);	// 10000
} else {}


