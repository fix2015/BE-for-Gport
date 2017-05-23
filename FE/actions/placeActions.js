/**
 * Created by semianchuk on 27.09.16.
 */
import axios from "axios";
import config from "../components/config"

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


export function fetchPlace(dispatch) {
        var url =  config.domain + 'place/get',
            self=this;
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            success: function (obj) {
                if(obj.status == 'success'){
                    var temp;
                    obj.places = shuffle(obj.places);
                    for(var i=0; i<obj.places.length; i++){
                        if(obj.places[i].id == 2451){
                            temp = obj.places[i];
                            obj.places.splice(i,1);
                            break;
                        }
                    }
                    obj.places.splice(0,0,temp);
                    dispatch({type: "SET_PLACES_PARAMS", payload: obj.places})
                }else{
                    console.log(obj.errors)
                }
            }
        })
}

export function setPlaceId(name) {
    return {
        type: "SET_PLACE_ID",
        payload: name
    }
}
export function setPlaceProfileUrl(name) {
    return {
        type: "SET_PLACE_PROFILE_URL",
        payload: name
    }
}
export function setPlaceParams(obj) {
    return {
        type: "SET_PLACE_PARAMS",
        payload: obj
    }
}
