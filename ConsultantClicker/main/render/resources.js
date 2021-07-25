import { FormatterNoDec } from '../utils/utils.js'
import { addResource } from '../logic/resources.js'

export const renderConsultants = () => {

    const consultants = $("body").data("consultants");

    Object.keys(consultants).forEach( key => {
        const consultant = consultants[key]
        $(`#${key}Count`).text(consultant.quantity)
        $(`#${key}Rate`).text("× " + consultant.rate)
        $(`#${key}Cost`).text("-" + FormatterNoDec.format(consultant.cost))
    })
}

export const renderSales = () => {
    
    const sales = $("body").data("sales");

    Object.keys(sales).forEach(key => {
        const salesMember = sales[key]
        $(`#${key}Count`).text(salesMember.quantity);
        $(`#${key}Rate`).text((salesMember.rate*100).toFixed(2) + " %");
        $(`#${key}Cost`).text("-" + FormatterNoDec.format(salesMember.cost));
    })
}

export function renderResourceButtons() {

    const body = $( "body" );
    const balance = body.data( "currentBalance")
    
    // consultants     
    const consultants = body.data("consultants")
    Object.keys(consultants).forEach( key => {
        const consultant = consultants[key];
        if (consultant.cost <= balance) { 
            enableResButton(`#${key}Button`, "consultants", key)
        } else {
            disableButton(`#${key}Button`)
        } 
    })

    // sales
    const sales = body.data("sales")
    Object.keys(sales).forEach( key => {
        const salesMember = sales[key];
        if (salesMember.cost <= balance) { 
            enableResButton(`#${key}Button`, "sales", key)
         } else {
            disableButton(`#${key}Button`)
         } 
    })
}

const enableResButton = (selector, category, resId) => {   
    $(selector).unbind().click(() => addResource(category, resId)); 
    $(selector).removeClass("disabled");
    $(selector).addClass("enabled");
}

const disableButton = (selector) => {
    $(selector).unbind();
    $(selector).removeClass("enabled");
    $(selector).addClass("disabled");
}