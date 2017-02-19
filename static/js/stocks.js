$(function() {
    names = []
    $('h3').each(function() {
        names.push($(this).html())
    })
    makeChart(names)
})

function makeChart(names) {
    var seriesOptions = []
    var seriesCounter = 0

    $.each(names, function (i, name) {
        $.getJSON('/api/stocks/' + name, function (data) {
            console.log(typeof data);

            var newData = []
            var tempData = data.dataset.data.reverse()
            tempData.forEach(function(arr) {
                var temp = new Date(arr[0])
                newData.push([temp.getTime(), arr[1]])
            })

            seriesOptions[i] = {
                name: name,
                data: newData
            };

            seriesCounter += 1;

            if (seriesCounter === names.length) {
                createChart(seriesOptions);
            }
        });
    });
}

/**
 * Create the chart when all data is loaded
 * @returns {undefined}
 */
function createChart(seriesOptions) {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'value',
                showInNavigator: true
            }
        },

        title: {
            text: 'Stock'
        },

        useHighStocks: true,

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    });
}