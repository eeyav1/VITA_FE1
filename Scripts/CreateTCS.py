import csv
import random
import time

numRows = 10    # Sets of data to write
numColumns = 4  # Number of columns besides time, phase, and sensor
filePath = "C:\\Users\\gusvi\\yamcs-studio\\Test\\Scripts\\RandomTCS.csv"    # File path to write

startTime = int(time.mktime(time.strptime('2023-01-01 00:00:00', '%Y-%m-%d %H:%M:%S'))) # Starting time

with open(filePath, 'wb') as file:
    writer  = csv.writer(file)
    writer.writerow(["Time", "Phase", "Temp1","Temp2", "Temp3", "Temp4"])  # Headers

# Loop through number of data sets 
for i in range(numRows):
    with open(filePath, 'ab') as file:  # 'ab' for appending
        writer = csv.writer(file)
    
        print("New data added: {}".format(i))   # Print what set of data was added
        sampleTime = startTime + 10*i    # Increasing time 
        readableTime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(sampleTime)) + " (UTC)"    # Time to be printed 
        
        # Data for sensor 1 
        row1 = [readableTime] + [1] + [random.uniform(1.0, 100.0) for _ in range(numColumns)]
        writer.writerow(row1)
        
        
    time.sleep(2)  # Wait for 10 seconds to write another data set 