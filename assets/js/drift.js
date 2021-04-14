var gpi = document.getElementById("gp-info")
var gpb = document.getElementById("gp-btns")
var leftJoystick = document.getElementById("left-joystick-pos")
var rightJoystick = document.getElementById("right-joystick-pos")
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

        // Update joystick positions
        leftJoystick.style.left  = calcJoystick(gp.axes[0])
        leftJoystick.style.top   = calcJoystick(gp.axes[1])
        rightJoystick.style.left = calcJoystick(gp.axes[2])
        rightJoystick.style.top  = calcJoystick(gp.axes[3])

        // Update left joystick indicator colors
        if ((gp.axes[0] > -0.01 && gp.axes[0] < 0.01) && (gp.axes[1] > -0.01 && gp.axes[1] < 0.01)) {
            leftJoystick.style.background = "chartreuse"
        } else if ((gp.axes[0] > -0.05 && gp.axes[0] < 0.05) && (gp.axes[1] > -0.05 && gp.axes[1] < 0.05)) {
            leftJoystick.style.background = "gold"
        } else if (gp.axes[0] == -1 || gp.axes[0] == 1 || gp.axes[1] == -1 || gp.axes[1] == 1) {
            leftJoystick.style.background = "red"
        } else {
            leftJoystick.style.background = "black"
        }

        // Update right joystick indicator colors
        if ((gp.axes[2] > -0.01 && gp.axes[2] < 0.01) && (gp.axes[3] > -0.01 && gp.axes[3] < 0.01)) {
            rightJoystick.style.background = "chartreuse"
        } else if ((gp.axes[2] > -0.05 && gp.axes[2] < 0.05) && (gp.axes[3] > -0.05 && gp.axes[3] < 0.05)) {
            rightJoystick.style.background = "gold"
        } else if (gp.axes[2] == -1 || gp.axes[2] == 1 || gp.axes[3] == -1 || gp.axes[3] == 1) {
            rightJoystick.style.background = "red"
        } else {
            rightJoystick.style.background = "black"
        }

        // Vibrate based on LT's value
        if (gp.buttons[6].value > 0.0) { 
            vibrate(gp, gp.buttons[6].value) 
        }
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

// Calculates the position of the joystick for the indicator
function calcJoystick(pos) {
    return pos * 50 + 50 + "%"
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
