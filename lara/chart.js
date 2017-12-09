//var rect = document.getElementById('barChart').getBoundingClientRect();
	const contextHeight = 50;
	const contextTextHeight = 40;
	const contextHeightTotal = contextHeight + contextTextHeight;
    const contextWidth = width;
var margin = {top: 20, right: 10, bottom: 20, left: 10},
	padding = {top: 60, right: 60, bottom: 60, left: 60},
    outerWidth = 700, //rect.width,
    outerHeight = 500; //rect.height - contextHeightTotal;
var innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom;
	//width = innerWidth - padding.left - padding.right,
    //height = innerHeight - padding.top - padding.bottom;
var width = 700,
	barHeight = 40,
	textPlaceholderLeft = 160;
	textPlaceholderRight = 200;

d3.csv("elements-by-episode_new.csv", function(csvdata) { 
	let columns = ["Apple Frame", "Aurora Borealis", "Barn", "Beach", "Boat", "Bridge", "Building", "Bushes", "Cabin", "Cactus", "Circle Frame", "Cirrus", "Cliff", "Clouds", "Conifer", "Cumulus", "Deciduous", "Dock", "Double Oval Frame", "Farm", "Fence", "Fire", "Florida Frame", "Flowers", "Fog", "Grass", "Guest", "Half Circle Frame", "Half Oval Frame", "Hills", "Lake", "Lighthouse", "Mill", "Moon", "Mountain", "Mountains", "Night", "Ocean", "Oval Frame", "Palm Trees", "Path", "Person", "Portrait", "Rectangle 3D Frame", "Rectangular Frame", "River", "Rocks", "Seashell Frame", "Snow", "Snowy Mountain", "Split Frame", "Steve Ross", "Structure", "Sun", "Tomb Frame", "Tree", "Trees", "Triple Frame", "Waterfall", "Waves", "Windmill", "Window Frame", "Winter", "Wood Framed"];
  
	d3.csv("elements-categories_new.csv", function(csvdata2) {
	let columns2 = ["ELEMENT", "CATEGORY"];
	
	var categoryColors = [["Frames", "Weather", "Structures", "Landscape", "Plants", "Guests", "Humans"], ["#000000", "#7cccff", "#666666", "#55b247", "#399661", "#130ea0", "#ffeec9"]];
	var unselectedColor = '#AAAAAA';
    
    const generateData = (keys,n1,n2) => {
		const data = d3.range(n2-n1+2).map((d, i) => {
		  var row = new Array(2);
		  row[0] = ["Apple Frame", "Aurora Borealis", "Barn", "Beach", "Boat", "Bridge", "Building", "Bushes", "Cabin", "Cactus", "Circle Frame", "Cirrus", "Cliff", "Clouds", "Conifer", "Cumulus", "Deciduous", "Dock", "Double Oval Frame", "Farm", "Fence", "Fire", "Florida Frame", "Flowers", "Fog", "Grass", "Guest", "Half Circle Frame", "Half Oval Frame", "Hills", "Lake", "Lighthouse", "Mill", "Moon", "Mountain", "Mountains", "Night", "Ocean", "Oval Frame", "Palm Trees", "Path", "Person", "Portrait", "Rectangle 3D Frame", "Rectangular Frame", "River", "Rocks", "Seashell Frame", "Snow", "Snowy Mountain", "Split Frame", "Steve Ross", "Structure", "Sun", "Tomb Frame", "Tree", "Trees", "Triple Frame", "Waterfall", "Waves", "Windmill", "Window Frame", "Winter", "Wood Framed"];
		  row[1] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
          
          csvdata.filter(element => element['SEASON']==n1+i-1).
            forEach(function(elem) {
				var i = 0;
				columns.forEach(function(key) {
					var number = row[1][i];
					if (number == NaN) {number = 0};
					row[1][i] += Number(elem[key]);
					i++;
				})
            });
          return row;
        });
		
 		var dataset = new Array(columns.length);
		for (var i = 0; i < columns.length; i++) {
			dataset[i] = new Array(3);
			dataset[i][2] = 0;
		} 
		
		data.forEach(function(elem) {
			for (var i = 0; i < elem[1].length; i++){
				dataset[i][1] = elem[0][i];
				dataset[i][2] += elem[1][i];
			}
		})
		
		csvdata2.forEach(function(elem) {
			for (var i = 0; i < columns.length; i++) {
				if (dataset[i][1] == elem[columns2[0]]){
					dataset[i][0] = elem[columns2[1]];
		}}})
		
		var categories = [["Frames", "Weather", "Structures", "Landscape", "Plants", "Guests", "Humans"], [0, 0, 0, 0, 0, 0, 0]];
			
		dataset.forEach(function(elem) {
			for (var i = 0; i < categories[0].length; i++){
				if (elem[0] === categories[0][i]){
					categories[1][i] += elem[2];
				}
			}
		});
		
		var subcategories = [[["Apple Frame", "Circle Frame", "Double Oval Frame", "Florida Frame", "Half Circle Frame", "Half Oval Frame", "Oval Frame", "Rectangle 3D Frame", "Rectangular Frame", "Seashell Frame", "Split Frame", "Tomb Frame", "Triple Frame", "Window Frame", "Wood Framed"],[]],
						[["Aurora Borealis", "Cirrus", "Clouds", "Cumulus", "Fire", "Fog", "Moon", "Night", "Snow", "Sun", "Winter"],[]],
						[["Barn", "Boat", "Bridge", "Building", "Cabin", "Dock", "Farm", "Fence", "Lighthouse", "Mill", "Structure", "Windmill"],[]],
						[["Beach", "Cliff", "Hills", "Lake", "Mountain", "Mountains", "Ocean", "Path", "River", "Rocks", "Snowy Mountain", "Waterfall", "Waves"],[]],
						[["Bushes", "Cactus", "Conifer", "Deciduous", "Flowers", "Grass", "Palm Trees", "Tree", "Trees"],[]],
						[["Guest", "Steve Ross"],[]],
						[["Person", "Portrait"],[]]];
		
		dataset.forEach(function(elem) {
			for (var i = 0; i < categories[0].length; i++){
				if (elem[0] === categories[0][i]){ //get the right category
						subcategories[i][1].push(elem[2])}} // to add if the element appears
		})

		var result = [categories, subcategories];
        return result;
      };
	
	// Generate context element
	{d3.select("#barChart").select(".barChartSvgcontext").remove();
	  
    var svgcontext = d3.select("#barChartContext").append('svg')
		.attr("class","barChartSvgcontext")
		.attr("width", outerWidth)
		.attr("height", contextHeightTotal)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create a context for a brush
    const xScaleGeneral=d3.scaleLinear()
		.domain([0,31])
        .range([0, innerWidth]);
    var contextXScale = d3.scaleLinear()
		.range([0, innerHeight])
		.domain(xScaleGeneral.domain());

      var contextAxis = d3.axisBottom(contextXScale)
        .tickSize(contextHeight)
        .tickPadding(10);

      var contextArea = d3.area()
        .x(function(d) {
          return contextXScale(d.time);
        })
        .y0(contextHeight)
        .y1(0)
        .curve(d3.curveLinear);

      var brush = d3.brushX()
        .extent([
          [contextXScale.range()[0], 0],
          [contextXScale.range()[1], contextHeight]
        ])
        .on("brush", onBrush);

      let context = svgcontext.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + 0  + "," + (margin.top  - 50) + ")");

      context.append("g")
        .attr("class", "x axis top")
        .attr("transform", "translate(0,0)")
        .call(contextAxis)

      context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", 0)
        .attr("height", contextHeight);

      context.append("text")
        .attr("class", "instructions")
        .attr("transform", "translate(" + -margin.left + "," + (contextHeight + contextTextHeight) + ")")
        .text('Click and drag above to zoom / pan the data');
	}
	
	var brushLowerBound = 0;
	var brushUpperBound = 31; 
	
	// Brush handler. Get time-range from a brush and pass it to the charts. 
    function onBrush() {
		var b = d3.event.selection === null ? contextXScale.domain() : d3.event.selection.map(contextXScale.invert);
        brushLowerBound = Math.ceil(b[0]);
		brushUpperBound = Math.floor(b[1]);
		renderGeneratedData(Math.ceil(b[0]),Math.floor(b[1]));      
    }
	
	var currentCategory;
	var currentD;
	var currentI;
	
	// render data
	const render = (data) => {
		
	var categories = data[0];
	var subcategories = data[1];
	

	
	//matches category and returns color value for this category
	function getColor(d, i) {
		if(currentI == null){
			for (var k = 0; k < categoryColors[0].length; k++){
				if (categories[0][i] == categoryColors[0][k]){
					return categoryColors[1][k]}}}
		else {
			if (currentI == i){
				return categoryColors[1][i]}
			else {return unselectedColor;}
		}}
	
	function updateDetailedChart() {
		if (currentCategory == null){
			return;
		} 
		else{		
			d = currentD;
			i = currentI;
			
			var barHeight2 = ((barHeight * categories[0].length) / (subcategories[i][0].length));
			var y = d3.scaleLinear()
			.domain([0, d3.max(subcategories[i][1])])
			.range([0, width-textPlaceholderRight]);  
			
			d3.select("#detailedChart").selectAll("#detailedChartGraph").remove();
			var detailedChart = d3.select("#detailedChart").insert("svg",":first-child")
			.attr("width", width)
			.attr("height", barHeight2 * subcategories[i][1].length)
			.attr("id", "detailedChartGraph");
			
			var bar2 = detailedChart.selectAll("g")
			.data(subcategories[i][1])
			.enter().append("g")
			.attr("transform", function(d, i) { return "translate(" + textPlaceholderLeft + "," + i * barHeight2 + ")"; });
			
			bar2.append("rect")
			.attr("width", y)
			.attr("height", barHeight2 - 1);
			
			bar2.attr("fill", function (d, j) {return getColor(d, i)}); 
			
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
		}
	}
	//d3.select("#overallChart").remove();
	console.log("i:"+currentI)
	
 	var x = d3.scaleLinear()
		.domain([0, d3.max(categories[1])])
		.range([0, width-textPlaceholderRight]); 

	d3.select("#overallChart").selectAll("#overallChartGraph").remove();
	var overallChart = d3.select("#overallChart").insert("svg",":first-child")
		.attr("width", width)
		.attr("height", barHeight * categories[1].length)
		.attr("id", "overallChartGraph");

	var bar = overallChart.selectAll("g")
		.data(categories[1])
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(" + textPlaceholderLeft + "," + i * barHeight + ")"; });

	bar.append("rect")
		.attr("height", barHeight - 1)
		.attr("width", x);
		
	////////////HERE////////////////////////////
	bar.attr("fill", function (d, i) {return getColor(d, i)}) 
		.on('mouseover', function(d, i) {
			if (currentI == i){
				console.log("hello");
				currentI = null;
				renderGeneratedData(brushLowerBound, brushUpperBound);
				d3.select("#detailedChart").selectAll("g").remove();
				return;
			}
			currentCategory = d3.select(this); 
			currentD = d;
			currentI = i;
			bar.attr("fill", unselectedColor);
			currentCategory.attr("fill", function (d, j) {return getColor(d, i)})
			updateDetailedChart()});
		/*.on('click', function() {
			bar.attr("fill", function (d, i) {return getColor(d, i)})
			d3.select("#detailedChart").selectAll("g").remove();
			});*/

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
	
	if (currentI != null){updateDetailedChart()};
	}
	
	const renderGeneratedData = (n1,n2) => {
		render(generateData(columns,n1,n2));
    }
	
	renderGeneratedData(0,31);
})
}); 

