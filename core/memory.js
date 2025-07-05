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
//# sourceMappingURL=memory.js.map