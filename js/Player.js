import UserInput from './UserInput.js';
import {PlayerIdleState, PlayerWalkState, PlayerRunState, PlayerAttackState, PlayerSpecialAttackState, PlayerGotHitState, PlayerDeathState} from './PlayerState.js';
import {HPBar, StaminaBar, ManaBar, XPBar} from './PlayerBars.js'

export default class Player {

  static preload(scene) {
    scene.load.atlas('hero', 'assets/images/hero.png', 'assets/images/hero_atlas.json');
    scene.load.animation('hero_anims', 'assets/images/hero_anims.json');
  }

  constructor(scene, x, y, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.gameState.setPlayerXP(0);
    this.gameState.setPlayerMaxXP(50);
    this.gameState.setPlayerLevel(1);
    this.gameState.setPlayerTotalXP(0);
    this.gameState.setPlayerWalkSpeed(2);
    this.gameState.setPlayerRunSpeed(4);
    this.gameState.setPlayerMaxHP(200);
    this.gameState.setPlayerHP(200);
    this.gameState.setPlayerMaxMana(20);
    this.gameState.setPlayerMana(20);
    this.gameState.setPlayerMaxStamina(100);
    this.gameState.setPlayerStamina(100);
    this.gameState.setPlayerAttStaminaCost(10);
    this.gameState.setPlayerSpAttStaminaCost(25);
    this.gameState.setPlayerSpAttManaCost(5);
    this.gameState.setPlayerCanRun(true);
    this.gameState.setPlayerDamage(100);
    this.gameState.setPlayerSpecialDamage(this.gameState.getPlayerDamage() * 2.5);
    this.gameState.setPlayerDirection('Right');
    
    const {Body,Bodies} = Phaser.Physics.Matter.Matter;
    this.playerCollider = Bodies.rectangle(x, y, 22, 32, {chamfer: {radius: 10}, isSensor:false, label:'playerCollider'});
    this.playerSensor1 = Bodies.rectangle(x + 15, y, 20, 8, {isSensor: true, label:'playerAttackSensorRight'})
    this.playerSensor2 = Bodies.rectangle(x - 15, y, 20, 8, {isSensor: true, label:'playerAttackSensorLeft'})
    const compoundBody = Body.create({parts:[this.playerCollider, this.playerSensor1, this.playerSensor2], frictionAir: .4});

    this.sprite = this.scene.matter.add.sprite(x, y, 'hero');
    this.sprite.setDepth(5);
    this.sprite.setExistingBody(compoundBody);
    this.sprite.setFixedRotation();
    this.sprite.anims.play('hero_idle');

    this.levelText = scene.add.text(400, 93, `Player Level: ${gameState.getPlayerLevel()}`, { fontFamily: 'Arial', fontSize: '12px', fill: '#000',  resolution: 4 });
    this.levelText.setScrollFactor(0, 0);

    this.userInput = new UserInput(this.scene);
    this.idleState = new PlayerIdleState(this);
    this.walkingState = new PlayerWalkState(this);
    this.runningState = new PlayerRunState(this);
    this.attackingState = new PlayerAttackState(this);
    this.specialAttackingState = new PlayerSpecialAttackState(this);
    this.gotHitState = new PlayerGotHitState(this);
    this.deathState = new PlayerDeathState(this);
    this.currentState = this.idleState;

    this.monstersTouching = [];
    this.scene.events.on('monsterDeath', this.gainXP, this);
    this.scene.matter.world.on('collisionactive', this.handleCollision, this);
    this.manaRegeneration();
  }

  createBars() {
    this.hpBar = new HPBar(this.scene, this);
    this.staminaBar = new StaminaBar(this.scene, this);
    this.manaBar = new ManaBar(this.scene, this);
    this.xpBar = new XPBar(this.scene, this);
  }
  updateBars() {
    this.hpBar.player = this;
    this.staminaBar.player = this;
    this.manaBar.player = this;
    this.xpBar.player = this;
  }

  gainXP(monster) {
    const currentXP = this.gameState.getPlayerXP();
    const maxXP = this.gameState.getPlayerMaxXP();
    const totalXP = this.gameState.getPlayerTotalXP();

    if (currentXP + monster.XP > maxXP) {
        this.gameState.setPlayerTotalXP(totalXP + maxXP - currentXP);
    } else {
        this.gameState.setPlayerTotalXP(totalXP + monster.XP);
    }
    this.gameState.setPlayerXP(currentXP + monster.XP);

    console.log(`Player gained ${monster.XP} XP. XP to next level: ${this.xpToNextLevel()}. Total XP: ${this.gameState.getPlayerTotalXP()}.`);

    if (this.gameState.getPlayerXP() >= this.gameState.getPlayerMaxXP()) {
        this.levelUp();
    }
  }
  
  levelUp() {
    const currentLevel = this.gameState.getPlayerLevel();
    this.gameState.setPlayerLevel(currentLevel + 1);
    this.gameState.setPlayerXP(0);
    this.gameState.setPlayerMaxXP(Math.ceil(this.gameState.getPlayerMaxXP() * 1.5));
    console.log(`Player leveled up! Current level: ${this.gameState.getPlayerLevel()}. XP to next level: ${this.xpToNextLevel()}`);
}

  xpToNextLevel() {
    const remainingXP = this.gameState.getPlayerMaxXP() - this.gameState.getPlayerXP();
    return remainingXP < 0 ? 0 : remainingXP;
  }

  manaRegeneration() {
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.gameState.getPlayerMana() < this.gameState.getPlayerMaxMana() && this.currentState.name !== PlayerSpecialAttackState.stateName) {
          this.gameState.setPlayerMana(this.gameState.getPlayerMana() + 1);
          this.manaBar.draw();
        }
      },
      loop: true
    });
  }

  handleCollision(event) {
    this.monstersTouching = [];
    for (let pair of event.pairs) {
      if ((pair.bodyA.label.includes(`playerAttackSensor${this.gameState.getPlayerDirection()}`) && pair.bodyB.label === 'monsterCollider')
          || (pair.bodyB.label.includes(`playerAttackSensor${this.gameState.getPlayerDirection()}`) && pair.bodyA.label === 'monsterCollider')) {
          let monsterBody = pair.bodyA.label === 'monsterCollider' ? pair.bodyA : pair.bodyB;
          this.monstersTouching.push(monsterBody.gameObject);
      }
    }
  }

  getMovement() {
    let x = 0;
    let y = 0;
  
    if (this.userInput.cursors.left.isDown || this.userInput.cursors.arrowLeft.isDown) {
      x = -1;
    } else if (this.userInput.cursors.right.isDown || this.userInput.cursors.arrowRight.isDown) {
      x = 1;
    }
    if (this.userInput.cursors.up.isDown || this.userInput.cursors.arrowUp.isDown) {
      y = -1;
    } else if (this.userInput.cursors.down.isDown || this.userInput.cursors.arrowDown.isDown) {
      y = 1;
    }
    return {x, y};
}
  
  setMovement(isRunning = false) {
    const speed = isRunning ? this.gameState.getPlayerRunSpeed() : this.gameState.getPlayerWalkSpeed();
    let {x, y} = this.getMovement();

    if(x !== 0 || y !== 0) {
      let direction = new Phaser.Math.Vector2(x, y);
      direction.normalize();
      x = direction.x;
      y = direction.y;
    }

    this.sprite.setVelocity(x * speed, y * speed);

    if (x < 0) {
      this.sprite.setFlipX(true);
      this.gameState.setPlayerDirection('Left');
    } else if (x > 0) {
      this.sprite.setFlipX(false);
      this.gameState.setPlayerDirection('Right');
    }
  }

  transitionToNewState(newState) {
    this.currentState.exit();
    this.currentState = newState;
    this.currentState.enter();
  }

  update() {
    this.currentState.update();
    this.hpBar.draw(this.gameState.getPlayerHP(), this.gameState.getPlayerMaxHP());
    this.xpBar.draw(this.gameState.getPlayerXP(), this.gameState.getPlayerMaxXP());
    this.manaBar.draw(this.gameState.getPlayerMana(), this.gameState.getPlayerMaxMana());
    this.staminaBar.draw(this.gameState.getPlayerStamina(), this.gameState.getPlayerMaxStamina());
    this.levelText.setText(`Player Level: ${this.gameState.getPlayerLevel()}`);
  }

}