interface PlayerSchema {
  name: string;
  wins: number;
  path: number[];
  type: string;
  play: (i: number) => void;
}

/*
  XO: to manage the overall elements
  Home: to manage the type of game you want t oplay 'agiant player, agiant computer, online'
  Game: the actuale game page where you have the cards and the buttons
  Board: the carts containers
  Player: the player where you can play by clicking on the boards 
  Computer: the player where the plays is automatically managed by the computer 
*/

abstract class XO {
  protected homeELement: HTMLDivElement;
  protected gameELement: HTMLDivElement;

  constructor() {
    this.homeELement = <HTMLDivElement>document.getElementById("home")!;
    this.gameELement = <HTMLDivElement>document.getElementById("game")!;
  }
}

class Game extends XO {
  private static _game: Game;
  private exitBtn: HTMLButtonElement;
  private cards: HTMLCollection;
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
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 5, 9],
    [3, 5, 7],
    [1, 4, 5],
    [2, 5, 8],
    [3, 6, 9],
  ];

  private playerTurn: number;

  private constructor(private players: Player[]) {
    super();
    this.cards = <HTMLCollection>document.getElementsByClassName("card");
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

    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].addEventListener("click", this.play.bind(this, i));
    }
  }

  private play(cardIndex: number): void {
    // get the dataset-is-played propriety that determened if the card was played
    const isPlayed = this.cards[cardIndex].getAttribute("data-is-played");

    if (isPlayed && +isPlayed === 1) return;
    // make ths card as played
    this.cards[cardIndex].setAttribute("data-is-played", "1");
    // added the played cart to the player path
    this.players[this.playerTurn].play(cardIndex);
    (
      this.cards[cardIndex] as HTMLElement
    ).style.backgroundImage = `url(../public/Images/${
      this.players[this.playerTurn].name
    }Image.png)`;
    this.playerTurn = this.playerTurn === 1 ? 0 : 1;
  }

  private rePlay() {
    this.players = this.players.map((player) => {
      return new Player(player.name, player.wins, []);
    });
  }

  exitGame() {
    this.gameELement.style.display = "none";
    this.homeELement.style.display = "block";
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

class Player implements PlayerSchema {
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

class Computer extends Player implements PlayerSchema {
  type: string = "computer";

  constructor(name: string, wins: number, path: number[]) {
    super(name, wins, path);
  }
}

const home = new Home();
