export default class EquipmentData {
    constructor(scene, gameState, player) {
        this.scene = scene;
        this.gameState = gameState;
        this.player = player;
        this.gameState.setEquipItems([null, null, null, null, null, null, null, null, null, null]);
        if (this.gameState.getEquipVisibility() === undefined) {
            this.gameState.setEquipVisibility(true);
        } 
    }


    toggleEquipmentVisibility() {this.gameState.setEquipVisibility(!this.gameState.getEquipVisibility())}


    removeEquipItem(index){
        let equips = this.gameState.getEquipItems();
        if(equips[index]){
            equips[index] = null;
        } 
        this.gameState.setEquipItems(equips);     
    }

    unequipItem(index) {
        let equips = this.gameState.getEquipItems();
        if (equips[index] && equips[index].canEquip === true) {
            let type = equips[index].type; 
            if (equips[index].quantity > 1) {
                equips[index].quantity--;
                this.gameState.setEquipItems(equips);
            } else if (equips[index].quantity === 1) {
                equips[index].quantity--;
            }
    
            switch (type) {
                case 'weapon':
                    this.unequipWeapon(type);
                    break;
                case 'shield':
                    this.unequipShield(type);
                    break;
                case 'helm':
                    this.unequipHelm(type);
                    break;
                default:
                    console.error('Invalid type:', type);
            }
    
            if (equips[index]?.quantity === 0) {
                this.removeEquipItem(index);
            }
        }
    }

    unequipWeapon(type) {
        if(type === 'weapon'){
            //
        }
    }
    unequipShield(type) {
        if(type === 'shield'){
            //
        }
    }
    unequipHelm(type) {
        if(type === 'helm'){
            //
        }
    }

}





