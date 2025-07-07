import * as LLM from './core/llm_interface.js';

LLM.LLMInterface.query('Hello Claude, are you there? Respond with a short, positive message.', LLM.LLMModel.Claude)
  .then(console.log)
  .catch(console.error);
