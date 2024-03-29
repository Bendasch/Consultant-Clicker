import { Formatter, FormatterDec, FormatterNoDec } from '../utils/utils.js'

export function renderStats() {

    const body = $( "body" );

    // earnings
    $("#totalEarnings").text(FormatterNoDec.format(body.data("totalEarnings")));
    $("#currentBalance").text(FormatterNoDec.format(body.data("currentBalance")));

    // total rates
    $("#rate").text(FormatterDec.format(body.data("totalRate")));  
    $("#totalSalesRate").text((body.data("totalSalesRate")*100).toFixed(2) + "%");


    const oClicking = body.data("clicking");

    $("#clickingRate").text(
        FormatterDec.format(oClicking.value)
    );
    
    $("#totalClickProgress").text(
        FormatterDec.format(oClicking.totalProgress)
    );
    
    $("#totalClicks").text(
        FormatterDec.format(oClicking.clicks)
    );

    $("#totalProjectsFinished").text(
        FormatterDec.format(body.data("projectMeta").totalProjectsFinished)
    );

    $("#totalProgress").text(
        FormatterDec.format(body.data("totalProgress"))
    );
}

export const renderCashews = () => {
    $("#cashews").text(FormatterNoDec.format($("body").data("currentBalance")));
};