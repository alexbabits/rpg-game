export default class LoadingBar extends Phaser.Scene{

    constructor(){
        super("LoadingBar");
    }

    static preload(scene){

        let progressBar = scene.add.graphics();
        let progressBox = scene.add.graphics();
        progressBox.fillStyle(0xffff00, .2);
        progressBox.fillRect(170,295,300,50);

        let width = scene.game.config.width;
        let height = scene.game.config.height;

        let loadingText = scene.make.text({
            x: width / 2 + 5,
            y: height / 2 - 70,
            text: 'Loading',
            style: {
                font: '48px monospace',
                fill: '#cbdbfc'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = scene.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '24px monospace',
                fill: '#000000'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = scene.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#cbdbfc'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        scene.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffff00, 1);
            progressBar.fillRect(170, 295, 300 * value, 50);
        });

        scene.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        scene.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

    }
}


/*

In Mainscene:

import LoadingBar from "./LoadingBar.js";
    preload() {
        LoadingBar.preload(this);
        ...
    }

*/