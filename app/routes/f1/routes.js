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
                "combos": []
            }
           



            req.session.myData.driversCombinationsInBudget = []
            // For each original combo array
            for (var i = 0; i < req.session.myData.driversCombinationsArray.length; i++) {
                var _combo = req.session.myData.driversCombinationsArray[i]
                var _newCombo = {
                    "drivers": [],
                    "totalPrice": 0,
                    "totalPoints": 0,
                    "totalPointsWithConstructor": 0,
                    "inBudget": false,
                    "starDriver": {
                      "name": "",
                      "points": 0
                    }
                }
                //For each driver in combo
                // {"name":"Leclerc","points":150,"price":25.7}
                for (var j = 0; j < _combo.length; j++) {
                    var _driver = _combo[j] //{"name":"Leclerc","points":150,"price":25.7}
                    _newCombo.drivers.push(_driver.name)
                    _newCombo.totalPrice = _newCombo.totalPrice + _driver.price
                    _newCombo.totalPoints = _newCombo.totalPoints + _driver.points
                    //Set star driver
                    if(req.session.myData.starDriver && _driver.price < 18){
                      if(_newCombo.starDriver.points == 0 || (_newCombo.starDriver.points < _driver.points)){
                        _newCombo.starDriver.name = _driver.name
                        _newCombo.starDriver.points = _driver.points
                      }
                    }
                }
                //add on star driver points
                _newCombo.totalPoints = _newCombo.totalPoints + _newCombo.starDriver.points

                //Add constructor points
                _newCombo.totalPointsWithConstructor = Math.round((_newCombo.totalPoints + _constructor.points) * 1) / 1

                //Round total driver points
                _newCombo.totalPoints = Math.round(_newCombo.totalPoints * 1) / 1

                //If combo is in budget add to list
                _newCombo.totalPrice = Math.round(_newCombo.totalPrice * 10) / 10
                _newCombo.inBudget = _newCombo.totalPrice <= _budget


                //IF combo contains all the have to have drivers then add to list
                _newCombo.hasAllHaveToHaveDrivers = false
                var _haveToMatchLength = req.session.myData.selectedHaveToHaveDrivers.length
                if(_haveToMatchLength > 0){
                  var _matched = 0
                  for (var k = 0; k < _haveToMatchLength; k++) {
                    var _selectedDriver = req.session.myData.selectedHaveToHaveDrivers[k]
                    for (var m = 0; m < _newCombo.drivers.length; m++) {
                        var _driver = _newCombo.drivers[m]
                        if(_selectedDriver == _driver){
                          _matched++
                        }
                    }
                  }
                  if(_matched == _haveToMatchLength){
                    _newCombo.hasAllHaveToHaveDrivers = true
                  }
                } else {
                  _newCombo.hasAllHaveToHaveDrivers = true
                }



                //IF in budget AND combo contains all the have to have drivers then add to list
                if(_newCombo.inBudget && _newCombo.hasAllHaveToHaveDrivers){
                    req.session.myData.driversCombinationsInBudget.push(_newCombo)
                }
            }
            //Sort all combos within contructor by total points
            req.session.myData.driversCombinationsInBudget.sort(function(a,b){
                var returnValue = a.totalPoints < b.totalPoints ? 1 : b.totalPoints < a.totalPoints ? -1 : 0;
                return returnValue;
            })


            //Highest points summary
            var _highestPoints = {
                "constructor": _constructor.constructor,
                "points": Math.round((req.session.myData.driversCombinationsInBudget[0].totalPoints + _constructor.points) * 1) / 1
            }
            req.session.myData.highestPoints.push(_highestPoints)



            _newTeam.combos = req.session.myData.driversCombinationsInBudget
            req.session.myData.teams.push(_newTeam)
        }

        //Sort summary at top
        req.session.myData.highestPoints.sort(function(a,b){
          var returnValue = a.points < b.points ? 1 : b.points < a.points ? -1 : 0;
          return returnValue;
        })
}

module.exports = function (router,_myData) {

    var version = "f1";

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        req.session.myData.drivers = [
          {
            "name": "Verstappen",
            "race1": 166,
            "race2": 170,
            "race3": 169,
            "race4": 157,
            "points": 165.5,
            "points8races": 162,
            "price": 29.8,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Perez",
            "race1": 159,
            "race2": 168,
            "race3": 157,
            "race4": 170,
            "points": 163.5,
            "points8races": 159,
            "price": 28.5,
            "available": true,
            "haveToHave": true
          },
          {
            "name": "Leclerc",
            "race1": 98,
            "race2": 142,
            "race3": 81,
            "race4": 167,
            "points": 122,
            "points8races": 141,
            "price": 25.6,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Russell",
            "race1": 134,
            "race2": 151,
            "race3": 100,
            "race4": 130,
            "points": 128.75,
            "points8races": 138,
            "price": 21.8,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Sainz",
            "race1": 168,
            "race2": 143,
            "race3": 129,
            "race4": 153,
            "points": 148.25,
            "points8races": 144,
            "price": 24.3,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Hamilton",
            "race1": 146,
            "race2": 145,
            "race3": 176,
            "race4": 141,
            "points": 152,
            "points8races": 146,
            "price": 25.1,
            "available": false,
            "haveToHave": false
          },
          {
            "name": "Alonso",
            "race1": 172,
            "race2": 180,
            "race3": 167,
            "race4": 157,
            "points": 169,
            "points8races": 145,
            "price": 24.3,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Ocon",
            "race1": 89,
            "race2": 135,
            "race3": 103,
            "race4": 98,
            "points": 106.25,
            "points8races": 118,
            "price": 15,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Norris",
            "race1": 96,
            "race2": 84,
            "race3": 155,
            "race4": 132,
            "points": 116.75,
            "points8races": 124,
            "price": 19,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Gasly",
            "race1": 141,
            "race2": 123,
            "race3": 112,
            "race4": 104,
            "points": 120,
            "points8races": 117,
            "price": 15.6,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Stroll",
            "race1": 155,
            "race2": 86,
            "race3": 169,
            "race4": 143,
            "points": 138.25,
            "points8races": 127,
            "price": 17.2,
            "available": true,
            "haveToHave": true
          },
          {
            "name": "Tsunoda",
            "race1": 123,
            "race2": 123,
            "race3": 130,
            "race4": 133,
            "points": 127.25,
            "points8races": 115,
            "price": 15.8,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Albon",
            "race1": 130,
            "race2": 70,
            "race3": 82,
            "race4": 119,
            "points": 100.25,
            "points8races": 104,
            "price": 6.6,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Bottas",
            "race1": 151,
            "race2": 85,
            "race3": 124,
            "race4": 87,
            "points": 111.75,
            "points8races": 107,
            "price": 12.6,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Magnussen",
            "race1": 110,
            "race2": 131,
            "race3": 88,
            "race4": 114,
            "points": 110.75,
            "points8races": 104,
            "price": 12,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Zhou",
            "race1": 93,
            "race2": 109,
            "race3": 144,
            "race4": 72,
            "points": 104.5,
            "points8races": 104,
            "price": 7.7,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Piastri",
            "race1": 59,
            "race2": 106,
            "race3": 144,
            "race4": 116,
            "points": 106.25,
            "points8races": 106,
            "price": 15,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Sargeant",
            "race1": 131,
            "race2": 97,
            "race3": 95,
            "race4": 91,
            "points": 103.5,
            "points8races": 51,
            "price": 6.6,
            "available": false,
            "haveToHave": false
          },
          {
            "name": "Hulkenberg",
            "race1": 102,
            "race2": 115,
            "race3": 168,
            "race4": 82,
            "points": 116.75,
            "points8races": 58,
            "price": 10.3,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Vries",
            "race1": 106,
            "race2": 105,
            "race3": 94,
            "race4": 55,
            "points": 90,
            "points8races": 45,
            "price": 6.1,
            "available": false,
            "haveToHave": false
          }
         ]
        req.session.myData.constructors = [
          {
            "constructor": "Red Bull",
            "race1": 177,
            "race2": 164,
            "race3": 153,
            "race4": 175,
            "points": 167.25,
            "points8races": 167,
            "price": 29.4
          },
          {
            "constructor": "Ferrari",
            "race1": 133,
            "race2": 153,
            "race3": 110,
            "race4": 165,
            "points": 140.25,
            "points8races": 147,
            "price": 23.6
          },
          {
            "constructor": "Mercedes",
            "race1": 149,
            "race2": 156,
            "race3": 141,
            "race4": 142,
            "points": 147,
            "points8races": 152,
            "price": 24.2
          },
          {
            "constructor": "Alpine",
            "race1": 103,
            "race2": 135,
            "race3": 112,
            "race4": 97,
            "points": 111.75,
            "points8races": 115,
            "price": 16.9
          },
          {
            "constructor": "Aston Martin",
            "race1": 155,
            "race2": 131,
            "race3": 162,
            "race4": 149,
            "points": 149.25,
            "points8races": 131,
            "price": 20.9
          },
          {
            "constructor": "Alfa Romeo",
            "race1": 113,
            "race2": 98,
            "race3": 110,
            "race4": 82,
            "points": 100.75,
            "points8races": 105,
            "price": 12.3
          },
          {
            "constructor": "McLaren",
            "race1": 83,
            "race2": 94,
            "race3": 129,
            "race4": 129,
            "points": 108.75,
            "points8races": 114,
            "price": 16.4
          },
          {
            "constructor": "Hass",
            "race1": 103,
            "race2": 118,
            "race3": 114,
            "race4": 91,
            "points": 106.5,
            "points8races": 101,
            "price": 11.8
          },
          {
            "constructor": "AlphaTauri",
            "race1": 103,
            "race2": 102,
            "race3": 109,
            "race4": 98,
            "points": 103,
            "points8races": 103,
            "price": 10.1
          },
          {
            "constructor": "Williams",
            "race1": 111,
            "race2": 79,
            "race3": 90,
            "race4": 102,
            "points": 95.5,
            "points8races": 91,
            "price": 8.8
          }
         ]

        req.session.myData.f1BudgetWithConstructor = 111.718
        // 112.6 real
        // 111.718 with 3% penalty for dropping red bull


        req.session.myData.selectedHaveToHaveDrivers = []
        for (var a = 0; a < req.session.myData.drivers.length; a++) {
          var _driver = req.session.myData.drivers[a]
          if(_driver.haveToHave){
            req.session.myData.selectedHaveToHaveDrivers.push(_driver.name)
          }
        }

        req.session.myData.starDriver = true

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

        //STAR DRIVER
        req.session.myData.starDriver = (req.body.starDriver != "_unchecked")

        //BUDGET
        req.session.myData.f1BudgetWithConstructor = req.body.budget

        //DRIVERS
        req.session.myData.selectedDrivers = req.body.drivers
        for (var e = 0; e < req.session.myData.drivers.length; e++) {
            req.session.myData.drivers[e].available = false
            req.session.myData.drivers[e].haveToHave = false
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
        req.session.myData.selectedHaveToHaveDrivers = []
        if(req.body.haveToHaveDrivers == "_unchecked"){
          //no have to have drivers!!
        } else {
            for (var d = 0; d < req.body.haveToHaveDrivers.length; d++) {
                //for each selected checkbox
                var _selectedDriver = req.body.haveToHaveDrivers[d]
                req.session.myData.selectedHaveToHaveDrivers.push(_selectedDriver)
                // req.session.myData.drivers
                for (var e = 0; e < req.session.myData.drivers.length; e++) {
                    //driver
                    var _driver = req.session.myData.drivers[e]
                    if(_selectedDriver == _driver.name){
                        _driver.haveToHave = true
                    }
                }
            }
            if(req.session.myData.selectedHaveToHaveDrivers[0] == "_unchecked"){
              req.session.myData.selectedHaveToHaveDrivers.shift()
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