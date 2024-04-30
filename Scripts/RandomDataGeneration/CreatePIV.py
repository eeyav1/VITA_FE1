import csv      # CSV file manipulation
import random   # Random data generation 
import time     # Timestamps

numRows = 2     # Sets of data to write per sensor
numColumns = 3  # Number of columns besides time, phase, and voltage line
filePath = "C:\\Users\\gusvi\\yamcs-studio\\VITA_FE1\\Scripts\\RandomPIV.csv"    # File path to write

startTime = int(time.mktime(time.strptime('2023-01-01 00:00:00', '%Y-%m-%d %H:%M:%S'))) # Starting time in UNIX epoch MILLI

# Write headers in write mode 
with open(filePath, 'w', newline='') as file:
    writer  = csv.writer(file)
    writer.writerow(["Time", "Phase", "V_Line","P", "I", "V"])  # Headers

# Loop through number of data sets 
for i in range(numRows):
    # Append data to the CSV file
    with open(filePath, 'a', newline='') as file:  # 'a' for appending
        writer = csv.writer(file)
    
        print("New data added: {}".format(i))   # Print how many sets of data were added
        sampleTime = startTime + 10*i    # Increasing time 
        readableTime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(sampleTime)) + " (UTC)"    # Time to be appended 
        
        # Data for 5V_line
        row1 = [readableTime] + [1] + [5] + [random.uniform(1.0, 100.0) for _ in range(numColumns)]
        writer.writerow(row1)
        # Data for 12V_line
        row2 = [readableTime] + [1] + [12] + [random.uniform(1.0, 100.0) for _ in range(numColumns)]
        writer.writerow(row2)
        
    time.sleep(2)  # Wait for X seconds to write another data set 