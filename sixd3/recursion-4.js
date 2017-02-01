var MAX = 2; //Maximum levels queried
var ARTISTS = [[]];  //Multidimensional array with the number of potential 'artists' i.e. compare Madonna, to Beethoven to Eminem to nth-artist
var RELEVENT_ARTISTS = 2; //Number of relevent artists added to the list for each new artist 


$(function(){
	//nextLevel(0) //Begin
	init(0);
	//addNewArtist('alkaline trio', 0);
	
})
function init(i){
	for(var i; i<ARTISTS.length; i++){

		console.log('searchArtists for relevant artist '+$('input')[i].value)	
		var artist = $('input')[i].value;
		$.ajax({
			url: 'https://api.spotify.com/v1/search',
			data: {
				q: artist,
				type: 'artist'
			},
				success: function (response) {
					console.log(response.artists.href);
					searchRecommendations(response.artists.items[0].id, 0)	
					//nextLevel(0)
			}
		});


	}
	//console.log(ARTISTS)	
	//getMatches(ARTISTS)	
}



function searchRecommendations(artist, depth) {
			console.log(' ')				
			console.log('searchRecommendations '+artist+ ' '+ depth )	
			if(depth == MAX){ return console.log('max reached '+depth) } else {

				return setTimeout(function() {

					$.ajax({
						url: 'https://api.spotify.com/v1/artists/' + artist + '/related-artists',
						data: {
							type: 'artist',
						},
						success: function (response) {
							
							console.log('RESPONSE');
							console.log(response)
							for(var r=0; r<RELEVENT_ARTISTS; r++){
								console.log(response.artists[r].name)
								//var obj = { 'id' : response.artists[r].name,'level':depth+1,'group':Math.floor(Math.random() * 10) + 1 } 
								var obj = { 'artist' : response.artists[r].name,  'level':(depth+1)*5} 

								ARTISTS.push(obj)
									

								searchRecommendations(response.artists[r].id, depth+1)  //Recursion
							}
						}		
					});
				},500,depth)
			}	
}






						/*if(typeof ARTISTS[artist_order] != "object"){ //init the first array object - prob better way to do this 
										 //ARTISTS[artist_order] = [num]	
										var obj = { 'artist' : response.artists[r].name,  'level':depth+1} 
										 ARTISTS[artist_order] = [obj]
									} else {
										//ARTISTS[artist_order].push(num)
										var obj = { 'artist' : response.artists[r].name,  'level':depth+1} 

										ARTISTS[artist_order].push(obj)
											
								}*/







$(document).ajaxStop(function () { //$.when is most likely better
      // 0 === $.active
      console.log('all ajax calls are compelete');
      console.log(ARTISTS)
      //getMatches(ARTISTS);
      //convert_artists_to_nodes_and_links(ARTISTS)
}); 





function convert_artists_to_nodes_and_links(ARTISTS){

	console.log(ARTISTS)
	var obj = {'nodes':[],'links':[]}

	var levelCursor = 0; 

	for(var a=0; a<ARTISTS.length; a++){
		console.log(ARTISTS[a])
		if (ARTISTS[a]['level'] != levelCursor && a > 0) { 
			obj['links'].push({"source": ARTISTS[a-1]['artist'], "target": ARTISTS[a]['artist'], "value": 4})
			levelCursor = ARTISTS[a]['level'];
				
		} 

		obj['nodes'].push({'id':ARTISTS[a]['artist'], 'group':Math.floor(Math.random() * 10) + 1, 'radius':ARTISTS[a]['level']})
	}

	console.log(obj)

	   fireAway(obj)
}





function fireAway(object){
	var svg = d3.select("svg"),
	    width = +svg.attr("width"),
	    height = +svg.attr("height");

	var color = d3.scaleOrdinal(d3.schemeCategory20);

	var simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(function(d) { return d.id; }))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(width / 2, height / 2));

		d3.json("miserables.json", function(error, graph) {
				if (error) throw error;
				console.log(graph)
				console.log('object')
				console.log(object)
				graph = object;

				var link = svg.append("g")
				.attr("class", "links")
				.selectAll("line")
				.data(graph.links)
				.enter().append("line")
				.attr("stroke-width", function(d) { return Math.sqrt(d.value); });


			var node = svg.append("g")
			.attr("class", "nodes")
			.selectAll("circle")
			.data(graph.nodes)
			.enter().append("circle")
			.attr("r", function(d){
				return d.radius;
				})
			.attr("fill", function(d) { return color(d.id); })
			.call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended));

			node.append("svg:title")
				.attr("dx", 12)
				.attr("dy", ".35em")
				.text(function(d) { return d.id });

			var labels = svg.append("g")
				.attr("class", "label")
				.selectAll("text")
				.data(graph.nodes)
				.enter().append("text")
				.attr("class", "labels")
				
				.attr("dx", 6)
				.attr("dy", ".35em")
				.text(function(d) { return d.id });



			simulation
				.nodes(graph.nodes)
				.on("tick", ticked);

			simulation.force("link")
				.links(graph.links);

			function ticked() {
				link
					.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				node
					.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });

				labels
					.attr("x", function(d) { return d.x; })
					.attr("y", function(d) { return d.y; });  		
			}
	});

function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
}

function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}

function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
}
}





















































/*
var nextLevel = function(level){ //Recursion 
	console.log(level)
	if( level == MAX ){
		return console.log('max level')
	} else {
		return setTimeout(function() {  //setTimeout not necessary, just for clairity and potential visual FX
				//addNew(level)	
				nextLevel(level+1) 	
		},500)
	}
}*/






/*
function initRecommended(i){		
	
	for(var j=0; j<RELEVENT_ARTISTS; j++){
			var num = Math.floor(Math.random() * 50) + 1; 
			

			if(typeof ARTISTS[i] != "object"){ //init the first array object - prob better way to do this 
				 ARTISTS[i] = [num]	
			} else {
				ARTISTS[i].push(num)
			}
		}
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
							MUSICIANS.push(this) //You can add unique identifiers here, depending on degree #.
							searchRecommendations(this.id, degree+1)
						}
					})
					

				      console.log('MUSICIANS');
				      console.log(MUSICIANS);

				}		
			});	

		},300,degree)
	}
}
*/








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




/*



var MUSICIANS = new Array(2) 
var IDS = []; 
var DEGREES = 1; 

//first degree find the single artist. Following degree search recommendations for each artist in that degree's Array index
function addNewArtist(artist, degree){
	if (degree === 0) {
		searchArtist(artist, degree);
	} else {
		MUSICIANS[degree].artists.forEach(function(item) {
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
				//IDS.push(response.artists.items[0].id);//MUSICIANS.push(response.artists.items[0].name)				
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
							MUSICIANS.push(this) //You can add unique identifiers here, depending on degree #.
							searchRecommendations(this.id, degree+1)
						}
					})
					

				      console.log('MUSICIANS');
				      console.log(MUSICIANS);

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





