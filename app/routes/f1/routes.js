const e = require("express");

/**
 * Copyright 2012 Akseli Palén.
 * Created 2012-07-15.
 * Licensed under the MIT license.
 * 
 * <license>
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * </lisence>
 * 
 * Implements functions to calculate combinations of elements in JS Arrays.
 * 
 * Functions:
 *   k_combinations(set, k) -- Return all k-sized combinations in a set
 *   combinations(set) -- Return all combinations of the set
 */


/**
 * K-combinations
 * 
 * Get k-sized combinations of elements in a set.
 * 
 * Usage:
 *   k_combinations(set, k)
 * 
 * Parameters:
 *   set: Array of objects of any type. They are treated as unique.
 *   k: size of combinations to search for.
 * 
 * Return:
 *   Array of found combinations, size of a combination is k.
 * 
 * Examples:
 * 
 *   k_combinations([1, 2, 3], 1)
 *   -> [[1], [2], [3]]
 * 
 *   k_combinations([1, 2, 3], 2)
 *   -> [[1,2], [1,3], [2, 3]
 * 
 *   k_combinations([1, 2, 3], 3)
 *   -> [[1, 2, 3]]
 * 
 *   k_combinations([1, 2, 3], 4)
 *   -> []
 * 
 *   k_combinations([1, 2, 3], 0)
 *   -> []
 * 
 *   k_combinations([1, 2, 3], -1)
 *   -> []
 * 
 *   k_combinations([], 0)
 *   -> []
 */
function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;
	
	// There is no way to take e.g. sets of 5 elements from
	// a set of 4.
	if (k > set.length || k <= 0) {
		return [];
	}
	
	// K-sized set has only one K-sized subset.
	if (k == set.length) {
		return [set];
	}
	
	// There is N 1-sized subsets in a N-sized set.
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	
	// Assert {1 < k < set.length}
	
	// Algorithm description:
	// To get k-combinations of a set, we want to join each element
	// with all (k-1)-combinations of the other elements. The set of
	// these k-sized sets would be the desired result. However, as we
	// represent sets with lists, we need to take duplicates into
	// account. To avoid producing duplicates and also unnecessary
	// computing, we use the following approach: each element i
	// divides the list into three: the preceding elements, the
	// current element i, and the subsequent elements. For the first
	// element, the list of preceding elements is empty. For element i,
	// we compute the (k-1)-computations of the subsequent elements,
	// join each with the element i, and store the joined to the set of
	// computed k-combinations. We do not need to take the preceding
	// elements into account, because they have already been the i:th
	// element so they are already computed and stored. When the length
	// of the subsequent list drops below (k-1), we cannot find any
	// (k-1)-combs, hence the upper limit for the iteration:
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		// head is a list that includes only our current element.
		head = set.slice(i, i + 1);
		// We take smaller combinations from the subsequent elements
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		// For each (k-1)-combination we join it with the current
		// and store it to the set of k-combinations.
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}


/**
 * Combinations
 * 
 * Get all possible combinations of elements in a set.
 * 
 * Usage:
 *   combinations(set)
 * 
 * Examples:
 * 
 *   combinations([1, 2, 3])
 *   -> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
 * 
 *   combinations([1])
 *   -> [[1]]
 */
function combinations(set) {
	var k, i, combs, k_combs;
	combs = [];
	
	// Calculate all non-empty k-combinations
	for (k = 1; k <= set.length; k++) {
		k_combs = k_combinations(set, k);
		for (i = 0; i < k_combs.length; i++) {
			combs.push(k_combs[i]);
		}
	}
	return combs;
}

function calculateBestTeam(req){

    req.session.myData.highestPoints = []

    req.session.myData.driversAvailable = []
    for (var e = 0; e < req.session.myData.drivers.length; e++) {
        if(req.session.myData.drivers[e].available){
            req.session.myData.driversAvailable.push(req.session.myData.drivers[e])
        }
    }

    req.session.myData.f1TeamSize = 5
    req.session.myData.driversCombinationsArray = k_combinations(req.session.myData.driversAvailable, req.session.myData.f1TeamSize)
    req.session.myData.f1Budget = req.session.myData.f1BudgetWithConstructor - req.session.myData.f1ConstructorPrice

    req.session.myData.teams = []
        //for each constructor
        for (var h = 0; h < req.session.myData.constructors.length; h++) {
            var _constructor = req.session.myData.constructors[h]
            var _constructorPrice = _constructor.price
            var _budget = req.session.myData.f1BudgetWithConstructor - _constructorPrice
            var _newTeam = {
                "constructor": _constructor,
                "combos": [],
            }
           



            req.session.myData.driversCombinationsInBudget = []
            // For each original combo array
            for (var i = 0; i < req.session.myData.driversCombinationsArray.length; i++) {
                var _combo = req.session.myData.driversCombinationsArray[i]
                var _newCombo = {
                    "drivers": [],
                    "totalPrice": 0,
                    "totalPoints": 0,
                    "inBudget": false
                }
                //For each driver in combo
                // {"name":"Leclerc","points":150,"price":25.7}
                for (var j = 0; j < _combo.length; j++) {
                    var _driver = _combo[j] //{"name":"Leclerc","points":150,"price":25.7}
                    _newCombo.drivers.push(_driver.name)
                    _newCombo.totalPrice = _newCombo.totalPrice + _driver.price
                    _newCombo.totalPoints = _newCombo.totalPoints + _driver.points
                }
                _newCombo.totalPrice = Math.round(_newCombo.totalPrice * 10) / 10
                _newCombo.inBudget = _newCombo.totalPrice <= _budget
                if(_newCombo.inBudget){
                    req.session.myData.driversCombinationsInBudget.push(_newCombo)
                }
            }
            req.session.myData.driversCombinationsInBudget.sort(function(a,b){
                var returnValue = a.totalPoints < b.totalPoints ? 1 : b.totalPoints < a.totalPoints ? -1 : 0;
                return returnValue;
            })


            //Highest points summary
            var _highestPoints = {
                "constructor": _constructor.constructor,
                "points": req.session.myData.driversCombinationsInBudget[0].totalPoints + _constructor.points
            }
            req.session.myData.highestPoints.push(_highestPoints)
            req.session.myData.highestPoints.sort(function(a,b){
                var returnValue = a.points < b.points ? 1 : b.points < a.points ? -1 : 0;
                return returnValue;
            })



            _newTeam.combos = req.session.myData.driversCombinationsInBudget
            req.session.myData.teams.push(_newTeam)
        }
}

module.exports = function (router,_myData) {

    var version = "f1";

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        req.session.myData.drivers = [
                {
                  "name": "Verstappen",
                  "points": 162,
                  "price": 30.2,
                  "available": true
                },
                {
                  "name": "Perez",
                  "points": 157,
                  "price": 27.8,
                  "available": true
                },
                {
                  "name": "Leclerc",
                  "points": 150,
                  "price": 25.7,
                  "available": true
                },
                {
                  "name": "Russell",
                  "points": 147,
                  "price": 25.1,
                  "available": true
                },
                {
                  "name": "Sainz",
                  "points": 144,
                  "price": 25.7,
                  "available": true
                },
                {
                  "name": "Hamilton",
                  "points": 141,
                  "price": 23.8,
                  "available": true
                },
                {
                  "name": "Alonso",
                  "points": 134,
                  "price": 21.4,
                  "available": true
                },
                {
                  "name": "Ocon",
                  "points": 125,
                  "price": 18.9,
                  "available": true
                },
                {
                  "name": "Norris",
                  "points": 121,
                  "price": 17.6,
                  "available": true
                },
                {
                  "name": "Gasly",
                  "points": 119,
                  "price": 18.5,
                  "available": true
                },
                {
                  "name": "Stroll",
                  "points": 117,
                  "price": 13.2,
                  "available": true
                },
                {
                  "name": "Tsunoda",
                  "points": 108,
                  "price": 12.9,
                  "available": true
                },
                {
                  "name": "Albon",
                  "points": 106,
                  "price": 5.3,
                  "available": true
                },
                {
                  "name": "Bottas",
                  "points": 106,
                  "price": 14.6,
                  "available": true
                },
                {
                  "name": "Magnussen",
                  "points": 104,
                  "price": 13.8,
                  "available": true
                },
                {
                  "name": "Zhou",
                  "points": 103,
                  "price": 7.4,
                  "available": true
                },
                {
                  "name": "Piastri",
                  "points": 82,
                  "price": 13.3,
                  "available": true
                },
                {
                  "name": "Sargeant",
                  "points": 28,
                  "price": 5.9,
                  "available": true
                },
                {
                  "name": "Hulkenberg",
                  "points": 27,
                  "price": 10.3,
                  "available": true
                },
                {
                  "name": "Vries",
                  "points": 26,
                  "price": 8.6,
                  "available": true
                }
        ]
        req.session.myData.constructors = [
            {
              "constructor": "Red Bull",
              "points": 168,
              "price": 30.0
            },
            {
              "constructor": "Ferrari",
              "points": 151,
              "price": 25.5
            },
            {
              "constructor": "Mercedes",
              "points": 151,
              "price": 25.1
            },
            {
              "constructor": "Alpine",
              "points": 119,
              "price": 20.0
            },
            {
              "constructor": "Aston Martin",
              "points": 124,
              "price": 16.8
            },
            {
              "constructor": "Alfa Romeo",
              "points": 105,
              "price": 15.2
            },
            {
              "constructor": "McLaren",
              "points": 116,
              "price": 13.8
            },
            {
              "constructor": "Hass",
              "points": 101,
              "price": 11.2
            },
            {
              "constructor": "AlphaTauri",
              "points": 103,
              "price": 9.5
            },
            {
              "constructor": "Williams",
              "points": 88,
              "price": 6.9
            }
        ]

        req.session.myData.f1BudgetWithConstructor = 108.4

        calculateBestTeam(req)
        
    }

    // Every GET and POST
    router.all('/' + version + '/*', function (req, res, next) {
        if(!req.session.myData || req.query.r) {
            reset(req)
        }

        //version
        req.session.myData.version = version

        // Reset page validation to false by default. Will only be set to true, if applicable, on a POST of a page
        req.session.myData.validationErrors = {}
        req.session.myData.validationError = "false"
        req.session.myData.includeValidation =  req.query.iv || req.session.myData.includeValidation

        //Reset page notifications
        req.session.myData.notifications = {}
        req.session.myData.showNotification = "false"

        //defaults for setup
        // req.session.myData.example =  req.query.eg || req.session.myData.example

        calculateBestTeam(req)

        next()
    });

    // Setup page
    router.get('/' + version + '/setup', function (req, res) {
        res.render(version + '/setup', {
            myData:req.session.myData
        });
    });

    //best-teams
    router.get('/' + version + '/best-teams', function (req, res) {
        res.render(version + '/best-teams', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/best-teams', function (req, res) {

        //BUDGET
        req.session.myData.f1BudgetWithConstructor = req.body.budget

        //DRIVERS
        req.session.myData.selectedDrivers = req.body.drivers
        for (var e = 0; e < req.session.myData.drivers.length; e++) {
            req.session.myData.drivers[e].available = false
        }
        if(req.session.myData.selectedDrivers == "_unchecked"){
            //no available drivers!!
        } else {
            for (var d = 0; d < req.session.myData.selectedDrivers.length; d++) {
                //for each selected checkbox
                var _selectedDriver = req.session.myData.selectedDrivers[d]
                // req.session.myData.drivers
                for (var e = 0; e < req.session.myData.drivers.length; e++) {
                    //driver
                    var _driver = req.session.myData.drivers[e]
                    if(_selectedDriver == _driver.name){
                        _driver.available = true
                    }
                }
            }
        }

        calculateBestTeam(req)

        
        if(!req.session.myData.selectedDrivers || req.session.myData.selectedDrivers == "_unchecked"){
            // req.session.myData.validationError = "true"
            // req.session.myData.validationErrors.terms = {
            //     "anchor": "terms",
            //     "message": "A FATAL ERROR HAS OCCURED IN THE SCAVENGER SECTION OF THE AWAY DAY."
            // }
        }

        // if(req.session.myData.validationError == "true") {
        //     res.render(version + '/best-teams', {
        //         myData: req.session.myData
        //     });
        // } else {

            res.redirect(301, '/' + version + '/best-teams');
            
        // }
    });
    

    


    

}