export default class MessageBox extends Phaser.Scene {
    constructor() {
        super("MessageBox");
    }

    init(data) {
        this.equipmentData = data.equipment;
    }

    create(data) {
        this.gameState = data.gameState;
        this.background = this.add.sprite(130, 480, 'brownbackground').setScale(3, 2);
        this.background.alpha = 1;
        this.messageText = this.add.text(20,520, '', {font: "16px Arial", fill: "#000", resolution: 2});
        this.equipmentData.on('message', this.updateMessage, this);
    }

    updateMessage(message) {
        this.messageText.setText(message);
    }
}