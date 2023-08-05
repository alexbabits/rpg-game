export default class MessageBox extends Phaser.Scene {
    constructor() {
        super("MessageBox");
        this.messages = [];
        this.maxVisibleMessages = 6; // Number of messages visible at once
        this.maxTotalMessages = 50; // Total number of messages to keep in memory
        this.scrollIndex = 0;  // Index to keep track of scroll position
        this.yPos = 480;
        this.spacing = 25;
        this.messageHeight = 16;
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
        this.scrollBarBackground = this.add.rectangle(15, this.yPos, 10, 160, 0x753939);
        this.scrollBarHandle = this.add.rectangle(15, this.yPos, 10, 20, 0xd07a58).setInteractive({ draggable: true });
        this.scrollBarHandle.on('drag', (pointer, dragX, dragY) => this.scroll(dragY));
    }

    updateMessage(message) {
        // Create new message
        const newMessage = this.add.text(this.spacing, this.yPos - this.messageHeight, message, {font: "16px Arial", fill: "#000", resolution: 2});
        this.messages.unshift(newMessage); // Add to the beginning of the array
    
        // Remove oldest message if exceeding total capacity
        if (this.messages.length > this.maxTotalMessages) {
            this.messages[this.messages.length - 1].destroy();
            this.messages.pop();
        }

        // Update visibility of messages
        this.updateMessageVisibility();
    }


    scroll(dragY) {
        // Calculate the percentage of the scroll bar's position
        let percentage = (dragY - this.yPos) / (this.scrollBarBackground.height - this.scrollBarHandle.height);

        // Calculate the new scroll index based on the percentage
        this.scrollIndex = Math.round(percentage * (this.messages.length - this.maxVisibleMessages));

        // Clamp the scroll index to valid range
        this.scrollIndex = Phaser.Math.Clamp(this.scrollIndex, 0, this.messages.length - this.maxVisibleMessages);

        // Update visibility of messages
        this.updateMessageVisibility();

        // Position scroll bar handle
        this.scrollBarHandle.y = this.yPos + percentage * (this.scrollBarBackground.height - this.scrollBarHandle.height);
    }

    updateMessageVisibility() {
        // Loop through all messages and set their visibility and position
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