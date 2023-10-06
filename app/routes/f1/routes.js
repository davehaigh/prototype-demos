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
            "race5": 172,
            "race6": 174,
            "race7": 164,
            "race8": 167,
            "race9": 164,
            "race10": 167,
            "race11": 165,
            "race12": 164,
            "race13": 164,
            "race14": 165,
            "race15": 150,
            "race16": 174,
            "points": 165.75,
            "price": 29.4,
            "available": false,
            "haveToHave": false
          },
          {
            "name": "Perez",
            "race1": 159,
            "race2": 168,
            "race3": 157,
            "race4": 170,
            "race5": 161,
            "race6": 91,
            "race7": 154,
            "race8": 143,
            "race9": 166,
            "race10": 146,
            "race11": 162,
            "race12": 164,
            "race13": 152,
            "race14": 166,
            "race15": 132,
            "race16": 91,
            "points": 148.88,
            "price": 24.3,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Leclerc",
            "race1": 98,
            "race2": 142,
            "race3": 81,
            "race4": 167,
            "race5": 132,
            "race6": 149,
            "race7": 120,
            "race8": 168,
            "race9": 182,
            "race10": 134,
            "race11": 136,
            "race12": 172,
            "race13": 86,
            "race14": 155,
            "race15": 155,
            "race16": 153,
            "points": 139.38,
            "price": 25.9,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Russell",
            "race1": 134,
            "race2": 151,
            "race3": 100,
            "race4": 130,
            "race5": 155,
            "race6": 147,
            "race7": 167,
            "race8": 97,
            "race9": 140,
            "race10": 149,
            "race11": 153,
            "race12": 141,
            "race13": 110,
            "race14": 152,
            "race15": 115,
            "race16": 139,
            "points": 136.25,
            "price": 20.7,
            "available": false,
            "haveToHave": false
          },
          {
            "name": "Sainz",
            "race1": 168,
            "race2": 143,
            "race3": 129,
            "race4": 153,
            "race5": 152,
            "race6": 133,
            "race7": 153,
            "race8": 147,
            "race9": 143,
            "race10": 127,
            "race11": 130,
            "race12": 94,
            "race13": 161,
            "race14": 170,
            "race15": 180,
            "race16": 139,
            "points": 145.13,
            "price": 25.2,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Hamilton",
            "race1": 146,
            "race2": 145,
            "race3": 176,
            "race4": 141,
            "race5": 144,
            "race6": 153,
            "race7": 168,
            "race8": 169,
            "race9": 133,
            "race10": 160,
            "race11": 155,
            "race12": 149,
            "race13": 152,
            "race14": 139,
            "race15": 168,
            "race16": 146,
            "points": 152.75,
            "price": 26.5,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Alonso",
            "race1": 172,
            "race2": 180,
            "race3": 167,
            "race4": 157,
            "race5": 168,
            "race6": 175,
            "race7": 134,
            "race8": 167,
            "race9": 149,
            "race10": 139,
            "race11": 126,
            "race12": 151,
            "race13": 172,
            "race14": 128,
            "race15": 113,
            "race16": 137,
            "points": 152.19,
            "price": 21.5,
            "available": false,
            "haveToHave": false
          },
          {
            "name": "Ocon",
            "race1": 89,
            "race2": 135,
            "race3": 103,
            "race4": 98,
            "race5": 128,
            "race6": 178,
            "race7": 135,
            "race8": 140,
            "race9": 101,
            "race10": 69,
            "race11": 76,
            "race12": 142,
            "race13": 126,
            "race14": 71,
            "race15": 91,
            "race16": 141,
            "points": 113.94,
            "price": 13.7,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Norris",
            "race1": 96,
            "race2": 84,
            "race3": 155,
            "race4": 132,
            "race5": 86,
            "race6": 131,
            "race7": 110,
            "race8": 114,
            "race9": 185,
            "race10": 189,
            "race11": 180,
            "race12": 148,
            "race13": 146,
            "race14": 133,
            "race15": 176,
            "race16": 166,
            "points": 139.44,
            "price": 25.1,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Gasly",
            "race1": 141,
            "race2": 123,
            "race3": 112,
            "race4": 104,
            "race5": 139,
            "race6": 136,
            "race7": 129,
            "race8": 112,
            "race9": 124,
            "race10": 95,
            "race11": 65,
            "race12": 115,
            "race13": 191,
            "race14": 99,
            "race15": 167,
            "race16": 121,
            "points": 123.31,
            "price": 16.4,
            "available": false,
            "haveToHave": false
          },
          {
            "name": "Stroll",
            "race1": 155,
            "race2": 86,
            "race3": 169,
            "race4": 143,
            "race5": 113,
            "race6": 73,
            "race7": 148,
            "race8": 128,
            "race9": 130,
            "race10": 101,
            "race11": 121,
            "race12": 125,
            "race13": 112,
            "race14": 91,
            "race15": 12,
            "race16": 70,
            "points": 111.06,
            "price": 9.2,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Tsunoda",
            "race1": 123,
            "race2": 123,
            "race3": 130,
            "race4": 133,
            "race5": 125,
            "race6": 104,
            "race7": 112,
            "race8": 104,
            "race9": 78,
            "race10": 89,
            "race11": 94,
            "race12": 129,
            "race13": 94,
            "race14": 30,
            "race15": 68,
            "race16": 119,
            "points": 103.44,
            "price": 8.6,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Albon",
            "race1": 130,
            "race2": 70,
            "race3": 82,
            "race4": 119,
            "race5": 108,
            "race6": 104,
            "race7": 94,
            "race8": 167,
            "race9": 120,
            "race10": 141,
            "race11": 124,
            "race12": 101,
            "race13": 149,
            "race14": 148,
            "race15": 117,
            "race16": 89,
            "points": 116.44,
            "price": 14.8,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Bottas",
            "race1": 151,
            "race2": 85,
            "race3": 124,
            "race4": 87,
            "race5": 110,
            "race6": 120,
            "race7": 78,
            "race8": 136,
            "race9": 94,
            "race10": 121,
            "race11": 124,
            "race12": 113,
            "race13": 107,
            "race14": 132,
            "race15": 81,
            "race16": 63,
            "points": 107.88,
            "price": 9.8,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Magnussen",
            "race1": 110,
            "race2": 131,
            "race3": 88,
            "race4": 114,
            "race5": 143,
            "race6": 76,
            "race7": 79,
            "race8": 88,
            "race9": 80,
            "race10": 66,
            "race11": 84,
            "race12": 100,
            "race13": 89,
            "race14": 78,
            "race15": 147,
            "race16": 94,
            "points": 97.94,
            "price": 8.2,
            "available": false,
            "haveToHave": false
          },
          {
            "name": "Zhou",
            "race1": 93,
            "race2": 109,
            "race3": 144,
            "race4": 72,
            "race5": 91,
            "race6": 108,
            "race7": 143,
            "race8": 91,
            "race9": 116,
            "race10": 94,
            "race11": 109,
            "race12": 108,
            "race13": 78,
            "race14": 99,
            "race15": 123,
            "race16": 115,
            "points": 105.81,
            "price": 11.3,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Piastri",
            "race1": 59,
            "race2": 106,
            "race3": 144,
            "race4": 116,
            "race5": 72,
            "race6": 124,
            "race7": 113,
            "race8": 122,
            "race9": 93,
            "race10": 174,
            "race11": 160,
            "race12": 83,
            "race13": 130,
            "race14": 117,
            "race15": 151,
            "race16": 174,
            "points": 121.13,
            "price": 19.5,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Sargeant",
            "race1": 131,
            "race2": 97,
            "race3": 95,
            "race4": 91,
            "race5": 67,
            "race6": 81,
            "race7": 67,
            "race8": 57,
            "race9": 116,
            "race10": 131,
            "race11": 79,
            "race12": 83,
            "race13": 75,
            "race14": 113,
            "race15": 105,
            "race16": 76,
            "points": 91.5,
            "price": 6.2,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Hulkenberg",
            "race1": 102,
            "race2": 115,
            "race3": 168,
            "race4": 82,
            "race5": 98,
            "race6": 85,
            "race7": 108,
            "race8": 120,
            "race9": 79,
            "race10": 113,
            "race11": 107,
            "race12": 79,
            "race13": 121,
            "race14": 92,
            "race15": 114,
            "race16": 105,
            "points": 105.5,
            "price": 9.7,
            "available": true,
            "haveToHave": false
          },
          {
            "name": "Vries",
            "race1": 106,
            "race2": 105,
            "race3": 94,
            "race4": 55,
            "race5": 83,
            "race6": 118,
            "race7": 99,
            "race8": 77,
            "race9": 87,
            "race10": 0,
            "race11": 0,
            "race12": 0,
            "race13": 0,
            "race14": 0,
            "race15": 0,
            "race16": 0,
            "points": 0,
            "price": 0,
            "available": false,
            "haveToHave": false
          },
          {
            "name": "Ricciardo",
            "race1": 0,
            "race2": 0,
            "race3": 0,
            "race4": 0,
            "race5": 0,
            "race6": 0,
            "race7": 0,
            "race8": 0,
            "race9": 0,
            "race10": 0,
            "race11": 113,
            "race12": 92,
            "race13": 0,
            "race14": 133,
            "race15": 147,
            "race16": 0,
            "points": 97,
            "price": 0,
            "available": false,
            "haveToHave": false
          },
          {
            "name": "Lawson",
            "race1": 0,
            "race2": 0,
            "race3": 0,
            "race4": 0,
            "race5": 0,
            "race6": 0,
            "race7": 0,
            "race8": 0,
            "race9": 0,
            "race10": 0,
            "race11": 0,
            "race12": 0,
            "race13": 120,
            "race14": 0,
            "race15": 0,
            "race16": 0,
            "points": 120,
            "price": 14.5,
            "available": true,
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
            "race5": 170,
            "race6": 131,
            "race7": 164,
            "race8": 159,
            "race9": 162,
            "race10": 156,
            "race11": 167,
            "race12": 176,
            "race13": 168,
            "race14": 173,
            "race15": 136,
            "race16": 140,
            "points": 160.69,
            "price": 25.9
          },
          {
            "constructor": "Ferrari",
            "race1": 133,
            "race2": 153,
            "race3": 110,
            "race4": 165,
            "race5": 152,
            "race6": 150,
            "race7": 133,
            "race8": 149,
            "race9": 165,
            "race10": 139,
            "race11": 139,
            "race12": 135,
            "race13": 123,
            "race14": 168,
            "race15": 172,
            "race16": 156,
            "points": 146.38,
            "price": 25.3
          },
          {
            "constructor": "Mercedes",
            "race1": 149,
            "race2": 156,
            "race3": 141,
            "race4": 142,
            "race5": 147,
            "race6": 154,
            "race7": 159,
            "race8": 133,
            "race9": 140,
            "race10": 157,
            "race11": 147,
            "race12": 154,
            "race13": 124,
            "race14": 152,
            "race15": 141,
            "race16": 147,
            "points": 146.44,
            "price": 24
          },
          {
            "constructor": "Alpine",
            "race1": 103,
            "race2": 135,
            "race3": 112,
            "race4": 97,
            "race5": 139,
            "race6": 155,
            "race7": 139,
            "race8": 123,
            "race9": 117,
            "race10": 87,
            "race11": 81,
            "race12": 121,
            "race13": 131,
            "race14": 83,
            "race15": 118,
            "race16": 122,
            "points": 116.44,
            "price": 15.7
          },
          {
            "constructor": "Aston Martin",
            "race1": 155,
            "race2": 131,
            "race3": 162,
            "race4": 149,
            "race5": 136,
            "race6": 126,
            "race7": 145,
            "race8": 148,
            "race9": 145,
            "race10": 123,
            "race11": 126,
            "race12": 139,
            "race13": 144,
            "race14": 106,
            "race15": 67,
            "race16": 107,
            "points": 131.81,
            "price": 16.4
          },
          {
            "constructor": "Alfa Romeo",
            "race1": 113,
            "race2": 98,
            "race3": 110,
            "race4": 82,
            "race5": 104,
            "race6": 104,
            "race7": 101,
            "race8": 99,
            "race9": 101,
            "race10": 95,
            "race11": 118,
            "race12": 105,
            "race13": 87,
            "race14": 108,
            "race15": 93,
            "race16": 85,
            "points": 100.19,
            "price": 9.4
          },
          {
            "constructor": "McLaren",
            "race1": 83,
            "race2": 94,
            "race3": 129,
            "race4": 129,
            "race5": 79,
            "race6": 127,
            "race7": 113,
            "race8": 122,
            "race9": 129,
            "race10": 169,
            "race11": 165,
            "race12": 119,
            "race13": 144,
            "race14": 130,
            "race15": 147,
            "race16": 171,
            "points": 128.13,
            "price": 24.4
          },
          {
            "constructor": "Hass",
            "race1": 103,
            "race2": 118,
            "race3": 114,
            "race4": 91,
            "race5": 120,
            "race6": 79,
            "race7": 95,
            "race8": 106,
            "race9": 83,
            "race10": 92,
            "race11": 95,
            "race12": 87,
            "race13": 97,
            "race14": 84,
            "race15": 125,
            "race16": 95,
            "points": 99,
            "price": 11.5
          },
          {
            "constructor": "AlphaTauri",
            "race1": 103,
            "race2": 102,
            "race3": 109,
            "race4": 98,
            "race5": 96,
            "race6": 111,
            "race7": 105,
            "race8": 88,
            "race9": 78,
            "race10": 86,
            "race11": 100,
            "race12": 104,
            "race13": 96,
            "race14": 79,
            "race15": 105,
            "race16": 120,
            "points": 98.75,
            "price": 10.9
          },
          {
            "constructor": "Williams",
            "race1": 111,
            "race2": 79,
            "race3": 90,
            "race4": 102,
            "race5": 87,
            "race6": 93,
            "race7": 76,
            "race8": 103,
            "race9": 110,
            "race10": 126,
            "race11": 92,
            "race12": 90,
            "race13": 116,
            "race14": 125,
            "race15": 104,
            "race16": 87,
            "points": 99.44,
            "price": 11.1
          }
         ]

        req.session.myData.f1BudgetWithConstructor = 122.218

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