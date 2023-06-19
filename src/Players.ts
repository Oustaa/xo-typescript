namespace App {
  interface PlayerSchema {
    name: string;
    wins: number;
    path: number[];
    type: string;
    play: (i: number) => void;
  }

  export class Player implements PlayerSchema {
    type: string = "player";

    constructor(
      public name: string,
      public wins: number,
      public path: number[]
    ) {}

    play(playedIndex: number): void {
      this.path.push(playedIndex);
    }
  }

  export class Computer extends Player implements PlayerSchema {
    type: string = "computer";

    constructor(name: string, wins: number, path: number[]) {
      super(name, wins, path);
    }
  }
}
