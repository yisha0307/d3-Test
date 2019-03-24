d3.csv('./playoff_shots.csv', function (data) {
    console.log(data)
    data = data.filter(d=>d["TEAM_NAME"]=== 'Cleveland Cavaliers')
    data = data.map(d=>({...d, LOC_X: parseFloat(d.LOC_X) + 300, LOC_Y: parseFloat(d.LOC_Y)+ 20}))

    var shots = d3.select('svg')
            .selectAll('g')
                .data(data)
                .enter()
                .append('g')
                    .attr('class', 'shot')
                    .attr('transform', function (d) {
                        return 'translate(' + d.LOC_Y +',' + d.LOC_X + ')'
                    })
                .on('mouseover', function (d) {
                    d3.select(this).raise()
                        .append('text')
                        .attr('class', 'playername')
                        .text(d.PLAYER_NAME)
                })
                .on('mouseout', function (d) {
                    d3.selectAll('text.playername').remove()
                })

    shots.append('circle')
        .attr('r', 5)
        .attr('fill', d => {
            if (d.EVENT_TYPE === 'Missed Shot') {
                return 'red'
            } else {
                return 'green'
            }
        })
    
    var players = d3.nest()
        .key(function(d){return d.PLAYER_NAME})
        .rollup(v => v.length)
        .entries(data)
    players.unshift(
        {
            key: 'ALL', 
            value: players.map(p => p.value).reduce((a, b) => a + b, 0)
        })
    
    console.log(players)
    
    var selector = d3.select('#selector')
    selector
        .selectAll('option')
        .data(players)
        .enter()
        .append('option')
            .text(d => `${d.key}: ${d.value}`)
            .attr('value', d => d.key)

    selector.on('change', function () {
        d3.selectAll('.shot')
            .attr('opacity', 1.0)
        var value = selector.property('value')
        if (value !== 'ALL') {
            d3.selectAll('.shot')
                .filter(d => d.PLAYER_NAME !== value)
                .attr('opacity', 0.1)
        }
    })
})