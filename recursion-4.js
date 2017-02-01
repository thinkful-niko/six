var MAX = 3; //Maximum levels queried

var ARTISTS = new Array(2);  //Multidimensional array with the number of potential 'artists' i.e. compare Madonna, to Beethoven to Eminem to nth-artist

var RELEVENT_ARTISTS = 5; //Number of relevent artists added to the list for each new artist 

var IDS = [];

$(function(){
	//nextLevel(0) //Begin
	init(0);
	addNewArtist('alkaline trio', 0);
	
})
function init(i){
	for(i; i<MAX; i++){
		addNew(i);
	} 
}
function addNew(level){
	for(var i=0; i<ARTISTS.length; i++){
		for(var j=0; j<RELEVENT_ARTISTS; j++){
			var num = Math.floor(Math.random() * 50) + 1; 
			if(typeof ARTISTS[i] != "object"){ //init the first array object - prob better way to do this 
				 ARTISTS[i] = [num]	
			} else {
				ARTISTS[i].push(num)
			}
		}
	}
	console.log(ARTISTS)	
	getMatches(ARTISTS)	
}




function getMatches(ARTISTS){  
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












//first degree find the single artist. Following degree search recommendations for each artist in that degree's Array index
function addNewArtist(artist, degree){
	if (degree === 0) {
		searchArtist(artist, degree);
	} else {
		ARTISTS[degree].artists.forEach(function(item) {
			searchRecommendations(item.id, degree);
		});
	}
}

//search for the artist the user inputs
function searchArtist(artist, degree) {
	$.ajax({
		url: 'https://api.spotify.com/v1/search',
		data: {
			q: artist,
			type: 'artist'
		},
			success: function (response) {
				console.log(response);
				IDS.push(response.artists.items[0].id);
				ARTISTS.push(response.artists.items[0].name)
				
				searchRecommendations(response.artists.items[0].id, degree);

				var firstHTML = '<h3>' + response.artists.items[0].name + '</h3>';
				$('.first-degree').html(firstHTML);
		}
	});
}
function searchRecommendations(artist, degree) {
	if( degree == DEGREES ){ return } else { 

		return setTimeout(function() {  //setTimeout not necessary, just for clairity and potential visual FX

			$.ajax({
				url: 'https://api.spotify.com/v1/artists/' + artist + '/related-artists',
				data: {
					type: 'artist',
				},
				success: function (response) {
					var color = "#"+((1<<24)*Math.random()|0).toString(16)
					var fontSize = (degree) + 'rem'; 
					//fontSize: 1rem';
					var limit = 0; 
					var left = degree*300+ 'px'

					$(response.artists).each(function(){ 
						if(limit == 5){ return } limit++; //Might want to limit this to less then 20;
						
						if(IDS.indexOf(this.id) == -1){
							var secondHTML = '<h5 style="margin-left:'+left+';color:'+color+';font-size:'+fontSize+'">' + this.name + '</h5>';
							$('.first-degree').append(secondHTML);
							IDS.push(this.id)
							ARTISTS.push(this) //You can add unique identifiers here, depending on degree #.
							searchRecommendations(this.id, degree+1)
						}
					})
					

				      console.log('ARTISTS');
				      console.log(ARTISTS);

				}		
			});	

		},300,degree)
	}
}





























/*
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
*/





