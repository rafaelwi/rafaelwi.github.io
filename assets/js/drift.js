// Constructor for GamepadButton object
class MyGamepadButton {
    constructor(gpid, newSvgId, successFunc, failureFunc) {
        this.id = gpid
        this.svgID = document.getElementById(newSvgId)
        this.onSuccess = successFunc.bind(this)
        this.onFailure = failureFunc.bind(this)
    }

    setFillColour(colour) {
        this.svgID.setAttribute("fill", colour)
    }

    setFillOpacity(opacity) {
        this.svgID.setAttribute("fill-opacity", opacity)
    }

    setBorderStyle(myStyle) {
        this.svgID.style.border = myStyle
    }
}

var gpi = document.getElementById("gp-info")
var gpb = document.getElementById("gp-btns")
var lt = document.getElementById("gp6")
var rt = document.getElementById("gp7")
var triggers = [lt, rt]

// Create an array of GamepadButton objects
var button0 = new MyGamepadButton(0, "gp0", 
    function() {this.setFillOpacity("1")},
    function() {this.setFillOpacity("0.25")}
)
var button1 = new MyGamepadButton(1, "gp1", 
    function() {this.setFillOpacity("1")}, 
    function() {this.setFillOpacity("0.25")}
)
var button2 = new MyGamepadButton(2, "gp2", 
    function() {this.setFillOpacity("1")}, 
    function() {this.setFillOpacity("0.25")}
)
var button3 = new MyGamepadButton(3, "gp3", 
    function() {this.setFillOpacity("1")}, 
    function() {this.setFillOpacity("0.25")}
)

var button4 = new MyGamepadButton(4, "gp4", 
    function() {this.setFillColour("gray")}, 
    function() {this.setFillColour("lightgray")}
)
var button5 = new MyGamepadButton(5, "gp5", 
    function() {this.setFillColour("gray")}, 
    function() {this.setFillColour("lightgray")}
)

var button8 = new MyGamepadButton(8, "gp8", 
    function() {this.setFillColour("gray")}, 
    function() {this.setFillColour("lightgray")}
)
var button9 = new MyGamepadButton(9, "gp9", 
    function() {this.setFillColour("gray")}, 
    function() {this.setFillColour("lightgray")}
)

var button10 = new MyGamepadButton(10, "left-joystick-pos",
    function() {this.setBorderStyle("5px solid black")},
    function() {this.setBorderStyle("5px solid lightgray")}
)
var button11 = new MyGamepadButton(11, "right-joystick-pos",
    function() {this.setBorderStyle("5px solid black")},
    function() {this.setBorderStyle("5px solid lightgray")}
)

var button12 = new MyGamepadButton(12, "gp12", 
    function() {this.setFillColour("chartreuse")}, 
    function() {this.setFillColour("lightgray")}
)
var button13 = new MyGamepadButton(13, "gp13", 
    function() {this.setFillColour("chartreuse")}, 
    function() {this.setFillColour("lightgray")}
)
var button14 = new MyGamepadButton(14, "gp14", 
    function() {this.setFillColour("chartreuse")}, 
    function() {this.setFillColour("lightgray")}
)
var button15 = new MyGamepadButton(15, "gp15", 
    function() {this.setFillColour("chartreuse")}, 
    function() {this.setFillColour("lightgray")}
)

var button16 = new MyGamepadButton(16, "gp16", 
function() {this.setFillColour("gray")}, 
function() {this.setFillColour("lightgray")}
)
var buttons = [button0, button1, button2, button3, button4, button5, button8, button9, button10, button11, button12, button13, button14, button15, button16]

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

        // Colour the triggers
        for ([i, e] of triggers.entries()) {
            e.setAttribute("fill-opacity", gp.buttons[i+6].value)
        }

        // Run through all of the functions of the buttons
        for ([i, e] of buttons.entries()) {
            (gp.buttons[e.id].value == 1) ? e.onSuccess() : e.onFailure()
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
