export default class MessageBox extends Phaser.Scene {
    constructor() {
        super("MessageBox");
        this.messages = [];
        this.maxVisibleMessages = 6; // Number of messages visible at once
        this.maxTotalMessages = 50; // Total number of messages to keep in memory
        this.scrollIndex = 0;  // Index to keep track of scroll position
        this.yPos = 480;
        this.spacing = 20;
    }

    init(data) {
        this.equipmentData = data.equipment;
    }

    create(data) {
        this.clearMessages();
        this.gameState = data.gameState;
        this.background = this.add.sprite(130, this.yPos, 'brownbackground').setScale(3, 2);
        this.equipmentData.on('message', this.updateMessage, this);
        this.scrollBar();
    }

    scrollBar(){
        this.scrollBarBackground = this.add.rectangle(10, this.yPos, 10, this.maxVisibleMessages * this.spacing, 0x753939).setOrigin(0, 0.5);
        this.scrollBarHandle = this.add.rectangle(10, this.yPos, 10, this.spacing, 0xd07a58).setOrigin(0, 0.5).setInteractive({ draggable: true });
        this.scrollBarHandle.on('drag', (pointer, dragX, dragY) => this.scroll(dragY));
    }

    updateMessage(message) {
        // Create new message
        const newMessage = this.add.text(this.spacing, this.yPos - this.scrollIndex * this.spacing, message, {font: "16px Arial", fill: "#000", resolution: 2});
        this.messages.push(newMessage);
    
        // Remove oldest message if exceeding total capacity
        if (this.messages.length > this.maxTotalMessages) {
            this.messages[0].destroy();
            this.messages.shift();
        }

        // Update visibility of messages
        this.updateMessageVisibility();
    }

    scroll(dragY) {
        // Calculate the new scroll index
        this.scrollIndex = Math.round((dragY - this.yPos) / this.spacing);
    
        // Clamp the scroll index to valid range
        this.scrollIndex = Phaser.Math.Clamp(this.scrollIndex, 0, this.messages.length - this.maxVisibleMessages);
    
        // Update visibility of messages
        this.updateMessageVisibility();
    
        // Position scroll bar handle
        this.scrollBarHandle.y = this.yPos + this.scrollIndex * this.spacing;
    }
    
    updateMessageVisibility() {
        // Loop through all messages and set their visibility and position
        for (let i = 0; i < this.messages.length; i++) {
            this.messages[i].y = this.yPos + 60 - (i - this.scrollIndex) * this.spacing;
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