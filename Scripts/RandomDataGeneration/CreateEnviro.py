import csv      # CSV file manipulation
import random   # Random data generation 
import time     # Timestamps

numRows = 10    # Sets of data to write per sensor
numColumns = 4  # Number of columns besides time, phase, and sensor
filePath = "C:\\Users\\gusvi\\yamcs-studio\\VITA_FE1\\Scripts\\RandomEnviro.csv"    # File path to write

startTime = int(time.mktime(time.strptime('2023-01-01 00:00:00', '%Y-%m-%d %H:%M:%S'))) # Starting time in UNIX epoch MILLI

# Write headers in write-binary mode 
with open(filePath, 'w', newline='') as file:
    writer  = csv.writer(file)
    writer.writerow(["Time", "Phase", "Sensor","Temperature", "Pressure", "Humidity", "Toxicity"])  # Headers

# Loop through number of data sets 
for i in range(numRows):
    # Append data to the CSV file
    with open(filePath, 'a', newline='') as file:  # 'ab' for appending
        writer = csv.writer(file)
    
        print("New data added: {}".format(i))   # Print how many sets of data were added
        sampleTime = startTime + 2*i    # Increasing time 
        readableTime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(sampleTime)) + " (UTC)"    # Time to be appended 
        
        # Data for sensor 1 
        row1 = [readableTime] + [1] + [1] + [random.uniform(1.0, 100.0) for _ in range(numColumns)]
        writer.writerow(row1)
        # Data for sensor 1 
        row2 = [readableTime] + [1] + [2] + [random.uniform(1.0, 100.0) for _ in range(numColumns)]
        writer.writerow(row2)
        
    time.sleep(2)  # Wait for X seconds to write another data set 