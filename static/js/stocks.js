$(function() {
    var names = getNames()
    makeChart(names)

    var socket = io()

    $('.remove').on('click', function() {
        var element = $(this).attr('id')
        socket.emit('remove symbol', element)
        $('.' + symbol).remove()
        names = getNames()
        makeChart(names)
    })

    $('form').submit(function() {
        
    })

    socket.on('add symbol', function(data) {
        console.log('got emit from server');
        var symbol = data.symbol
        var name = data.name
        $($('.col-sm-6.col-md-4').last()).append('<div class="thumbnail ' + symbol + '"><div class="caption"><h3>' + symbol + '</h3><p>' + name + '</p><p><a href="#" id="' + symbol + '" class="btn btn-danger remove" role="button">Remove</a></p></div></div>')
        names = getNames()
        makeChart(names)
    })

    socket.on('remove symbol', function(symbol) {
        $('.' + symbol).remove()
        names = getNames()
        makeChart(names)
    })
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

function getNames() {
    names = []
    $('h3').each(function() {
        names.push($(this).html())
    })
    return names
}