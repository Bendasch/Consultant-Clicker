import {
  setProgressBar
} from "./animation.js"

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

export function updateProject(tick) {

  // get rate
  var iRate = jQuery.data( document.body, "totalRate");

  // get stats of the current project
  var iEffort = jQuery.data(document.body, "projectEffort");
  if (iEffort <= 0) {return;} // currently there is no active project
  var iProgress = jQuery.data(document.body, "projectProgress");

  // calculate the progress of the projects
  // the rates are per second, the tick rate is in milliseconds
  // e.g. tick = 250 means that we have to devide by 4
  var iNewProgress = iProgress + (tick/1000) * iRate;

  // update the progress
  // update the earnings if 
  if (iNewProgress >= iEffort) {

    var projectValue = jQuery.data(document.body, "projectValue");

    // add the project value to the earnings and balance
    addToBalance(projectValue);

    // display a success message
    logAction("Project finished! Earned " + projectValue.toFixed(2) + "€.");

    // reset the current project
    // 1) saved stats
    jQuery.data(document.body, "projectValue", 0);
    jQuery.data(document.body, "projectEffort", 0);
    jQuery.data(document.body, "projectProgress", 0);

    // 2) interface
    $("#projectValue").text("there is no active project");
    $("#projectProgress").text("0 / 0");
    setProgressBar(0, 1);

  } else {

    // update the project
    // 1) save progress
    jQuery.data(document.body, "projectProgress", iNewProgress);

    // 2) update progress display
    $("#projectProgress").text(iNewProgress + " / " + iEffort);
    setProgressBar(iNewProgress, iEffort);
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
  if (iTotalSalesRate < iRand) {
    logAction("Project proposal failed! Total Sales Rate < " + iRand.toFixed(5) + ".");  
    return;
  } 

  // in this case get further random numbers to determine the value and effort
  var iProjectValue = Math.random() * 45000;
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

export function addToBalance(val) {

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
  $("#totalSalesRate").text(iTotalSalesRate*100 + " %");
  $("#salesMeter").height(200*iTotalSalesRate);
}

export function logAction(str) {

  const logBox = $("#logBox");
  const d = new Date()
  var time = String(d.getHours()).padStart(2,0) + ":" + String(d.getMinutes()).padStart(2,0) + ":" + String(d.getSeconds()).padStart(2,0);
  logBox.append("<p>" + time + " - " + str + "</p>");

  // scroll down animation
  logBox.animate({scrollTop: logBox.prop("scrollHeight")}, 500);
}

export function openTab(event, tabId) {

  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", " inactive");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabId).style.display = "block";
  event.currentTarget.className = event.currentTarget.className.replace(" inactive", " active");;
}