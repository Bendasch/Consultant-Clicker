import { trelloCardSuccess, resetTrelloPopup } from './render.js';

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

export const FormatterDec =  new Intl.NumberFormat('de-DE', {
    style: 'decimal'
});

export function normRand(from=0, to=1) {

    const offset = 3;
    const scale = 1/6;

    // get two uniformly distributed variables
    var rand = [Math.random(), Math.random()];

    // box-muller transform them and calculate their mean
    rand = boxMullerTransform(rand);
    var normRand = (rand[0] + rand[1]) / 2;

    // restrict their range to the specified bounds
    // if no bounds are specified, this defaults
    // to a normal distribution with mean=0.5 and var=1/36
    normRand = (normRand + (offset + from)) * (scale * to);
    if (normRand < from) {normRand = from;}
    if (normRand > to) {normRand = to;}

    return normRand;
}

function boxMullerTransform([u1,u2]) {
    var v1, v2;
    v1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    v2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    return [v1, v2];
}

// creates a trello card
export function createTrelloCard(event) {
  
    // button    
    var button = $("#trelloSend");
    var buttonState = button.text();

    if (buttonState == "Create issue") {

        var cardName =  $("#trelloName").val();
        var cardDescription = $("#trelloDescr").val();
    
        console.log(`Name: ${cardName}`);
        console.log(`Description: ${cardDescription}`);
    
        const url = "https://api.trello.com/1/cards";
        const label = "60e9ca86d66e2e1822939642";
        const listId = "60c11c4faec7d254b90f6a5b";
        const key = "fbd9d0099d94233747a9b62f70741bef";
        const token = "a84f11d8ce5f5ad43679748f661b9879023a94f15f5ee94563fbc9a86c6a3f68";
    
        const endpoint = url + "?key=" + key
                             + "&token=" + token 
                             + "&idList=" + listId 
                             + "&idLabels=" + label 
                             + "&name=" + cardName
                             + "&desc=" + cardDescription;

        $.ajax({ 
            url: endpoint, 
            method: 'POST'
        }).done( (jqXHR, textStatus, errorThrown) => {
            if (textStatus == "success") {
                trelloCardSuccess();
            }
        })   

    } else if (buttonState == "Issue created") {
        resetTrelloPopup();
    }
}