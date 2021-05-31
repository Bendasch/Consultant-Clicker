export const FormatterNoDec = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const Formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
});

export function updateRandomizer(iRand) {
  var iHeight = 100 * ( 1 - iRand);
  var iMarginTop = 200 - 2 * iHeight;
  $('#randomizer').height(iHeight+"%");
  $('#randomizer').css('margin-top',iMarginTop+"%");
};

export function updateColor(iEffort, iProgress) {

  // get circles
  var oCircTR = $('#circleTR');
  var oCircBR = $('#circleBR');
  var oCircBL = $('#circleBL');
  var oCircTL = $('#circleTL');

  // no project, clear everything
  if (iEffort==0) {
    oCircTR.removeClass("white");
    oCircBR.removeClass("white");
    oCircBL.removeClass("white");
    oCircTL.removeClass("white");
    oCircTR.addClass("dark");
    oCircBR.addClass("dark");
    oCircBL.addClass("dark");
    oCircTL.addClass("dark");
    return;
  }

  // calculate fraction of the project that is finished
  var iFraction = iProgress / iEffort;
  
  // color circles according to what has been finished
  if (iFraction < .25) {    
  
    oCircTR.removeClass("dark");
    oCircBR.removeClass("dark");
    oCircBL.removeClass("dark");
    oCircTL.removeClass("dark");

    oCircTR.addClass("white");
    oCircBR.addClass("white");
    oCircBL.addClass("white");
    oCircTL.addClass("white");

  } else if (iFraction < .5) {

    oCircTR.removeClass("white");
    oCircBR.removeClass("dark");
    oCircBL.removeClass("dark");
    oCircTL.removeClass("dark");

    oCircTR.addClass("dark");
    oCircBR.addClass("white");
    oCircBL.addClass("white");
    oCircTL.addClass("white");

  } else if (iFraction < .75) {

    oCircTR.removeClass("white");
    oCircBR.removeClass("white");
    oCircBL.removeClass("dark");
    oCircTL.removeClass("dark");

    oCircTR.addClass("dark");
    oCircBR.addClass("dark");
    oCircBL.addClass("white");
    oCircTL.addClass("white");

  } else if (iFraction < 1) {

    oCircTR.removeClass("white");
    oCircBR.removeClass("white");
    oCircBL.removeClass("white");
    oCircTL.removeClass("dark");

    oCircTR.addClass("dark");
    oCircBR.addClass("dark");
    oCircBL.addClass("dark");
    oCircTL.addClass("white");

  } else {

    oCircTR.removeClass("white");
    oCircBR.removeClass("white");
    oCircBL.removeClass("white");
    oCircTL.removeClass("white");

    oCircTR.addClass("dark");
    oCircBR.addClass("dark");
    oCircBL.addClass("dark");
    oCircTL.addClass("dark");
  }
};

export function updateProject(tick) {

  // get rate
  var iRate = jQuery.data( document.body, "totalRate");

  // get stats of the current project
  var iEffort = jQuery.data(document.body, "projectEffort");
  var iProgress = jQuery.data(document.body, "projectProgress");

  // calculate the progress of the projects
  // the rates are per second, the tick rate is in milliseconds
  // e.g. tick = 250 means that we have to devide by 4
  var iNewProgress = iProgress + (tick/1000) * iRate;

  // update the progress
  // update the earnings if 
  if (iEffort > 0 && iNewProgress >= iEffort) {

    // add the project value to the earnings and balance
    updateEarnings(jQuery.data(document.body, "projectValue"));

    // reset the current project
    // 1) saved stats
    jQuery.data(document.body, "projectValue", 0);
    jQuery.data(document.body, "projectEffort", 0);
    jQuery.data(document.body, "projectProgress", 0);

    // 2) interface
    $("#projectValue").text("");
    $("#projectProgress").text("0 / 0");

  } else {

    // update the project
    // 1) save progress
    jQuery.data(document.body, "projectProgress", iNewProgress);

    // 2) update progress display
    $("#projectProgress").text(iNewProgress + " / " + iEffort);
  }
};

export function findProject(tick, cycle) {

  // if there is a current project, we don't need to find one 
  if  (jQuery.data(document.body, "projectValue") !== 0) {
    return;
  }
  
  // try to find a project every x seconds
  var x = 1;
  var iFrequency = (1000 / tick) * x;
  if (cycle % iFrequency !== 0) {
    return;
  }

  // get the current sales rate
  var iTotalSalesRate = jQuery.data(document.body, "totalSalesRate");

  // get a random number between 0 and 1
  // if the total sales rate is greater than the random number, we get a project
  var iRand = Math.random();
  updateRandomizer(iRand);
  if (iTotalSalesRate < iRand) {
    logAction("Project proposal failed! Total Sales Rate < " + iRand.toFixed(5) + ".");  
    return;
  } 

  // in this case get further random numbers to determine the value and effort
  // projects value (multiply by 45.000)
  var iProjectValue = Math.random() * 45000;
  // project effort (multiply by 5.000)
  var iProjectEffort = Math.round(Math.random() * 7500);

  // save this value
  jQuery.data(document.body, "projectValue", iProjectValue);
  jQuery.data(document.body, "projectEffort", iProjectEffort);

  // update the display
  $("#projectValue").text(Formatter.format(iProjectValue));
  $("#projectProgress").text(0 + " / " + iProjectEffort);

  // output success message
  logAction("Project proposal successful! Project value " + iProjectValue.toFixed(2) + "€ (effort " + iProjectEffort + ").");
};

export function updateEarnings(val) {

  // get old total earnings & current balance
  var iOldEarnings = jQuery.data(document.body, "totalEarnings");
  var iOldBalance = jQuery.data(document.body, "currentBalance");

  // add the value to each total
  var iNewEarnings = iOldEarnings + val;
  var iNewBalance = iOldBalance + val;

  // save new earnings & balance values
  jQuery.data(document.body, "totalEarnings", iNewEarnings);
  jQuery.data(document.body, "currentBalance", iNewBalance);

  // display new values (rounded and clipped to two decimals)
  $("#totalEarnings").text(Formatter.format(iNewEarnings));
  $("#currentBalance").text(Formatter.format(iNewBalance));

  // display a success message
  logAction("Project finished! Earned " + val.toFixed(2) + "€.");
};

export function updateRate() {

  // get rates
  var iJuniorRate = jQuery.data( document.body, "juniorRate");
  var iConsultantRate = jQuery.data( document.body, "consultantRate");
  var iSeniorRate = jQuery.data( document.body, "seniorRate");
  var iSalesPersonRate = jQuery.data( document.body, "salesPersonRate");

  // get counts  
  var iJuniors = jQuery.data( document.body, "juniors");
  var iConsultants = jQuery.data( document.body, "consultants");
  var iSeniors = jQuery.data( document.body, "seniors");
  var iSalesPersons = jQuery.data( document.body, "salesPersons");

  // calculate new rates
  var iTotalRate = iJuniorRate * iJuniors + iConsultantRate * iConsultants + iSeniorRate * iSeniors;
  var iTotalSalesRate = iSalesPersonRate * iSalesPersons;

  // save the new rates
  jQuery.data(document.body, "totalRate", iTotalRate);
  jQuery.data(document.body, "totalSalesRate", iTotalSalesRate);

  // display new value (rounded and clipped to two decimals)
  $("#rate").text(iTotalRate);  
  $("#salesMeter").height(200*iTotalSalesRate);
}

export function subtractBalance(val) {
  var iOldBalance = jQuery.data(document.body, "currentBalance");
  jQuery.data(document.body, "currentBalance", iOldBalance - val);
}

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

function logAction(str) {
  const d = new Date()
  var time = String(d.getHours()).padStart(2,0) + ":" + String(d.getMinutes()).padStart(2,0) + ":" + String(d.getSeconds()).padStart(2,0);
  $("#logBox").append("<p>" + time + " - " + str + "</p>");
  $("#logBox").animate({scrollTop: $("#logBox").prop("scrollHeight")}, 1000);
}