
/**
 * Category: Utility
 * To add event listener
 * @param {String} "parent, evt, selector, handler"
 */
// addEvent(document, 'click', 'a[href]', function (e) {
//     var href = this.getAttribute('href');
// });
function addEvent (parent, evt, selector, handler) {
    // let target = (parent === document) ? document.getElementsByTagName('html')[0] : parent;
    evt.split(' ').map(eventName => {
        parent.addEventListener(eventName, function (event) {
            if (event.target.matches(selector + ', ' + selector + ' *')) {
                handler.apply(event.target.closest(selector), arguments);
            }
        }, false);
    });
}


/**
 * Category: Utility
 * To check empty object
 * @returns {Boolean} Truthiness of an object emptiness
 */
function notEmpty (obj) {
    return !!Object.keys(obj).length;
}


/**
 * Category: timecode
 * @returns {String} currentHMn: Current timecode 
 */
function getCurrentT () {
    // get current time in HHMM format
    var daily = new Date();
    var currentH = daily.getHours();
    var currentHs = currentH.toString();
    var currentM = daily.getMinutes();

    var currentMs = '';
    if (currentM < 10) {
        currentMs = '0' + currentM;
    } else {
        currentMs = currentM.toString();
    }
    var currentHMs = currentHs + currentMs;
    var currentHMn = parseInt(currentHMs);
    return currentHMn;
}


/**
 * Category: timecode
 * To convert timecode String to Number for comparison
 * @param {String} timeStr
 * @returns {String} Truthiness of an object emptiness
 */
function stringToNumber (timeStr) {
    var cutStr = timeStr.split(':');
    var resultStr = cutStr[0] + cutStr[1];
    var resultStr = parseInt(resultStr);
    return resultStr;
}


/**
 * Category: Marker
 * To synthesize a list of marker items
 * @param {Array} inObj: one geojson feature
 */
function processHash (hash) {
    // var id = hash.replace('#', '');
    var idRegexp = /id=(.+)/g; // /id\/(.+)/g;
    var match = idRegexp.exec(hash);
    var id = match[1];
    console.log('hash', hash, 'id:', id);

    var hitMarker = G['theMapGeoJson'].features.filter(function (o) {
        return (o.properties.id) ?
            o.properties.id.toString().indexOf(id) !== -1 :
            false
    });

    if (hitMarker.length) {
        positionMarkerZoom(hitMarker);
    }
}

