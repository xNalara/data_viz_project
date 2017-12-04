import { Component, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';
// import * as data from '../../../data/elements_by_episode.json';

import {
  D3Service,
  D3,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  ScaleOrdinal,
  LinkRadial,
  Selection,
  Transition
} from 'd3-ng2-service';
import { Http } from '@angular/http/src/http';
import { Map } from 'd3-ng2-service/src/bundle-d3';


@Component({
  selector: 'app-d3example',
  template: '<svg width="200" height="200"></svg>',
  // templateUrl: './d3example.component.html',
  styleUrls: ['./d3example.component.css']
})


export class D3exampleComponent implements OnInit {
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  private allData;

  constructor(element: ElementRef, private ngZone: NgZone, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
    // this.http.get('data/data.json')
    //     .subscribe(res => this.allData = res.json());
  }

  ngOnInit() {
    // ***********************
    //    TABLE OF CONTENTS
    // ***********************
    //   1. Raw Data
    //   2. Types
    //   3. Global Variables
    //   4. Factory Methods
    //   5. Raw Data Preprocessing
    //   6. Visual Parameters
    //   8. Drawing
    //   9. Event Handlers




    const d3ParentElement: any = null;

    // *************************
    //       1. RAW DATA
    // *************************
        type DataEntry = [string, string[]];
        const raw_data: DataEntry[] = [["a walk in the woods", ['bushes', 'deciduous', 'grass', 'river', 'tree', 'trees']], ["mt. mckinley", ['cabin', 'clouds', 'conifer', 'mountain', 'snow', 'snowy_mountain', 'tree', 'trees', 'winter']], ["ebony sunset", ['cabin', 'conifer', 'fence', 'mountain', 'mountains', 'structure', 'sun', 'tree', 'trees', 'winter']]];
        var s01e4: [string, string[]] = [ "winter mist", ['bushes', 'clouds', 'conifer', 'lake', 'mountain', 'snowy_mountain', 'tree', 'trees']]
        var s01e5: [string, string[]] = ["quiet stream" ,  ['deciduous', 'river', 'rocks', 'tree', 'trees']];
        var s01e6: [string, string[]] = ["winter moon", ['cabin', 'conifer', 'lake', 'moon', 'mountain', 'mountains', 'night', 'snow', 'snowy_mountain', 'structure', 'tree', 'trees', 'winter']];
        var s01e7: [string, string[]] = ["autumn mountains", ['deciduous', 'lake', 'mountain', 'mountains', 'snowy_mountain', 'tree', 'trees']];
        var s01e8: [string, string[]] = ["peaceful valley", ['bushes', 'conifer', 'lake', 'mountain', 'mountains', 'tree', 'trees']];
        var s01e9: [string, string[]] = ["seascape", ['beach', 'clouds', 'fence', 'ocean']];
        var s01e10: [string, string[]] = [ "mountain lake", ['bushes', 'conifer', 'deciduous', 'lake', 'mountain', 'tree', 'trees']];
        var s01e11: [string, string[]] = ["winter glow", ['deciduous', 'lake', 'tree', 'trees']];
        var s01e12: [string, string[]] = ["snowfall", ['cirrus', 'clouds', 'conifer', 'lake', 'mountain', 'mountains', 'snowy_mountain', 'tree', 'trees']];
        var s01e13: [string, string[]] = [ "final reflections", ['bushes', 'conifer', 'deciduous', 'grass', 'mountain', 'snowy_mountain', 'tree', 'trees']];
        raw_data.push(s01e4);
        raw_data.push(s01e5);
        raw_data.push(s01e6);
        raw_data.push(s01e7);
        raw_data.push(s01e8);
        raw_data.push(s01e9);
        raw_data.push(s01e10);
        raw_data.push(s01e11);
        raw_data.push(s01e12);
        raw_data.push(s01e13);
        


    // ************
    //  2. TYPES
    // ************
    class MyNode {
        id: string;
        name: number | string;
        related_nodes: string[];
        related_links: string[];
        x: number; // logical position, can be in radial coordinates
        y: number; // logical position
        vx: number; // visual position, pixels
        vy: number; // visual position

        constructor() {
            this.related_nodes = new Array<string>();
            this.related_links = new Array<string>();
        }
    }

    class MyLink {
        id: string;
        inner: MyNode;
        outer: MyNode;
    }

    // *************************
    //  3.  GLOBAL VARIABLES
    // *************************
    let outer: any = this.d3.map();
    const inner: MyNode[] = new Array<MyNode>();
    const links: MyLink[] = new Array<MyLink>();
    let outerId = 0;

    // **************************
    //    4.  FACTORY METHODS
    // **************************
    function make_new_inner_node(d: DataEntry) {
        const i = new MyNode();
        i.id = 'i' + inner.length;
        i.name = d[0];
        i.related_nodes.push(i.id);
        return i;
    }

    function make_outer_node(id: string) {
        const o = new MyNode();
        o.name = id;
        o.id = 'o' + outerId++;
        o.related_nodes.push(o.id);
        return o;
    }

    function make_or_get_outer_node(onode_id: string) {
        let o: MyNode;
        o = outer.get(onode_id);

        if (o == null) {
            o = make_outer_node(onode_id);
            outer.set(onode_id, o);
        }

        return o;
    }

    function make_new_link(i: MyNode, o: MyNode) {
        const l = new MyLink();
        l.id = 'l-' + i.id + '-' + o.id;
        l.inner = i;
        l.outer = o;
        return l;
    }

    // *************************************
    //      6. RAW DATA PREPROCESSING
    // *************************************
    raw_data.forEach(function(d: DataEntry){
        if (d == null) {
            return;
        }

        const i = make_new_inner_node(d);
        inner.push(i);

        d[1].forEach(function(onode_id: string){
            const o = make_or_get_outer_node(onode_id);
            const l = make_new_link(i, o);

            links.push(l);
            i.related_nodes.push(o.id);
            i.related_links.push(l.id);
            o.related_nodes.push(i.id);
            o.related_links.push(l.id);
        });
    });

    const data = {
        inner: inner,
        outer: outer.values(),
        links: links
    };

    // sort the data -- TODO: have multiple sort options
    outer = data.outer;
    data.outer = Array(outer.length);

    let i1 = 0;
    let i2 = outer.length - 1;

    for (let i = 0; i < data.outer.length; ++i) {
        if (i % 2 === 1) {
            data.outer[i2--] = outer[i];
        } else {
            data.outer[i1++] = outer[i];
        }
    }

    // ***********************************
    //       7.  VISUAL PARAMETERS
    // ***********************************
    // from d3 colorbrewer:
    // This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
    const colors = [
        '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090',
        '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'];

    const color = this.d3.scaleLinear()
        .domain([10, 220])
        .range([colors.length - 1, 0])
        .clamp(true);

    const diameter = 900;
    const rect_width = 150;
    const rect_height = 14;

    const link_width = '1px';

    const il = data.inner.length;
    const ol = data.outer.length;

    const inner_y = this.d3.scaleLinear()
        .domain([0, il])
        .range([-(il * rect_height) / 2, (il * rect_height) / 2]);

    const mid: any = (data.outer.length / 2.0);
    const outer_x = this.d3.scaleLinear()
        .domain([0, mid, mid, data.outer.length])
        .range([15, 170, 190, 355]);

    const outer_y = this.d3.scaleLinear()
        .domain([0, data.outer.length])
        .range([0, diameter / 2 - 120]);

    data.outer = data.outer.map(function(d, i) {
        d.x = outer_x(i);
        d.y = diameter / 3;
        return d;
    });

    data.inner = data.inner.map(function(d, i) {
        d.x = -(rect_width / 2);
        d.y = inner_y(i);
        return d;
    });


    function get_color(name) {
        const c = Math.round(color(name));
        if (isNaN(c)) {
            return '#dddddd';	// fallback color
        }

        return colors[c];
    }

    // *******************************
    //        8.  DRAWING
    // *******************************

    // Can't just use d3.svg.diagonal because one edge is in normal space, the
    // other edge is in radial space. Since we can't just ask d3 to do projection
    // of a single point, do it ourselves the same way d3 would do it.
    function projectX(x) {
        return ((x - 90) / 180 * Math.PI) - (Math.PI / 2);
    }

    // See original code below
    const my_diagonal = this.d3.linkHorizontal<MyLink, MyNode>()
        .source(function (d: MyLink) {
            // calculate visual position for outer node
            d.outer.vx = d.outer.y * Math.cos(projectX(d.outer.x));
            d.outer.vy = -d.outer.y * Math.sin(projectX(d.outer.x));
            return d.outer;
        })
        .target(function (d: MyLink) {
            // calculate visual position for inner node
            d.inner.vx = d.inner.y + rect_height / 2;
            d.inner.vy = d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width;
            return d.inner;
        })
        .x(function (d: MyNode) {
            // Because we introduced visual and logical position
            // this x() acessor is here to specify which coordinate we want.
            // We return y coordinate for .x() because we use vertical orientation for inner nodes.
            return d.vy;
        })
        .y(function (d: MyNode) {
            return d.vx;
        });

    // original code:
    // var diagonal = this.d3.svg.diagonal()
    //     .source(function(d) { return {'x': d.outer.y * Math.cos(projectX(d.outer.x)),
    //                                 'y': -d.outer.y * Math.sin(projectX(d.outer.x))}; })
    //     .target(function(d) { return {'x': d.inner.y + rect_height/2,
    //                                 'y': d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width}; })
    //     .projection(function(d) { return [d.y, d.x]; });

    // Setup canvas
    const svg = this.d3.select('body').append('svg')
        .attr('width', diameter)
        .attr('height', diameter)
        .append('g')
        .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')');

    // Draw links
    const link = svg.append('g').attr('class', 'links').selectAll('.link')
        .data(data.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('id', function(d: {id: any}) {
            return d.id;
        })
        .attr('d', my_diagonal) // use my_diagonal instead of the original diagonal
        .attr('stroke', function(d: {inner: {name: any}}) {
            return "gray";
        })
        .attr('stroke-width', link_width)
        .attr('fill', 'none');

    // Draw outer nodes (words)
    const onode = svg.append('g').selectAll('.outer_node')
        .data(data.outer)
        .enter().append('g')
        .attr('class', 'outer_node')
        .attr('transform', function(d: {x: any, y: any}) { return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')'; })
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);

    onode.append('circle')
        .attr('id', function(d: MyNode) { return d.id; })
        .attr('r', 4.5);

    onode.append('circle')
        .attr('r', 20)
        .attr('visibility', 'hidden');

    onode.append('text')
        .attr('id', function(d: {id: any}) { return d.id + '-txt'; })
        .attr('dy', '.31em')
        .attr('text-anchor', function(d: MyNode) { return d.x < 180 ? 'start' : 'end'; })
        .attr('transform', function(d: MyNode) { return d.x < 180 ? 'translate(8)' : 'rotate(180)translate(-8)'; })
        .text(function(d: MyNode) { return d.name; });

    // Draw inner nodes (rectangles)
    const inode = svg.append('g').selectAll('.inner_node')
        .data(data.inner)
        .enter().append('g')
        .attr('class', 'inner_node')
        .attr('transform', function(d: MyNode, i) { return 'translate(' + d.x + ',' + d.y + ')'; })
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);

    inode.append('rect')
        .attr('width', rect_width)
        .attr('height', rect_height)
        .attr('id', function(d: MyNode) { return d.id; })
        .attr('fill', function(d: MyNode) { return get_color(d.name); });

    inode.append('text')
        .attr('id', function(d: MyNode) { return d.id + '-txt'; })
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + rect_width / 2 + ', ' + rect_height * .75 + ')')
        .text(function(d: MyNode) { return d.name; });

    // need to specify x/y/etc
    console.log('And now: ', this.d3.select);
    this.d3.select(self.frameElement).style('height', diameter - 150 + 'px');
    console.log('And now: ', this.d3.select);

    // **********************
    //  9. EVENT HANDLERS
    // **********************

    // IMPORANT: this is the scope fix
    const super_d3 = this.d3;
    function mouseover(d) {
        // IMPORTANT: this is the scope fix
        // At this point, this points to current function scope.
        // Currently this.d3 does not exists but we populate it here.
        // This can be simplified by directly referring to super_d3.
        this.d3 = super_d3;

        console.log('Mouse over! ', d);
        console.log('Mouse over d3 ', this.d3);

        // bring to front
        this.d3.selectAll('.links .link').sort(function(a, b){ return d.related_links.indexOf(a.id); });

        for (let i = 0; i < d.related_nodes.length; i++) {
             this.d3.select('#' + d.related_nodes[i]).classed('highlight', true);
             this.d3.select('#' + d.related_nodes[i] + '-txt').attr('font-weight', 'bold');
        }

        for (let i = 0; i < d.related_links.length; i++) {
            this.d3.select('#' + d.related_links[i]).attr('stroke-width', '5px');
            this.d3.select('#' + d.related_links[i]).attr("stroke","blue");
        }
    }

    // Make it normal once again.
    function mouseout(d) {
        for (let i = 0; i < d.related_nodes.length; i++) {
            this.d3.select('#' + d.related_nodes[i]).classed('highlight', false); // n
            this.d3.select('#' + d.related_nodes[i] + '-txt').attr('font-weight', 'normal');
        }

        for (let i = 0; i < d.related_links.length; i++) {
            this.d3.select('#' + d.related_links[i]).attr('stroke-width', link_width);
            this.d3.select('#' + d.related_links[i]).attr("stroke","gray")
        }
    }
  }
}