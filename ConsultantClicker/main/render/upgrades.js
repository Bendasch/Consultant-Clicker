import { Formatter } from '../utils/utils.js'
import { buyUpgrade } from '../logic/upgrades.js'

export const renderUpgradeButtons = () => {

    const body = $( "body" );
    const allUpgrades = body.data("upgrades");
    const balance = body.data("currentBalance");

    Object.keys(allUpgrades).forEach( (key) => {
        const upgrade = allUpgrades[key];
        if (upgrade.owned) {
            $("#" + upgrade.id).removeClass("not-owned");
            $("#" + upgrade.id).addClass("owned");
        } else {
            $("#" + upgrade.id).removeClass("owned");
            $("#" + upgrade.id).addClass("not-owned");
        }

        if (upgrade.cost <= balance && !(upgrade.owned)) {
            enableUpgradeButton(upgrade.id);
        } else {
            disableButton("#" + upgrade.id);
        } 
    });
}
  
const enableUpgradeButton = (upgradeId) => {   
    $("#" + upgradeId).unbind().click(() => buyUpgrade(upgradeId)); 
    $("#" + upgradeId).removeClass("disabled");
    $("#" + upgradeId).addClass("enabled");
}

const disableButton = (selector) => {
    $(selector).unbind();
    $(selector).removeClass("enabled");
    $(selector).addClass("disabled");
}

export const addUpgradeRow = (upgrade) => {

    // row 
    const oRow = $("<div id='" + upgrade.id + "' class='upgradeRow'></div>");
    $("#upgradeTable").append(oRow);

    // cells
    oRow.append("<div id='" + upgrade.id + "-name' class='upgradeName'></div>");
    oRow.append("<div id='" + upgrade.id + "-description' class='upgradeDescription'></div>");
    oRow.append("<div id='" + upgrade.id + "-cost' class='upgradeCost'></div>");

    // values
    $("#" + upgrade.id + "-name").append('<p>' + upgrade.name + '</p>');
    $("#" + upgrade.id + "-description").append('<p>' + upgrade.description + '</p>');
    $("#" + upgrade.id + "-cost").append('<p>' + Formatter.format(upgrade.cost) + '</p>');
}

