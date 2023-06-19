/*
  XO: to manage the overall elements
  Home: to manage the type of game you want t oplay 'agiant player, agiant computer, online'
  Game: the actuale game page where you have the cards and the buttons
  Board: the carts containers
  Player: the player where you can play by clicking on the boards 
  Computer: the player where the plays is automatically managed by the computer 
*/
/// <reference path="./Players.ts" />

namespace App {
  abstract class XO {
    protected homeELement: HTMLDivElement;
    protected gameELement: HTMLDivElement;
    protected replayBtn: HTMLButtonElement;
    protected xwinsElement: HTMLElement;
    protected tiesElement: HTMLElement;
    protected owinsElement: HTMLElement;

    constructor() {
      this.homeELement = <HTMLDivElement>document.getElementById("home")!;
      this.gameELement = <HTMLDivElement>document.getElementById("game")!;
      this.replayBtn = <HTMLButtonElement>(
        document.getElementById("btn-replay")!
      );
      this.xwinsElement = <HTMLButtonElement>document.getElementById("Xwins")!;
      this.tiesElement = <HTMLButtonElement>document.getElementById("ties")!;
      this.owinsElement = <HTMLButtonElement>document.getElementById("Owins")!;
    }
  }

  class Game extends XO {
    private static _game: Game;
    private exitBtn: HTMLButtonElement;
    private gameEnded: boolean = false;
    private board: Board;
    private playCount: number = 0;
    private ties: number = 0;
    private cardsPlayed: [
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean
    ] = [false, false, false, false, false, false, false, false, false];
    private winingPath: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [6, 3, 0],
      [7, 4, 1],
      [8, 5, 2],
      [0, 4, 8],
      [6, 4, 2],
    ];

    private playerTurn: number;

    private constructor(private players: Player[]) {
      super();
      this.board = new Board();
      this.exitBtn = <HTMLButtonElement>document.getElementById("btn-exit");
      this.playerTurn = 0;
      this.configure();
    }

    static getGame(players?: Player[]): Game {
      if (!this._game && players) this._game = new Game(players);
      return this._game;
    }

    private configure(): void {
      this.exitBtn.addEventListener("click", this.exitGame.bind(this));
      this.replayBtn.addEventListener("click", this.rePlay.bind(this));
      for (let i = 0; i < this.board.cards.length; i++) {
        this.board.cards[i].addEventListener("click", this.play.bind(this, i));
      }
    }

    displayState() {
      this.xwinsElement.innerHTML = "X: " + this.players[0].wins.toString();
      this.owinsElement.innerHTML = "O: " + this.players[1].wins.toString();
      this.tiesElement.innerHTML = "Ties: " + this.ties.toString();
    }

    private play(cardIndex: number): void {
      if (this.board.isPlayed(cardIndex) || this.gameEnded) return;
      const player = this.players[this.playerTurn];
      player.play(cardIndex);

      this.board.cardPlayed(cardIndex, player.name);
      const [weHaveWinner, path] = this.checkWinnner();
      console.log([weHaveWinner, path]);
      if (weHaveWinner && path) {
        this.gameEnded = true;
        player.wins++;
        this.board.colorWiningPath(path, player);
        this.displayState();
      }

      if (this.playCount === 8) {
        this.ties += 1;
        this.displayState();
      }
      this.playCount += 1;
      this.playerTurn = this.playerTurn === 1 ? 0 : 1;
    }

    private rePlay() {
      this.gameEnded = false;
      this.reset();
      this.board.clear();
    }

    exitGame() {
      this.gameELement.style.display = "none";
      this.homeELement.style.display = "block";
      this.reset();
      this.board.clear();
    }

    reset() {
      this.players[0].path = [];
      this.players[1].path = [];
    }

    private checkWinnner(): [boolean, number[] | 0] {
      const player = this.players[this.playerTurn];
      if (player.path.length < 3) return [false, 0];
      let checkCount = 0;
      for (var i = 0; i < this.winingPath.length; i++) {
        for (let j = 0; j < this.winingPath[i].length; j++) {
          for (let p = 0; p < player.path.length; p++) {
            if (player.path[p] === this.winingPath[i][j]) {
              checkCount++;
            }
          }
        }
        if (checkCount < 3) {
          checkCount = 0;
        } else if (checkCount === 3) {
          break;
        }
      }
      return [checkCount >= 3, this.winingPath[i]];
    }
  }

  class Home extends XO {
    private game: Game = Game.getGame();
    private playWithFirendBtn: HTMLButtonElement;
    private playWithComputerBtn: HTMLButtonElement;
    private playOnlineBtn: HTMLButtonElement;

    constructor() {
      super();

      this.playWithFirendBtn = <HTMLButtonElement>(
        document.getElementById("play-btn-firend")!
      );
      this.playWithComputerBtn = <HTMLButtonElement>(
        document.getElementById("play-btn-computer")!
      );
      this.playOnlineBtn = <HTMLButtonElement>(
        document.getElementById("play-btn-online")!
      );

      this.configure();
    }

    private configure() {
      // displaying the home page 'so to say'
      this.gameELement.style.display = "none";
      // adding the events listeners to the buttons
      this.playWithFirendBtn.addEventListener(
        "click",
        this.playWithFiend.bind(this)
      );
      this.playWithComputerBtn.addEventListener(
        "click",
        this.playWithComputer.bind(this)
      );
      this.playOnlineBtn.addEventListener("click", this.playOnline.bind(this));
    }

    private startGame(players: Player[]): void {
      this.game = Game.getGame(players);
      this.gameELement.style.display = "block";
      this.homeELement.style.display = "none";
    }

    private playWithFiend() {
      const players = [new Player("X", 0, []), new Player("O", 0, [])];
      this.startGame(players);
    }

    private playWithComputer() {
      const players = [new Player("X", 0, []), new Computer("O", 0, [])];
      this.startGame(players);
    }

    private playOnline() {}
  }

  class Board {
    cards: HTMLCollection;

    constructor() {
      this.cards = <HTMLCollection>document.getElementsByClassName("card")!;
    }

    configure(play: Function) {
      for (let i = 0; i < this.cards.length; i++) {
        this.cards[i].addEventListener("click", play.bind(this, i));
      }
    }

    cardPlayed(cardIndex: number, playerName: string) {
      this.cards[cardIndex].setAttribute("data-is-played", "1");
      (
        this.cards[cardIndex] as HTMLElement
      ).style.backgroundImage = `url(../public/Images/${playerName}Image.png)`;
    }

    isPlayed(cardIndex: number): boolean {
      return (
        +(this.cards[cardIndex] as HTMLElement).getAttribute(
          "data-is-played"
        )! === 1
      );
    }

    clear() {
      for (var i = 0; i < this.cards.length; i++) {
        (this.cards.item(i)! as HTMLElement).style.backgroundImage = "";
        (this.cards.item(i)! as HTMLElement).setAttribute(
          "data-is-played",
          "0"
        );
        (this.cards.item(i)! as HTMLElement).style.backgroundColor =
          "var(--primary-clr-light)";
      }
    }

    colorWiningPath(path: number[], player: Player) {
      for (let i = 0; i < path.length; i++) {
        (
          this.cards.item(path[i]) as HTMLElement
        ).style.backgroundColor = `var(--${player.name}clr)`;
      }
    }
  }

  new Home();
}
