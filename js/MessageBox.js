export default class MessageBox extends Phaser.Scene {
    constructor() {
        super("MessageBox");
        this.messages = [];
        this.maxVisibleMessages = 6;
        this.maxTotalMessages = 50;
        this.scrollIndex = 0;
        this.yPos = 480;
        this.spacing = 25;
        this.messageHeight = 16;
        this.scrollBarHeight = 160;
    }

    init(data) {
        this.equipmentData = data.equipment;
        this.inventoryData = data.inventory;
    }

    create(data) {
        this.clearMessages();
        this.gameState = data.gameState;
        this.background = this.add.sprite(150, this.yPos, 'brownbackground').setScale(3.4, 2);
        this.equipmentData.on('message', this.updateMessage, this);
        this.inventoryData.on('message', this.updateMessage, this);
        this.createScrollBar();
    }

    createScrollBar(){
        this.scrollBarBackground = this.add.rectangle(15, this.yPos, 10, this.scrollBarHeight, 0x753939);
        this.maxHandleY = this.yPos + (this.scrollBarHeight - 20) / 2;
        this.minHandleY = this.yPos - (this.scrollBarHeight - 20) / 2;
        this.scrollBarHandle = this.add.rectangle(15, this.maxHandleY, 10, 20, 0xd07a58).setInteractive({ draggable: true });
        this.scrollBarHandle.on('drag', (pointer, dragX, dragY) => this.scroll(dragY));
    }

    updateMessage(message) {
        const newMessage = this.add.text(this.spacing, this.yPos - this.messageHeight, message, {font: "14px Arial", fill: "#000", resolution: 2});
        this.messages.unshift(newMessage);
    
        if (this.messages.length > this.maxTotalMessages) {
            this.messages[this.messages.length - 1].destroy();
            this.messages.pop();
        }
        this.scrollIndex = 0;
        this.scrollBarHandle.y = this.yPos + 70;
        this.updateMessageVisibility();
    }


    scroll(dragY) {
        let clampedY = Phaser.Math.Clamp(dragY, this.minHandleY, this.maxHandleY);
        let percentage = (this.maxHandleY - clampedY) / (this.maxHandleY - this.minHandleY);
        this.scrollIndex = Math.round(percentage * (this.messages.length - this.maxVisibleMessages));
        this.scrollIndex = Phaser.Math.Clamp(this.scrollIndex, 0, this.messages.length - this.maxVisibleMessages);
        this.updateMessageVisibility();
        this.scrollBarHandle.y = clampedY;
    }

    updateMessageVisibility() {
        for (let i = 0; i < this.messages.length; i++) {
            this.messages[i].y = this.yPos + 70 - this.messageHeight - (i - this.scrollIndex) * this.spacing;
            this.messages[i].visible = i >= this.scrollIndex && i < this.scrollIndex + this.maxVisibleMessages;
        }
    }

    clearMessages() {
        for (const message of this.messages) {
            message.destroy();
        }
        this.messages = [];
        this.scrollIndex = 0;
    }

}