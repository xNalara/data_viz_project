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

	var categories = new Array(2);
	categories[0] = new Array();

	csvdata2.forEach(function(elem) {
		if (categories[0].indexOf(elem.CATEGORY) == -1){
			categories[0].push(elem.CATEGORY);
	}})
	
	categories[1] = new Array(categories[0].length);
	for (var i = 0; i < categories[0].length; i++) {
		categories[1][i] = 0;
	}
				
	dataset.forEach(function(elem) {
		for (var i = 0; i < categories[0].length; i++){
			if (elem[0] === categories[0][i]){
				categories[1][i] += elem[2];
			}
		}
	});
			
	var subcategories = new Array(categories[0].length);
	for (var i = 0; i < subcategories.length; i++) {
		subcategories[i] = new Array(2);
		subcategories[i][0] = new Array();
		subcategories[i][1] = new Array();}
		
	dataset.forEach(function(elem) {
		for (var i = 0; i < categories[0].length; i++){
			if (elem[0] === categories[0][i]){
				if (subcategories[i][0].indexOf(elem[1]) == -1){
					subcategories[i][0].push(elem[1]);
					subcategories[i][1].push(elem[2])}}
	}})
	
	console.log(dataset);
	console.log(categories);
	console.log(subcategories);
	
	var categoryColors = [["Frames", "Weather", "Structures", "Landscape", "Plants", "Guests", "Humans"], ["#000000", "#7cccff", "#666666", "#55b247", "#399661", "#130ea0", "#ffeec9"]];
	var unselectedColor = '#AAAAAA';

	var width = 420,
		barHeight = 40;

 	var x = d3.scale.linear()
		.domain([0, d3.max(categories[1])])
		.range([0, width-150]); 

	var overallChart = d3.select("#overallChart")
		.attr("width", width)
		.attr("height", barHeight * categories[1].length);

	var bar = overallChart.selectAll("g")
		.data(categories[1])
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(100," + i * barHeight + ")"; });

	bar.append("rect")
		.attr("width", x)
		.attr("height", barHeight - 1)
		
	var rect = bar.selectAll("rect")
	
	bar.attr('fill', function (d, i) {return getColor(d, i)}) 
		.on('mouseover', function(d, i) {
			bar.attr("fill", unselectedColor);
			d3.select(this).attr("fill", function (d, j) {return getColor(d, i)})})
		.on('mouseout', function() {
			bar.attr("fill", function (d, i) {return getColor(d, i)})});

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
		.text(function(d, i) { return categories[0][i]; });

	var barUpdate = bar.data(categories[1]);
	var barEnter = barUpdate.enter().append("div")
	barEnter.style("width", function(d) {return x(d) + "px";})
			.text(function(d) {return d;})

	//matches category and returns color value for this category
	function getColor(d, i) {
		for (var k = 0; k < categoryColors[0].length; k++){
				if (categories[0][i] == categoryColors[0][k]){
					return categoryColors[1][k]}}}

})}); 

