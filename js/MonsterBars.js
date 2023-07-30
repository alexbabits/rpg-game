export class MonsterHPBar {
    constructor(scene, monster) {
        this.scene = scene;
        this.monster = monster;
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.text = new Phaser.GameObjects.Text(scene, monster.sprite.x, monster.sprite.y, '', {fontFamily: 'Arial', fontSize: '11px', fill: '#000', resolution: 2});
        this.bar.setDepth(40);
        this.text.setDepth(41);
        this.xOffset = -38;
        this.yOffset = -35;
        this.size = {width: 80, height: 8};
        scene.add.existing(this.bar);
        scene.add.existing(this.text);
        this.draw();
        this.bar.setVisible(false);
        this.text.setVisible(false);
        this.monster.sprite.on('monsterDamageTaken', this.damageSplat, this);
        this.monster.sprite.on('monsterSpecialDamageTaken', this.damageSplat, this);
    };

    draw() {
        this.bar.clear();
        this.text.setPosition(this.monster.sprite.x + this.xOffset + 18, this.monster.sprite.y + this.yOffset - 3);
        this.text.setText(`${this.monster.HP}/${this.monster.maxHP}`);

        this.pixelPerHP = this.size.width / this.monster.maxHP;
        const { width, height } = this.size;
        const HPWidth = this.monster.HP * this.pixelPerHP;
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(this.monster.sprite.x + this.xOffset, this.monster.sprite.y + this.yOffset, width, height);
        this.bar.fillStyle(0xFF0000);
        if (HPWidth > 0) {
            this.bar.fillRect(this.monster.sprite.x + this.xOffset, this.monster.sprite.y + this.yOffset, HPWidth, height);
        }
    };

    damageSplat(damage, specialDamage) {
        const posX = this.monster.sprite.x;
        const posY = this.monster.sprite.y;
        const hitSplat = this.scene.add.graphics({ x: posX, y: posY });
        hitSplat.fillStyle(0xff0000).fillCircle(0, 0, 10).setDepth(49);
    
        const damageText = this.scene.add.text(posX, posY, `${damage}`, {fontSize: '14px', fontFamily: 'Arial', fill: '#FFF', resolution: 2}).setOrigin(0.5,0.5);
        damageText.setDepth(50);

        const specialDamageText = this.scene.add.text(posX, posY, `${specialDamage}`, {fontSize: '14px', fontFamily: 'Arial', fill: '#FFF', resolution: 2}).setOrigin(0.5,0.5);
        specialDamageText.setDepth(50);
    
        this.specialDamageText = specialDamageText;
        this.damageText = damageText;
        this.hitSplat = hitSplat;
    
        this.scene.tweens.add({
            targets: [damageText, specialDamageText, hitSplat],
            alpha: 0,
            duration: 1000, 
            onComplete: () => {
                damageText.destroy();
                hitSplat.destroy();
                this.damageText = null;
                this.hitSplat = null;
            }
        });
    }

    showHPBar() {
        this.bar.setVisible(true);
        this.text.setVisible(true);
    }
    
    hideHPBar() {
        this.bar.setVisible(false);
        this.text.setVisible(false);
    }

    update() {
        if (this.monster.sprite.body) {
            this.draw();
        } else {
            this.bar.clear();
            this.text.setText('');
        }

        if (this.damageText && this.monster.sprite.body) {
            this.damageText.setPosition(this.monster.sprite.x, this.monster.sprite.y);
        }
        if (this.specialDamageText && this.monster.sprite.body) {
            this.specialDamageText.setPosition(this.monster.sprite.x, this.monster.sprite.y);
        }
        if (this.hitSplat && this.monster.sprite.body) {
            this.hitSplat.setPosition(this.monster.sprite.x, this.monster.sprite.y);
        }
    }
}