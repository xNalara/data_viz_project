let columns = ["Apple Frame", "Aurora Borealis", "Barn", "Beach", "Boat", "Bridge", "Building", "Bushes", "Cabin", "Cactus", "Circle Frame", "Cirrus", "Cliff", "Clouds", "Conifer", "Cumulus", "Deciduous", "Dock", "Double Oval Frame", "Farm", "Fence", "Fire", "Florida Frame", "Flowers", "Fog", "Framed", "Grass", "Guest", "Half Circle Frame", "Half Oval Frame", "Hills", "Lake", "Lighthouse", "Mill", "Moon", "Mountain", "Mountains", "Night", "Ocean", "Oval Frame", "Palm Trees", "Path", "Person", "Portrait", "Rectangle 3D Frame", "Rectangular Frame", "River", "Rocks", "Seashell Frame", "Snow", "Snowy Mountain", "Split Frame", "Steve Ross", "Structure", "Sun", "Tomb Frame", "Tree", "Trees", "Triple Frame", "Waterfall", "Waves", "Windmill", "Window Frame", "Winter", "Wood Framed"];
obj = [];
d3.csv("elements-by-episode_new.csv", function(csvdata) {
    i = 0;

    csvdata.forEach(function(episode){
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

        newElem.push(episode.TITLE);
        newElem.push(cols);
        newElem.push(episode.EPISODE);
        newElem.push(episode.SEASON);
        obj.push(newElem);
        i +=1;
    });

    console.log("DATA: ");
    console.log(obj); 
    filterData = [];
    filterData.push(obj[0]);
    filterData.push(obj[1]);
    filterData.push(obj[2]);
    filterData.push(obj[3]);
    filterData.push(obj[4]);
    filterData.push(obj[5]);
    filterData.push(obj[6], obj[7], obj[8], obj[9], obj[10]);

    data = filterData;
    console.log(data);


    function filterDataElements(){
        console.log("Brush brush..");
    };



    var outer = d3.map();
    var inner = [];
    var links = [];
    
    var outerId = [0];
 
    data.forEach(function(d){
        
        if (d == null)
            return;
        
        i = { id: 'i' + inner.length, name: d[0], related_links: [] };
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
            l = { id: 'l-' + i.id + '-' + o.id, inner: i, outer: o }
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
    }
    
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
    var colors = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]
    var color = d3.scaleLinear()
        .domain([10, 220])
        .range([colors.length-1, 0])
        .clamp(true);
    
    //var color = "#00BFFF"; // deep sky blue
    var diameter = 900;
    var rect_width = 120;
    var rect_height = 18;
    
    var link_width = "1px"; 
    
    var il = data.inner.length;
    var ol = data.outer.length;
    
    var inner_y = d3.scaleLinear()
        .domain([0, il])
        .range([-(il * rect_height)/2, (il * rect_height)/2]);
    
    mid = (data.outer.length/2.0)
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
    var svg = d3.select("#conceptMap").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
      .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
        
    
    // links
    var link = svg.append('g').attr('class', 'links').selectAll(".link")
        .data(data.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('id', function(d) { return d.id })
        .attr("d", my_diagonal)
        .attr('stroke', "gray" )
        .attr('stroke-width', link_width);
    
    // outer nodes
    
    var onode = svg.append('g').selectAll(".outer_node")
        .data(data.outer)
      .enter().append("g")
        .attr("class", "outer_node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
      
    onode.append("circle")
        .attr('id', function(d) { return d.id })
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
      
    var inode = svg.append('g').selectAll(".inner_node")
        .data(data.inner)
      .enter().append("g")
        .attr("class", "inner_node")
        .attr("transform", function(d, i) { return "translate(" + d.x + "," + d.y + ")"})
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
      
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
            d3.select('#' + d.related_links[i]).attr("stroke","blue");
            //d3.select('#' + d.related_links[i]).style("fill","#00BFFF");
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



    /// BRUSH
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    padding = {top: 20, right: 60, bottom: 60, left: 60},
    outerWidth = 1400,
    outerHeight = 1200,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom;
    const contextHeight = 50;
    const contextWidth = width;


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

    let context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + -400  + "," + (350) + ")");

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
        .attr("transform", "translate(0," + (contextHeight + 40) + ")")
        .text('Click and drag above to zoom / pan the data');
            // Brush handler. Get time-range from a brush and pass it to the charts. 
    
    function onBrush() {
        console.log(" You changed the brush filter!!! ");
        var b = d3.event.selection === null ? contextXScale.domain() : d3.event.selection.map(contextXScale.invert);
        minChosen = Math.ceil(b[0])
        maxChosen = Math.floor(b[1])
        console.log("Chosen min and max: ", minChosen, " , ", maxChosen);
        console.log("Filter data now...");
        data = [];
        
        // renderGeneratedData(Math.ceil(b[0]),Math.floor(b[1]));
    
    }





}); 
    