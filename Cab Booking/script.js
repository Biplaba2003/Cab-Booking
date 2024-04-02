const cabTravelTimes = [
    {
        'A': {'B': 5, 'C': 10},
        'B': {'A': 5, 'C': 3, 'D': 12},
        'C': {'A': 10, 'B': 3, 'D': 8},
        'D': {'B': 12, 'C': 8, 'E': 6},
        'E': {'D': 6, 'F': 20},
        'F': {'E': 20}
    },
    {
        'A': {'B': 4, 'C': 9},
        'B': {'A': 4, 'C': 2, 'D': 11},
        'C': {'A': 9, 'B': 2, 'D': 7},
        'D': {'B': 11, 'C': 7, 'E': 5},
        'E': {'D': 5, 'F': 19},
        'F': {'E': 19}
    },
    {
        'A': {'B': 6, 'C': 11},
        'B': {'A': 6, 'C': 4, 'D': 13},
        'C': {'A': 11, 'B': 4, 'D': 9},
        'D': {'B': 13, 'C': 9, 'E': 7},
        'E': {'D': 7, 'F': 21},
        'F': {'E': 21}
    },
    {
        'A': {'B': 7, 'C': 12},
        'B': {'A': 7, 'C': 5, 'D': 14},
        'C': {'A': 12, 'B': 5, 'D': 10},
        'D': {'B': 14, 'C': 10, 'E': 8},
        'E': {'D': 8, 'F': 22},
        'F': {'E': 22}
    },
    {
        'A': {'B': 8, 'C': 13},
        'B': {'A': 8, 'C': 6, 'D': 15},
        'C': {'A': 13, 'B': 6, 'D': 11},
        'D': {'B': 15, 'C': 11, 'E': 9},
        'E': {'D': 9, 'F': 23},
        'F': {'E': 23}
    }
];

const bookings = {};

let cabPrices = [1.5, 1.8, 2.0, 2.2, 2.5];

function isCabAvailable(cab, start, end) {
    if (!bookings[cab]) {
        return true;
    }

    for (let booking of bookings[cab]) {
        if (!(end <= booking.start || start >= booking.end)) {
            return false;
        }
    }

    return true;
}

function addBooking(cab, start, end) {
    if (!bookings[cab]) {
        bookings[cab] = [];
    }
    bookings[cab].push({ start: start, end: end });
}

function calculateShortestTimeAndPath(source, destination, cab) {
    const graph = cabTravelTimes[cab - 1];
    const distances = {};
    const visited = {};
    const queue = [];
    const previous = {};

    for (let node in graph) {
        distances[node] = Infinity;
    }
    distances[source] = 0;

    queue.push(source);

    while (queue.length > 0) {
        let current = queue.shift();
        if (current === destination) {
            break;
        }

        if (!visited[current]) {
            visited[current] = true;
            let neighbors = graph[current];
            for (let neighbor in neighbors) {
                let distance = distances[current] + neighbors[neighbor];
                if (distance < distances[neighbor]) {
                    distances[neighbor] = distance;
                    previous[neighbor] = current;
                    queue.push(neighbor);
                }
            }
        }
    }

    let shortestPath = [];
    let currentNode = destination;
    while (currentNode !== source) {
        shortestPath.unshift(currentNode);
        currentNode = previous[currentNode];
    }
    shortestPath.unshift(source);

    let shortestTime = distances[destination];

    return {
        shortestTime: shortestTime,
        shortestPath: shortestPath.join(' -> ')
    };
}

function bookCab() {
    var email = document.getElementById("email").value;
    var source = document.getElementById("source").value;
    var destination = document.getElementById("destination").value;
    var cab = document.getElementById("cab").value;
    var startTime = new Date(document.getElementById("start-time").value).getTime();
    var endTime = new Date(document.getElementById("end-time").value).getTime();

    if (!isCabAvailable(cab, startTime, endTime)) {
        alert("Selected cab is not available during the requested time period.");
        return;
    }

    var result = calculateShortestTimeAndPath(source, destination, cab);
    var time = result.shortestTime;
    var cost = calculateCost(time, cab);
    var shortestPath = result.shortestPath;

    addBooking(cab, startTime, endTime);

    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "Estimated time: " + time + " minutes<br>Estimated cost: $" + cost + "<br>Shortest Path: " + shortestPath;
}

function calculateCost(time, cab) {
    const pricePerMinute = cabPrices[cab - 1];

    const totalCost = (time * pricePerMinute).toFixed(2);
    return totalCost;
}

function updateCabPrice(cab) {
    const price = document.getElementById("price" + cab).value;
    if (price <= 0) {
        alert("Price must be greater than zero.");
        return;
    }
    const cabIndex = cab - 1;
    cabPrices[cabIndex] = parseFloat(price);
    alert("Price for Cab " + cab + " updated successfully.");
    
    const resultDiv = document.getElementById("result");
    if (resultDiv.innerHTML !== "") {
        const timeMatch = resultDiv.innerHTML.match(/Estimated time: (\d+(\.\d+)?) minutes?/);
        if (timeMatch) {
            const newCost = calculateCost(parseFloat(timeMatch[1]), cab);
            resultDiv.innerHTML = resultDiv.innerHTML.replace(/Estimated cost: \$\d+(\.\d+)?/, "Estimated cost: $" + newCost);
        }
    }
}