import things from './Things.js'

export default class InventoryData extends Phaser.Events.EventEmitter {
    constructor(scene, gameState, player, equipmentData) {
        super();
        this.scene = scene;
        this.gameState = gameState;
        this.player = player;
        this.equipmentData = equipmentData;
        this.gameState.setInvItems([
            things.staminapotion, null, null, things.basicshield, 
            things.basicsword, null, null, null, 
            null, things.healthpotion, things.metalshield, null, 
            null, things.metalsword, things.gold, things.manapotion
        ]);
        if (this.gameState.getInvVisibility() === undefined) {
            this.gameState.setInvVisibility(false);
        }
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
            items[index] = null;
        } 
        this.gameState.setInvItems(items);     
    }

    addInvItem(item, context = 'loot') {
        let items = this.gameState.getInvItems();
        let itemAdded = false;
        
        for(let i=0; i < items.length; i++){
            if(items[i] === null){
                items[i] = item;
                itemAdded = true;
                break;
            }
        }
        this.gameState.setInvItems(items);
        this.emit('addInvItem');
        if (context === 'loot') {
            this.emit('message', `${item.name} looted.`)
        };
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

    equipItem(index){
        let items = this.gameState.getInvItems();
        if (items[index] && items[index].canEquip === true) {
            let item = items[index];
            
            if (!this.equipmentData.isSlotAvailable(item.type)) {
                console.log('Slot is already occupied. Cannot equip item.');
                return;
            }
            
            switch (item.type) {
                case 'weapon':
                    this.equipmentData.equipWeapon(item);
                    break;
                case 'offhand':
                    this.equipmentData.equipOffhand(item);
                    break;
                case 'helm':
                    this.equipmentData.equipHelm(item);
                    break;
                default:
                    console.error('Invalid item index or type:', index, item.type);
                    return;
            }
            
            if (items[index].quantity > 1) {
                items[index].quantity--;
            } else if (items[index].quantity === 1) {
                items[index] = null;
            }
            this.gameState.setInvItems(items);
        }
    }

}