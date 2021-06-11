# Project

Summary:  By the Vendor you completed the work create table showing list of most recent Annuals by Account.  Create separate table for account under each vendor.  Below each table provide the total percentage of Inspection Failed based on all ScanSeries application



Start date for the inspections 
end date for the last timet he inspection was modified 
Building address 1 field = building id 

no inspections no building listed 




1.0.1 - 0.3
fixed safaried date issues with ''.replace(/\s/, 'T')
Fixed issues with CSS not loading on print preview and updating print preview CSS rules to make it more readable on a PDF print out

This is a rework of the original app adding in information pertaining to how many devices failed within the inspection and the last time the inspection was modified

2.0 didd rewrk to add in the device count for failed devices ,  causes teh app to slow down due to high api calls

2.0.4
added in columns for devices failed/total, and the date of the last change