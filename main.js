let cheerio = require('cheerio');
let fs = require('fs');
let path = require('path');
let request = require('request');
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url,cbc);
function cbc(error,response,html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
            console.log("Page not Found!");
    }
    else{
        dataExtractor(html);
        // console.log(html);
    }
}
function dataExtractor(html){
    let searchTool = cheerio.load(html);
    let viewR = searchTool('a[data-hover="View All Results"]');
    let link = viewR.attr("href");
    // console.log(link);
    let fullLink = `https://www.espncricinfo.com${link}`;
    // console.log(fullLink);
    request(fullLink,newcb);
}
function newcb(error,response,html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
            console.log("Page not Found!");
    }
    else{
        let searchTool = cheerio.load(html);
        let matchLinks = searchTool('a[data-hover="Scorecard"]');
        // console.log(scoreLink.length);
       
        for(let i=0;i<matchLinks.length;i++){
            let perMatchLink = searchTool(matchLinks[i]);
            let everyMatchUrl = perMatchLink.attr("href");
            // console.log("``````````````````````````````");
            let fullUrl = `https://www.espncricinfo.com${everyMatchUrl}`;
            // console.log(fullUrl);
            request(fullUrl,matchLinkExtractor);
        }
    }
}
function matchLinkExtractor(error,response,html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
            console.log("Page not Found!");
    }
    else{
        let searchTool = cheerio.load(html);
        // let teamName = searchTool(".name-link>p");
        // for(let i=0;i<teamName.length;i++){
        //     let team = searchTool(teamName[i]).text();
        //     console.log(team);
            
        // }
        let innings = searchTool(".card.content-block.match-scorecard-table>.Collapsible");
        //console.log(result);
        // console.log("```````````````````````");
        for(let i = 0;i<innings.length;i++){
            let teamName = searchTool(innings[i]).find("h5").text();
            teamName = teamName.split("INNINGS")[0].trim();
            let oppIndex = i ==0 ? 1 : 0;
            let oppName = searchTool(innings[oppIndex]).find("h5").text();
            oppName = oppName.split("INNINGS")[0].trim();
            console.log("````````````````````````");
            console.log();
            console.log(`${teamName} vs ${oppName}` );
            console.log();
            
            let currentInning = searchTool(innings[i]);
            let rows = currentInning.find(".table.batsman tbody tr")
            for (let j = 0; j < rows.length; j++) {
                let cols = searchTool(rows[j]).find("td");
                //let isValid = searchTool(cols[0]).hasClass("batsman-cell");
                if (cols.length==8) {
                    // console.log(cols.text());
                    //       Player  runs balls fours sixes sr 
                    let playerName = searchTool(cols[0]).text().trim();
                    let runs = searchTool(cols[2]).text().trim();
                    let balls = searchTool(cols[3]).text().trim();
                    let fours = searchTool(cols[5]).text().trim();
                    let sixes = searchTool(cols[6]).text().trim();
                    let sr = searchTool(cols[7]).text().trim();
                     console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                }
            }

        }

    }
}