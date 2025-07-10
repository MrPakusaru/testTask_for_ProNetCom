const SETTINGS = {
    gameField: {
        //Высота поля
        height: 24,
        //Ширина поля
        width: 40,
        //Параметры генерации 'комнат'
        roomsRanges: {
            amount: { min: 5, max: 10 },
            height: { min: 3, max: 8 },
            width: { min: 3, max: 8 }
        },
        //Параметры генерации 'коридоров'
        roadsRanges: {
            amount: { min: 3, max: 5 }
        }
    },
    //Количество объектов на поле
    amountObjects: {
        swords: 2,
        healthPotions: 10,
        enemies: 10
    },
    //Базовые значения
    basicParameters: {
        //Максимум жизней
        maxHitPoints: 100,
        //Базовый уровень урона
        baseDamage: 10,
        //Всегда ли ENEMY делает шаш
        enemyAlwaysMakeStep: true
    }
}
//Общие классы для доступа к ним из любых мест
const GLOBAL = {
    gameField: null,
    game: null
}
$(() => {
    GLOBAL.gameField = new GameField();
    GLOBAL.game = new Game();
    GLOBAL.game.init();
});
