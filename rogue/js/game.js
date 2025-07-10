/**
 * Класс, определяющий правила игры
 */
class Game {
    /**
     * Набор данных об PERSON, содержит {position: {X, Y}, health, damage}
     */
    #person;
    /**
     * Массив ENEMIES, где каждый содержит {position: {X, Y}, health, damage, idEnemy}
     */
    #enemies;
    /**
     * Список доступных клавиш и действий
     * @type {{key, act}[]}
     */
    #actions = [
        {key: 'KeyW', act:'up', direction: {dx: 0, dy: 1}},     // 0: вверх
        {key: 'KeyS', act:'down', direction: {dx: 0, dy: -1}},  // 1: вниз
        {key: 'KeyA', act:'left', direction: {dx: -1, dy: 0}},  // 2: влево
        {key: 'KeyD', act:'right', direction: {dx: 1, dy: 0}},  // 3: вправо
        {key: 'Space'}
    ];
    constructor() {
        this.#person = GLOBAL.gameField.firstObjects.PERSON;
        this.#enemies = GLOBAL.gameField.firstObjects.ENEMIES;
    }
    init = () => {
        this.keyPressListener(this, GLOBAL.gameField);
    }
    /**
     * Меняет координаты сущности в #fieldLink при выполнении условий для перемещения
     * @param entity Сущность, которая будет перемещаться
     * @param typeThis Тип сущности (GameTile.types)
     * @param direction {string} Направление ('up'/'down'/'left'/'right')
     * @param otherTypes Массив непроходимых типов тайлов (GameTile.types)
     */
    makeStep = (entity, typeThis, direction, otherTypes) => {
        //Типы непроходимых тайлов
        const forbidden = new Set ([GameTile.types.WALL,...otherTypes]);
        //Потенциальная координата
        const nextPos = {...entity.position};
        //Маппинг направлений на изменения координат на 1
        const directionMap = {
            up:    () => nextPos.Y++,
            down:  () => nextPos.Y--,
            left:  () => nextPos.X--,
            right: () => nextPos.X++
        };
        // Применяем изменения координат
        directionMap[direction]?.();
        //Если следующий тайл имеет непроходимый тип, то прерываем перемещение
        const nextTileType = GLOBAL.gameField.getTile(nextPos, tile => tile.getType());

        if (forbidden.has(nextTileType)) return;
        //Если игрок...
        if (typeThis === GameTile.types.PERSON) {
            //...наступит на зелье, то его 'хп' восполнится
            if (nextTileType === GameTile.types.HP) entity.health = 100;
            //...наступит на меч, то его 'damage' удвоится
            if (nextTileType === GameTile.types.SWORD) entity.damage *= 2;
        }
        //Ставим базовые свойства тайла
        GLOBAL.gameField.deleteTileObject(entity);
        //Меняем координату сущности на следующую
        entity.position = nextPos;
        //Меняем тип следующего тайла на тип сущности
        GLOBAL.gameField._matrix.rule.cell(nextPos.Y, nextPos.X, tile =>
            tile.setOthers(typeThis, entity.health, entity.idEnemy)
        );
    }
    /**
     * Проверяет в радиусе 1 клетки вокруг сущности наличие противников и атакует их
     * @param entity Сущность, которая может атаковать
     * @param typeOpponent Сущности, которые будут атакованы
     */
    makeAttack = (entity, typeOpponent) => {
        const {Y, X} = entity.position;
        const {height, width} = SETTINGS.gameField;
        //Ограничения диапазона, если сущность на краю карты
        let range = {
            sX: (X-1) < 0 ? X : (X-1),      //start X
            sY: (Y-1) < 0 ? Y : (Y-1),      //start Y
            eX: (X+1) >= width ? X : (X+1), //end X
            eY: (Y+1) >= height ? Y : (Y+1),//end Y
        }
        /**
         * Берёт область 3x3 с сущностью в центре, проводит поиск на наличие противника.
         * Возвращает массив с найденными GameTile противника
         * @type {Array<GameTile>|[]}
         */
        let opponents = Tools.matrixSlice(
            GLOBAL.gameField._matrix.get.matrix(), range.sY, range.eY, range.sX, range.eX, tile => tile
        ).map(
            row => row.filter(tile => tile.getType()===typeOpponent).flat()
        ).flat();
        /**
         * Обрабатывает воздействие атаки на другие сущности
         * @param target Атакуемая сущность
         * @return {*|null} Состояние сущности после результата атаки
         */
        const applyDamage = target => {
            if (target.health > 0) {
                target.health -= entity.damage;
                //Обновить значение health в матрице тайлов
                GLOBAL.gameField.getTile(target.position, tile => tile.setHealth(target.health));
                //Удалить сущность, если health при нуле и ниже
                if (target.health <= 0) {
                    GLOBAL.gameField.deleteTileObject(target);
                    return null; // Помечаем цель для удаления
                }
            }
            return target;
        };
        if (typeOpponent === GameTile.types.ENEMY) {
            // Обрабатываем врагов
            opponents.forEach(tile => {
                const id = tile.getIdEnemy();
                if (this.#enemies[id]!==null) this.#enemies[id] = applyDamage(this.#enemies[id]);
            });
        }
        if (typeOpponent === GameTile.types.PERSON && opponents.length > 0 && this.#person!==null) {
            // Обрабатываем персонажа
            this.#person = applyDamage(this.#person);
        }
    }
    /**
     * Обработчик нажатий на клавиши управления
     */
    keyPressListener = () => {
        $(document).keypress(event => {
            //Убираем предварительные действия браузера
            event.preventDefault();
            let action = this.#actions.find((i) => i.key === event.code);
            //Если нажатая клавиша не входит в список, то прерываем действие
            if(action === undefined) return;
            //Если PERSON существует, то игрок ходит
            if (this.#person!==null) {
                if (event.code === 'Space') this.makeAttack(this.#person, GameTile.types.ENEMY);
                else this.makeStep(this.#person, GameTile.types.PERSON, action.act, [GameTile.types.ENEMY, null]);
            }

            this.#enemies.forEach(enemy => {
                //Если этот ENEMY не существует, то пропускаем итерацию
                if(enemy===null) return;
                //Атакуем
                this.makeAttack(enemy, GameTile.types.PERSON);
                //Выбираем направление
                const direction = this.enemyChooseDirection(enemy);
                if(direction===null) return;
                this.makeStep(enemy, GameTile.types.ENEMY, direction, [GameTile.types.PERSON, GameTile.types.ENEMY, null]);
            });
            FieldRenderer.updateField(GLOBAL.gameField._matrix.get.matrix());
        });
    }
    /**
     * Определяет логику выбора направления хода для ENEMY
     *
     * Если SETTINGS.basicParameters.enemyAlwaysMakeStep - true, ENEMY всегда делает ход, иначе вероятность хода случайна
     * @param enemy Сущность ENEMY
     * @return {*}
     */
    enemyChooseDirection = (enemy) => {
        // Определяем возможные направления
        const directions = this.#actions.slice(0, 4);
        //Если обязателен шаг в каждый год
        if(SETTINGS.basicParameters.enemyAlwaysMakeStep) {
            //Запрещённые типы тайлов
            const forbidden = new Set([GameTile.types.WALL, GameTile.types.PERSON, null]);
            //Проверяет тайл с координатами на запрещённые типы
            const isTileAccessible = (X, Y) => !forbidden.has(
                GLOBAL.gameField.getTile({X, Y}, tile => tile?.getType())
            );
            //Выбирает доступные направления
            const availableDir = directions.filter(action => {
                const {dx, dy} = action?.direction;
                const {X, Y} = enemy.position;
                return isTileAccessible(X + dx, Y + dy);
            });
            //Выбирает случайное доступное направление
            return availableDir.length > 0
                ? availableDir[Tools.randomInteger(0, availableDir.length - 1)].act
                : null;
        }
        // Случайное направление без проверок
        return directions[Tools.randomInteger(0, 3)].act;
    }

}