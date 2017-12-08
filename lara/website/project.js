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

/* function dynamicHeight(){
	var chord = document.getElementById("chord");
	var h = chord.width;
	chord.attr("height", h);
} */
/* control behavior of subheadings when scrolling */
window.onload = function() {
	scrollControl(); 
	chord(); 
	colorstream()}
window.onresize = function(){
	chord(); 
	colorstream();}

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
      const color_names = ["ALIZARIN_CRIMSON", "BLACK_GESSO", "BRIGHT_RED", "BURNT_UMBER", "CADMIUM_YELLOW", "DARK_SIENNA", "INDIAN_RED", "INDIAN_YELLOW", "LIQUID_BLACK", "LIQUID_CLEAR", "MIDNIGHT_BLACK","PHTHALO_BLUE", "PHTHALO_GREEN", "PRUSSIAN_BLUE", "SAP_GREEN", "TITANIUM_WHITE", "VAN_DYKE_BROWN", "YELLOW_OCHRE"];
      //, "MIDNIGHT_BLACK", "PHTHALO_GREEN"
      const hexadec = ["#4E1500", "#000000", "#DB0000", "#8A3324", "#FFEC00", "#5F2E1F", "#CD5C5C", "#FFB800", "#000000", "#C0C2C4",  "#000000", "#0C0040", "#102E3C","#021E44","#0A3410", "#FFFFFF", "#221B15", "#C79B00"];

      const generateData = (keys,n1,n2) => {

        const data = d3.range(n2-n1+2).map((d, i) => {
          //console.log(n1+i-1)
          const row = {"ALIZARIN_CRIMSON" :0 , "BLACK_GESSO":0 , "BRIGHT_RED":0 , "BURNT_UMBER":0 , "CADMIUM_YELLOW":0 ,"MIDNIGHT_BLACK":0, "PHTHALO_GREEN":0, "DARK_SIENNA":0 , "INDIAN_RED":0 , "INDIAN_YELLOW":0 , "LIQUID_BLACK":0 , "LIQUID_CLEAR":0 , "PHTHALO_BLUE":0 , "PRUSSIAN_BLUE":0 , "SAP_GREEN":0 , "TITANIUM_WHITE":0 , "VAN_DYKE_BROWN":0 , "YELLOW_OCHRE":0 };
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
        //console.log(data)
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

              // Brush handler. Get time-range from a brush and pass it to the charts. 
      function onBrush() {
        var b = d3.event.selection === null ? contextXScale.domain() : d3.event.selection.map(contextXScale.invert);

        renderGeneratedData(Math.ceil(b[0]),Math.floor(b[1]));
        
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
        //console.log(data);
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
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
	padding = {top: 20, right: 60, bottom: 60, left: 60},
    outerWidth = rect.width,
    outerHeight = rect.height,
	innerWidth = outerWidth - margin.left - margin.right,
	innerHeight = outerHeight - margin.top - margin.bottom,
	width = innerWidth - padding.left - padding.right,
	height = innerHeight - padding.top - padding.bottom;
	var textPlaceholder = 60;


d3.csv("bobrosscategorized.csv", function(csvdata) { 

  let columns = [ "LANDSCAPES","FRAMES", "STRUCTURES", "PLANTS", "GUESTS", "WEATHER", "HUMANS"];

  const generateData = (columns, n1,n2) =>{
    //console.log(n1,n2)

    var data = new Array(columns.length*(columns.length-1));
    for (var i = 0; i < columns.length*(columns.length-1); i++) {
      data[i] = new Array(3);
    }
    //console.log(data)
    for (var i = 0; i < columns.length; i++) {
      //console.log(i)
      var realindex = 0;
      for (var j = 0; j < (columns.length); j++) {
        //console.log(j)
        if (i!=j){
          data[(columns.length-1)*i+realindex][0] = columns[i];
          data[(columns.length-1)*i+realindex][1] = columns[realindex];
          data[(columns.length-1)*i+realindex][2] = 0.0;
          realindex += 1;
        } 
        
      }
    }
    //console.log(data)
    csvdata.filter(element=>(element['SEASON']>=n1)&&(element['SEASON']<=n2)).forEach(function(painting) {
      for (var i = 0; i < columns.length; i++) {
        //console.log(painting[columns[i]])
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

              // Brush handler. Get time-range from a brush and pass it to the charts. 
      function onBrush() {
        var b = d3.event.selection === null ? contextXScale.domain() : d3.event.selection.map(contextXScale.invert);

        renderGeneratedData(Math.ceil(b[0]),Math.floor(b[1]));
        
      }


  const render = (data) => {

  	var size = 0;
  	if (width-2*textPlaceholder < height){
		size = (width/2) - 2*textPlaceholder;
	}
	else {
		size = (height/2) - textPlaceholder;
	}
	
    d3.select(".chordSvgchart").remove();
    var svg = d3.select("#chord").insert("svg",":first-child")
        .attr("class","chordSvgchart")
        .attr("width", outerWidth) //outerWidth
        .attr("height", outerHeight-contextHeightTotal); //outerHeight
	
    var colors = {"FRAMES" : "#000000","STRUCTURES" : "#776f6f","PLANTS" : "#399661","LANDSCAPES" : "#55b247","WEATHER" : "#7cccff","GUESTS" : "#130ea0","HUMANS" : "#ffeec9"};

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

    //var width=1200, height=1100;

	var xTranslation = 0;
	if (width-2*textPlaceholder < height){
		xTranslation = ((outerWidth/2));
	}
	else {
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
});}

