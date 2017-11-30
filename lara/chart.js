d3.csv("elements-by-episode_new.csv", function(csvdata) { 
  let columns = ["Apple Frame", "Aurora Borealis", "Barn", "Beach", "Boat", "Bridge", "Building", "Bushes", "Cabin", "Cactus", "Circle Frame", "Cirrus", "Cliff", "Clouds", "Conifer", "Cumulus", "Deciduous", "Dock", "Double Oval Frame", "Farm", "Fence", "Fire", "Florida Frame", "Flowers", "Fog", "Framed", "Grass", "Guest", "Half Circle Frame", "Half Oval Frame", "Hills", "Lake", "Lighthouse", "Mill", "Moon", "Mountain", "Mountains", "Night", "Ocean", "Oval Frame", "Palm Trees", "Path", "Person", "Portrait", "Rectangle 3D Frame", "Rectangular Frame", "River", "Rocks", "Seashell Frame", "Snow", "Snowy Mountain", "Split Frame", "Steve Ross", "Structure", "Sun", "Tomb Frame", "Tree", "Trees", "Triple Frame", "Waterfall", "Waves", "Windmill", "Window Frame", "Winter", "Wood Framed"];
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
  
  d3.csv("elements-categories_new.csv", function(csvdata2) {
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

	var width = 700,
		barHeight = 40,
		leftMargin = 160;
		rightMargin = 200;
		
 	var x = d3.scale.linear()
		.domain([0, d3.max(categories[1])])
		.range([0, width-rightMargin]); 

	var overallChart = d3.select("#overallChart")
		.attr("width", width)
		.attr("height", barHeight * categories[1].length);

	var bar = overallChart.selectAll("g")
		.data(categories[1])
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(" + leftMargin + "," + i * barHeight + ")"; });

	bar.append("rect")
		.attr("width", x)
		.attr("height", barHeight - 1)
	
	bar.attr("fill", function (d, i) {return getColor(d, i)}) 
		.on('mouseover', function(d, i) {
			bar.attr("fill", unselectedColor);
			d3.select(this).attr("fill", function (d, j) {return getColor(d, i)})
			
			var barHeight2 = ((barHeight * categories[0].length) / (subcategories[i][0].length));
 			var y = d3.scale.linear()
			.domain([0, d3.max(subcategories[i][1])])
			.range([0, width-rightMargin]);  
			
			var detailedChart = d3.select("#detailedChart")
			.attr("width", width)
			.attr("height", barHeight2 * subcategories[i][1].length);
			
			var bar2 = detailedChart.selectAll("g")
			.data(subcategories[i][1])
			.enter().append("g")
			.attr("transform", function(d, i) { return "translate(" + leftMargin + "," + i * barHeight2 + ")"; });
			
			bar2.append("rect")
			.attr("width", y)
			.attr("height", barHeight2 - 1)
			.attr("fill", function (d, j) {return getColor(d, i)}); 
			
			bar2.append("text")
			.attr("x", function(d, j) { return y(subcategories[i][1][j]) + 5; })
			.attr("y", barHeight2 / 2)
			.attr("dy", ".35em")
			.attr("text-anchor", "start")
			.text(function(d, j) { return subcategories[i][1][j]; });
			
			bar2.append("text")
			.attr("x", function(d) { return -5; })
			.attr("y", barHeight2 / 2)
			.attr("dy", ".35em")
			.attr("text-anchor", "end")
			.text(function(d, j) { return subcategories[i][0][j]; });

			var barUpdate = bar.data(function(d, i) {return subcategories[1][i]});
			var barEnter = barUpdate.enter().append("div")
			barEnter.style("width", function(d) {return y(d) + "px";})
				.text(function(d) {return d;})
			})
		.on('mouseout', function() {
			bar.attr("fill", function (d, i) {return getColor(d, i)})
			d3.select("#detailedChart").selectAll("g").remove();
			});

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

