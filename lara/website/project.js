function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
	const headerOffset = 40;
	var headerBottom = document.getElementById('header').getBoundingClientRect().bottom + headerOffset;
    // Partially visible elements return true:
    isVisible = elemTop < window.innerHeight && elemBottom > headerBottom && elemBottom >= 0;
    return isVisible;
}

/* control behavior of subheadings when scrolling */
window.onload = function() {
	scrollControl(); 
	chord(); 
	colorstream();
	barChart();}
window.onresize = function(){
	chord(); 
	colorstream();
	barChart(true);}


scrollControl = function(){
	window.onscroll = function(){	
		var subheadings = document.getElementsByClassName('subheading');
		for (var i = 0; i < subheadings.length; i++){
			if (subheadings[i].textContent == "Paintings") {
				if (isScrolledIntoView(document.getElementById('paintingsBox'))){
					if ((subheadings[i].classList.contains('currentlyNotShown'))){
						subheadings[i].classList.remove('currentlyNotShown');
						subheadings[i].classList.add('currentlyShown');
					}	
				}
				else {
					if ((subheadings[i].classList.contains('currentlyShown'))){
						subheadings[i].classList.remove('currentlyShown');
						subheadings[i].classList.add('currentlyNotShown');
					}	
					
				}
			}
			if (subheadings[i].textContent == "Elements") {
				if (isScrolledIntoView(document.getElementById('elementsBox'))){
					if ((subheadings[i].classList.contains('currentlyNotShown'))){
						subheadings[i].classList.remove('currentlyNotShown');
						subheadings[i].classList.add('currentlyShown');
					}	
				}
				else {
					if ((subheadings[i].classList.contains('currentlyShown'))){
						subheadings[i].classList.remove('currentlyShown');
						subheadings[i].classList.add('currentlyNotShown');
					}	
					
				}
			}
			if (subheadings[i].textContent == "Colors") {
				if (isScrolledIntoView(document.getElementById('colorsBox'))){
					if ((subheadings[i].classList.contains('currentlyNotShown'))){
						subheadings[i].classList.remove('currentlyNotShown');
						subheadings[i].classList.add('currentlyShown');
					}	
				}
				else {
					if ((subheadings[i].classList.contains('currentlyShown'))){
						subheadings[i].classList.remove('currentlyShown');
						subheadings[i].classList.add('currentlyNotShown');
					}	
					
				}
			}
		}
	};}
	
colorstream = function(){	
	var rect = document.getElementById('colorstream').getBoundingClientRect();
	const contextHeight = 50;
	const contextTextHeight = 40;
	const contextHeightTotal = contextHeight + contextTextHeight;
  const contextWidth = width;
  var margin = {top: 20, right: 10, bottom: 20, left: 10},
      padding = {top: 60, right: 60, bottom: 60, left: 60},
      outerWidth = rect.width,
      outerHeight = rect.height - contextHeightTotal;
  var innerWidth = outerWidth - margin.left - margin.right,
      innerHeight = outerHeight - margin.top - margin.bottom,
      width = innerWidth - padding.left - padding.right,
      height = innerHeight - padding.top - padding.bottom;


  d3.csv("bobrossjoined.csv", function(dd) { 
    // Everything after happens when we have loaded the csv file
    const color_names = ["Alizarin Crismon","Black Gesso","Bright Red","Burnt Amber","Cadmium Yellow","Dark Sienna","Indian Red","Indian Yellow","Liquid Black","Liquid Clear","Midnight Black","Phthalo Blue","Phthalo Green","Prussian Blue","Sap Green","Titanium White","Van Dyke Brown","Yellow Ochre"];
    const hexadec = ["#4E1500", "#000000", "#DB0000", "#8A3324", "#FFEC00", "#5F2E1F", "#CD5C5C", "#FFB800", "#000000", "#C0C2C4",  "#000000", "#0C0040", "#102E3C","#021E44","#0A3410", "#FFFFFF", "#221B15", "#C79B00"];

    const generateData = (keys,n1,n2) => {

      const data = d3.range(n2-n1+2).map((d, i) => {
        const row = {"Alizarin Crismon" : 0,"Black Gesso" : 0,"Bright Red" : 0,"Burnt Amber" : 0,"Cadmium Yellow" : 0,"Dark Sienna" : 0,"Indian Red" : 0,"Indian Yellow" : 0,"Liquid Black" : 0,"Liquid Clear" : 0,"Midnight Black" : 0,"Phthalo Blue" : 0,"Phthalo Green" : 0,"Prussian Blue" : 0,"Sap Green" : 0,"Titanium White" : 0,"Van Dyke Brown" : 0,"Yellow Ochre" : 0};
        row["time"]= n1+i-1;

        dd.filter(element => element['SEASON']==n1+i-1).
          forEach(function(elem) {
            color_names.forEach(function(key) {
              var number = Number(row[key]);
              if (number == NaN) {number = 0};
              row[key]=Number(number)+Number(elem[key]);
            });
          });
        return row;
      });
      
      data.keys = keys
      return data
    };


    const width = innerWidth
    const height = innerHeight

	  d3.select("#colorstream").select(".colorstreamSvgcontext").remove();
	  
    var svgcontext = d3.select("#colorstream").append('svg')
      .attr("class","colorstreamSvgcontext")
      .attr("width", outerWidth)
      .attr("height", contextHeightTotal)
  	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Create a context for a brush
    const xScaleGeneral=d3.scaleLinear()
        .domain([0,31])
        .range([0, width]);
    var contextXScale = d3.scaleLinear()
      .range([0, width])
      .domain(xScaleGeneral.domain());

    var contextAxis = d3.axisBottom(contextXScale)
      .tickSize(contextHeight)
	  .ticks(31)
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
      .on("brush end", onBrush);

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

            // Brush handler. Get time-range from a brush and pass it to the charts. 
    function onBrush() {
      var b = d3.event.selection === null ? contextXScale.domain() : d3.event.selection.map(contextXScale.invert);
      a=Math.ceil(b[0])
      c=Math.floor(b[1])
      if (c-a<1) {c=a+1;}
      renderGeneratedData(a,c);

      
    }
    
    const stack = d3.stack().offset(d3.stackOffsetWiggle)
    const xValue = d => d.time
    const xScale = d3.scaleLinear()
    const yScale = d3.scaleLinear()
    const colorScale = d3.scaleOrdinal().range(hexadec)


    const area = d3.area()
      .x(d => xScale(xValue(d.data)))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveBasis)
    
    const render = (data) => {

    d3.select(".colorstreamSvgchart").remove();

    var svg = d3.select("#colorstream").insert("svg",":first-child")
      .attr("class","colorstreamSvgchart")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    data.splice(0,1);
    stack.keys(data.keys)
    colorScale.domain(data.keys)
    delete data.keys;
    const stacked = stack(data);
  	
    xScale
      .domain(d3.extent(data, d => d.time))
      .range([0, width]);


    yScale
      .domain([
        d3.min(stacked[0], d => d[0]),
        d3.max(stacked[stacked.length - 1], d => d[1])
      ])
      .range([height, 0]);
    
    const transition = d3.transition().duration(1000);
    
    const paths = svg.selectAll('path').data(stacked)
    paths
      .enter().append('path')
      .merge(paths)
        .attr('fill', d => colorScale(d.key))
        .attr('stroke', d => colorScale(d.key))
      .transition(transition)
        .attr('d', area);

    const labels = svg.selectAll('text').data(stacked);
    labels
      .enter().append('text')
        .attr('class', 'area-label')
      .merge(labels)
        .text(d => d.key)
      .transition(transition)
        .attr('transform', d3.areaLabel(area));

    // Add the x Axis
    var x_axis = d3.axisBottom()
               .scale(xScale);

    svg.append("g")
    .attr("transform", "translate(0," + (innerHeight) + ")")
    .call(x_axis);

    svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (innerWidth/2) +","+(outerHeight)+")")  // centre below axis
      .text("Season");
    }
      
    const renderGeneratedData = (n1,n2) => {
      render(generateData(color_names,n1,n2));
    }
    
    renderGeneratedData(0,31);

	});
}

chord = function(){
	var rect = document.getElementById('chord').getBoundingClientRect();
	const contextHeight = 50;
	const contextTextHeight = 40;
	const contextHeightTotal = contextHeight + contextTextHeight;
  const contextWidth = width;
	var margin = {top: 20, right: 10, bottom: 20, left: 10},
	    padding = {top: 20, right: 60, bottom: 60, left: 60},
      outerWidth = rect.width,
      outerHeight = rect.height,
	    innerWidth = outerWidth - margin.left - margin.right,
	    innerHeight = outerHeight - margin.top - margin.bottom,
	    width = innerWidth - padding.left - padding.right,
	    height = innerHeight - padding.top - padding.bottom;

	var textPlaceholder = 60;


  d3.csv("bobrosscategorized.csv", function(csvdata) { 
    // Everything after happens when we have loaded the csv file
    let columns = [ "Landscapes","Frames", "Structures", "Plants", "Guests", "Weather", "Humans"];

    const generateData = (columns, n1,n2) =>{
      var data = new Array(columns.length*(columns.length-1));
      for (var i = 0; i < columns.length*(columns.length-1); i++) {
        data[i] = new Array(3);
      }
      for (var i = 0; i < columns.length; i++) {
        var realindex = 0;
        for (var j = 0; j < (columns.length); j++) {
          if (i!=j){
            data[(columns.length-1)*i+realindex][0] = columns[i];
            data[(columns.length-1)*i+realindex][1] = columns[realindex];
            data[(columns.length-1)*i+realindex][2] = 0.0;
            realindex += 1;
          } 
        }
      }
      csvdata.filter(element=>(element['SEASON']>=n1)&&(element['SEASON']<=n2)).forEach(function(painting) {
        for (var i = 0; i < columns.length; i++) {
          if (painting[columns[i]]==1){
            var realindex = 0;
            for (var j = 0; j < (columns.length); j++) {
              if (i!=j){
                if (painting[columns[realindex]]==1){
                  data[(columns.length-1)*i+realindex][2] =data[(columns.length-1)*i+realindex][2]+1;
                }
              } 
              realindex += 1;
            }
          }
        }
      })
      return data
    };

    const width = innerWidth
    const height = innerHeight

	  d3.select("#chord").select(".chordSvgcontext").remove();
	  
    var svgcontext = d3.select("#chord").append('svg')
      .attr("class","chordSvgcontext")
      .attr("width", outerWidth)
      .attr("height", contextHeightTotal)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Create a context for a brush
    const xScaleGeneral=d3.scaleLinear()
        .domain([0,31])
        .range([0, width]);
    var contextXScale = d3.scaleLinear()
      .range([0, width])
      .domain(xScaleGeneral.domain());

    var contextAxis = d3.axisBottom(contextXScale)
      .tickSize(contextHeight)
	  .ticks(31)
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
      .on("brush end", onBrush);

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

    // Brush handler. Get time-range from a brush and pass it to the charts. 
    function onBrush() {
      var b = d3.event.selection === null ? contextXScale.domain() : d3.event.selection.map(contextXScale.invert);
      a=Math.ceil(b[0])
      c=Math.floor(b[1])
      if (c-a<1) {c=a+1;}
      renderGeneratedData(a,c);
      
    }


  const render = (data) => {

  	var size = 0;
  	if (width-2*textPlaceholder < height){
		size = (width/2) - 2*textPlaceholder;
  	} else {
  		size = (height/2) - textPlaceholder;
  	}
	
    d3.select(".chordSvgchart").remove();
    var svg = d3.select("#chord").insert("svg",":first-child")
        .attr("class","chordSvgchart")
        .attr("width", outerWidth) 
        .attr("height", outerHeight-contextHeightTotal); 
	
    var colors = {"Frames" : "#000000","Structures" : "#776f6f","Plants" : "#399661","Landscapes" : "#55b247","Weather" : "#7cccff","Guests" : "#130ea0","Humans" : "#ffeec9"};

    var sortOrder =columns

    function sort(a,b){ return d3.ascending(sortOrder.indexOf(a),sortOrder.indexOf(b)); }
		
    var ch = viz.ch().data(data)
        .padding(.01)
        .sort(sort)
        .innerRadius(size-20) //430
        .outerRadius(size) //450
        .duration(1000)
        .chordOpacity(0.3)
        .labelPadding(.03)
        .fill(function(d){ return colors[d];});


  	var xTranslation = 0;
  	if (width-2*textPlaceholder < height){
  		xTranslation = ((outerWidth/2));
  	} else {
  		xTranslation = ((outerWidth/2));
  	}

  	svg.append("g").attr("transform", "translate("+ xTranslation + "," + ((height/2)-20) + ")").call(ch); //600, 480
      // adjust height of frame in bl.ocks.org
      d3.select(self.frameElement).style("height", height).style("width", width);
    }

    const renderGeneratedData = (n1,n2) => {
      render(generateData(columns,n1,n2));
    }
        
    renderGeneratedData(0,31);   
  });
}

var currentCategory;
var currentD;
var currentI;
var clickedI = null;
var brushLowerBound = 0;
var brushUpperBound = 31;

barChart = function(resizing) {
var rect = document.getElementById('barChart').getBoundingClientRect();
	const contextHeight = 50;
	const contextTextHeight = 40;
	const contextHeightTotal = contextHeight + contextTextHeight;
	
const contextOffset = 5;

var margin = {top: 20, right: 10, bottom: 20, left: 10},
	padding = {top: 60, right: 60, bottom: 60, left: 60},
    outerWidth = rect.width,
    outerHeight = rect.height - contextHeightTotal - contextOffset;
var innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom;
	width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom;
	const contextWidth = width;
			
var	barHeight = 40,
	barWidthOverall = document.getElementById('overallChart').getBoundingClientRect().width,
	barWidthDetailed = document.getElementById('detailedChart').getBoundingClientRect().width,
	textPlaceholderLeftOverall = 100,
	textPlaceholderLeftDetailed = 160,
	textPlaceholderRight = 200;

d3.csv("elements-by-episode_new.csv", function(csvdata) { 
	let columns = ["Apple Frame", "Aurora Borealis", "Barn", "Beach", "Boat", "Bridge", "Building", "Bushes", "Cabin", "Cactus", "Circle Frame", "Cirrus", "Cliff", "Clouds", "Conifer", "Cumulus", "Deciduous", "Dock", "Double Oval Frame", "Farm", "Fence", "Fire", "Florida Frame", "Flowers", "Fog", "Grass", "Guest", "Half Circle Frame", "Half Oval Frame", "Hills", "Lake", "Lighthouse", "Mill", "Moon", "Mountain", "Mountains", "Night", "Ocean", "Oval Frame", "Palm Trees", "Path", "Person", "Portrait", "Rectangle 3D Frame", "Rectangular Frame", "River", "Rocks", "Seashell Frame", "Snow", "Snowy Mountain", "Split Frame", "Steve Ross", "Structure", "Sun", "Tomb Frame", "Tree", "Trees", "Triple Frame", "Waterfall", "Waves", "Windmill", "Window Frame", "Winter", "Wood Framed"];
  
	d3.csv("elements-categories_new.csv", function(csvdata2) {
	let columns2 = ["ELEMENT", "CATEGORY"];
	
	var categoryColors = [["Frames", "Weather", "Structures", "Landscape", "Plants", "Guests", "Humans"], ["#000000", "#7cccff", "#666666", "#55b247", "#399661", "#130ea0", "#ffeec9"]];
	var unselectedColor = '#AAAAAA88';
    
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
	const width = innerWidth
    const height = innerHeight
	d3.select("#barChart").select(".barChartSvgcontext").remove();
	  
    var svgcontext = d3.select("#barChart").append('svg')
		.attr("class","barChartSvgcontext")
		.attr("width", outerWidth)
		.attr("height", contextHeightTotal)
		.attr("transform", "translate(0," + contextOffset + ")")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create a context for a brush
    const xScaleGeneral=d3.scaleLinear()
		.domain([0,31])
        .range([0, width]);
    var contextXScale = d3.scaleLinear()
		.range([0, width])
		.domain(xScaleGeneral.domain());

      var contextAxis = d3.axisBottom(contextXScale)
        .tickSize(contextHeight)
		.ticks(31)
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
        .on("brush end", onBrush);

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
	
	
	// Brush handler. Get time-range from a brush and pass it to the charts. 
    function onBrush() {
		var b = d3.event.selection === null ? contextXScale.domain() : d3.event.selection.map(contextXScale.invert);
		brushLowerBound = Math.ceil(b[0]);
		brushUpperBound = Math.floor(b[1]);
        if (brushUpperBound-brushLowerBound<1) {brushUpperBound = brushLowerBound+1;}
        renderGeneratedData(brushLowerBound,brushUpperBound);         
    }
	
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
			.range([0, barWidthDetailed-textPlaceholderRight]);  
			
			d3.select("#detailedChart").selectAll("#detailedChartGraph").remove();
			var detailedChart = d3.select("#detailedChart").insert("svg",":first-child")
			.attr("width", outerWidth)
			.attr("height", barHeight2 * subcategories[i][1].length)
			.attr("id", "detailedChartGraph");
			
			var bar2 = detailedChart.selectAll("g")
			.data(subcategories[i][1])
			.enter().append("g")
			.attr("transform", function(d, i) { return "translate(" + textPlaceholderLeftDetailed + "," + i * barHeight2 + ")"; });
			
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
	
 	var x = d3.scaleLinear()
		.domain([0, d3.max(categories[1])])
		.range([0, barWidthOverall-textPlaceholderRight]); 

	d3.select("#overallChart").selectAll("#overallChartGraph").remove();
	var overallChart = d3.select("#overallChart").insert("svg",":first-child")
		.attr("width", outerWidth)
		.attr("height", barHeight * categories[1].length)
		.attr("id", "overallChartGraph");

	var bar = overallChart.selectAll("g")
		.data(categories[1])
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(" + textPlaceholderLeftOverall + "," + i * barHeight + ")"; });

	bar.append("rect")
		.attr("height", barHeight - 1)
		.attr("width", x);

	bar.attr("fill", function (d, i) {return getColor(d, i)}) 
		.on('mouseover', function(d, i) {
			if(clickedI == null){ // mouseover mode
				if (currentI == i){
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
				updateDetailedChart();
			}
			})
		.on('click', function(d, i) {
			if(clickedI == null){ // set clickedI -> no mouseover anymore
				clickedI = i;
			} else if (clickedI == i){ // switch to mouseover mode
				clickedI = null;
			} else { // select new clickedI (change category)
				clickedI = i;
				currentCategory = d3.select(this); 
				currentD = d;
				currentI = i;
				bar.attr("fill", unselectedColor);
				currentCategory.attr("fill", function (d, j) {return getColor(d, i)})
				updateDetailedChart();
			}
			})
		.on('mouseout', function() {
			if (clickedI == null){
				currentI = null;
				bar.attr("fill", function (d, i) {return getColor(d, i)})
				d3.select("#detailedChart").selectAll("g").remove();}
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
	
	if (currentI != null){updateDetailedChart()};
	if(resizing){console.log("resize"); updateDetailedChart();}
	}
	
	const renderGeneratedData = (n1,n2) => {
		render(generateData(columns,n1,n2));
    }
	
	renderGeneratedData(brushLowerBound,brushUpperBound);
})
}); 
}




///KRISTINA - ConceptMap chart

let columns = ["Apple Frame", "Aurora Borealis", "Barn", "Beach", "Boat", "Bridge", "Building", "Bushes", "Cabin", "Cactus", "Circle Frame", "Cirrus", "Cliff", "Clouds", "Conifer", "Cumulus", "Deciduous", "Dock", "Double Oval Frame", "Farm", "Fence", "Fire", "Florida Frame", "Flowers", "Fog", "Framed", "Grass", "Guest", "Half Circle Frame", "Half Oval Frame", "Hills", "Lake", "Lighthouse", "Mill", "Moon", "Mountain", "Mountains", "Night", "Ocean", "Oval Frame", "Palm Trees", "Path", "Person", "Portrait", "Rectangle 3D Frame", "Rectangular Frame", "River", "Rocks", "Seashell Frame", "Snow", "Snowy Mountain", "Split Frame", "Steve Ross", "Structure", "Sun", "Tomb Frame", "Tree", "Trees", "Triple Frame", "Waterfall", "Waves", "Windmill", "Window Frame", "Winter", "Wood Framed"];
obj = [];
inTransition = 0;
data = [];
svg_chart = null;
svg_brush = null;

const maxSelectedSeasons = 2;

function load_data(episode) {
        var newElem = [];
        //console.log(episode.TITLE);
        cols = [];

        // add list of elements appearing
        for(j = 0; j < columns.length; j++)  {
            var col = columns[j];
            if(episode[col] == 1){
                cols.push(col);
            }
        }

        //add season and episode
        newElem.push(episode.TITLE);    // 0
        newElem.push(cols);             // 1
        newElem.push(episode.EPISODE);  // 2
        newElem.push(episode.SEASON);   // 3
        newElem.push(episode.IMAGE);    // 4
        newElem.push(episode.YOUTUBE);  // 5
        obj.push(newElem);
}

function get_filtered_data(start, stop) {
    filtered = [];

    for(i = 0; i < obj.length; i++) {
        episode = obj[i];
        season = episode[3]; // 2 is position of the episode.EPISODE in the obj[] element

        if(season > start && season <= stop) {
            filtered.push(episode);
        }
    }

    console.log("start, stop: ", start, stop, " = ", filtered.length);

    return filtered;
}

function render_data() {
    // widget
    var outer = d3.map();
    var inner = [];
    var links = [];

    var outerId = [0];

    // widget: prepare data
    data.forEach(function(d) {

        if (d == null)
            return;

        // this metadata will be acceessible in the onClick() handler
        i = {
            id: 'i' + inner.length,
            name: d[0],
            episode: d[2],
            season: d[3],
            image: d[4],
            video: d[5],
            related_links: []
        };

        i.related_nodes = [i.id];
        inner.push(i);

        if (!Array.isArray(d[1]))
            d[1] = [d[1]];

        d[1].forEach(function(d1){

            o = outer.get(d1);

            if (o == null)
            {
                o = { name: d1,	id: 'o' + outerId[0], related_links: [] };
                o.related_nodes = [o.id];
                outerId[0] = outerId[0] + 1;

                outer.set(d1, o);
            }

            // create the links
            l = { id: 'l-' + i.id + '-' + o.id, inner: i, outer: o };
            links.push(l);

            // and the relationships
            i.related_nodes.push(o.id);
            i.related_links.push(l.id);
            o.related_nodes.push(i.id);
            o.related_links.push(l.id);
        });
    });

    data = {
        inner: inner,
        outer: outer.values(),
        links: links
    };

    // sort the data -- TODO: have multiple sort options
    outer = data.outer;
    data.outer = Array(outer.length);


    var i1 = 0;
    var i2 = outer.length - 1;

    for (var i = 0; i < data.outer.length; ++i)
    {
        if (i % 2 == 1)
            data.outer[i2--] = outer[i];
        else
            data.outer[i1++] = outer[i];
    }

    //console.log(data.outer.reduce(function(a,b) { return a + b.related_links.length; }, 0) / data.outer.length);


    // from d3 colorbrewer:
    // This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
    var colors = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"];
    var color = d3.scaleLinear()
        .domain([10, 220])
        .range([colors.length-1, 0])
        .clamp(true);

    //var color = "#00BFFF"; // deep sky blue
    var diameter = 1.1*innerHeight;
    var rect_width = 120;
    var rect_height = 16;

    var link_width = "1px";

    var il = data.inner.length;
    var ol = data.outer.length;

    var inner_y = d3.scaleLinear()
        .domain([0, il])
        .range([-(il * rect_height)/2, (il * rect_height)/2]);

    mid = (data.outer.length/2.0);
    var outer_x = d3.scaleLinear()
        .domain([0, mid, mid, data.outer.length])
        .range([15, 170, 190 ,355]);

    var outer_y = d3.scaleLinear()
        .domain([0, data.outer.length])
        .range([0, diameter / 2 - 120]);


    // setup positioning
    data.outer = data.outer.map(function(d, i) {
        d.x = outer_x(i);
        d.y = diameter/3;
        return d;
    });

    data.inner = data.inner.map(function(d, i) {
        d.x = -(rect_width / 2);
        d.y = inner_y(i);
        return d;
    });


    function get_color(name)
    {
        var c = Math.round(color(name));
        if (isNaN(c))
            return '#dddddd';	// fallback color

        return colors[c];
    }

    // Can't just use d3.svg.diagonal because one edge is in normal space, the
    // other edge is in radial space. Since we can't just ask d3 to do projection
    // of a single point, do it ourselves the same way d3 would do it.


    function projectX(x)
    {
        return ((x - 90) / 180 * Math.PI) - (Math.PI/2);
    }

    // var diagonal = d3.svg.diagonal()
    //     .source(function(d) { return {"x": d.outer.y * Math.cos(projectX(d.outer.x)),
    //                                   "y": -d.outer.y * Math.sin(projectX(d.outer.x))}; })
    //     .target(function(d) { return {"x": d.inner.y + rect_height/2,
    //                                   "y": d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width}; })
    //     .projection(function(d) { return [d.y, d.x]; });

     my_diagonal = d3.linkHorizontal()
            .source(function (d) {
                // calculate visual position for outer node
                d.outer.vx = d.outer.y * Math.cos(projectX(d.outer.x));
                d.outer.vy = -d.outer.y * Math.sin(projectX(d.outer.x));
                return d.outer;
            })
            .target(function (d) {
                // calculate visual position for inner node
                d.inner.vx = d.inner.y + rect_height / 2;
                d.inner.vy = d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width;
                return d.inner;
            })
            .x(function (d) {
                // Because we introduced visual and logical position
                // this x() acessor is here to specify which coordinate we want.
                // We return y coordinate for .x() because we use vertical orientation for inner nodes.
                return d.vy;
            })
            .y(function (d) {
                return d.vx;
            });


    console.log("Append still works!");
    d3.select(".my-chart").remove();
    svg_chart = d3.select("#conceptMap").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "my-chart")
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


    // links
    var link = svg_chart.append('g').attr('class', 'links').selectAll(".link")
        .data(data.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('id', function(d) { return d.id; })
        .attr("d", my_diagonal)
        .attr('stroke', "gray" )
        .attr('stroke-width', link_width);

    // outer nodes
    console.log("Data l: ", data);

    var onode = svg_chart.append('g').selectAll(".outer_node")
        .data(data.outer)
      .enter().append("g")
        .attr("class", "outer_node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", function(d){console.log("Mouse click node! "); mouseclickNode(d, data.inner) } );

    onode.append("circle")
        .attr('id', function(d) { return d.id; })
        .attr("r", 4.5);

    onode.append("circle")
        .attr('r', 20)
        .attr('visibility', 'hidden');

    onode.append("text")
        .attr('id', function(d) { return d.id + '-txt'; })
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function(d) { return d.name; });

    // inner nodes

    var inode = svg_chart.append('g').selectAll(".inner_node")
        .data(data.inner)
      .enter().append("g")
        .attr("class", "inner_node")
        .attr("transform", function(d, i) { return "translate(" + d.x + "," + d.y + ")"; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", mouseclick);

    inode.append('rect')
        .attr('width', rect_width)
        .attr('height', rect_height)
        .attr('id', function(d) { return d.id; })
        .attr('fill', function(d) { return get_color(d.name); });

    inode.append("text")
        .attr('id', function(d) { return d.id + '-txt'; })
        .attr('text-anchor', 'middle')
        .attr("transform", "translate(" + rect_width/2 + ", " + rect_height * .75 + ")")
        .text(function(d) { return d.name; });

    // need to specify x/y/etc

    d3.select(self.frameElement).style("height", diameter - 150 + "px");

    function mouseover(d)
    {
        // bring to front
        d3.selectAll('.links .link').sort(function(a, b){ return d.related_links.indexOf(a.id); });	

        for (var i = 0; i < d.related_nodes.length; i++)
        {
            d3.select('#' + d.related_nodes[i]).classed('highlight', true);
            d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'bold');
        }

        for (var i = 0; i < d.related_links.length; i++){
            d3.select('#' + d.related_links[i]).attr('stroke-width', '5px');
            d3.select('#' + d.related_links[i]).attr("stroke","steelblue");
            //d3.select('#' + d.related_links[i]).style("fill","#00BFFF");
        }
    }

    function mouseclickNode(d, data)
    {
        // bring to front
        var thumbnailHeight = 100;
        var thumbnailWidth = 150;
        d3.selectAll('.links .link').sort(function(a, b){ return d.related_links.indexOf(a.id); });	
        console.log("Adding gallery!");
        d3.select("#gallery").remove();
        d3.select("#detailedView").append("div").attr("id", "gallery");

        var srcList = [];
        for (var i = 0; i < d.related_nodes.length; i++){   
            testName = d3.select('#' + d.related_nodes[i] + '-txt').text();
            
            data.forEach(function(dataD) {
                //console.log(dataD);
                if(dataD.name == testName){
                    srcList.push(dataD.image);
                    console.log(dataD.image);
                }
            });
        };

        

        for (var i = 0; i < d.related_nodes.length-1; i++)
        {
            var col = i%4;
            if(col == 0){
                var myRow = d3.select("#gallery").append("div");
            }
            
            myRow.append("img").attr("src", srcList[i])
                    .attr("width", thumbnailWidth).attr("height", thumbnailHeight);
        
        }
    }


    function mouseout(d)
    {
        for (var i = 0; i < d.related_nodes.length; i++)
        {
            d3.select('#' + d.related_nodes[i]).classed('highlight', false);
            d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'normal');
        }

        for (var i = 0; i < d.related_links.length; i++){
            d3.select('#' + d.related_links[i]).attr('stroke-width', link_width);
            d3.select('#' + d.related_links[i]).attr("stroke","gray");
        }
    }

    function mouseclick(d)
    {
        console.log(d);
        d3.select("#episode-title").text(d.name);
        d3.select("#season").text(d.season);
        d3.select("#episode").text(d.episode);

        d3.select("#image").attr("src", d.image);

        d3.select("#video-url").attr("href", d.video).text(d.video);
    }
    // end of widget
}

// main entry point
d3.csv("elements-by-episode_new_concept_map.csv", function(csvdata) {
    csvdata.forEach(load_data);
    data = get_filtered_data(0, 2);
    render_data();

    /// BRUSH
    var rect = document.getElementById('chord').getBoundingClientRect();
    var margin = {top: 20, right: 10, bottom: 20, left: 10},
    padding = {top: 20, right: 60, bottom: 60, left: 60},
    outerWidth = rect.width,
    outerHeight = 200,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom;
    const contextHeight = 50;
	const contextTextHeight = 40;
    const contextHeightTotal = contextHeight + 40;
    const contextWidth = outerWidth;



    const xScaleGeneral=d3.scaleLinear()
        .domain([0,31])
        .range([0, innerWidth]);

    var contextXScale = d3.scaleLinear()
        .range([0, innerWidth])
        .domain(xScaleGeneral.domain());

    var contextAxis = d3.axisBottom(contextXScale)
        .tickSize(contextHeight)
		.ticks(31)
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
        .on("end", onBrush);

    let context = d3.select("#brushContainer").append("svg")
        .attr("width", contextWidth)
        .attr("height", contextHeightTotal)
    .append("g")
        .attr("class", "context")
        .attr("transform", "translate("+10+","+(-10)+")");

    

    context.append("g")
        .attr("class", "x axis top")
        .attr("width", contextWidth)
        .attr("height", contextHeight)
        .attr("transform", "translate(0,0)")
        .call(contextAxis);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", 0)
        .attr("width", contextWidth)
        .attr("height", contextHeight);

    context.append("text")
        .attr("class", "instructions")
        //.attr("transform", "translate(0," + (contextHeight +30) + ")")
		.attr("transform", "translate(" + -margin.left + "," + (contextHeight + contextTextHeight) + ")")
        .text('Click and drag above to zoom / pan the data');
            // Brush handler. Get time-range from a brush and pass it to the charts.

    function onBrush() {
        console.log(" You changed the brush filter!!! ");
        console.log("In transition: ", inTransition);

        var b = d3.event.selection === null ? contextXScale.domain() : d3.event.selection.map(contextXScale.invert);


        minChosen = Math.round(Math.min(b[0],b[1]));
        maxChosen = Math.round(Math.max(b[0], b[1]));
        delta = maxChosen - minChosen;

        if(delta === 0) { return; }

        console.log("Filter data now...");

        if (delta > maxSelectedSeasons && inTransition === 0) {
            var l = xScaleGeneral(minChosen);
            var r = xScaleGeneral(minChosen + maxSelectedSeasons);

            data = get_filtered_data(minChosen, minChosen+maxSelectedSeasons);
            render_data();

            d3.select(this).transition().call(d3.event.target.move, [l, r]);
            inTransition = 1;
        }
        else if(delta <= maxSelectedSeasons && inTransition === 0) {
            var l = xScaleGeneral(minChosen);
            var r = xScaleGeneral(maxChosen);

            data = get_filtered_data(minChosen, maxChosen);
            render_data();

            d3.select(this).transition().call(d3.event.target.move, [l, r]);
        }
        else if (delta <= maxSelectedSeasons && inTransition === 1) {
            inTransition = 0;
        }


        // renderGeneratedData(Math.ceil(b[0]),Math.floor(b[1]));

    }
});
