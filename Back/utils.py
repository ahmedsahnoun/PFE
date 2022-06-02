from math import log,exp

def coef(document,n):
	return((document+" ")*n)

def score(x):
	score = (exp(2)-exp(x))/(exp(2)-1)*100
	# score = (1-x/2)*100
	return(score)

def get_experience_duration(dates):
	total_experience_in_months = 0
	i = dates.split(' ')
	if i[3].lower() == 'present':
		total_experience_in_months = get_number_of_months_from_dates(i[0]+' '+i[1], i[3])
	else:
		total_experience_in_months = get_number_of_months_from_dates(i[0]+' '+i[1], i[3]+' '+i[4])
	return total_experience_in_months

def get_experience_duration_linkedin(dates):
	total_experience_in_months = 0

	i = dates.split('·')[1].strip()
	i = i.split(' ')
	print(i)
	if len(i) == 2:
		return int(i[0])
	else:
		return int(i[0])*12+int(i[2])


def get_number_of_months_from_dates(date1, date2):
	if date2.lower() == 'present':
		date2 = datetime.now().strftime('%b %Y')
	try:
		if len(date1.split()[0]) > 3:
			date1 = date1.split()
			date1 = date1[0][:3] + ' ' + date1[1]
		if len(date2.split()[0]) > 3:
			date2 = date2.split()
			date2 = date2[0][:3] + ' ' + date2[1]
	except IndexError:
		return 0
	try:
		date1 = datetime.strptime(str(date1), '%b %Y')
		date2 = datetime.strptime(str(date2), '%b %Y')
		months_of_experience = relativedelta.relativedelta(date2, date1)
		months_of_experience = (months_of_experience.years * 12 + months_of_experience.months) + 1
	except ValueError:
		return 0
	return months_of_experience 