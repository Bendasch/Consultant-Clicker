import {
  addToBalance,
  logAction
} from './base.js' 

export function addResource(type,num) {

  var sData, sOutSingular, sOutPlural, iCosts;

  switch (type) {
  
    case "JUNIOR": {
      sData = "juniors";
      sOutSingular = jQuery.data(document.body, "juniorSingular");
      sOutPlural = jQuery.data(document.body, "juniorPlural");
      iCosts = num * jQuery.data(document.body, "juniorCost");
    } break;   

    case "CONSULTANT": {
      sData = "consultants";
      sOutSingular = jQuery.data(document.body, "consultantSingular");
      sOutPlural = jQuery.data(document.body, "consultantPlural");
      iCosts = num * jQuery.data(document.body, "consultantCost");
    } break;   

    case "SENIOR": {
      sData = "seniors";
      sOutSingular = jQuery.data(document.body, "seniorSingular");
      sOutPlural = jQuery.data(document.body, "seniorPlural");
      iCosts = num * jQuery.data(document.body, "seniorCost");
    } break;   

    case "SALESPERS": {
      sData = "salesPersons";
      sOutSingular = jQuery.data(document.body, "salesPersonSingular");
      sOutPlural = jQuery.data(document.body, "salesPersonPlural");
      iCosts = num * jQuery.data(document.body, "salesPersonCost");
    } break;   
  }

  // get current count
  var iCount = jQuery.data( document.body, sData);

  // set new count
  jQuery.data( document.body, sData, iCount + num);

  // update current balance
  addToBalance(-1 * iCosts);

  // update screen
  updateResourceCount(type,iCount + num);

  // log this
  if (num == 1) {
    logAction("1 " + sOutSingular +  " was added.");
  } else {
    logAction(snum + sOutPlural +  " were added.");
  }
}

export function updateResourceCount(type,num) {
  
  switch (type) {
    case "JUNIOR": {
      $("#juniorCount").text(num);
    } break;   

    case "CONSULTANT": {
      $("#consultantCount").text(num);
    } break;   

    case "SENIOR": {
      $("#seniorCount").text(num);
    } break;   

    case "SALESPERS": {
      $("#salesPersonCount").text(num);
    } break;   
  }

}

export function updateResourceButtons() {

  // get current balance
  var iBalance = jQuery.data(document.body, "currentBalance");

  // this should be more dynamic later on
  // for now we hard-check junior, consultant and senior
  var iJuniorCost = jQuery.data(document.body, "juniorCost");
  var iConsultantCost = jQuery.data(document.body, "consultantCost");
  var iSeniorCost = jQuery.data(document.body, "seniorCost");
  var iSalesPersonCost = jQuery.data(document.body, "salesPersonCost");

  // check which buttons to active/deactive
  (iJuniorCost <= iBalance) ? enableButton("#juniorButton", "JUNIOR") : disableButton("#juniorButton");
  (iConsultantCost <= iBalance) ? enableButton("#consultantButton", "CONSULTANT") : disableButton("#consultantButton");
  (iSeniorCost <= iBalance) ? enableButton("#seniorButton", "SENIOR") : disableButton("#seniorButton");
  (iSalesPersonCost <= iBalance) ? enableButton("#salesPersonButton", "SALESPERS") : disableButton("#salesPersonButton");
}

export function updateEquipmentButtons() {

  var balance = $("body").data("currentBalance");
  var oMonitor = $("body").data("secondMonitor");

  if (oMonitor.cost <= balance && !(oMonitor.owned)) {
    enableButton("#secondMonitor", null, true);
  } else {
    disableButton("#secondMonitor");
  } 
}

export function enableButton(sSelector, sResId=null, bEquip=false) {
  
  if (sResId != null && sResId != "") {
    $(sSelector).unbind().click(function(){
      addResource(sResId, 1);
    }); 
  } else if (bEquip) {
    $(sSelector).unbind().click(() => buyEquipment(sSelector)); 
  }

  $(sSelector).removeClass("disabled");
  $(sSelector).addClass("enabled");
}

export function disableButton(sSelector) {

  // disable button
  $(sSelector).unbind();

  // style
  $(sSelector).removeClass("enabled");
  $(sSelector).addClass("disabled");
}

function buyEquipment(sSelector) {

  var sEquipId = sSelector.substring(1, sSelector.length);
  var oEquip = jQuery.data(document.body, sEquipId);

  addToBalance(-1 * oEquip.cost);

  oEquip.owned = true;
  jQuery.data(document.body, sEquipId, oEquip);
  logAction("Bought equipment '" + oEquip.name + "'. Productivity increased!");

  $(sSelector).removeClass("not-owned");
  $(sSelector).removeClass("enabled");
  $(sSelector).addClass("owned");
} 