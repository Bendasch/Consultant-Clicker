import { render, openTab, logAction } from './render.js';

export function initialize() {

  const body = $( "body" );

  // initialize the log
  logAction("Welcome to Consultant Clicker!");
  logAction("Good luck!")
  logAction("-----------------------------------------")

  $(document).ready(function() {

    // bind event handlers to navbar
    $("#statsTab").on("click", (event) => {openTab(event, "stats")});
    $("#staffTab").on("click", (event) => {openTab(event, "staff")});
    $("#equipmentTab").on("click", (event) => {openTab(event, "equipment")});
  });

  // initialize data
  return fetch("./data/init.json").then( response => response.json() ).then( json => {

    // project data
    body.data( "project", json.project);

    // staff data
    body.data("junior", json.junior);
    body.data("consultant", json.consultant);
    body.data("senior", json.senior);
    body.data("salesPerson", json.salesPerson);

    // stats
    body.data("totalEarnings", 0);
    body.data("currentBalance", 0);
    var totalRate = json.junior.rate * json.junior.quantity + json.consultant.rate * json.consultant.quantity + json.senior.rate * json.senior.quantity;
    var totalSalesRate = json.salesPerson.rate * json.salesPerson.quantity;
    body.data("totalRate", totalRate);
    body.data("totalSalesRate", totalSalesRate);

    // equipments
    var oEquip = json.equipment;
    Object.keys(oEquip).forEach( (key) => {
      $("body").data(key, oEquip[key]);
    });

    // render everything
    render();
  });
}