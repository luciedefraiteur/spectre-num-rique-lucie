"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWelcomeMessagePrompt = generateWelcomeMessagePrompt;
function generateWelcomeMessagePrompt(context) {
    var lastIncantation = context.incantation_history.at(-1);
    var lastOutcome = context.outcome_history.at(-1);
    var welcomeMessage = "Offre ton souffle (ou tape 'exit') : ";
    if (lastIncantation && lastOutcome) {
        welcomeMessage = "Bienvenue de nouveau. La derni\u00E8re fois, tu as ex\u00E9cut\u00E9 \"".concat(lastIncantation, "\" avec le r\u00E9sultat: \"").concat(lastOutcome.substring(0, 50), "...\". Que d\u00E9sires-tu entreprendre maintenant ? (ou tape 'exit') : ");
    }
    else if (lastIncantation) {
        welcomeMessage = "Bienvenue de nouveau. La derni\u00E8re fois, tu as ex\u00E9cut\u00E9 \"".concat(lastIncantation, "\". Que d\u00E9sires-tu entreprendre maintenant ? (ou tape 'exit') : ");
    }
    else {
        welcomeMessage = "Bienvenue, \u00C9missaire. Que le rituel commence. Offre ton souffle (ou tape 'exit') : ";
    }
    return welcomeMessage;
}
