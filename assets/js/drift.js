var gpi = document.getElementById("gp-info")
var gpb = document.getElementById("gp-btns")
var gpbs = ""
var haveEvents = 'GamepadEvent' in window
var haveWebkitEvents = 'WebKitGamepadEvent' in window
var reqAniFrame = window.mozRequestAnimationFrame || window.requestAnimationFrame
var gamepads = []

function gamepadConnectionHandler(e, connecting) {
  var gamepad = e.gamepad

  if (connecting) {
    gamepads[gamepad.index] = gamepad
    gpi.innerHTML = "Gamepad #" + gamepad.index + ": " + gamepad.id + " connected! " +
        gamepad.buttons.length + " buttons and " + gamepad.axes.length + " axes"

    // Update ibration tester button and start updating values
    document.getElementById("testVibrate").setAttribute( "onClick", "vibrate(gamepads[0], 1.0)" )
    document.getElementById("testVibrate").removeAttribute("hidden")
    reqAniFrame(updateGamepadStatus)
  } else {
    gpi.innerHTML = "Gamepad #" + gamepad.index + ": " + gamepad.id + " disconnected"
    delete gamepads[gamepad.index]
  }
}

function updateGamepadStatus() {
    // Reset
    gpbs = ""
    gpb.innerHTML = ""

    // Check all gamepads
    scanForGamepads()
    for (gp of gamepads) {
        // Check all axes
        for ([i,a] of gp.axes.entries()) {
            gpbs += "Axes #" + i + " Value: " + a + "<br>"
        }

        // Check all buttons
        for ([i, b] of gp.buttons.entries()) {
            var pressed = b == 1.0
            if (typeof(b) == "object") {
                pressed = b.pressed
                val = b.value
            }
            gpbs += "Button " + i + " value: " + b.value + "<br>"
        }

        // Vibrate based on LT's value
        if (gp.buttons[6].value > 0.12) { 
            vibrate(gp, gp.buttons[6].value) 
        } else {
            vibrate(gp, 0.0)
        }

        // Vibrate stop
        if (gp.buttons[1].value == 1) { vibrate(gp, 0.0) }
    }
    
    // Print results
    gpb.innerHTML = gpbs
    reqAniFrame(updateGamepadStatus)
}

// Polls for gamepads
function scanForGamepads() {
    var theGamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])
    for (var i = 0; i < theGamepads.length; i++) {
      if (theGamepads[i] && (theGamepads[i].index in gamepads)) {
        gamepads[theGamepads[i].index] = theGamepads[i]
      }
    }
}

// Vibrates the gamepad
function vibrate(gp, val) {
    if (gp && gp.vibrationActuator) {
        gp.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 1000,
          weakMagnitude: val,
          strongMagnitude: val
        })
    }
}

/// The "Main"
// Browser-based event listeners
if (haveEvents) {
    console.log("haveEvents")
    window.addEventListener("gamepadconnected", function(e) { gamepadConnectionHandler(e, true) })
    window.addEventListener("gamepaddisconnected", function(e) { gamepadConnectionHandler(e, false) })
} else if (haveWebkitEvents) {
    console.log("haveWebkitEvents")
    window.addEventListener("webkitgamepadconnected", function(e) { gamepadConnectionHandler(e, true) })
    window.addEventListener("webkitgamepaddisconnected", function(e) { gamepadConnectionHandler(e, false) })
} else {
    setInterval(scanForGamepads, 500)
}
