import { isUpgradeOwned } from '../logic/upgrades.js'
import { destroyTooltip } from './achievements.js'

export const bindTabButtons = () => {
  $("#upgradeTab").unbind().click((event) => {toggleTab(event, "upgrades")});
  setStaffTab();
  $("#statsTab").unbind().click((event) => {toggleTab(event, "stats")});
  $("#achievementTab").unbind().click((event) => {toggleTab(event, "achievements")});
  //$("#logTab").unbind().click((event) => {toggleTab(event, "log")})
  $("#settingsTab").unbind().click((event) => {toggleTab(event, "settings")})
}

const toggleTab = (event, tabId) => {

    // start by destroying any tooltip that is currently shown
    destroyTooltip()

    var i, tabcontent, tablinks;
    
    var isActive = $(event.currentTarget).hasClass("active");

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
    var menu =  $("#menu");
    if (!isActive) {
        document.getElementById(tabId).style.display = "block";
        menu.css("display", "block");
        event.currentTarget.className = event.currentTarget.className.replace(" inactive", " active");
    } else {
        menu.css("display", "none");
    }
}

export const setStaffTab = () => {
  var staffTab = $("#staffTab")   
  if (isUpgradeOwned("staffUpgrade")) {
    staffTab.removeClass("disabled")
    staffTab.unbind().click((event) => {toggleTab(event, "staff")})
  } else {
    staffTab.addClass("disabled")
    staffTab.unbind()
  }
}