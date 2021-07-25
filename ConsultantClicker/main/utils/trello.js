export function createTrelloCard() {
  
    var button = $("#trelloSend");
    var buttonState = button.text();

    if (buttonState == "Create issue") {

        var cardName =  encodeURIComponent($("#trelloName").val());
        var cardDescription = encodeURIComponent($("#trelloDescr").val());
        
        const endpoint = "/api/trello?name=" + cardName + "&description=" + cardDescription; 

        $.ajax({ 
            url: endpoint, 
            method: 'POST'
        }).done( (jqXHR, textStatus, errorThrown) => {
            if (jqXHR == "success") {
                trelloCardSuccess();
            }
        })   

    } else if (buttonState == "Issue created") {
        resetTrelloPopup();
    }
}

export function trelloCardSuccess() {
    var button = $("#trelloSend");
    button.css("background-color", "#06d280");
    button.text("Issue created");
    $("#trelloName").prop("disabled", true);
    $("#trelloDescr").prop("disabled", true);
}

export function resetTrelloPopup() {

    // reset button
    var button = $("#trelloSend");
    button.css("background-color", "brown");
    button.text("Create issue");    

    // reset name
    var nameInput = $("#trelloName");
    nameInput.prop("disabled", false);
    nameInput.val("");

    // reset description
    var descArea = $("#trelloDescr");
    descArea.prop("disabled", false);
    descArea.val("");
}

// toggles the popup with the parent div #<domId>
// the default display is 'inline'
export function popup(domId, display="inline") {

    var main = $(domId);
    var state;
    (main.css("display") == "none") ? state = display : state = "none";
    main.css("display", state);
}

export const bindTrelloButtons = () => {
    $("#trelloButton").unbind().click(() => {popup("#trello")})
    $("#trelloSend").unbind().click((event) => {createTrelloCard(event)})
}