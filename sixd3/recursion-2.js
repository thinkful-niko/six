

var MAX, ARTISTS, RELEVENT_ARTISTS; 
var table = document.getElementById("myTable");


$(function(){
	//nextLevel(0) //Begin
	$('button').click(function(e){
		
		e.preventDefault();

		MAX = 2; //Maximum levels queried

		ARTISTS = new Array(1);  //Multidimensional array with the number of potential 'artists' i.e. compare Madonna, to Beethoven to Eminem to nth-artist --Must equal inputs
		RELEVENT_ARTISTS = Math.min(3, 20); //Number of relevent artists added to the list for each new artist 

		RELEVENT_ARTISTS_RETURNED = 1; 

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
		console.log('searchArtists for relevant artist '+$('input')[i].value)	
		searchArtists($('input')[i].value, i, level)
	}
}





function searchArtists(artist, artists_order, level) {
	$.ajax({
		url: 'https://api.spotify.com/v1/search',
		data: {
			q: artist,
			type: 'artist'
		},
		success: function (response) {
			console.log(response); 
			for(var j=0; j<RELEVENT_ARTISTS; j++){
				var relevent_artist = response.artists.items[j]; 

				if(relevent_artist){
					//console.log(relevent_artist.name)
					//var row = table.insertRow(0);
					//row.innerHTML = relevent_artist.name
					//$('table').append('<div id="'+ relevent_artist.name+'" class="artist">'+relevent_artist.name+'</div>')
					searchRecommendations(relevent_artist, artists_order, level);
					
				}
			}

		}
	
	});
}

function searchRecommendations(relevent_artist, artist_order, level) {
	$.ajax({
		url: 'https://api.spotify.com/v1/artists/' + relevent_artist.id + '/related-artists',
		data: {
			type: 'artist',
		},
		success: function (response) {
			//console.log(' ')console.log(relevent_artist.name + 's related artists:');console.log(response)console.log(response.artists.length)
				console.log(response)
					
				for(var a=0; a<RELEVENT_ARTISTS_RETURNED; a++){
					var artist = response.artists[a].name;
					if(typeof ARTISTS[artist_order] != "object"){ //init the first array object - prob better way to do this 
							 //ARTISTS[artist_order] = [num]	
							var obj = { 'artist' : artist,  'level':level+1} 
							 ARTISTS[artist_order] = [obj]
						} else {
							//ARTISTS[artist_order].push(num)
							var obj = { 'artist' : artist,  'level':level+1} 
							ARTISTS[artist_order].push(obj)
								
					}

				
				}
	
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
      console.log(ARTISTS)
      getMatches(ARTISTS);
      convert_artists_to_nodes_and_links(ARTISTS)
}); 





function convert_artists_to_nodes_and_links(ARTISTS){

	console.log(ARTISTS)
	var obj = {'nodes':[],'links':[]}

	for(var a=0; a<ARTISTS[0].length; a++){
		obj['nodes'].push({'id':ARTISTS[0][a]['artist'], 'group':Math.floor(Math.random() * 10) + 1, 'radius':ARTISTS[0][a]['level']})
	}

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
var obj = {
  "nodes": [
    {"id": "Myriel", "group": 1},
    {"id": "Napoleon", "group": 1},
    {"id": "Mlle.Baptistine", "group": 1}
  ],
  "links": [
    {"source": "Napoleon", "target": "Myriel", "value": 1},
    {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8},
]}


console.log(obj)*/
