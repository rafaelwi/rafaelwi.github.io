var gpi = document.getElementById("gp-info")
var gpb = document.getElementById("gp-btns")

var dpadUp    = document.getElementById("gp12")
var dpadDown  = document.getElementById("gp13")
var dpadLeft  = document.getElementById("gp14")
var dpadRight = document.getElementById("gp15")
var dpad = [dpadUp, dpadDown, dpadLeft, dpadRight]

var btnA = document.getElementById("gp0")
var btnB = document.getElementById("gp1")
var btnX = document.getElementById("gp2")
var btnY = document.getElementById("gp3")
var abxy = [btnA, btnB, btnX, btnY]

var lb = document.getElementById("gp4")
var rb = document.getElementById("gp5")
var lt = document.getElementById("gp6")
var rt = document.getElementById("gp7")
var shoulderButtons = [lb, rb]
var triggers = [lt, rt]

var backBtn    = document.getElementById("gp8")
var startBtn   = document.getElementById("gp9")
var gamebarBtn = document.getElementById("gp16")
var gamepadMenu = [backBtn, startBtn]

var leftJoystick = document.getElementById("left-joystick-pos")
var rightJoystick = document.getElementById("right-joystick-pos")
var joysticks = [leftJoystick, rightJoystick]

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
            leftJoystick.style.background = "white"
        }

        // Update right joystick indicator colors
        if ((gp.axes[2] > -0.01 && gp.axes[2] < 0.01) && (gp.axes[3] > -0.01 && gp.axes[3] < 0.01)) {
            rightJoystick.style.background = "chartreuse"
        } else if ((gp.axes[2] > -0.05 && gp.axes[2] < 0.05) && (gp.axes[3] > -0.05 && gp.axes[3] < 0.05)) {
            rightJoystick.style.background = "gold"
        } else if (gp.axes[2] == -1 || gp.axes[2] == 1 || gp.axes[3] == -1 || gp.axes[3] == 1) {
            rightJoystick.style.background = "red"
        } else {
            rightJoystick.style.background = "white"
        }

        // Vibrate based on LT's value
        if (gp.buttons[6].value > 0.0) {
            vibrate(gp, gp.buttons[6].value)
        }

        // Colour the joystick indicators
        for ([i, e] of joysticks.entries()) {
            if (gp.buttons[i+10].value == 1) {
                e.style.border = "5px solid black"
            } else {
                e.style.border = "5px solid lightgray"
            }
        }


        // Colour the dpad (buttons 12-15)
        for ([i, e] of dpad.entries()) {
            if (gp.buttons[i+12].value == 1) {
                e.setAttributeNS(null, 'fill', 'chartreuse')
            } else {
                e.setAttributeNS(null, 'fill', 'lightgray')
            }
        }

        // Colour the ABXY buttons (0-3)
        for ([i, e] of abxy.entries()) {
            if (gp.buttons[i].value == 1) {
                e.setAttributeNS(null, "fill-opacity", "1")
            } else {
                e.setAttributeNS(null, "fill-opacity", "0.25")
            }
        }

        // Colour the shoulder buttons
        for ([i, e] of shoulderButtons.entries()) {
            if (gp.buttons[i+4].value == 1) {
                e.setAttributeNS(null, "fill", "gray")
            } else {
                e.setAttributeNS(null, "fill", "lightgray")
            }
        }

        // Colour the triggers
        for ([i, e] of triggers.entries()) {
            e.setAttribute("fill-opacity", gp.buttons[i+6].value)
        }

        // Colour the gamepad menu buttons
        for ([i, e] of gamepadMenu.entries()) {
            if (gp.buttons[i+8].value == 1) {
                e.setAttribute("fill", "gray")
            } else {
                e.setAttribute("fill", "lightgray")
            }
        }

        // Colour the X button
        if (gp.buttons[16].value == 1) {
            gamebarBtn.setAttribute("fill", "gray")
        } else {
            gamebarBtn.setAttribute("fill", "lightgray")
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
