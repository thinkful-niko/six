

var MAX, ARTISTS, RELEVENT_ARTISTS; 


$(function(){
	//nextLevel(0) //Begin
	$('button').click(function(e){

		
		e.preventDefault();


		MAX = 6; //Maximum levels queried

		ARTISTS = new Array(3);  //Multidimensional array with the number of potential 'artists' i.e. compare Madonna, to Beethoven to Eminem to nth-artist --Must equal inputs
		RELEVENT_ARTISTS = 20; //Number of relevent artists added to the list for each new artist 





		nextLevel(0) //Begin
	})
	
})




var nextLevel = function(level){ //Recursion 
	console.log(level)
	if( level == MAX ){
		return console.log('max level')
	} else {
		return setTimeout(function() {  //setTimeout not necessary, just for clairity and potential visual FX
				addNew(level)	
				nextLevel(level+1) 	
		},500)
	}
}



var addNew = function(level){
	for(var i=0; i<ARTISTS.length; i++){
		console.log(i)
		console.log('search for '+$('input')[i].value)

		searchArtists($('input')[i].value, i)



		/*
		for(var j=0; j<RELEVENT_ARTISTS; j++){
			//var num = Math.floor(Math.random() * 10) + 1; 
			//var num = searchArtists(
			if(typeof ARTISTS[i] != "object"){ //init the first array object - prob better way to do this 
				 ARTISTS[i] = [num]	
			} else {
				ARTISTS[i].push(num)
			}
		}*/


	}

	//console.log(ARTISTS)	
	//getMatches(ARTISTS)	
}





function searchArtists(artist, artists_order, element) {
	$.ajax({
		url: 'https://api.spotify.com/v1/search',
		data: {
			q: artist,
			type: 'artist'
		},
		success: function (response) {
			for(var j=0; j<RELEVENT_ARTISTS; j++){
				//var num = Math.floor(Math.random() * 10) + 1; 
				//var num = searchArtists(
				//console.log(response);
				//console.log(response.artists.items);
				//console.log(response.artists.items.length);
				var relevent_artist = response.artists.items[j]; 
				//console.log(relevent_artist.name)
				if(relevent_artist){
					console.log(relevent_artist.id);
					searchRecommendations(relevent_artist, artists_order);
					
				}


				
				//searchRecommendations(response, element);	
				/*if(typeof ARTISTS[i] != "object"){ //init the first array object - prob better way to do this 
					 ARTISTS[i] = [num]	
				} else {
					ARTISTS[i].push(num)
				}*/
			}

		}
	
	});
}

function searchRecommendations(relevent_artist, artist_order, element) {
	$.ajax({
		url: 'https://api.spotify.com/v1/artists/' + relevent_artist.id + '/related-artists',
		data: {
			type: 'artist',
		},
		success: function (response) {
			console.log(' ')
			console.log(relevent_artist.name + 's related artists:');
			console.log(response)
			console.log(response.artists.length)
		
			//getMatches(response)
			//

				
			//for(var k=0; k<RELEVENT_ARTISTS; k++){
				
					
				for(var a=0; a<response.artists.length; a++){
					console.log(response.artists[a].name)
					var num = response.artists[a].name;
				
			
					if(typeof ARTISTS[artist_order] != "object"){ //init the first array object - prob better way to do this 
							 ARTISTS[artist_order] = [num]	
						} else {
							ARTISTS[artist_order].push(num)
					}

				
				}
	
			//}

			//AJAXCALLS++; 
			//if(AJAXCALLS == RELEVENT_ARTISTS * ARTISTS.length){
			//	getMatches(ARTISTS);
			//}
		}
	});	
}




var getMatches = function(ARTISTS){  
	var arrays = ARTISTS.slice(); //This is needed to clone the array and make a new reference 
	var result = arrays.shift().reduce(function(res, v) {  //Fancy Pants Answer - http://stackoverflow.com/questions/11076067/finding-matches-between-multiple-javascript-arrays
	    if (res.indexOf(v) === -1 && arrays.every(function(a) { //EXTRA CREDIT - Try to find if only some the artist arrays have matches, or which arrays match.  Say artist A with artist D match for value 'blah blah'; 
		return a.indexOf(v) !== -1;
	    })) 
	    res.push(v);
	    return res;
	}, ['matches:']);

	console.log(result)

}






$(document).ajaxStop(function () { //$.when is most likely better
      // 0 === $.active
      console.log('all ajax calls are compelete');
      getMatches(ARTISTS);
});

