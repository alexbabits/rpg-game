export default class MessageBox extends Phaser.Scene {
    constructor() {
        super("MessageBox");
        this.messages = [];
        this.maxMessages = 6;
    }

    init(data) {
        this.equipmentData = data.equipment;
    }

    create(data) {
        this.gameState = data.gameState;
        this.background = this.add.sprite(130, 480, 'brownbackground').setScale(3, 2);
        this.background.alpha = 1;
        this.equipmentData.on('message', this.updateMessage, this);
    }

    updateMessage(message) {
        for (let i = 0; i < this.messages.length; i++) {
            this.messages[i].y -= 20;
        }

        const newMessage = this.add.text(20, 520, message, {font: "16px Arial", fill: "#000", resolution: 2});
        this.messages.push(newMessage);

        if (this.messages.length > this.maxMessages) {
            this.messages[0].destroy();
            this.messages.shift();
        }
    }
}