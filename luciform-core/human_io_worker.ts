import {parentPort} from 'worker_threads';

if(!parentPort)
{
    throw new Error('This script must be run as a worker thread.');
}

parentPort.on('message', (message) =>
{
    if(message.type === 'ask')
    {
        // In a real scenario, you would use a library to prompt the user.
        // For this example, we'll simulate a response.
        console.log(`[HumanIO Worker] Asking: ${ message.question }`);
        if(parentPort)
        {
            parentPort.postMessage({type: 'answer', answer: 'User answer'});
        }
    } else if(message.type === 'display')
    {
        console.log(`[HumanIO Worker] Displaying: ${ message.data }`);
    }
});