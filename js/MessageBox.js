export default class MessageBox extends Phaser.Scene {
    constructor() {
        super("MessageBox");
        this.messages = [];
        this.maxVisibleMessages = 6; // Number of messages visible at once
        this.totalMessages = 50; // Total number of messages to keep in memory
        this.scrollIndex = 0;  // Index to keep track of scroll position
    }

    init(data) {
        this.equipmentData = data.equipment;
    }

    create(data) {
        this.clearMessages();
        this.gameState = data.gameState;
        this.background = this.add.sprite(130, 480, 'brownbackground').setScale(3, 2);
        this.equipmentData.on('message', this.updateMessage, this);

        // Create scroll bar background
        this.scrollBarBackground = this.add.rectangle(10, 480, 10, this.maxVisibleMessages * 20, 0x753939);
        this.scrollBarBackground.setOrigin(0, 0.5);

        // Create scroll bar handle
        this.scrollBarHandle = this.add.rectangle(10, 480, 10, 20, 0xd07a58);
        this.scrollBarHandle.setOrigin(0, 0.5);
        this.scrollBarHandle.setInteractive({ draggable: true });
        this.scrollBarHandle.on('drag', (pointer, dragX, dragY) => this.scroll(dragY));
    }

    updateMessage(message) {
        // Create new message
        const newMessage = this.add.text(20, 480 - this.scrollIndex * 20, message, {font: "16px Arial", fill: "#000", resolution: 2});
        this.messages.push(newMessage);
    
        // Remove oldest message if exceeding total capacity
        if (this.messages.length > this.totalMessages) {
            this.messages[0].destroy();
            this.messages.shift();
        }

        // Update visibility of messages
        this.updateMessageVisibility();
    }

    scroll(dragY) {
        // Calculate the new scroll index
        this.scrollIndex = Math.round((dragY - 480) / 20);
    
        // Clamp the scroll index to valid range
        this.scrollIndex = Phaser.Math.Clamp(this.scrollIndex, 0, this.messages.length - this.maxVisibleMessages);
    
        // Update visibility of messages
        this.updateMessageVisibility();
    
        // Position scroll bar handle
        this.scrollBarHandle.y = 480 + this.scrollIndex * 20;
    }
    
    updateMessageVisibility() {
        // Loop through all messages and set their visibility and position
        for (let i = 0; i < this.messages.length; i++) {
            this.messages[i].y = 540 - (i - this.scrollIndex) * 20;
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