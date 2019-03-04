(function() {
    function drawChart(data, options) {
        var month_views = [], i = 0;

        // Loop through the data and get the number of vists for each month
        for (var key in data.list) {
            month_views[i] = {
                month: moment(data.list[key].to).format('MMM'),
                data: data.list[key].metrics[options.metric]
            };

            i++;
        }

        // Load the Visualization API and the piechart package.
        google.load('visualization', '1.0', {
            packages: ['corechart'],
            callback: function() {
                // Create the data table structure
                var chart_data = new google.visualization.DataTable();
                chart_data.addColumn('string', 'Month');
                chart_data.addColumn('number', options.title);

                // Add all the visitor data to it
                for (var key in month_views) {
                    chart_data.addRow([
                        month_views[key].month,
                        month_views[key].data
                    ]);
                }

                // Instantiate and draw our chart, passing in some options
                var chart_type = options.type + 'Chart';
                var chart = new google.visualization[chart_type](document.getElementById('chart'));
                chart.draw(chart_data, {
                    title: options.title + ' per Month'
                });
            }
        });
    }

    // Note: you should keep your api key secret so it's probably best not to make this page public!
    $.getJSON('config.json', function(config) {
        $.GoSquared({
            api_key: config.api_key,
            site_token: config.site_token,
        });

        // Get the monthly visits data
        $.GoSquared.trends.v2.aggregate({
            from: +moment().subtract('months', config.months),
            to: +new Date(),
            interval: 'month'
        }, function(error, data) {

            // Did something go wrong? :(
            if (error) {
                alert('Error! See the console for more info..');
                console.log(error);
            }

            // If not, draw the requested chart!
            drawChart(data, {
                metric: 'visits',
                title: 'Visitors',
                type: 'Column'
            });

            // And handle when the metric is changed!
            $('#metric, #type').on('change', function() {
                // Get the metric and title selected
                var $metric = $('#metric'),
                    $type = $('#type');

                drawChart(data, {
                    metric: $metric.val(),
                    title: $metric.find(':selected').text(),
                    type: $type.val()
                });
            });
        });
    });
})();
