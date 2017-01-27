var DEGREES = 10; //Maximum levels queried; starts at zero
var IDS = []; 
$(function(){
	addNewArtist('alkaline trio', 0);
})


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
					var limit = 0; 

					$(response.artists).each(function(){ 
						if(limit == 5){ return } limit++; //Might want to limit this to less then 20;
						
						if(IDS.indexOf(this.id) == -1){
							var secondHTML = '<h5 style="color:'+color+';font-size:'+fontSize+'">' + this.name + '</h5>';
							$('.first-degree').append(secondHTML);
							IDS.push(this.id)
							searchRecommendations(this.id, degree+1)
						}
					})
				}		
			});	

		},300,degree)
	}
}


