import { 
  FormatterNoDec,
  Formatter
 } from './base.js';

// initialize data

// configure initial counts here
const iJuniors = 2;
const iConsultants = 2;
const iSeniors = 1;
const iSalesPersons = 1;

// configure initial rates here
const iJuniorRate = 55;
const iConsultantRate = 75;
const iSeniorRate = 125;
const iSalesPersonRate = 0.1;

// configure initial costs here
const iJuniorCost = 40000;
const iConsultantCost = 50000;
const iSeniorCost = 65000;
const iSalesPersonCost = 100000;

// current project
const iProjectValue = 12500;
const iProjectEffort = 2500;

// total earnings
jQuery.data(document.body, "totalEarnings", 0);
jQuery.data(document.body, "currentBalance", 0);

// current project
jQuery.data(document.body, "projectValue", iProjectValue);
jQuery.data(document.body, "projectEffort", iProjectEffort);
jQuery.data(document.body, "projectProgress", 0);

// juniors
jQuery.data(document.body, "juniors", iJuniors);
jQuery.data(document.body, "juniorRate", iJuniorRate);
jQuery.data(document.body, "juniorCost", iJuniorCost);

// consultants
jQuery.data(document.body, "consultants", iConsultants);
jQuery.data(document.body, "consultantRate", iConsultantRate);
jQuery.data(document.body, "consultantCost", iConsultantCost);

// seniors
jQuery.data(document.body, "seniors", iSeniors);
jQuery.data(document.body, "seniorRate", iSeniorRate);
jQuery.data(document.body, "seniorCost", iSeniorCost);

// sales
jQuery.data(document.body, "salesPersons", iSalesPersons);
jQuery.data(document.body, "salesPersonRate", iSalesPersonRate);
jQuery.data(document.body, "salesPersonCost", iSalesPersonCost);

// total rates
jQuery.data(document.body, "totalRate", iJuniorRate * iJuniors + iConsultantRate * iConsultants + iSeniorRate * iSeniors);
jQuery.data(document.body, "totalSalesRate", iSalesPersonRate * iSalesPersons);

// initialize the screen

// resource counts
$("#juniorCount").text(jQuery.data(document.body, "juniors"));
$("#consultantCount").text(jQuery.data(document.body, "consultants"));
$("#seniorCount").text(jQuery.data(document.body, "seniors"));
$("#salesPersonCount").text(jQuery.data(document.body, "salesPersons"));

// resource rates
$("#juniorRate").text("× " + jQuery.data(document.body, "juniorRate"));
$("#consultantRate").text("× " + jQuery.data(document.body, "consultantRate"));
$("#seniorRate").text("× " + jQuery.data(document.body, "seniorRate"));
$("#salesPersonRate").text("× " + jQuery.data(document.body, "salesPersonRate"));

// resource costs
$("#juniorCost").text("-" + FormatterNoDec.format(jQuery.data(document.body, "juniorCost")));
$("#consultantCost").text("-" + FormatterNoDec.format(jQuery.data(document.body, "consultantCost")));
$("#seniorCost").text("-" + FormatterNoDec.format(jQuery.data(document.body, "seniorCost")));
$("#salesPersonCost").text("-" + FormatterNoDec.format(jQuery.data(document.body, "salesPersonCost")));

// earnings & balance
$("#totalEarnings").text(Formatter.format(0));
$("#currentBalance").text(Formatter.format(0));

// project
$("#projectValue").text(Formatter.format(iProjectValue));
$("#projectProgress").text(0 + " / " + iProjectEffort);

// call when document is ready
$(document).ready(function() {
    return;
});