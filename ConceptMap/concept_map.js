function loadJSON(callback) {   
    
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'elements_by_episode.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
              if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
              }
        };
        xobj.send(null);  
     }
    
    
    // loadJSON( function(response) {
    //     podaci = JSON.parse(response);
    //     console.log("Data here! ", podaci.length);
    // });
    
    //var data = [[120, ["like", "call response", "dramatic intro", "has breaks", "male vocalist", "silly", "swing"]], [150, ["brassy", "like", "calm energy", "female vocalist", "swing", "fun"]], [170, ["calm energy", "instrumental", "swing", "like", "happy"]], [140, ["has breaks", "male vocalist", "swing", "piano", "banjo", "chill"]], [160, ["calm energy", "instrumental", "swing", "like", "interesting"]], [140, ["brassy", "like", "energy", "dramatic intro", "male vocalist", "baseball", "swing"]], [170, ["instrumental", "interesting", "high energy", "like", "swing"]], [140, ["instrumental", "energy", "like", "swing"]], [200, ["instrumental", "brassy", "dramatic intro", "like", "swing"]], [160, ["male vocalist", "brassy", "swing", "like", "my favorites"]], [130, ["like", "interesting", "dramatic intro", "male vocalist", "silly", "swing", "gospel"]], [160, ["like", "long intro", "announcer", "energy", "swing", "female vocalist"]], [170, ["instrumental", "swing", "bass", "like"]], [150, ["like", "interesting", "has breaks", "instrumental", "chunky", "swing", "banjo", "trumpet"]], [170, ["like", "has breaks", "male vocalist", "silly", "swing", "banjo"]], [190, ["instrumental", "banjo", "swing"]], [130, ["instrumental", "brassy", "banjo", "like", "swing"]], [160, ["brassy", "like", "energy", "instrumental", "big band", "jam", "swing"]], [150, ["like", "male vocalist", "live", "swing", "piano", "banjo", "chill"]], [150, ["like", "trick ending", "instrumental", "chunky", "swing", "chill"]], [120, ["brassy", "like", "female vocalist", "swing", "chill", "energy buildup"]], [150, ["brassy", "like", "interesting", "instrumental", "swing", "piano"]], [190, ["brassy", "like", "long intro", "energy", "baseball", "swing", "female vocalist"]], [180, ["calm energy", "female vocalist", "live", "like", "swing"]], [200, ["banjo", "like", "long intro", "interesting", "energy", "my favorites", "male vocalist", "silly", "swing", "fun", "balboa"]], [150, ["brassy", "calm energy", "chunky", "instrumental", "old-timey", "live", "swing"]], [160, ["like", "call response", "interesting", "instrumental", "calm energy", "swing"]], [180, ["interesting", "swing", "fast", "male vocalist"]], [150, ["calm energy", "chunky", "swing", "female vocalist", "like"]], [180, ["like", "has breaks", "male vocalist", "chunky", "silly", "swing"]], [140, ["instrumental", "brassy", "dramatic intro", "swing", "chill"]], [150, ["male vocalist", "trumpet", "like", "swing"]], [150, ["instrumental", "energy", "like", "has breaks", "swing"]], [180, ["brassy", "like", "energy", "has breaks", "instrumental", "has calm", "swing"]], [150, ["female vocalist", "swing"]], [170, ["instrumental", "brassy", "energy", "swing"]], [170, ["calm energy", "instrumental", "energy", "like", "swing"]], [190, ["brassy", "like", "instrumental", "high energy", "swing", "trumpet"]], [160, ["male vocalist", "energy", "swing", "old-timey"]], [170, ["like", "oldies", "my favorites", "fast", "male vocalist", "high energy", "swing"]]];
    var data = [["a walk in the woods", ['bushes', 'deciduous', 'grass', 'river', 'tree', 'trees']], ["mt. mckinley", ['cabin', 'clouds', 'conifer', 'mountain', 'snow', 'snowy_mountain', 'tree', 'trees', 'winter']], ["ebony sunset", ['cabin', 'conifer', 'fence', 'mountain', 'mountains', 'structure', 'sun', 'tree', 'trees', 'winter']]];
    var s01e4 = [ "winter mist", ['bushes', 'clouds', 'conifer', 'lake', 'mountain', 'snowy_mountain', 'tree', 'trees']]
    var s01e5 = ["quiet stream" ,  ['deciduous', 'river', 'rocks', 'tree', 'trees']];
    var s01e6 = ["winter moon", ['cabin', 'conifer', 'lake', 'moon', 'mountain', 'mountains', 'night', 'snow', 'snowy_mountain', 'structure', 'tree', 'trees', 'winter']];
    var s01e7 = ["autumn mountains", ['deciduous', 'lake', 'mountain', 'mountains', 'snowy_mountain', 'tree', 'trees']];
    var s01e8 = ["peaceful valley", ['bushes', 'conifer', 'lake', 'mountain', 'mountains', 'tree', 'trees']];
    var s01e9 = ["seascape", ['beach', 'clouds', 'fence', 'ocean']];
    var s01e10 = [ "mountain lake", ['bushes', 'conifer', 'deciduous', 'lake', 'mountain', 'tree', 'trees']];
    var s01e11 = ["winter glow", ['deciduous', 'lake', 'tree', 'trees']];
    var s01e12 = ["snowfall", ['cirrus', 'clouds', 'conifer', 'lake', 'mountain', 'mountains', 'snowy_mountain', 'tree', 'trees']];
    var s01e13 = [ "final reflections", ['bushes', 'conifer', 'deciduous', 'grass', 'mountain', 'snowy_mountain', 'tree', 'trees']];
    
    data.push(s01e4);
    data.push(s01e5);
    data.push(s01e6);
    data.push(s01e7);
    data.push(s01e8);
    data.push(s01e9);
    data.push(s01e10);
    data.push(s01e11);
    data.push(s01e12);
    data.push(s01e13);
    
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
    
    console.log(data.outer.reduce(function(a,b) { return a + b.related_links.length; }, 0) / data.outer.length);
    
    
    // from d3 colorbrewer: 
    // This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
    var colors = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]
    var color = d3.scaleLinear()
        .domain([10, 220])
        .range([colors.length-1, 0])
        .clamp(true);
    
    //var color = "#00BFFF"; // deep sky blue
    var diameter = 960;
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
    