const e = require("express");

module.exports = function (router,_myData) {

    var version = "sort-code";

    function setAndCheckSortCodeDigit(req,_toCheckID){
        req.session.myData["sortCode" + _toCheckID] = req.body["sortCode" + _toCheckID].trim().toString()

        //Check blank
        if(!req.session.myData["sortCode" + _toCheckID]){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors["sortCode" + _toCheckID] = {
                "anchor": "sortCode" + _toCheckID,
                "message": "Put your " + _toCheckID.toLowerCase() + " digit in using " + req.session.myData.sortCodeSystem + " numerals"
            }
        //Check value
        } else {

            //Check within numbers in set
            var _pos = req.session.myData.selectedSystem.numbers.indexOf(req.session.myData["sortCode" + _toCheckID].toUpperCase())
            if(_pos > -1) {
                req.session.myData["sortCode" + _toCheckID + "InArabic"] = _pos
            } else {
                req.session.myData.validationError = "true"
                req.session.myData.validationErrors["sortCode" + _toCheckID] = {
                    "anchor": "sortCode" + _toCheckID,
                    "message": "Enter a single number in " + req.session.myData.sortCodeSystem + " numerals, e.g. " + req.session.myData.selectedSystem.numbers
                }
            }
        }
    }

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        req.session.myData.numeralSystems = [
            {
                "type": "roman",
                "description": "Roman numerals",
                "numbers": ["N","I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]
            },
            {
                "type": "arabic",
                "description": "Arabic numerals",
                "numbers": ["0","1","2","3","4","5","6","7","8","9"]
            },{
                "type": "braille",
                "description": "Braille numerals",
                "numbers": ["⠚","⠁","⠃","⠉","⠙","⠑","⠋","⠛","⠓","⠊"]
            },{
                "type": "brahmi",
                "description": "Brahmi numerals",
                "numbers": ["𑁦","𑁧","𑁨","𑁩","𑁪","𑁫","𑁬","𑁭","𑁮","𑁯"]
            },{
                "type": "devanagari",
                "description": "Devanagari numerals",
                "numbers": ["०","१","२","३","४","५","६","७","८","९"]
            },{
                "type": "bengali",
                "description": "Bengali numerals",
                "numbers": ["০","১","২","৩","৪","৫","৬","৭","৮","৯"]
            },{
                "type": "gurmukhi",
                "description": "Gurmukhi numerals",
                "numbers": ["੦","੧","੨","੩","੪","੫","੬","੭","੮","੯"]
            },{
                "type": "gujarati",
                "description": "Gujarati numerals",
                "numbers": ["૦","૧","૨","૩","૪","૫","૬","૭","૮","૯"]
            },{
                "type": "odia",
                "description": "Odia numerals",
                "numbers": ["୦","୧","୨","୩","୪","୫","୬","୭","୮","୯"]
            },{
                "type": "santali",
                "description": "Santali numerals",
                "numbers": ["᱐","᱑","᱒","᱓","᱔","᱕","᱖","᱗","᱘","᱙"] 
            },{
                "type": "tamil",
                "description": "Tamil numerals",
                "numbers": ["0","௧","௨","௩","௪","௫","௬","௭","௮","௯"] 
            },{
                "type": "telugu",
                "description": "Telugu script § Numerals",
                "numbers": ["౦","౧","౨","౩","౪","౫","౬","౭","౮","౯"]
            },{
                "type": "kannada",
                "description": "Kannada script § Numerals",
                "numbers": ["೦","೧","೨","೩","೪","೫","೬","೭","೮","೯"]
            },{
                "type": "malayalam",
                "description": "Malayalam numerals",
                "numbers": ["൦","൧","൨","൩","൪","൫","൬","൭","൮","൯"]
            },{
                "type": "burmese",
                "description": "Burmese numerals",
                "numbers": ["၀","၁","၂","၃","၄","၅","၆","၇","၈","၉"]
            },{
                "type": "tibetan",
                "description": "Tibetan numerals",
                "numbers": ["༠","༡","༢","༣","༤","༥","༦","༧","༨","༩"] 
            },{
                "type": "mongolian",
                "description": "Mongolian numerals",
                "numbers": ["᠐","᠑","᠒","᠓","᠔","᠕","᠖","᠗","᠘","᠙"]
            },{
                "type": "khmer",
                "description": "Khmer numerals",
                "numbers": ["០","១","២","៣","៤","៥","៦","៧","៨","៩"] 
            },{
                "type": "thai",
                "description": "Thai numerals",
                "numbers": ["๐","๑","๒","๓","๔","๕","๖","๗","๘","๙"]
            },{
                "type": "lao",
                "description": "Lao script § Numerals",
                "numbers": ["໐","໑","໒","໓","໔","໕","໖","໗","໘","໙"]
            },{
                "type": "javanese",
                "description": "Javanese numerals",
                "numbers": ["꧐","꧑","꧒","꧓","꧔","꧕","꧖","꧗","꧘","꧙"] 
            },{
                "type": "ea",
                "description": "Eastern Arabic numerals (Arabic)",
                "numbers": ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"]
            },{
                "type": "eapersian",
                "description": "Eastern Arabic numerals (Persian / Dari / Pashto)",
                "numbers": ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"]
            },{
                "type": "eaurdu",
                "description": "Eastern Arabic numerals (Urdu / Shahmukhi)",
                "numbers": ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"]
            },{
                "type": "chinese",
                "description": "Chinese, Vietnamese, Japanese, and Korean numerals",
                "numbers": ["零","一","二","三","四","五","六","七","八","九"] 
            },{
                "type": "greek",
                "description": "Greek numerals",
                "numbers": ["ο","Αʹ","Βʹ","Γʹ","Δʹ","Εʹ","Ϛʹ","Ζʹ","Ηʹ","Θʹ"] 
            }
        ]
        req.session.myData.numeralSystems.sort(function(a,b){
            var returnValue = a.description.toString().toUpperCase() > b.description.toString().toUpperCase() ? 1 : b.description.toString().toUpperCase() > a.description.toString().toUpperCase() ? -1 : 0;
            return returnValue;
        })
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

        next()
    });

    // Setup page
    router.get('/' + version + '/setup', function (req, res) {
        res.render(version + '/setup', {
            myData:req.session.myData
        });
    });

    //Dropout
    router.get('/' + version + '/sort-code-dropout', function (req, res) {
        res.render(version + '/sort-code-dropout', {
            myData:req.session.myData
        });
    });

    //Check
    router.get('/' + version + '/sort-code-check', function (req, res) {
        res.render(version + '/sort-code-check', {
            myData:req.session.myData
        });
    });

    //Do you know your sort code
    router.get('/' + version + '/sort-code-know', function (req, res) {
        res.render(version + '/sort-code-know', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/sort-code-know', function (req, res) {

        req.session.myData.sortCodeKnow = req.body.sortCodeKnow

        if(!req.session.myData.sortCodeKnow){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.sortCodeKnow = {
                "anchor": "sortCodeKnow-1",
                "message": "Do you know it or not?"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/sort-code-know', {
                myData: req.session.myData
            });
        } else {

            if(req.session.myData.sortCodeKnow == "No"){
                req.session.myData.dropout = "dontknow"
                res.redirect(301, '/' + version + '/sort-code-dropout');
            } else {
                res.redirect(301, '/' + version + '/sort-code-sure');
            }
            
        }
    });

    //Sure you know your sort code
    router.get('/' + version + '/sort-code-sure', function (req, res) {
        res.render(version + '/sort-code-sure', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/sort-code-sure', function (req, res) {

        req.session.myData.sortCodeSure = req.body.sortCodeSure

        if(!req.session.myData.sortCodeSure){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.sortCodeSure = {
                "anchor": "sortCodeSure-1",
                "message": "Answer the question"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/sort-code-sure', {
                myData: req.session.myData
            });
        } else {

            if(req.session.myData.sortCodeSure == "No"){
                req.session.myData.dropout = "dontknow2"
                res.redirect(301, '/' + version + '/sort-code-dropout');
            } else {
                res.redirect(301, '/' + version + '/sort-code-system');
            }
            
        }
    });

    //Numerical system
    router.get('/' + version + '/sort-code-system', function (req, res) {
        res.render(version + '/sort-code-system', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/sort-code-system', function (req, res) {

        req.session.myData.sortCodeSystem = req.body.sortCodeSystem

        if(!req.session.myData.sortCodeSystem){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.sortCodeSystem = {
                "anchor": "sortCodeSystem",
                "message": "Pick a numerical system"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/sort-code-system', {
                myData: req.session.myData
            });
        } else {

            //Set selected system
            for (var i = 0; i < req.session.myData.numeralSystems.length; i++) {
                if(req.session.myData.numeralSystems[i].type == req.session.myData.sortCodeSystem){
                    req.session.myData.selectedSystem = req.session.myData.numeralSystems[i]
                }
            }

            res.redirect(301, '/' + version + '/sort-code-1');
            
        }
    });

    //Sort code 1
    router.get('/' + version + '/sort-code-1', function (req, res) {
        res.render(version + '/sort-code-1', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/sort-code-1', function (req, res) {

        setAndCheckSortCodeDigit(req,"First")

        if(req.session.myData.validationError == "true") {
            res.render(version + '/sort-code-1', {
                myData: req.session.myData
            });
        } else {

            res.redirect(301, '/' + version + '/sort-code-2');
            
        }
    });

    //Sort code 2
    router.get('/' + version + '/sort-code-2', function (req, res) {
        res.render(version + '/sort-code-2', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/sort-code-2', function (req, res) {

        setAndCheckSortCodeDigit(req,"Second")

        if(req.session.myData.validationError == "true") {
            res.render(version + '/sort-code-2', {
                myData: req.session.myData
            });
        } else {

            res.redirect(301, '/' + version + '/sort-code-3');
            
        }
    });

    //Sort code 3
    router.get('/' + version + '/sort-code-3', function (req, res) {
        res.render(version + '/sort-code-3', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/sort-code-3', function (req, res) {

        setAndCheckSortCodeDigit(req,"Third")

        if(req.session.myData.validationError == "true") {
            res.render(version + '/sort-code-3', {
                myData: req.session.myData
            });
        } else {

            res.redirect(301, '/' + version + '/sort-code-4');
            
        }
    });

    //Sort code 4
    router.get('/' + version + '/sort-code-4', function (req, res) {
        res.render(version + '/sort-code-4', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/sort-code-4', function (req, res) {

        setAndCheckSortCodeDigit(req,"Fourth")

        if(req.session.myData.validationError == "true") {
            res.render(version + '/sort-code-4', {
                myData: req.session.myData
            });
        } else {

            res.redirect(301, '/' + version + '/sort-code-5');
            
        }
    });

    //Sort code 5
    router.get('/' + version + '/sort-code-5', function (req, res) {
        res.render(version + '/sort-code-5', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/sort-code-5', function (req, res) {

        setAndCheckSortCodeDigit(req,"Fifth")

        if(req.session.myData.validationError == "true") {
            res.render(version + '/sort-code-5', {
                myData: req.session.myData
            });
        } else {

            res.redirect(301, '/' + version + '/sort-code-6');
            
        }
    });

    //Sort code 6
    router.get('/' + version + '/sort-code-6', function (req, res) {
        res.render(version + '/sort-code-6', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/sort-code-6', function (req, res) {

        setAndCheckSortCodeDigit(req,"Sixth")

        if(req.session.myData.validationError == "true") {
            res.render(version + '/sort-code-6', {
                myData: req.session.myData
            });
        } else {

            res.redirect(301, '/' + version + '/sort-code-check');
            
        }
    });

    

}