"use strict";
try {
    require('dotenv').config();
}
catch (e) {
    console.error('Le paquet `dotenv` n\'est pas installé. Veuillez exécuter `npm install dotenv`.');
    process.exit(1);
}
if (process.env.GEMINI_API_KEY) {
    console.log('✅ La variable d\'environnement GEMINI_API_KEY est bien définie.');
    console.log('Valeur (tronquée):', process.env.GEMINI_API_KEY.substring(0, 4) + '...');
}
else {
    console.error('❌ La variable d\'environnement GEMINI_API_KEY n\'est pas définie.');
    console.log('Veuillez créer un fichier .env et y ajouter votre clé, ou la définir dans votre environnement système.');
}
//# sourceMappingURL=check_gemini_key.js.map