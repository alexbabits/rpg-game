/*
Handles all things associated with user input:

--> Clicking Things (Changing volume, changing options, click load/save buttons)
--> Entering Information (inputting values in options or text box prompts in game)
*/
export default class UserInput {
  constructor(scene, handlers = {}) {
    this.scene = scene;

    this.cursors = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      ctrl: Phaser.Input.Keyboard.KeyCodes.CTRL,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC,
      I: Phaser.Input.Keyboard.KeyCodes.I,

      arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
      arrowDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
      arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
      arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });

    this.scene.input.on('pointerover', handlers.onPointerOver || (() => {}));
    this.scene.input.on('pointerout', handlers.onPointerOut || (() => {}));
    this.scene.input.on('pointerdown', handlers.onPointerDown || (() => {}));
    this.scene.input.on('drag', handlers.onDrag || (() => {}));
    this.scene.input.on('dragstart', handlers.onDragStart || (() => {}));
    this.scene.input.on('dragend', handlers.onDragEnd || (() => {}));
  }
}