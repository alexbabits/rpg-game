import things from './Things.js'

export default class InventoryData extends Phaser.Events.EventEmitter {
    constructor(scene, gameState, player, equipmentData) {
        super();
        this.scene = scene;
        this.gameState = gameState;
        this.player = player;
        this.equipmentData = equipmentData;

        let staminapotion = { ...things.staminapotion, quantity: 3 };
        let basicshield = { ...things.basicshield, quantity: 1 };
        let basicsword = { ...things.basicsword, quantity: 1 };
        let healthpotion = { ...things.healthpotion, quantity: 2 };
        let metalshield = { ...things.metalshield, quantity: 1 };
        let metalsword = { ...things.metalsword, quantity: 1 };
        let gold = { ...things.gold, quantity: 50 };
        let manapotion = { ...things.manapotion, quantity: 6 };

        this.gameState.setInvItems([
            staminapotion, null, null, basicshield, 
            basicsword, null, metalsword, null, 
            null, healthpotion, metalshield, null, 
            null, metalsword, gold, manapotion
        ]);
        if (this.gameState.getInvVisibility() === undefined) {this.gameState.setInvVisibility(false)}
        this.scene.events.on('itemLooted', this.addInvItem, this);
    }

    toggleInventoryVisibility() {this.gameState.setInvVisibility(!this.gameState.getInvVisibility())}

    moveInvItem(oldIndex, newIndex) {
        const items = this.gameState.getInvItems();
        const item = items[oldIndex];
        items[oldIndex] = null;
        items[newIndex] = item;
    }

    removeInvItem(index){
        let items = this.gameState.getInvItems();
        if(items[index]){
            items[index] = null
        } 
        this.gameState.setInvItems(items);     
        this.emit('itemSwapped', index);
    }

    addInvItem(item, context = 'loot', swapIndex = null) {
        let items = this.gameState.getInvItems();
        let itemAdded = false;
    
        if (swapIndex !== null) {
            items[swapIndex] = item;
            itemAdded = true;
        }
    
        if (!itemAdded && item.stackable) {
            for (let i = 0; i < items.length; i++) {
                if (items[i] !== null && items[i].name === item.name) {
                    items[i].quantity += item.quantity;
                    itemAdded = true;
                    break;
                }
            }
        }

        if (!itemAdded) {
            for (let i = 0; i < items.length; i++) {
                if (items[i] === null) {
                    items[i] = item;
                    itemAdded = true;
                    break;
                }
            }
        }
    
        this.gameState.setInvItems(items);
        this.emit('addInvItem');
        if (context === 'loot' && item.quantity > 1) {
            this.emit('message', `Looted ${item.quantity} ${item.name}s.`)
        } else if (context === 'loot' && item.quantity === 1){
            this.emit('message', `Looted ${item.name}.`)
        }
    }

    useItem(index) {
        let items = this.gameState.getInvItems();
        if (items[index] && items[index].canUse === true) {
            let itemName = items[index].name; 
            if (items[index].quantity > 1) {
                items[index].quantity--;
                this.gameState.setInvItems(items);
            } else if (items[index].quantity === 1) {
                items[index].quantity--;
            }
    
            switch (itemName) {
                case 'healthpotion':
                    this.useHealthPotion(itemName);
                    break;
                case 'manapotion':
                    this.useManaPotion(itemName);
                    break;
                case 'staminapotion':
                    this.useStaminaPotion(itemName);
                    break;
                default:
                    console.error('Invalid item name:', itemName);
            }
    
            if (items[index]?.quantity === 0) {
                this.removeInvItem(index);
            }
        }
    }
    
    useHealthPotion(itemName) {
        if(itemName === 'healthpotion') {
            const healAmount = 50;
            this.player.gameState.setPlayerHP(this.player.gameState.getPlayerHP() + healAmount);
            console.log(`Used health potion. HP is now ${this.player.gameState.getPlayerHP()}`);
            this.player.scene.scene.get('PlayerVisualScene').events.emit('potionDrank', healAmount, '#73e600');
            this.emit('message', `Used ${itemName}. Recovered ${healAmount} HP.`);
        }
    }
    
    useManaPotion(itemName) {
        if(itemName === 'manapotion') {
            const manaAmount = 10;
            this.player.gameState.setPlayerMana(this.player.gameState.getPlayerMana() + manaAmount);
            console.log(`Used mana potion. Mana is now ${this.player.gameState.getPlayerMana()}`);
            this.player.scene.scene.get('PlayerVisualScene').events.emit('potionDrank', manaAmount, '#0073e6');
            this.emit('message', `Used ${itemName}. Recovered ${manaAmount} Mana.`);
        }
    }
    
    useStaminaPotion(itemName) {
        if(itemName === 'staminapotion') {
            const staminaAmount = 25;
            this.player.gameState.setPlayerStamina(this.player.gameState.getPlayerStamina() + staminaAmount);
            console.log(`Used stamina potion. Stamina is now ${this.player.gameState.getPlayerStamina()}`);
            this.player.scene.scene.get('PlayerVisualScene').events.emit('potionDrank', staminaAmount, '#e6e600');
            this.emit('message', `Used ${itemName}. Recovered ${staminaAmount} Stamina.`);
        }
    }

    equipItem(index) {
        let items = this.gameState.getInvItems();
    
        if (items[index] && items[index].canEquip === true) {
            let item = items[index];
            let equipIndex;
            let equipMethod;

            switch (item.type) {
                case 'weapon':
                    equipIndex = 5;
                    equipMethod = this.equipmentData.equipWeapon;
                    break;
                case 'offhand':
                    equipIndex = 6;
                    equipMethod = this.equipmentData.equipOffhand;
                    break;
            }
            this.removeInvItem(index);
            if (!this.equipmentData.isSlotAvailable(item.type)) {
                this.equipmentData.unequipItem(equipIndex, index);
            }

            equipMethod.call(this.equipmentData, item);
            this.gameState.setInvItems(items);
        }
    }
}