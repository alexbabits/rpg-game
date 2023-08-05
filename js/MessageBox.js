export default class MessageBox extends Phaser.Scene {
    constructor() {
        super("MessageBox");
        this.messages = [];
        this.maxDisplayedMessages = 6;
        this.maxTotalMessages = 50;
        this.scrollIndex = 0;
        this.yPos = 480;
        this.spacing = 25;
        this.messageHeight = 16;
        this.scrollBarHeight = 160;
        this.isVisible = false;
    }

    init(data) {
        this.equipmentData = data.equipment;
        this.inventoryData = data.inventory;
        this.player = data.player;
    }

    create(data) {
        this.clearMessages();
        this.gameState = data.gameState;
        this.background = this.add.sprite(150, this.yPos, 'brownbackground').setScale(3.4, 2);
        this.equipmentData.on('message', this.updateMessage, this);
        this.inventoryData.on('message', this.updateMessage, this);
        this.events.on('message', this.updateMessage, this);
        this.events.once('shutdown', this.shutdown, this);
        this.createScrollBar();
        this.setupMessageBoxIcon();
        this.setupExitButton();
        this.exitButton.visible = false;
        this.background.visible = false;
        this.scrollBarBackground.visible = false;
        this.scrollBarHandle.visible = false;
        this.messages.forEach(message => message.visible = false);
    
        this.input.keyboard.on('keydown-K', () => {this.toggleVisibility()});
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
        this.updateMessageDisplay();
    }


    scroll(dragY) {
        let clampedY = Phaser.Math.Clamp(dragY, this.minHandleY, this.maxHandleY);
        let percentage = (this.maxHandleY - clampedY) / (this.maxHandleY - this.minHandleY);
        this.scrollIndex = Math.round(percentage * (this.messages.length - this.maxDisplayedMessages));
        this.scrollIndex = Phaser.Math.Clamp(this.scrollIndex, 0, this.messages.length - this.maxDisplayedMessages);
        this.updateMessageDisplay();
        this.scrollBarHandle.y = clampedY;
    }

    updateMessageDisplay() {
        for (let i = 0; i < this.messages.length; i++) {
            this.messages[i].y = this.yPos + 70 - this.messageHeight - (i - this.scrollIndex) * this.spacing;
            this.messages[i].visible = this.isVisible && i >= this.scrollIndex && i < this.scrollIndex + this.maxDisplayedMessages;
        }
    }


    toggleVisibility() {
        this.isVisible = !this.isVisible;
        this.background.visible = this.isVisible;
        this.scrollBarBackground.visible = this.isVisible;
        this.scrollBarHandle.visible = this.isVisible;
        this.exitButton.visible = this.isVisible;
        this.updateMessageDisplay();
    }

    clearMessages() {
        for (const message of this.messages) {
            message.destroy();
        }
        this.messages = [];
        this.scrollIndex = 0;
    }

    setupExitButton() {
        this.exitButton = this.add.sprite(10, this.yPos - 80, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
        this.exitButton.on('pointerover', () => {this.exitButton.setTint(0x969696)});
        this.exitButton.on('pointerout', () => {this.exitButton.clearTint()});
        this.exitButton.on('pointerdown', () => {this.toggleVisibility()});
    }

    setupMessageBoxIcon() {
        this.messageBoxIcon = this.add.sprite(145, 603, 'items', 3).setScale(1.5).setDepth(200).setInteractive();
        this.messageBoxIcon.on('pointerover', () => {this.messageBoxIcon.setTint(0x969696)});
        this.messageBoxIcon.on('pointerout', () => {this.messageBoxIcon.clearTint()});
        this.messageBoxIcon.on('pointerdown', () => {this.toggleVisibility()});
    }

    shutdown() {
        this.events.off('message', this.updateMessage, this);
    }

}