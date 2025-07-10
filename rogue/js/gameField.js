/**
 * Класс, управляющий игровым полем через матрицу ячеек
 */
class GameField {
    _matrix; //Матрица ячеек
    firstObjects = {
        PERSON: null,
        ENEMIES: []
    }
    /**
     * Первичная инициализация значений и объектов
     */
    constructor() {
        this._matrix = new Matrix_2D(
            SETTINGS.gameField.height,
            SETTINGS.gameField.width,
            (indexX, indexY) => new GameTile(GameTile.types.WALL, indexX, indexY)
        );
        FieldRenderer.generateTiles();
        this.tilesAdd.roads();
        this.tilesAdd.rooms();
        this.tilesAdd.others(SETTINGS.amountObjects.swords, GameTile.types.SWORD);
        this.tilesAdd.others(SETTINGS.amountObjects.healthPotions, GameTile.types.HP);
        this.tilesAdd.others(1, GameTile.types.PERSON);
        this.tilesAdd.others(SETTINGS.amountObjects.enemies, GameTile.types.ENEMY);
        FieldRenderer.updateField(this._matrix.get.matrix());
    }
    /**
     * Набор функций, обновляющих состояние матрицы
     */
    tilesAdd = {
        /**
         * Заполняет _matrix данными о дорожках
         */
        roads: () => {
            let roads = GeneratorObjects.Roads;
            roads.generateFirst(SETTINGS);
            //Пробег по участкам матрицы и их изменение
            this._matrix.rule.rows(roads.horizontal, tile => tile.setType(GameTile.types.ROAD));
            this._matrix.rule.columns(roads.vertical, tile => tile.setType(GameTile.types.ROAD));
        },
        /**
         * Добавляет 'комнаты' в _matrix
         */
        rooms: () => {
            const {min, max} = SETTINGS.gameField.roomsRanges.amount;
            const roomCount = Tools.randomInteger(min, max);
            //Для каждой 'комнаты'
            Array.from({length:roomCount},() => {
                //Получаем новую комнату с генерацией координат до тех пор, пока не появится примыкающая
                let tempRoom = null;
                do {
                    let room = GeneratorObjects.Rooms;
                    room.generateFirst();
                    room.generatePos();
                    //Если комната соседствует, передаём её в tempRoom
                    if(!room.ifAloneCheck(this._matrix.get.matrix())) tempRoom = room;
                } while (tempRoom===null)
                const {startX, startY, height, width} = tempRoom;
                //Обновление
                this._matrix.rule.area(startY, startY + height-1,startX,startX + width-1, tile => tile.setType(GameTile.types.ROAD));
            })
        },
        /**
         * Добавляет в пустое пространство доп. объекты
         * @param amount Количество объектов
         * @param type Тип объекта
         */
        others: (amount, type) => {
            //Сборка всех свободных для прохода тайлов в одномерный массив
            const empties =  this._matrix.get.matrix().map(row => row.filter(
                tile => {if(tile.getType() === GameTile.types.ROAD) return tile;})
            ).flat();
            const personType = GameTile.types.PERSON;
            const enemyType = GameTile.types.ENEMY;
            //Деконструкция базовых параметров для PERSON и ENEMY
            const {maxHitPoints, baseDamage} = SETTINGS.basicParameters;
            //Для каждого объекта
            Array.from({length:amount}, () =>
                //Выбирается случайный тайл
                empties[Tools.randomInteger(0, empties.length - 1)]
            ).forEach((tile, id) => {
                //Деконструкция координат тайла
                const { Y, X } = tile.getPosition();
                //Принимает разнородный набор данных, возвращает в виде объекта
                let genFrameProperties = (position, health, damage, other = {}) => (
                    { position: position, health: health, damage: damage, ...other }
                )
                //Заполнение первичных данных объекта PERSON
                if(type === personType) {
                    this.firstObjects.PERSON = genFrameProperties(tile.getPosition(), maxHitPoints, baseDamage);
                    this._matrix.rule.cell(Y,X, tile => tile.setHealth(this.firstObjects.PERSON.health));
                }
                //Заполнение первичных данных объекта ENEMY
                if(type === enemyType) {
                    this._matrix.rule.cell(Y,X, tile => tile.setIdEnemy(id));
                    this.firstObjects.ENEMIES.push(
                        genFrameProperties(tile.getPosition(), maxHitPoints, baseDamage, { idEnemy: id })
                    );
                    this._matrix.rule.cell(Y,X, tile => tile.setHealth(this.firstObjects.ENEMIES[id].health));
                }
                this._matrix.rule.cell(Y,X, tile => tile.setType(type));
            });
        }
    }
    deleteTileObject = (object) => {
        //Меняем свойства тайла с сущностью на простой тайл дороги
        this._matrix.rule.cell(object.position.Y, object.position.X, tile =>
            tile.setOthers(GameTile.types.ROAD, null, null)
        );
    }
    /**
     * Возвращает GameTile указанной координаты
     * @param position Объект вида {X: ..., Y: ...} с координатами
     * @param func Действия над GameTile внутри
     * @return {*|null}
     */
    getTile = (position, func) => Tools.matrixSlice(
        this._matrix.get.matrix(),
        position.Y,
        position.Y,
        position.X,
        position.X,
        func
    )?.flat()[0] ?? null;
}