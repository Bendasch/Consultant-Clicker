import {
  subtractBalance,
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
    subtractBalance(iCosts);
  
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
    (iJuniorCost <= iBalance) ? enableButton("#juniorButton") : disableButton("#juniorButton");
    (iConsultantCost <= iBalance) ? enableButton("#consultantButton") : disableButton("#consultantButton");
    (iSeniorCost <= iBalance) ? enableButton("#seniorButton") : disableButton("#seniorButton");
    (iSalesPersonCost <= iBalance) ? enableButton("#salesPersonButton") : disableButton("#salesPersonButton");
  }
  
  export function enableButton(sId) {
    
    switch (sId) {
  
      case "#juniorButton": {
  
        // add 1 junior
        $("#juniorButton").unbind().click(function(){
            addResource("JUNIOR", 1);
        }); 
  
        // style
        $("#juniorButton").removeClass("disabled");
        $("#juniorButton").addClass("enabled");
  
      } break;   
  
      case "#consultantButton": {
  
        // add 1 consultant
        $("#consultantButton").unbind().click(function(){
            addResource("CONSULTANT", 1);
        }); 
  
        // style
        $("#consultantButton").removeClass("disabled");
        $("#consultantButton").addClass("enabled");
  
      } break;   
  
      case "#seniorButton": {
  
        // add 1 senior
        $("#seniorButton").unbind().click(function(){
            addResource("SENIOR", 1);
        }); 
  
        // style
        $("#seniorButton").removeClass("disabled");
        $("#seniorButton").addClass("enabled");
  
      } break;   
  
      case "#salesPersonButton": {
  
        // add 1 senior
        $("#salesPersonButton").unbind().click(function(){
            addResource("SALESPERS", 1);
        }); 
  
        // style
        $("#salesPersonButton").removeClass("disabled");
        $("#salesPersonButton").addClass("enabled");
  
      } break;   
    }
  }
  
  export function disableButton(sId) {
  
    switch (sId) {
  
      case "#juniorButton": {
  
        // disable button
        $("#juniorButton").unbind();
  
        // style
        $("#juniorButton").removeClass("enabled");
        $("#juniorButton").addClass("disabled");
  
      } break;   
  
      case "#consultantButton": {
  
        // disable button
        $("#consultantButton").unbind();
  
        // style
        $("#consultantButton").removeClass("enabled");
        $("#consultantButton").addClass("disabled");
  
      } break;   
  
      case "#seniorButton": {
  
        // disable button
        $("#seniorButton").unbind();
  
        // style
        $("#seniorButton").removeClass("enabled");
        $("#seniorButton").addClass("disabled");
        
      } break;   
  
      case "#salesPersonButton": {
  
        // add 1 senior
        $("#salesPersonButton").unbind();
  
        // style
        $("#salesPersonButton").removeClass("enabled");
        $("#salesPersonButton").addClass("disabled");
  
      } break;   
    }
  }