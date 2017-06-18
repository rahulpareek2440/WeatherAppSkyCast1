skycast = angular.module('skycast')

.controller('HomeController', [
	'$scope', '$rootScope', 'UserService',
	function($scope, $rootScope, UserService){

		$scope.$on('skycast', function(env, skycast){
			weatherGraph(skycast.data.skycast);
		});
        var  date_format = d3.time.format("%d %b");
		var chartMargin = {top: 80, right: 80, bottom: 80, left: 80},
	    width = 600 - chartMargin.left - chartMargin.right,
	    height = 400 - chartMargin.top - chartMargin.bottom;
        var formatPercent = d3.format(".degree");
	    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

	    var y0 = d3.scale.linear().domain([0, 110]).range([height, 0]);

	    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	    // create left yAxis
	    var yAxisLeft = d3.svg.axis().scale(y0).ticks(4).orient("left")
        .tickFormat(formatPercent);
	    var svg = null;

		var weatherGraph = function(data){
			if (!svg){
				svg = d3.select("#d3_chart").append("svg")
			    .attr("width", width + chartMargin.left + chartMargin.right)
			    .attr("height", height + chartMargin.top + chartMargin.bottom)
			    .append("g")
			    .attr("class", "graph")
			    .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");
			} else {
				svg.selectAll("rect").remove();
				svg.selectAll("g.x.axis").remove();
			}

			x.domain(data.daily.data.map(function(d) {
		      	return getDate(d.time);
		    }));

			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
                .append("text")
                .attr("x", 5)
                .attr("dx", "44em")
                .text("Date")
            .style("fill", "yellow");

			svg.append("g")
			.attr("class", "y axis axisLeft")
			.attr("transform", "translate(0,0)")
			.call(yAxisLeft)
			.append("text")
			.attr("y", 5)
			.attr("dy", "-2em")
			.style("text-anchor", "end")
			.style("text-anchor", "end")
			.text("Degree")
			.style("fill","green");

			bars = svg.selectAll(".bar").data(data.daily.data).enter();
			bars.append("rect")
			.attr("class", "bar1")
			.attr("x", function(d) { return x(getDate(d.time)); })
			.attr("width", x.rangeBand()/2)
			.attr("y", function(d) { return y0(d.temperatureMax); })
			.attr("height", function(d,i,j) { return height - y0(d.temperatureMax); });

			bars.append("rect")
			.attr("class", "bar2")
			.attr("x", function(d) { return x(getDate(d.time)) + x.rangeBand()/2; })
			.attr("width", x.rangeBand() / 2)
			.attr("y", function(d) { return y0(d.temperatureMin); })
			.attr("height", function(d,i,j) { return height - y0(d.temperatureMin); });
		}

        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		var getDate = function(time){
			var date = new Date(time * 1000);
			return date.getDate() + ' ' + monthNames[date.getMonth() + 1];
		}

		$scope.search = function(address){
			
			if (!address) return;
			
			UserService.getWeather(address).then(function(result){
				
				$rootScope.chart = true;
				$rootScope.skycast = result.data.skycast;

			}, function(err){
				
				alert('Error occurred please correct it : ' + JSON.stringify(err) );

			});
		}
	}
]);