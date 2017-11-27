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

	var categories = ["Frames", "Structures", "Plants", "Landscape", "Weather", "Humans", "Guests"];
	var datasetCategories = new Array(categories.length);
	for (var i = 0; i < categories.length; i++) {
		datasetCategories[i] = new Array(2);
		datasetCategories[i][0] = categories[i];
		datasetCategories[i][1] = 0;
	}
				
	dataset.forEach(function(elem) {
		for (var i = 0; i < categories.length; i++){
			if (elem[0] === datasetCategories[i][0]){
				datasetCategories[i][1] += elem[2];
			}
		}
	});
	
	console.log(dataset);
	console.log(datasetCategories);

	var colors = ['#ff6600', '#006600', '#ff0055', '#bb09A0', '#ff0000', '#ff0000', '#ff0000']
	var chart = c3.generate({
		bindto: '#chart',
		data: {
			columns: datasetCategories,
		type : 'pie',
/* 		colors: {
            categories: colors[1],
        }, */
		onclick: function (d, i) { 
			console.log("onclick", d, i);
			if (d.ratio != 1){
				for (var i = 0; i < categories.length; i++){
					if (categories[i] != d.id){
						chart.unload({ids: categories[i]})}}}
			else{
				for (var i = 0; i < categories.length; i++){
					if (categories[i] != d.id){
						chart.load({columns: [datasetCategories[i]]})}};
			}},
		onmouseover: function (d, i) { console.log("onmouseover", d, i); },
		onmouseout: function (d, i) { console.log("onmouseout", d, i); }
	}}); 
});});

/* setTimeout(function () {
    chart.load({
        columns: [
            ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
            ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
            ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
        ]
    });
}, 1500);

setTimeout(function () {
    chart.unload({
        ids: 'data1'
    });
    chart.unload({
        ids: 'data2'
    });
}, 2500); */