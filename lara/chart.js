d3.csv("elements-by-episode.csv", function(csvdata) { 
  let columns = ["APPLE_FRAME","AURORA_BOREALIS","BARN","BEACH","BOAT","BRIDGE","BUILDING","BUSHES","CABIN","CACTUS","CIRCLE_FRAME","CIRRUS","CLIFF","CLOUDS","CONIFER","CUMULUS","DECIDUOUS","DIANE_ANDRE","DOCK","DOUBLE_OVAL_FRAME","FARM","FENCE","FIRE","FLORIDA_FRAME","FLOWERS","FOG","FRAMED","GRASS","GUEST","HALF_CIRCLE_FRAME","HALF_OVAL_FRAME","HILLS","LAKE","LAKES","LIGHTHOUSE","MILL","MOON","MOUNTAIN","MOUNTAINS","NIGHT","OCEAN","OVAL_FRAME","PALM_TREES","PATH","PERSON","PORTRAIT","RECTANGLE_3D_FRAME","RECTANGULAR_FRAME","RIVER","ROCKS","SEASHELL_FRAME","SNOW","SNOWY_MOUNTAIN","SPLIT_FRAME","STEVE_ROSS","STRUCTURE","SUN","TOMB_FRAME","TREE","TREES","TRIPLE_FRAME","WATERFALL","WAVES","WINDMILL","WINDOW_FRAME","WINTER","WOOD_FRAMED"];
  var dataset = new Array(columns.length);
  for (var i = 0; i < columns.length; i++) {
    dataset[i] = new Array(3);
	dataset[i][2] = 0;
  }

  csvdata.forEach(function(painting) {
    for (var i = 0; i < columns.length; i++) {
		dataset[i][1] = columns[i];
		if (painting[columns[i]]==1){
			dataset[i][2] += 1;}
  }})
  
  d3.csv("elements-categories.csv", function(csvdata2) {
	let columns2 = ["ELEMENT", "CATEGORY"];
	csvdata2.forEach(function(elem) {
		for (var i = 0; i < columns.length; i++) {
			if (dataset[i][1] == elem[columns2[0]]){
				dataset[i][0] = elem[columns2[1]];
	}}})

	var categories = ["Frames", "Structures", "Plants", "Landscape", "Weather", "Guests", "Humans"];
	var datasetCategories = new Array(categories.length);
	for (var i = 0; i < categories.length; i++) {
		datasetCategories[i] = 0;
	}
				
	dataset.forEach(function(elem) {
		for (var i = 0; i < categories.length; i++){
			if (elem[0] === categories[i]){
				datasetCategories[i] += elem[2];
			}
		}
	});
	
	console.log(dataset);
	console.log(categories);
	console.log(datasetCategories);
	
	var categoryColors = ["#000000", "#776f6f", "#399661", "#55b247", "#7cccff", "#130ea0", "#ffeec9"];
	var unselectedColor = '#888888';

	var width = 420,
		barHeight = 40;

 	var x = d3.scale.linear()
		.domain([0, d3.max(datasetCategories)])
		.range([0, width-150]); 

	var overallChart = d3.select("#overallChart")
		.attr("width", width)
		.attr("height", barHeight * datasetCategories.length);

	var bar = overallChart.selectAll("g")
		.data(datasetCategories)
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(100," + i * barHeight + ")"; });

	bar.append("rect")
		.attr("width", x)
		.attr("height", barHeight - 1)
		
	var rect = bar.selectAll("rect")
	
	bar.attr('fill', function (d, i) { return categoryColors[i]})
		.on('mouseover', function(d, i) {
			bar.attr("fill", unselectedColor);
			d3.select(this).attr("fill", categoryColors[i])})
		.on('mouseout', function() {
			bar.attr("fill", function(d, i) {
			return categoryColors[i];});});	

	bar.append("text")
		.attr("x", function(d) { return x(d) + 5; })
		.attr("y", barHeight / 2)
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.text(function(d) { return d; });
		
	bar.append("text")
		.attr("x", function(d) { return -5; })
		.attr("y", barHeight / 2)
		.attr("dy", ".35em")
		.attr("text-anchor", "end")
		.text(function(d, i) { return categories[i]; });

	var barUpdate = bar.data(datasetCategories);
	var barEnter = barUpdate.enter().append("div")
	barEnter.style("width", function(d) {return x(d) + "px";})
			.text(function(d) {return d;})


})}); 

