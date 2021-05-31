import { 
  FormatterNoDec,
  Formatter
 } from './base.js';

// initialize data
fetch("./data/init.json").then( response => response.json() ).then( json => {

  // total earnings
  jQuery.data(document.body, "totalEarnings", 0);
  jQuery.data(document.body, "currentBalance", 0);

  // current project
  jQuery.data(document.body, "projectValue", json.project.value);
  jQuery.data(document.body, "projectEffort", json.project.effort);
  jQuery.data(document.body, "projectProgress", 0);

  // juniors
  jQuery.data(document.body, "juniors", json.junior.quantity);
  jQuery.data(document.body, "juniorRate", json.junior.rate);
  jQuery.data(document.body, "juniorCost", json.junior.cost);

  // consultants
  jQuery.data(document.body, "consultants", json.consultant.quantity);
  jQuery.data(document.body, "consultantRate", json.consultant.rate);
  jQuery.data(document.body, "consultantCost", json.consultant.cost);

  // seniors
  jQuery.data(document.body, "seniors", json.senior.quantity);
  jQuery.data(document.body, "seniorRate", json.senior.rate);
  jQuery.data(document.body, "seniorCost", json.senior.cost);

  // sales
  jQuery.data(document.body, "salesPersons", json.salesPerson.quantity);
  jQuery.data(document.body, "salesPersonRate", json.salesPerson.rate);
  jQuery.data(document.body, "salesPersonCost", json.salesPerson.cost);

  // total rates
  jQuery.data(document.body, "totalRate", json.junior.rate * json.junior.quantity + json.consultant.rate * json.consultant.quantity + json.senior.rate * json.senior.quantity);
  jQuery.data(document.body, "totalSalesRate", json.salesPerson.rate * json.salesPerson.quantity);

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
  $("#projectValue").text(Formatter.format(json.project.value));
  $("#projectProgress").text(0 + " / " + json.project.effort);

});

// call when document is ready
$(document).ready(function() {
    return;
});