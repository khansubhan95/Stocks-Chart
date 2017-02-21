$(function() {

    var names = getNames()
    makeChart(names)


    var socket = io()

    $('.remove').on('click', function() {
        var element = $(this).attr('id')
        socket.emit('remove symbol', element)
        $('div.' + element).parent().remove()
        names = getNames()
        makeChart(names)
    })

    $('form').submit(function(event) {
        event.preventDefault()
        var symbol = $('#input-symbol').val()
        $('#input-symbol').val('')
        $('#loading').html('Loading')
        $.ajax({
            url: '/',
            type: 'POST',
            data: {
                symbol: symbol
            },
            success: function(data) {
                // $('#input-symbol').val('')
                $('#loading').html('')
            }
        })
        // return false
    })

    socket.on('add symbol', function(data) {
        var symbol = data.symbol
        var name = data.name
        $('#add').before('<div class="col-sm-6 col-md-4"><div class="thumbnail ' + symbol + '"><div class="caption"><h3>' + symbol + '</h3><p>' + name + '</p><p><a href="#" id="' + symbol + '" class="btn btn-danger remove" role="button">Remove</a></p></div></div></div>')
        var names = getNames()
        makeChart(names)
    })

    socket.on('remove symbol', function(symbol) {
        $('div.' + symbol).parent().remove()
        var names = getNames()
        makeChart(names)
    })
})

function makeChart(names) {
    var seriesOptions = []
    var seriesCounter = 0

    $.each(names, function (i, name) {
        $.getJSON('/api/stocks/' + name, function (data) {
 
            var newData = []
            console.log(Array.isArray(data.stocks));
            var tempData = data.stocks.reverse()
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

        noData: {
            style: {
                fontSize: '14px',
                color: '#56565E',
                zIndex: 25
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            // split: true
        },

        series: seriesOptions
    });
}

function getNames() {
    names = []
    if ($('h3').length) {
        $('h3').each(function() {
            names.push($(this).html())
        })
    }
    return names
}

