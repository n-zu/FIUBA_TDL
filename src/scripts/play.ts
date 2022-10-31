import "../styles/menu.css";
import "phaser";
import { MultiplayerGame } from "./game/multiplayerGame";
import MainScene from "./scenes/mainScene";
import { GuestMaster } from "./gameMaster/guestMaster";
import { HostMaster } from "./gameMaster/hostMaster";
import { UIScene } from "./scenes/uiScene";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

const gameConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [MainScene, UIScene],
  antialias: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  transparent: true,
};

export function addUrl(id: string) {
  const loc = window.location.href;
  const url = `${loc.split("play")[0]}play?id=${id}`;
  const anchor = document.getElementById("joinLink") as HTMLAnchorElement;
  anchor.href = url;
  const text = document.getElementById("joinText") as HTMLHeadingElement;
  text.innerText = `Join with URL: ${url}`;

  anchor.onclick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(url);
    text.innerText = "Copied to Clipboard!";
    setTimeout(() => {
      text.innerText = `Join with URL: ${url}`;
    }, 1000);
  };
}

window.addEventListener("load", () => {
  const params = new URL(document.location.toString()).searchParams;
  const join_id = params.get("id");
  const host_with = params.get("host_with");

  // If there's a join_id, we're joining.
  if (join_id) {
    console.log(`Joining game id: ${join_id}`);
    const gameMaster = new GuestMaster(join_id);
    gameMaster.start();

    new MultiplayerGame(gameConfig, gameMaster);
    addUrl(join_id);
    return;
  }

  // No join_id: we're hosting.
  console.log(`Hosting game id: ${host_with}`);
  let gameMaster: HostMaster;
  if (host_with) {
    gameMaster = new HostMaster(host_with);
  } else {
    gameMaster = new HostMaster();
  }
  gameMaster.start();
  new MultiplayerGame(gameConfig, gameMaster);
  addUrl(host_with ?? "");
});
