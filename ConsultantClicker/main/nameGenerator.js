export function getRandomProjectName() {

    const url = "/api/namegen";
    
    return $.ajax({ 
        url: url, 
        method: 'GET',
        dataType: 'json', 
        async: true
    })   
}