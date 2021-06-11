import { render, openTab, logAction, addEquipmentRow } from './render.js';
import { officeClick } from './base.js';

export function initialize() {

  const body = $( "body" );

  // initialize the log
  logAction("Welcome to Consultant Clicker!");
  logAction("Select a project to start the game.");
  logAction("Good luck!");
  logAction("");

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

    // clicking
    body.data("clicking", json.clicking);

    // initialize the office buttons
    var oButtons = json.buttons;
    Object.keys(oButtons).forEach( (buttonId) => {
        $("#" + buttonId).unbind().click(() => officeClick(buttonId)); 
    });
    body.data("buttons", oButtons);

    // initialize equipments
    var oAllEquips = json.equipment;
    body.data("equipment", oAllEquips);
    Object.keys(oAllEquips).forEach( (key) => {
      var oEquip = oAllEquips[key];
      addEquipmentRow(oEquip);
    });

    // initialize current projects
    body.data("projects", json.projects);

    // render everything
    render();
  });
}