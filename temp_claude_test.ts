import * as LLM from './luciform-core/llm_interface.js';

LLM.LLMInterface.query('Hello Claude, are you there? Respond with a short, positive message.', LLM.LLMModel.Claude)
  .then(console.log)
  .catch(console.error);
