interface PlayerSchema {
  name: string;
  wins: number;
  path: number[];
  type: string;
  play: (i: number) => void;
}

type PlayerType = "player" | "computer";

export class Player implements PlayerSchema {
  type: PlayerType = "player";

  constructor(
    public name: string,
    public wins: number,
    public path: number[]
  ) {}

  play(
    playedIndex: number,
    _?: number[],
    _2?: number[],
    _3?: number[][]
  ): void | number {
    this.path.push(playedIndex);
  }
}

export class Computer extends Player implements PlayerSchema {
  type: PlayerType = "computer";

  constructor(name: string, wins: number, path: number[]) {
    super(name, wins, path);
  }

  play(
    _: number,
    posiblePlays?: number[],
    oponentPath?: number[],
    winingPath?: number[][]
  ): number {
    let computerPlay;

    // check if the computer is gonna wins if plays a spicific card
    const canComputerWin = this.checkwins(
      posiblePlays!,
      winingPath!,
      this.path,
      oponentPath!
    );
    if (canComputerWin !== null) computerPlay = canComputerWin;
    else {
      const canPlayerWin = this.checkwins(
        posiblePlays!,
        winingPath!,
        oponentPath!,
        this.path
      );
      if (canPlayerWin !== null) computerPlay = canPlayerWin;
      else if (!computerPlay)
        computerPlay =
          posiblePlays![Math.floor(Math.random() * posiblePlays!.length)];
    }

    this.path.push(computerPlay);
    return computerPlay;
  }

  checkwins(
    posibleMovse: number[],
    winningPaths: number[][],
    playerPath: number[],
    oponentPath: number[]
  ): number | null {
    let pointToPlay;
    let count = 0;
    if (posibleMovse.length === 1) {
      return posibleMovse[0];
    }
    for (var i = 0; i < winningPaths.length; i++) {
      for (var j = 0; j < winningPaths[i].length; j++) {
        if (playerPath.indexOf(winningPaths[i][j]) !== -1) count++;
        if (count === 2) {
          pointToPlay = this.specialItem(playerPath, winningPaths[i]);
          if (pointToPlay !== null && oponentPath.indexOf(pointToPlay) === -1) {
            return pointToPlay;
          } else {
            count = 0;
            break;
          }
        }
      }
      count = 0;
    }
    return null;
  }
  specialItem(playerPath: number[], path: number[]) {
    for (let i = 0; i < path.length; i++) {
      if (playerPath.indexOf(path[i]) === -1) {
        return path[i];
      }
    }
    return null;
  }
}
