export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

export const getRandomProjectName = async () => {

    const url = "/api/namegen";
    
    var data = await $.ajax({ 
        url: url, 
        method: 'GET',
        dataType: 'json', 
        async: true
    }).catch((e)=>{
        console.error('Name generation error!')
        console.log(e)
    })       
    var name = data.company || "Random Company"
    return name
}

export function setTime(type, value) {
    const T_NOW = (new Date()).getTime(); 
    if (type == "update") { $("#updateTime").text("Update time: " + (T_NOW - value) + "ms"); return}
    if (type == "render") { $("#renderTime").text("Render time: " + (T_NOW - value) + "ms"); return}
    if (type == "tick") { $("#tick").text("Tick rate: " + (1000 / value) + "Hz"); return}
} 