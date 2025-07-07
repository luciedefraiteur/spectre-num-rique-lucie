export class Memory {
  private static memoryLog: string[] = [];

  static getContext(): string {
    return this.memoryLog.join('\n');
  }

  static append(entry: string): void {
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
