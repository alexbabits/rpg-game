export default class HPBar {
    constructor(scene, x, y, player) {
        this.scene = scene;
        this.player = player;
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.text = new Phaser.GameObjects.Text(scene, 135, 108, '', { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2 });
        this.bar.setDepth(50);
        this.text.setDepth(51);
        this.bar.setScrollFactor(0, 0);
        this.text.setScrollFactor(0, 0);
        this.x = x;
        this.y = y;
        this.size = {
            width: 77,
            height: 10
        };

        scene.add.existing(this.bar);
        scene.add.existing(this.text);

        this.draw();
    };

    modifyHPBar() {
        this.player.HP = Math.max(0, Math.min(this.player.HP, this.player.maxHP));
        this.draw();
    }

    draw() {
        this.bar.clear();
        this.pixelPerHP = this.size.width / this.player.maxHP;
        this.text.setText(`${this.player.HP}/${this.player.maxHP}`);

        const { width, height } = this.size;
        const HPWidth = this.player.HP * this.pixelPerHP;

        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(this.x, this.y, width, height);

        if (HPWidth <= this.size.width / 4) {
            this.bar.fillStyle(0xFF0000);
        } else {
            this.bar.fillStyle(0x73e600);
        }

        if (HPWidth > 0) {
            this.bar.fillRect(this.x, this.y, HPWidth, height);
        }
    };
}