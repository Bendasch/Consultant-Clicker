import { render, openTab, logAction, addEquipmentRow, popup } from './render.js';
import { officeClick } from './base.js';
import { createTrelloCard } from './utils.js';

export function initialize() {

  $(document).ready(function() {

    // bind event handlers to navbar
    $("#statsTab").on("click", (event) => {openTab(event, "stats")});
    $("#staffTab").on("click", (event) => {openTab(event, "staff")});
    $("#equipmentTab").on("click", (event) => {openTab(event, "equipment")});
    $("#log").on("click", (event) => {openTab(event, "logBox")})

    // trello popup
    $("#trelloButton").on("click", (event) => {popup("#trello")});
    $("#trelloSend").on("click", (event) => {createTrelloCard(event)});
  });

  // initialize data
  var json = window.localStorage.getItem("CONS_CLICKER") || null;
  if (json) { 
    logAction("Welcome to Consultant Clicker!");
    logAction("");
    const p = new Promise((resolve, reject) => {  init(JSON.parse(json)); resolve(); }); return p;
  } else {
    logAction("Welcome to Consultant Clicker!");
    logAction("Select a project to start the game.");
    logAction("Good luck!");
    logAction("");
    return fetch("./data/init.json").then( response => response.json() ).then( json => { init(json); });
  }
}

function init(json) {

  const body = $("body");

  body.data("project", json.project);
  body.data("projects", json.projects);

  body.data("junior", json.junior);
  body.data("consultant", json.consultant);
  body.data("senior", json.senior);
  body.data("salesPerson", json.salesPerson);

  body.data("totalEarnings", json.totalEarnings);
  body.data("currentBalance", json.currentBalance);
  body.data("totalRate", json.totalRate);
  body.data("totalSalesRate", json.totalSalesRate);

  body.data("clicking", json.clicking);

  // initialize the office buttons
  var oButtons = json.buttons;
  Object.keys(oButtons).forEach( (buttonId) => {
      $("#" + buttonId).unbind().click((event) => officeClick(event, buttonId)); 
  });
  body.data("buttons", oButtons);

  // initialize equipments
  var oAllEquips = json.equipment;
  body.data("equipment", oAllEquips);
  Object.keys(oAllEquips).forEach( (key) => {
    var oEquip = oAllEquips[key];
    addEquipmentRow(oEquip);
  });

  render();
}