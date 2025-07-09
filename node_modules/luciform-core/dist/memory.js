export class Memory {
    static memoryLog = [];
    static getContext() {
        return this.memoryLog.join('\n');
    }
    static append(entry) {
        if (this.memoryLog.length >= 10) {
            this.memoryLog.shift();
        }
        this.memoryLog.push(entry);
    }
}
/*
        .-"""-.
      /        \
     |  O    O  |
     |   .--.   |   Digital ghosts dwell,
     |  (    )  |   Echoes drift in silent loops
      \  '--'  /    In the code’s shadow.
       '-....-'
*/
