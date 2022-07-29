// Put all the javascript code here, that you want to execute after page load.
let hasPlaylist = false;
let isLoop = false;

function countVideoInPlaylist() {
  let playlist = document.getElementsByTagName(
    "ytd-playlist-panel-video-renderer"
  );
  let count = 0;
  for (let i = 0; i < playlist.length; i++) {
    const element = playlist.item(i);
    if (element.attributes.hasOwnProperty("within-miniplayer")) {
      continue;
    }
    count++;
  }
  return count;
}

function hasButtonLoop() {
  let btnLoops = document.getElementsByTagName(
    "ytd-playlist-loop-button-renderer"
  );
  return btnLoops && btnLoops.length != 0;
}

function getActionMenu() {
  let panel = document.querySelectorAll(
    "#start-actions.ytd-playlist-panel-renderer"
  );
  return panel[1].children["playlist-action-menu"];
}

function isLastVideo() {
  let [curr, total] = document
    .querySelectorAll(".index-message-wrapper.ytd-playlist-panel-renderer")[1]
    ?.innerText?.split(" / ");
  return parseInt(curr) === parseInt(total);
}

function moveToFirstVideo() {
  let playlist = document.getElementsByTagName(
    "ytd-playlist-panel-video-renderer"
  );
  for (let i = 0; i < playlist.length; i++) {
    const element = playlist.item(i);
    if (element.attributes.hasOwnProperty("within-miniplayer")) {
      continue;
    }
    element?.children[0]?.click();
    break;
  }
}

function loopIcon() {
  if (isLoop) {
    return '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 22px; height: 22px;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M20,14h2v5L5.84,19.02l1.77,1.77l-1.41,1.41L1.99,18l4.21-4.21l1.41,1.41l-1.82,1.82L20,17V14z M4,7l14.21-0.02l-1.82,1.82 l1.41,1.41L22.01,6l-4.21-4.21l-1.41,1.41l1.77,1.77L2,5v6h2V7z" class="style-scope yt-icon"></path></g></svg>';
  }
  return '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 22px; height: 22px;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M21,13h1v5L3.93,18.03l2.62,2.62l-0.71,0.71L1.99,17.5l3.85-3.85l0.71,0.71l-2.67,2.67L21,17V13z M3,7l17.12-0.03 l-2.67,2.67l0.71,0.71l3.85-3.85l-3.85-3.85l-0.71,0.71l2.62,2.62L2,6v5h1V7z" class="style-scope yt-icon"></path></g></svg>';
}

const config = { subtree: true, childList: true };
setTimeout(()=>{
  try {
    //observer change dom tree of playlist
    const observer = new MutationObserver(function () {
      try {
        let c = countVideoInPlaylist();
        if (hasButtonLoop()) return;
        let actionMenu = getActionMenu();
        let lpcontainer = document.getElementById("lpcontainer");
        //create new
        if (!lpcontainer) {
          let container = document.createElement("div");
          container.style.paddingTop = "8px";
          container.id = "lpcontainer";

          let btn = document.createElement("button");
          btn.style.backgroundColor = "transparent";
          btn.style.border = "0px";
          btn.style.cursor = "pointer";

          btn.innerHTML = loopIcon();
          btn.addEventListener("click", function (e) {
            e.stopPropagation();
            isLoop = !isLoop;
            btn.innerHTML = loopIcon();
          });
          container.appendChild(btn);

          actionMenu.style.display = "flex";
          actionMenu.prepend(container);
        } else {
          if (
            (lpcontainer.hasAttribute("lp-active") && isLoop) ||
            (!lpcontainer.hasAttribute("lp-active") && !isLoop)
          ) {
            return;
          }

          if (isLoop) {
            lpcontainer.setAttribute("lp-active", "");
            let btn = lpcontainer.children[0];
            btn.innerHTML = loopIcon();
          } else {
            lpcontainer.removeAttribute("lp-active", "");
          }
        }
      } catch (error) {
        console.error(error);
      }
    });

    observer.observe(
      document.querySelector("#playlist.ytd-watch-flexy"),
      config
    );

    // observer end of video
    let btnPlay = document.querySelector(
      ".ytp-chrome-controls .ytp-play-button"
    );
    let observeVideoEnded = new MutationObserver(function () {
      if (!isLoop) return;

      if (!isLastVideo()) return;

      if (btnPlay.attributes["title"].nodeValue != "Replay") return;

      //move to first queue
      moveToFirstVideo();
    });
    observeVideoEnded.observe(btnPlay, config);
  } catch (error) {
    console.error(error);
  }
}, 2000);
//https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#signing-test-version-listed
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
//https://discourse.mozilla.org/t/content-script-fails-to-get-installed/37501
