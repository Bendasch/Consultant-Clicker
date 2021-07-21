import { Formatter, FormatterDec, FormatterNoDec } from '../utils/utils.js'

export function renderStats() {

    const body = $( "body" );

    // earnings
    $("#totalEarnings").text(Formatter.format(body.data("totalEarnings")));
    $("#currentBalance").text(Formatter.format(body.data("currentBalance")));

    // total rates
    $("#rate").text(body.data( "totalRate" ));  
    $("#totalSalesRate").text((body.data("totalSalesRate")*100).toFixed(2) + " %");


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
}

export const renderCashews = () => {
    $("#cashews").text(FormatterNoDec.format($("body").data("currentBalance")));
};