import csv

filename = "data/data1.csv"

title = [0,0,0]
time = []
dist = []

with open(filename, 'r') as csvfile:
	csvreader = csv.reader(csvfile)
	#print(title)
	for row in csvreader:
		time.append(row[0])
		dist.append(row[1])


row = 25
col = 20

title[0] = "coordx"
title[1] = "coordy"
title[2] = "dist"
latest = dist[-1]

single_dist = []
i = 0 
while i < len(latest):
	#print(latest[i])
	if(latest[i].isdigit()):
		number = int(latest[i:i+4])
		i+= 4
		single_dist.append(number)
	i+=1

data = []

print(min(single_dist), max(single_dist))
x = 0
y = 0

for i in range(len(single_dist)):

	if(x == 20):
		x = 0
	if(i%20 == 0):
		y += 1
	x += 1
	#print([single_dist[i], x, y])
	data.append([x, y, single_dist[i]])
#print(data)

# with open("single_time_frame", 'w') as csvfile:
# 	csvwriter = csv.writer(csvfile)
# 	csvwriter.writerow(title)
# 	for i in range(len(data)):
# 		csvwriter.writerow(data[i])









