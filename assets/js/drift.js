function tsTest() {
    document.getElementById("ts-test").innerHTML="Snello world"
}

addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected at index %d: %s. \n%d buttons \n%d axes",
      e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length)
    }
)

addEventListener("gamepaddisconnected", function(e) {
    console.log("Gamepad disconnected from index %d: %s", e.gamepad.index, e.gamepad.id)
  }
)
