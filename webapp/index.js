import { 
  FormatterNoDec,
  Formatter,
  openTab
 } from './main/base.js';

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
  jQuery.data(document.body, "juniorSingular", json.junior.singular);
  jQuery.data(document.body, "juniorPlural", json.junior.plural);

  // consultants
  jQuery.data(document.body, "consultants", json.consultant.quantity);
  jQuery.data(document.body, "consultantRate", json.consultant.rate);
  jQuery.data(document.body, "consultantCost", json.consultant.cost);
  jQuery.data(document.body, "consultantSingular", json.consultant.singular);
  jQuery.data(document.body, "consultantPlural", json.consultant.plural);

  // seniors
  jQuery.data(document.body, "seniors", json.senior.quantity);
  jQuery.data(document.body, "seniorRate", json.senior.rate);
  jQuery.data(document.body, "seniorCost", json.senior.cost);
  jQuery.data(document.body, "seniorSingular", json.senior.singular);
  jQuery.data(document.body, "seniorPlural", json.senior.plural);

  // sales
  jQuery.data(document.body, "salesPersons", json.salesPerson.quantity);
  jQuery.data(document.body, "salesPersonRate", json.salesPerson.rate);
  jQuery.data(document.body, "salesPersonCost", json.salesPerson.cost);
  jQuery.data(document.body, "salesPersonSingular", json.salesPerson.singular);
  jQuery.data(document.body, "salesPersonPlural", json.salesPerson.plural);

  // total rates
  var totalRate = json.junior.rate * json.junior.quantity + json.consultant.rate * json.consultant.quantity + json.senior.rate * json.senior.quantity;
  var totalSalesRate = json.salesPerson.rate * json.salesPerson.quantity;
  jQuery.data(document.body, "totalRate", totalRate);
  jQuery.data(document.body, "totalSalesRate", totalSalesRate);

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

  // rates
  $("#rate").text(totalRate);
  $("#totalSalesRate").text(totalSalesRate*100 + " %");
});

// initialize the log
$("#logBox").text("Welcome to Consultant Clicker!");
$("#logBox").append("<p>Good luck!</p>")
$("#logBox").append("<p>-------------</p>")

// call when document is ready
$(document).ready(function() {
  // bind event handlers to navbar
  $("#statsTab").on("click", (event) => {openTab(event, "stats")});
  $("#shopTab").on("click", (event) => {openTab(event, "shop")});
});

