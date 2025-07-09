import { CHAOLITE_FERMANT, CHAOLITE_OUVRANT } from '../chaolites.js';
export function extraireReveEtChargeUtile(reponseBrute) {
    const debutReve = reponseBrute.indexOf(CHAOLITE_OUVRANT);
    const finReve = reponseBrute.indexOf(CHAOLITE_FERMANT);
    if (debutReve !== -1 && finReve > debutReve) {
        const reve = reponseBrute.substring(debutReve + CHAOLITE_OUVRANT.length, finReve).trim();
        const chargeUtile = reponseBrute.substring(finReve + CHAOLITE_FERMANT.length).trim();
        return { reve, chargeUtile };
    }
    else {
        return { reve: null, chargeUtile: reponseBrute.trim() };
    }
}
