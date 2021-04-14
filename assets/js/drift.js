var gpi = document.getElementById("gp-info")
var gpb = document.getElementById("gp-btns")
var gpbs = ""
var haveEvents = 'GamepadEvent' in window
var haveWebkitEvents = 'WebKitGamepadEvent' in window
var reqAniFrame = window.mozRequestAnimationFrame || window.requestAnimationFrame
var gamepads = {}

function gamepadConnectionHandler(e, connecting) {
  var gamepad = e.gamepad

  if (connecting) {
    gamepads[gamepad.index] = gamepad;
    gpi.innerHTML = "Gamepad #" + gamepad.index + ": " + gamepad.id + " connected! " +
      gamepad.buttons.length + " buttons and " + gamepad.axes.length + " axes"
    console.log(gamepad.buttons)
    reqAniFrame(updateGamepadStatus)
  } else {
    gpi.innerHTML = "Gamepad #" + gamepad.index + ": " + gamepad.id + " disconnected"
    delete gamepads[gamepad.index]
  }
}

function updateGamepadStatus() {
    gpbs = ""
    for (gp in gamepads) {
        // Check all buttons
        for (i = 0; i < gp.buttons.length; i++) {
            b = gp.buttons[i]
            console.log(b.index)
            if (b.pressed) {
                gpbs += "<br>Button " + b.index + " pressed! Value: " + b.value
                console.log("bp")
            } else if (b.touched) {
                gpbs += "<br>Button " + b.index + " touched! Value: " + b.value
                console.log("bt")
            }
        }

        // Check all axes
        for (a in gp.axes) {
            gpbs += "<br>Axes #" + a.index + " Value: " + a.value
        }
    }
    
    // Print results
    gpb.innerHTML = gpbs
    reqAniFrame(updateGamepadStatus)
}

function scanForGamepads() {
    var theGamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < theGamepads.length; i++) {
      if (theGamepads[i] && (theGamepads[i].index in gamepads)) {
        gamepads[theGamepads[i].index] = theGamepads[i];
      }
    }
}

// Browser-based event listeners
if (haveEvents) {
    console.log("haveEvents")
    window.addEventListener("gamepadconnected", function(e) { gamepadConnectionHandler(e, true); })
    window.addEventListener("gamepaddisconnected", function(e) { gamepadConnectionHandler(e, false); })
} else if (haveWebkitEvents) {
    console.log("haveWebkitEvents")
    window.addEventListener("webkitgamepadconnected", function(e) { gamepadConnectionHandler(e, true); })
    window.addEventListener("webkitgamepaddisconnected", function(e) { gamepadConnectionHandler(e, false); })
} else {
    setInterval(scanForGamepads, 500)
}
