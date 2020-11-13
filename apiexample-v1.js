var showCounter = 0;


// initialize variables after page loads
window.onload = function () {
	closeLightBox();
	create_schedule();

	
	

} // window.onload




// get data from TV Maze
function fetchData() {
	document.getElementById("main").innerHTML = "";

	var search = document.getElementById("search_input").value;

	fetch('http://api.tvmaze.com/search/shows?q=' + search)
		.then(response => response.json())
		.then(data => updatePage(data));
} // window.onload 


// change the activity displayed 
function updatePage(data) {
	console.log("Update page : ");
	console.log(data);
	

	var tvshow;
	for (tvshow in data) {

		createTVShow(data[tvshow]);
	} // for

} // updatePage

// returns a string of formatted genres
function showGenres(genres) {
	var g;
	var output = "";
	for (g in genres) {
		output += genres[g] + ", ";
	}

	return output;
} // showGenres

// constructs one TV show entry on homepage
function createTVShow(tvshowJSON) {

	var elemMain = document.getElementById("main");
	elemMain.classList.add("result_container"); // add a class to apply css

	var elemDiv_portrait = document.createElement("div");
	elemDiv_portrait.classList.add("portrait_container"); // add a class to apply css

	var elemImage = document.createElement("img");

	var elemDivSummary = document.createElement("div");
	elemDivSummary.classList.add("show_summary"); // add a class to apply css

	var elemDivInfo = document.createElement("div");
	elemDivInfo.classList.add("show_info"); // add a class to apply css

	var elemShowTitle = document.createElement("h2");
	elemShowTitle.classList.add("show_title"); // add a class to apply css

	var elemSummaryText = document.createElement("div");
	elemSummaryText.classList.add("summary_text"); // add a class to apply css


	var elemSummaryEpisode = document.createElement("div");
	elemSummaryEpisode.classList.add("episode_container"); // add a class to apply css

	var elemSummaryInfoTitle = document.createElement("h2");
	elemSummaryInfoTitle.classList.add("summary_info_title"); // add a class to apply css

	var elemNetwork = document.createElement("h5");
	var elemSchedule = document.createElement("h5");
	var elemGenre = document.createElement("h5");
	var elemRating = document.createElement("h5");
	var elemOfficialSite = document.createElement("h5");









	// add JSON data to elements
	try {
		elemImage.src = tvshowJSON.show.image.medium;
		elemImage.alt = "IMAGE_OF_SHOW"
	}
	catch (err) {
		elemImage.src = "no-img-portrait-text.png";
		elemImage.alt = "IMAGE_OF_SHOW"
	}

	elemShowTitle.innerHTML = tvshowJSON.show.name;

	try {
		elemNetwork.innerHTML = "Network: " + tvshowJSON.show.network.name ;
	}
	catch (err) {
		elemNetwork.innerHTML = "Network: " + "n/a" + "";
	}

	elemSchedule.innerHTML = "Schedule: " + tvshowJSON.show.schedule.days + " @" + tvshowJSON.show.schedule.time ;
	elemGenre.innerHTML = "Genre:  " + tvshowJSON.show.genres ;
	elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average ;

	try {
		elemOfficialSite.innerHTML = "Official Site:  <a href=\"" + tvshowJSON.show.officialSite + "\">" + tvshowJSON.show.officialSite ;
	} catch (error) {
		elemOfficialSite.innerHTML = "Official Site: n/a ";
	}
	
	
	
	elemSummaryInfoTitle.innerHTML = "What's it about? "

	try {
		elemSummaryText.innerHTML = tvshowJSON.show.summary;
	}
	catch (err) {
		elemSummaryText.innerHTML = "Unfortunately	there is not any summary info available yet !"
	}



	// add elements to the div tag
	elemDivInfo.appendChild(elemShowTitle);
	elemDivInfo.appendChild(elemNetwork);
	elemDivInfo.appendChild(elemSchedule);
	elemDivInfo.appendChild(elemGenre);
	elemDivInfo.appendChild(elemRating);
	elemDivInfo.appendChild(elemOfficialSite);


	elemDivSummary.appendChild(elemSummaryInfoTitle);
	elemDivSummary.appendChild(elemSummaryText);

	elemDiv_portrait.appendChild(elemImage);




	//get id of show and add episode list
	var showId = tvshowJSON.show.id;
	fetchEpisodes(showId, elemSummaryEpisode);
	elemDivSummary.appendChild(elemSummaryEpisode);



	elemMain.appendChild(elemDiv_portrait);
	elemMain.appendChild(elemDivSummary);
	elemMain.appendChild(elemDivInfo);








} // createTVShow

// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemSummaryEpisode) {

	fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')
		.then(response => response.json())
		.then(data => showEpisodes(data, elemSummaryEpisode));

} // fetch episodes


// show episodes
function showEpisodes(data, elemSummaryEpisode) {
	console.log("Episodes: ");
	console.log(data);


	var epsElemButton = document.createElement("button");
	epsElemButton.classList.add("collapsible"); //add a class to apply css
	epsElemButton.innerHTML = "EPISODES";
	epsElemButton.type = "button";
	epsElemButton.addEventListener("click", function () {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.display === "block") {
			content.style.display = "none";
		} else {
			content.style.display = "block";
		}
	});



	var elemDivCollapse = document.createElement("div");
	elemDivCollapse.classList.add("collapse_content"); // add a class to apply css

	var eps_id = "-9999";
	var eps_name = "n/a";
	var eps_season;
	var eps_number;
	var eps_summary = "n/a";
	var eps_img_url = "no-img-portrait-text.png";




	var output = "";
	for (episode in data) {

		try { eps_id = data[episode].id; } catch (error) { eps_id = -9999; }
		try { eps_name = str_replace(data[episode].name); } catch (error) { eps_name = "n/a"; }
		try { eps_season = data[episode].season; } catch (error) { eps_season = "n/a"; }
		try { eps_number = data[episode].number; } catch (error) { eps_number = "n/a"; }
		try { eps_summary = str_replace(data[episode].summary); } catch (error) { eps_summary = "n/a"; }
		try { eps_img_url = data[episode].image.medium; } catch (error) { eps_img_url = "no-img-portrait-text.png" }



		output += "<li><a href='javascript:showLightBox(`" + eps_id + "`,`" + eps_name + "`,`" + eps_season + "`,`" + eps_number + "`,`" + eps_summary + "`,`" + eps_img_url + "`)'> " + eps_name + "</a></li>";


	}
	output = "<ol>" + output + "</ol>";


	elemDivCollapse.innerHTML = output;

	elemSummaryEpisode.appendChild(epsElemButton);
	elemSummaryEpisode.appendChild(elemDivCollapse);





} // showEpisodes


function showLightBox(l_id, l_name, l_season, l_number, l_summary, l_img_url) {
	var elemLbTitle = document.createElement("h3");
	elemLbTitle.classList.add("lightbox_title"); // add a class to apply css

	var elemLbEpisodeSeason = document.createElement("h3");
	elemLbEpisodeSeason.classList.add("lightbox_episode_season"); // add a class to apply css

	var elemLbText = document.createElement("h3");
	elemLbText.classList.add("lightbox_text"); // add a class to apply css






	elemLbTitle.innerHTML = l_name;
	elemLbEpisodeSeason.innerHTML = " (Season: " + l_season + " / Episode number: " + l_number + ")";
	elemLbText.innerHTML = l_summary;

	document.getElementById("M_RIGHT").innerHTML = "";
	var elemLbRight = document.getElementById("M_RIGHT");




	document.getElementById("lightbox").style.display = "block";
	//document.getElementById("message").innerHTML = l_id + l_name + l_season + l_number + l_summary +"<img src=" + l_img_url + ">" + "</img>";  

	document.getElementById("M_LEFT").innerHTML = "<img src= " + l_img_url + "></img>";
	elemLbRight.appendChild(elemLbTitle);
	elemLbRight.appendChild(elemLbEpisodeSeason);
	elemLbRight.appendChild(elemLbText);


} // showLightBox

// close the lightbox
function closeLightBox() {
	document.getElementById("lightbox").style.display = "none";
} // closeLightBox 





function str_replace(s) {
	var t = "";
	t = s;
	t = t.replace(/'/g, "&rsquo;");
	t = t.replace(/"/g, "&quot;");

	return t;

}







function display_shows (){

       
    fetch('http://api.tvmaze.com/shows?page=1')
		.then(response => response.json())
        .then(function(data) {
          
            var show;
            var temp = document.getElementById("main");
			temp.remove();

			var elemDivBodyMiddle = document.getElementById ("body_bar_middle");
			
			var elemMain = document.createElement ("div");
			elemMain.classList.add ( "shows_container");
			elemMain.setAttribute ( "ID",  "main");
            elemDivBodyMiddle.appendChild (elemMain);
                       
                        for (show in data) 
                            {

								var elemDiv = document.createElement ("div");
								elemDiv.classList.add ("show_card");
								var elemPElement = document.createElement ("p");
								
								var elemShowImage = document.createElement("img");
								
                                elemShowImage.src = data[show].image.medium;
								elemShowImage.alt = "IMAGE_OF_SHOW";
								elemShowImage.setAttribute ("onclick", "display_show_details("+data[show].id+ ");");
								elemPElement.innerHTML = data[show].name;
								
                                elemDiv.appendChild (elemShowImage);
								elemDiv.appendChild (elemPElement);
								
								elemMain.appendChild(elemDiv);
							
								
                              
                            }
                        }
        );

}



async function display_show_details(showId){

	url = "http://api.tvmaze.com/shows/" + showId + "?embed=cast";


	var temp = document.getElementById("main");
	temp.remove();

	var elemDivBodyMiddle = document.getElementById ("body_bar_middle");
	var elemMain = document.createElement ("div");
	elemMain.classList.add ( "show_details_container");
	elemMain.setAttribute ( "ID",  "main");
	elemDivBodyMiddle.appendChild (elemMain);


	var elemShowDetailsBar = document.createElement ("div");
	elemShowDetailsBar.classList.add ("item_show_details_bar");
	
	elemMain.appendChild (elemShowDetailsBar);
	

	var elemDivTabButton1 = document.createElement ("div");
	elemDivTabButton1.classList.add ("tab_button");
	var buttont1 = document.createElement ("button");
	buttont1.classList.add ("t_button");
	buttont1.classList.add ("w3-red");
	buttont1.setAttribute ("onclick", "openTab(event,'first-tab');");
	buttont1.innerHTML = "Main info";
	elemDivTabButton1.appendChild (buttont1);
	elemShowDetailsBar.appendChild (elemDivTabButton1);

	var elemDivTabButton2 = document.createElement ("div");
	elemDivTabButton2.classList.add ("tab_button");
	var buttont2 = document.createElement ("button");
	buttont2.classList.add ("t_button");
	buttont2.setAttribute ("onclick", "openTab(event,'second-tab');");
	buttont2.innerHTML = "Episodes";
	elemDivTabButton2.appendChild (buttont2);
	elemShowDetailsBar.appendChild (elemDivTabButton2);

	var elemDivTabButton3 = document.createElement ("div");
	elemDivTabButton3.classList.add ("tab_button");
	var buttont3 = document.createElement ("button");
	buttont3.classList.add ("t_button");
	buttont3.setAttribute ("onclick", "openTab(event,'third-tab');");
	buttont3.innerHTML = "Cast";
	elemDivTabButton3.appendChild (buttont3);
	elemShowDetailsBar.appendChild (elemDivTabButton3);

	var elemDivTabButton4 = document.createElement ("div");
	elemDivTabButton4.classList.add ("tab_button");
	var buttont4 = document.createElement ("button");
	buttont4.classList.add ("t_button");
	buttont4.setAttribute ("onclick", "openTab(event,'forth-tab');");
	buttont4.innerHTML = "Crew";
	elemDivTabButton4.appendChild (buttont4);
	elemShowDetailsBar.appendChild (elemDivTabButton4);

	/*
	var elemDivTabButton5 = document.createElement ("div");
	elemDivTabButton5.classList.add ("tab_button");
	var buttont5 = document.createElement ("button");
	buttont5.classList.add ("t_button");
	buttont5.setAttribute ("onclick", "openTab(event,'fifth-tab');");
	buttont5.innerHTML = "Further Images";
	elemDivTabButton5.appendChild (buttont5);
	elemShowDetailsBar.appendChild (elemDivTabButton5);
	*/

	var elemDivtabBodyT1 = document.createElement ("div");
	elemDivtabBodyT1.classList.add ("item_show_details_body");
	elemDivtabBodyT1.setAttribute ("id", "first-tab");
	elemDivtabBodyT1.style.display = "";

	var elemDivMainInfo = document.createElement ("div");
	elemDivMainInfo.classList.add ("mainInfo-container");

	var elemDivTabBodyLeftT1 = document.createElement ("div");
	elemDivTabBodyLeftT1.classList.add ("tb_left");

	var elemDivTabBodyMiddleT1 = document.createElement ("div");
	elemDivTabBodyMiddleT1.classList.add ("tb_middle");

	var elemDivTabBodyRightT1 = document.createElement ("div");
	elemDivTabBodyRightT1.classList.add ("tb_right");

	var elemDivTabBodyRightT1Header = document.createElement ("div");
	elemDivTabBodyRightT1Header.classList.add ("tb_right_header");
	elemDivTabBodyRightT1Header.innerHTML = "Further images"
	elemDivTabBodyRightT1.appendChild (elemDivTabBodyRightT1Header);


	

	elemDivMainInfo.appendChild (elemDivTabBodyLeftT1);
	elemDivMainInfo.appendChild (elemDivTabBodyMiddleT1);
	elemDivMainInfo.appendChild (elemDivTabBodyRightT1);
	elemDivtabBodyT1.appendChild (elemDivMainInfo);



	var elemDivtabBodyT2 = document.createElement ("div");
	elemDivtabBodyT2.classList.add ("item_show_details_body");
	elemDivtabBodyT2.setAttribute ("id", "second-tab");
	elemDivtabBodyT2.style.display = "none";
	var elemDivTabBodyLeftT2 = document.createElement ("div");
	elemDivTabBodyLeftT2.classList.add ("item_tab_body_left");
	
	var elemDivTabBodyMiddleT2 = document.createElement ("div");
	elemDivTabBodyMiddleT2.classList.add ("item_tab_body_middle");
	
	var elemDivTabBodyRightT2 = document.createElement ("div");
	elemDivTabBodyRightT2.classList.add ("item_tab_body_right");
	
	elemDivtabBodyT2.appendChild (elemDivTabBodyLeftT2);
	elemDivtabBodyT2.appendChild (elemDivTabBodyMiddleT2);
	elemDivtabBodyT2.appendChild (elemDivTabBodyRightT2);

	
	var elemDivtabBodyT3 = document.createElement ("div");
	elemDivtabBodyT3.classList.add ("item_show_details_body");
	elemDivtabBodyT3.setAttribute ("id", "third-tab");
	elemDivtabBodyT3.style.display = "none";
	var elemDivTabBodyLeftT3 = document.createElement ("div");
	elemDivTabBodyLeftT3.classList.add ("item_tab_body_left");

	var elemDivTabBodyMiddleT3 = document.createElement ("div");
	elemDivTabBodyMiddleT3.classList.add ("item_tab_body_middle");

	var elemDivTabBodyRightT3 = document.createElement ("div");
	elemDivTabBodyRightT3.classList.add ("item_tab_body_right");

	elemDivtabBodyT3.appendChild (elemDivTabBodyLeftT3);
	elemDivtabBodyT3.appendChild (elemDivTabBodyMiddleT3);
	elemDivtabBodyT3.appendChild (elemDivTabBodyRightT3);


	var elemDivtabBodyT4 = document.createElement ("div");
	elemDivtabBodyT4.classList.add ("item_show_details_body");
	elemDivtabBodyT4.setAttribute ("id", "forth-tab");
	elemDivtabBodyT4.style.display = "none";
	var elemDivTabBodyLeftT4 = document.createElement ("div");
	elemDivTabBodyLeftT4.classList.add ("item_tab_body_left");
	
	var elemDivTabBodyMiddleT4 = document.createElement ("div");
	elemDivTabBodyMiddleT4.classList.add ("item_tab_body_middle");
	
	var elemDivTabBodyRightT4 = document.createElement ("div");
	elemDivTabBodyRightT4.classList.add ("item_tab_body_right");

	elemDivtabBodyT4.appendChild (elemDivTabBodyLeftT4);
	elemDivtabBodyT4.appendChild (elemDivTabBodyMiddleT4);
	elemDivtabBodyT4.appendChild (elemDivTabBodyRightT4);



	elemMain.appendChild (elemDivtabBodyT1);
	elemMain.appendChild (elemDivtabBodyT2);
	elemMain.appendChild (elemDivtabBodyT3);
	elemMain.appendChild (elemDivtabBodyT4);
	
	



	let response = await fetch(url);
	let show = await response.json();
	
	var elemImage = document.createElement ("img");
	elemImage.src = show.image.medium;
	elemImage.alt = "IMAGE of SHOW";


	var elemDivTabBodyLeftTOP= document.createElement ("div");
	elemDivTabBodyLeftTOP.classList.add ("tb_left_top");

	var elemDivTabBodyLeftBOTTOM= document.createElement ("div");


	

	
	elemDivTabBodyLeftTOP.appendChild (elemImage);
	


	var elemDivSummary = document.createElement("div");
	elemDivSummary.classList.add("show_summary"); // add a class to apply css
	elemDivSummary.innerHTML = show.summary;


	var elemShowTitle = document.createElement("h2");
	elemShowTitle.classList.add("show_title"); // add a class to apply css

	try {
	elemShowTitle.innerHTML = show.name + " (&#9734;" + show.rating.average + ", Genre(s): "+ checkifnull(show.genres) + ")";
	}
	catch{
		elemShowTitle.innerHTML = show.name + " (Average raiting: " + "n/a"+ ")";
	}

	var elemShowInfoA= document.createElement("p");
	elemShowInfoA.innerHTML = "<strong>Premiered: </strong>"+ checkifnull(show.premiered)  + " | <strong>Status: </strong>"+ checkifnull(show.status) + " | <strong>Network: </strong>" + checkifnull(show.network.name) + " @ " + checkifnull(show.schedule.time) + " on " + checkifnull(show.schedule.days);

	var elemSummaryText = document.createElement("div");
	elemSummaryText.classList.add("summary_text"); // add a class to apply css
	elemSummaryText.innerHTML = show.summary;


	var elemShowOfficial = document.createElement("a");


	var elemShowInfoNetwork = document.createElement("p");
	var elemShowScheduleTime = document.createElement("p");
	var elemShowScheduleDays = document.createElement("p");
	var elemShowGenre = document.createElement("p");

	
	
	

	elemDivTabBodyLeftBOTTOM.appendChild (elemShowInfoNetwork);
	elemDivTabBodyLeftBOTTOM.appendChild (elemShowScheduleTime);
	elemDivTabBodyLeftBOTTOM.appendChild (elemShowScheduleDays);
	elemDivTabBodyLeftBOTTOM.appendChild (elemShowGenre);

	elemDivTabBodyLeftT1.appendChild (elemDivTabBodyLeftTOP);
	elemDivTabBodyLeftT1.appendChild (elemDivTabBodyLeftBOTTOM);


	elemDivTabBodyMiddleT1.appendChild (elemShowTitle);
	elemDivTabBodyMiddleT1.appendChild  (elemShowInfoA);

	elemDivTabBodyMiddleT1.appendChild (elemSummaryText);
	elemDivTabBodyMiddleT1.appendChild (elemShowOfficial);

	
	try {
		elemShowOfficial.innerHTML = "<br><br>Official Site:  <a href=\"" + show.officialSite + "\">" + show.officialSite ;
	} catch (error) {
		elemShowOfficial.innerHTML = "<br><br>Official Site: n/a ";
	}
	

	

	let json_resp = await fetch("http://api.tvmaze.com/shows/" + show.id + "/images");	
	let json_images = await json_resp.json();



			for (m in json_images){

					
				
					var elemDivTabBodyRightT1Column = document.createElement ("div");
					elemDivTabBodyRightT1Column.classList.add ("tb_column");

					var elemImg = document.createElement ("img");
					var elemImageLink = document.createElement ("a");
								

				
					try {
						elemImg.src = json_images[m].resolutions.original.url;	
						elemImg.alt = "IMAGE";
						elemImageLink.target = "_blank";
						elemImageLink.href = json_images[m].resolutions.original.url;
						elemImageLink.appendChild (elemImg);
				
					} catch (error) {
						elemImg.src = ""; 
						elemImg.alt = "No image available"
						elemImageLink.target = "_blank";
						elemImageLink.href = json_images[m].resolutions.original.url;
						elemImageLink.appendChild (elemImg);
					}
				

					
					
					elemDivTabBodyRightT1Column.appendChild (elemImageLink);
					elemDivTabBodyRightT1.appendChild (elemDivTabBodyRightT1Column);

			
					}






	console .log ("Show>>>>>>>>>>" + show.name);
	console .log ("Show> embedded>>>>>>>>>" + show._embedded.cast);
	for (i in show._embedded.cast) {
		console.log( show._embedded.cast[i].person.name);
		console.log( show._embedded.cast[i].character.name);

	 }	
	 
	 createEpisodes(show.id);
	 createCast(show._embedded.cast);
	 createCrew(show.id);
	 createGallery(show.id);

}


async function createEpisodes (showId){
	var headerswitch = true;
	var zebraflag = true;

	url = "http://api.tvmaze.com/shows/" + showId + "/episodes";	
	console.log("EPISODES URL " + url);	
	let response = await fetch(url);	
	let episodes = await response.json();

	var elemDivEpisodeContainer = document.createElement ("div");
	elemDivEpisodeContainer.classList.add ("episode-container");
	

	var elemEpisodeTable = document.createElement ("div");
	elemEpisodeTable.classList.add ("Episodes-table");


	for (e in episodes){


		if (headerswitch)
			{
				var EpsName = document.createElement ("div");
				var EpsDateAirtime = document.createElement ("div");
				var EpsSeasonEpsNumber = document.createElement ("div");
				var EpsImageDiv = document.createElement ("div");
				var EpsSummary = document.createElement ("div");
				
				EpsName.classList.add("Episodes_row_h");
				EpsDateAirtime.classList.add("Episodes_row_h");
				EpsSeasonEpsNumber.classList.add("Episodes_row_h");
				EpsImageDiv.classList.add("Episodes_row_h");
				EpsSummary.classList.add("Episodes_row_h");

				EpsName.innerHTML = "Name";
				EpsDateAirtime.innerHTML = "Airdate / Airtime"
				EpsSeasonEpsNumber.innerHTML = "Season / Episode";
				EpsImageDiv.innerHTML = "Image";
				EpsSummary.innerHTML = "Summary";
				headerswitch = false;


				elemEpisodeTable.appendChild (EpsImageDiv);
				elemEpisodeTable.appendChild (EpsSeasonEpsNumber);
				elemEpisodeTable.appendChild (EpsDateAirtime);
				elemEpisodeTable.appendChild (EpsName);
				elemEpisodeTable.appendChild (EpsSummary);

			}

			var EpsName = document.createElement ("div");
			var EpsDateAirtime = document.createElement ("div");
			var EpsSeasonEpsNumber = document.createElement ("div");
			var EpsImageDiv = document.createElement ("div");
			var EpsSummary = document.createElement ("div");
			var elemImageEps = document.createElement ("img");

		
		if (zebraflag ) {
		

			EpsName.classList.add("Episodes_row_a");
			EpsDateAirtime.classList.add("Episodes_row_a");
			EpsSeasonEpsNumber.classList.add("Episodes_row_a");
			EpsImageDiv.classList.add("Episodes_row_a");
			EpsSummary.classList.add("Episodes_row_a"); 
			
			zebraflag = false;
		}
		else{
		
			EpsName.classList.add("Episodes_row_b");
			EpsDateAirtime.classList.add("Episodes_row_b");
			EpsSeasonEpsNumber.classList.add("Episodes_row_b");
			EpsImageDiv.classList.add("Episodes_row_b");
			EpsSummary.classList.add("Episodes_row_b"); 

			zebraflag = true;
		}

			EpsName.innerHTML = episodes[e].name;
			EpsDateAirtime.innerHTML = episodes[e].airdate + " / " + episodes[e].airtime;
			EpsSeasonEpsNumber.innerHTML = episodes[e].season + " / " + episodes[e].number;
			
			try { elemImageEps.src = episodes[e].image.original; } catch (error) { elemImageEps.src = "no-img-portrait-text.png" }
			EpsImageDiv.appendChild (elemImageEps);
			EpsSummary.innerHTML = episodes[e].summary;

			elemEpisodeTable.appendChild (EpsImageDiv);
			elemEpisodeTable.appendChild (EpsSeasonEpsNumber);
			elemEpisodeTable.appendChild (EpsDateAirtime);
			elemEpisodeTable.appendChild (EpsName);
			elemEpisodeTable.appendChild (EpsSummary);
	
		
	
		
		


	}
	
	
	



	elemDivEpisodeContainer.appendChild (elemEpisodeTable);
	
	
	document.getElementById ("second-tab").appendChild(elemDivEpisodeContainer);





}




function createCast (data){



	var elemDivCastContainer = document.createElement ("div");
	elemDivCastContainer.classList.add ("cast-container");

	if (data.length == 0 ) {
		var d = new Date();

			elemDivCastContainer.innerHTML =  "Unfortunately, there is no info available for 'Cast' in our database! (Message generated on: " + d +")";
					
			
			document.getElementById ("third-tab").appendChild(elemDivCastContainer);
	

	}
	else {
	
		for (i in data){
			//console.log ("CREATECAST>>>>>>>>>>>>>>: " + data[i].person.name + ":" + data[i].character.name +" img src: " + data[i].person.image.medium )
			
			var elemDivCastCell = document.createElement ("div");
			elemDivCastCell.classList.add("cast-cell");

			var elemDivCastCellLeft = document.createElement ("div");
			var elemImageCastPerson = document.createElement  ("img");

			try { 
				
				if (data[i].person.image.medium === null ){
					elemImageCastPerson.src = "no-img-portrait-text.png" ;
				} else {
					elemImageCastPerson.src = data[i].person.image.medium;
				}
				
			} catch (error) { elemImageCastPerson.src = "no-img-portrait-text.png" }



			elemImageCastPerson.alt = "IMAGE OF PERSON";
			elemDivCastCellLeft.appendChild (elemImageCastPerson);
			var elemCellText1 = document.createElement ("p");
			var elemCellText2 = document.createElement ("p");
			elemCellText1.classList.add("cast-title");
			elemCellText2.classList.add("cast-text");

			elemCellText1.innerText = data[i].person.name;
			elemCellText2.innerText = "as " + data[i].character.name ;
			elemDivCastCellLeft.appendChild (elemCellText1);
			elemDivCastCellLeft.appendChild (elemCellText2);
			
			

			var elemDivCastCellRight = document.createElement ("div");
			elemDivCastCellRight.classList.add("test");
			//elemDivCastCellRight.innerHTML = data[i].person.name + " <br> " + data[i].character.name ;


			elemDivCastCell.appendChild (elemDivCastCellLeft);
			elemDivCastCell.appendChild (elemDivCastCellRight);

			elemDivCastContainer.appendChild (elemDivCastCell);
			
			
			
			document.getElementById ("third-tab").appendChild(elemDivCastContainer);
		}

	}

}





async function createCrew (data){


	url = "http://api.tvmaze.com/shows/" + data + "/crew";		
	let response = await fetch(url);	
	let crew = await response.json();

	var elemDivCrewContainer = document.createElement ("div");
	elemDivCrewContainer.classList.add ("crew-container");


	console.log ("CREW          ---------------> ID: " +crew);

	if (crew.length == 0) {
		var d = new Date();

		elemDivCrewContainer.innerHTML =  "Unfortunately, there is no info available for 'Crew' in our database! (Message generated on: " + d +")";
		document.getElementById ("forth-tab").appendChild(elemDivCrewContainer);

	}
	else {

		for (i in crew){

			var elemDivCrewCell = document.createElement ("div");
			elemDivCrewCell.classList.add("crew-cell");

			var elemDivCrewCellLeft = document.createElement ("div");
			var elemImageCrewPerson = document.createElement  ("img");
			
			try { elemImageCrewPerson.src = crew[i].person.image.medium; } catch (error) { elemImageCrewPerson.src = "no-img-portrait-text.png" }


			elemImageCrewPerson.alt = "IMAGE OF PERSON";
			elemDivCrewCellLeft.appendChild (elemImageCrewPerson);
			var elemCellText1 = document.createElement ("p");
			elemCellText1.classList.add("crew-title");
			var elemCellText2 = document.createElement ("p");
			elemCellText2.classList.add("crew-text");

			elemCellText1.innerText = crew[i].person.name ;
			elemCellText2.innerText = crew[i].type ;
			elemDivCrewCellLeft.appendChild (elemCellText1);
			elemDivCrewCellLeft.appendChild (elemCellText2);

			var elemDivCrewCellRight = document.createElement ("div");
			elemDivCrewCell.appendChild (elemDivCrewCellLeft);
			elemDivCrewCell.appendChild (elemDivCrewCellRight);

			elemDivCrewContainer.appendChild (elemDivCrewCell);

			document.getElementById ("forth-tab").appendChild(elemDivCrewContainer);

		}

	}





}



async function createGallery (data){

	url = "http://api.tvmaze.com/shows/" + data + "/images";		
	let response = await fetch(url);	
	let gallery = await response.json();

	var elemDivGalleryContainer = document.createElement ("div");
	elemDivGalleryContainer.classList.add ("gallery-container");

	for (i in gallery){

		var elemDivGalleryCell = document.createElement ("div");
		elemDivGalleryCell.classList.add("gallery-cell");
		
		var elemDivGalleryCellLeft = document.createElement ("div");
		var elemImageGallery = document.createElement  ("img");

		var a = document.createElement('a');
		
		try { elemImageGallery.src = gallery[i].resolutions.original.url; 
			elemImageGallery.setAttribute ("width", "200vw;");

      		a.target = "_blank";
			a.href = gallery[i].resolutions.original.url;
			a.appendChild (elemImageGallery);
			  
		
		
		} catch (error) { elemImageGallery.src = "no-img-portrait-text.png" }

		elemImageGallery.alt = "IMAGE OF PERSON";
		

		var elemCellText= document.createElement ("p");
		elemCellText.classList.add("gallery-title");

		

	

		elemCellText.innerText = gallery[i].type ;
	
		elemDivGalleryCellLeft.appendChild (elemCellText);
		elemDivGalleryCellLeft.appendChild (a);


		var elemDivGalleryCellRight = document.createElement ("div");
		elemDivGalleryCell.appendChild (elemDivGalleryCellLeft);
		elemDivGalleryCell.appendChild (elemDivGalleryCellRight);

		elemDivGalleryContainer.appendChild (elemDivGalleryCell);

		/*document.getElementById ("fifth-tab").appendChild(elemDivGalleryContainer);*/

	}


}



async function create_schedule(){
	var l_popularItem = {
		EpisodeId: "0",
		EpisodeName :"n/a" ,
		EpisodeAirtime : "n/a",
		ShowId : "0",
		ShowRating : "-1",
		ShowImage : "n/a",
		Network : "n/a"
	};
	var l_upcomingItem = {
		EpisodeId: "0",
		EpisodeName :"n/a" ,
		EpisodeAirtime : "n/a",
		ShowId : "0",
		ShowRating : "-1",
		ShowImage : "n/a",
		Network : "n/a"
	};

	/*var t_popularItem = [];*/
	var l_popularItems = [];
	var l_upcomingItems = [];
	var i = 0;
	var j = 0;
	var k = 0;
	var u = 0;
	var uu = 0;
	var z = 0;

	var network_Webchannel = "n/a";
	p_counter = 0;


	url = "http://api.tvmaze.com/schedule";		
	url_upc = "http://api.tvmaze.com/schedule?date="+ getNextDay();
	//url = url_upc;

	let response = await fetch(url);	
	let schedule = await response.json();
	
	let response_upc = await fetch(url_upc);	
	let schedule_upc = await response_upc.json();




	var counter = 0;
	var headerswitch = true;
	var zebraflag = true;

	var temp = document.getElementById("main");
	temp.remove();

	var elemDivBodyMiddle = document.getElementById ("body_bar_middle");
	var elemMain = document.createElement ("div");
	elemMain.classList.add ( "home-container");
	elemMain.setAttribute ( "ID",  "main");
	elemDivBodyMiddle.appendChild (elemMain);


	var elemHomeBox = document.createElement ("div");
	
	var popularTitle= document.createElement("p");
	popularTitle.classList.add ("popular-title");
	popularTitle.innerHTML = "Tonight's popular shows";
	

	var upcomingTitle= document.createElement("p");
	upcomingTitle.classList.add ("upcomingTitle");
	upcomingTitle.innerHTML = "Tomorrow's popular shows";

	
	var elemScheduleBox = document.createElement ("div");
	var ScheduleTitle= document.createElement("p");
	ScheduleTitle.classList.add ("ScheduleTitle");
	ScheduleTitle.innerHTML = "Tonight's schedule";



	var elemPopularContainer = document.createElement ("div");
	elemPopularContainer.classList.add("popular-container");

	var elemUpcomingContainer = document.createElement ("div");
	elemUpcomingContainer.classList.add("upcoming-container");


	elemHomeBox.appendChild(popularTitle);
	elemHomeBox.appendChild (elemPopularContainer);

	elemHomeBox.appendChild(upcomingTitle);
	elemHomeBox.appendChild (elemUpcomingContainer);

	 /*elemScheduleBox.appendChild(ScheduleTitle);*/
	



	for (i in schedule) {

	

		try {l_popularItem.EpisodeAirtime = schedule[i].airtime ; 	} 
			catch (error) {	l_popularItem.EpisodeAirtime = "??:??";	}
		try {l_popularItem.EpisodeId = schedule[i].id; } catch (error) {		}
		try {l_popularItem.EpisodeName = schedule[i].name; } catch (error) {		}
		try {l_popularItem.ShowId = schedule[i].show.id; } catch (error) {		}
		try {
			
			if (schedule[i].show.rating.average == null){
				l_popularItem.ShowRating = 0;
			}
			else{

			l_popularItem.ShowRating = schedule[i].show.rating.average;
			}
		} catch (error) {	l_popularItem.ShowRating = 0;	}
		try {l_popularItem.ShowImage = schedule[i].show.image.medium; } catch (error) {	l_popularItem.ShowImage = "no-img-portrait-text.png";}
		try {

		
			l_popularItem.Network = buildChannel (schedule[i].show);
		
		
		} catch (error) {console.log (error);	}

		try {l_popularItems.push (Object.assign({},l_popularItem)); } catch (error) {	console (error);	}
		try {l_popularItems.sort ( function(a, b){return b.ShowRating - a.ShowRating} ); } catch (error) {	console (error);	}


		/* UPCOMING */

		try {l_upcomingItem.EpisodeAirtime = schedule_upc[i].airtime ; 	} 
		catch (error) {	l_upcomingItem.EpisodeAirtime = "??:??";	}
		try {l_upcomingItem.EpisodeId = schedule_upc[i].id; } catch (error) {		}
		try {l_upcomingItem.EpisodeName = schedule_upc[i].name; } catch (error) {		}
		try {l_upcomingItem.ShowId = schedule_upc[i].show.id; } catch (error) {		}
		try {
			
			if (schedule_upc[i].show.rating.average == null){
				l_upcomingItem.ShowRating = 0;
			}
			else{

			l_upcomingItem.ShowRating = schedule_upc[i].show.rating.average;
			}
		} catch (error) {	l_upcomingItem.ShowRating = 0;	}
		try {l_upcomingItem.ShowImage = schedule_upc[i].show.image.medium; } catch (error) {	l_upcomingItem.ShowImage = "no-img-portrait-text.png";}
		try {
			l_upcomingItem.Network = buildChannel (schedule_upc[i].show);
		} catch (error) {	}
		try {l_upcomingItems.push (Object.assign({},l_upcomingItem)); } catch (error) {	console (error);	}
		try {l_upcomingItems.sort ( function(a, b){return b.ShowRating - a.ShowRating} ); } catch (error) {	console (error);	}

		/*p_counter++;*/

	
		

	}


	for (j in l_popularItems){

		console.log("2nd: " + l_popularItems[j].ShowId + "/" + l_popularItems[j].EpisodeId + "/" + l_popularItems[j].ShowRating);

		if (k < 8){

			console.log("l_popularItems[j].airtime: " + l_popularItems[j].EpisodeAirtime + "    Network: " + l_popularItems[j].Network);

			if (l_popularItems[j].EpisodeAirtime.startsWith("20:") ||  l_popularItems[j].EpisodeAirtime.startsWith("21:") || l_popularItems[j].EpisodeAirtime.startsWith("22:") ){
				console.log ("Result of popular shows/episodes: " + l_popularItems[j].ShowId + "/" + l_popularItems[j].EpisodeAirtime + " R: " + l_popularItems[j].ShowRating  );		

				var elemPopularCell = document.createElement ("div");
				elemPopularCell.classList.add("popular-cell");
				var elemImage = document.createElement ("img");
				var elemPopulerChannel = document.createElement ("p");
				
				elemPopulerChannel.innerHTML = l_popularItems[j].Network + "/" + l_popularItems[j].EpisodeAirtime ;

				elemImage.src = l_popularItems[j].ShowImage;
				elemImage.alt = "IMAGE";
				elemImage.setAttribute ("onclick", "display_show_details("+l_popularItems[j].ShowId+ ");");
				elemPopularCell.appendChild (elemImage);
				elemPopularCell.appendChild (elemPopulerChannel);
				elemPopularContainer.appendChild(elemPopularCell);
				k++;
			}	
		}	
			
	}



	

	for (u in l_upcomingItems){

		console.log("2nd: " + l_upcomingItems[u].ShowId + "/" + l_upcomingItems[u].EpisodeId + "/" + l_upcomingItems[u].ShowRating);

		if (uu < 8){

			console.log("l_upcomingItems[u].airtime: " + l_upcomingItems[u].EpisodeAirtime + "    Network: " + l_upcomingItems[u].Network);

			if (l_upcomingItems[u].EpisodeAirtime.startsWith("20:") ||  l_upcomingItems[u].EpisodeAirtime.startsWith("21:") || l_upcomingItems[u].EpisodeAirtime.startsWith("22:") ){
				console.log ("Result of upcoming shows/episodes: " + l_upcomingItems[u].ShowId + "/" + l_upcomingItems[u].EpisodeAirtime + " R: " + l_upcomingItems[u].ShowRating  );		

				var elemUpcomingCell = document.createElement ("div");
				elemUpcomingCell.classList.add("upcoming-cell");
				var elemImageUpc = document.createElement ("img");
				var elemUpcChannel = document.createElement ("p");
				
				elemUpcChannel.innerHTML = l_upcomingItems[u].Network + "/" + l_upcomingItems[u].EpisodeAirtime + " tmw.";

				elemImageUpc.src = l_upcomingItems[u].ShowImage;
				elemImageUpc.alt = "IMAGE";
				elemImageUpc.setAttribute ("onclick", "display_show_details("+l_upcomingItems[u].ShowId+ ");");
				elemUpcomingCell.appendChild (elemImageUpc);
				elemUpcomingCell.appendChild (elemUpcChannel);
				elemUpcomingContainer.appendChild(elemUpcomingCell);
				uu++;
			}	
		}	
			
	}






	for (z in schedule) {

		if ( schedule[z].airtime.startsWith("20:") ||  schedule[z].airtime.startsWith("21:") ||  schedule[z].airtime.startsWith("22:") ||  schedule[z].airtime.startsWith("23:")  ){
			
			if (headerswitch)
			{
				var ScheduleTable= document.createElement ("div");
				ScheduleTable.classList.add ("Schedule-table");
				elemScheduleBox.appendChild(ScheduleTable);
			
				var ScheduleTitle= document.createElement ("div");
			
				ScheduleTitle.classList.add("Schedule-table-cell");
				ScheduleTitle.classList.add("row_h");
				ScheduleTitle.innerHTML = "Tonight's schedule";
				headerswitch = false;
				ScheduleTable.appendChild(ScheduleTitle);
			}

			var ScheduleCellLeft= document.createElement ("div");
			var ScheduleCellRight= document.createElement ("div");

			ScheduleCellLeft.classList.add("Schedule-table-cell");
			ScheduleCellRight.classList.add("Schedule-table-cell");

			if (zebraflag ) {
				ScheduleCellLeft.classList.add("row_a");
				ScheduleCellRight.classList.add("row_a");
				zebraflag = false;
			}
			else{
				ScheduleCellLeft.classList.add("row_b");
				ScheduleCellRight.classList.add("row_b");
				zebraflag = true;
			}

			
			network_Webchannel = buildChannel (schedule[z].show);
			/*
			if (schedule[z].show.network === null ){

				if (schedule[z].show.webchannel === null){
					network_Webchannel = "n/a";
				}else {
					network_Webchannel = schedule[z].show.webChannel.name;
				}
			}
			else {
				network_Webchannel = schedule[z].show.network.name;
			}
			*/



			
			ScheduleCellLeft.innerHTML= schedule[z].airtime + "<p>" + network_Webchannel + "</p>";
			
		
			
			

			var elemScheduleLink = document.createElement ("a");

			elemScheduleLink.href = "javascript: display_show_details("+schedule[z].show.id+")";
			var elemScheduleLinkText = document.createTextNode(schedule[z].show.name);

			ScheduleCellRight.appendChild (elemScheduleLink);
			elemScheduleLink.appendChild (elemScheduleLinkText);
									
			ScheduleTable.appendChild(ScheduleCellLeft);
			ScheduleTable.appendChild(ScheduleCellRight);
			elemScheduleBox.appendChild(ScheduleTable);


		}

	}


	elemMain.appendChild(elemHomeBox);
	elemMain.appendChild(elemScheduleBox);









}


function openTab(evt, tabName) {
	var i, x, tablinks;
	x = document.getElementsByClassName("item_show_details_body");
	for (i = 0; i < x.length; i++) {
	  x[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("t_button");
	for (i = 0; i < x.length; i++) {
	  tablinks[i].className = tablinks[i].className.replace("w3-red", "");
	}
	document.getElementById(tabName).style.display = "";
	evt.currentTarget.className += " w3-red";
  }



function checkifnull(arg) {

	
	if ( isEmpty(arg)) {
		return "n/a";
	}
	else {
		return arg;
	}
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


function buildChannel (data){

	var l_channel = "n/a";

		if (data.network === null ){

			if (data.webchannel === null){
				l_channel = "n/a";
			}else {
				l_channel = data.webChannel.name;
			}
		}
		else {
			l_channel= data.network.name;
		}

return l_channel;
}


function getNextDay (){
	const today = new Date();
	let tomorrow =  new Date();
	tomorrow.setDate(today.getDate() + 1);
	tomorrow.setHours(0,0,0,0);
	let year = tomorrow.getFullYear();
	let month = parseInt(tomorrow.getMonth())+1;
	let day = tomorrow.getDate();
	

	console.log("getNextDay  " + year + "-" + month + "-"+ day);
	return year + "-" + month + "-"+ day;

}




