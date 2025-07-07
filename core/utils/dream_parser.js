"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extraireReveEtChargeUtile = extraireReveEtChargeUtile;
var chaolites_js_1 = require("../chaolites.js");
function extraireReveEtChargeUtile(reponseBrute) {
    var debutReve = reponseBrute.indexOf(chaolites_js_1.CHAOLITE_OUVRANT);
    var finReve = reponseBrute.indexOf(chaolites_js_1.CHAOLITE_FERMANT);
    if (debutReve !== -1 && finReve > debutReve) {
        var reve = reponseBrute.substring(debutReve + chaolites_js_1.CHAOLITE_OUVRANT.length, finReve).trim();
        var chargeUtile = reponseBrute.substring(finReve + chaolites_js_1.CHAOLITE_FERMANT.length).trim();
        return { reve: reve, chargeUtile: chargeUtile };
    }
    else {
        return { reve: null, chargeUtile: reponseBrute.trim() };
    }
}
