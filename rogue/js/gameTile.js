/**
 * Класс, управляющий данными тайла
 */
class GameTile {
    #positionX; //Координата X
    #positionY; //Координата Y
    #class;     //Координатный класс
    #type;      //Тип тайла
    #health;    //Кол-во здоровья (для сущностей ENEMY и PERSON)
    #idEnemy;   //Порядковый номер (для сущностей ENEMY)
    /**
     * Возвращает новый объект тайла с заполненными данными
     * @param type
     * @param posX
     * @param posY
     */
    constructor(type, posX, posY) {
        this.#type = type;
        this.#positionX = posX;
        this.#positionY = posY;
        this.#class = Tools.classGenerate(posX, posY);
        this.#health = null;
        this.#idEnemy = null;
    }
    /**
     * Набор типов тайла
     * @type {{WALL: number, PERSON: number, ROAD: number, SWORD: number, ENEMY: number, HP: number}}
     */
    static types = {
        WALL: 0,
        ROAD: 1,
        PERSON: 2,
        ENEMY: 3,
        SWORD: 4,
        HP: 5,
    }
    /**
     * Получает GameTile.types, возвращает в строковом формате
     * @param type Тип тайла (число)
     * @param ifInvert True, если необходим набор без значения
     * @returns {string|string[]} Тип тайла (строка)
     */
    static classByType = (type, ifInvert = false) => {
        let typesClass = ['tileW', 'tile', 'tileP', 'tileE', 'tileSW', 'tileHP'];
        return !ifInvert ? typesClass[type] : typesClass.filter(element => element !== type);
    }
    /**
     * Возвращает тип тайла в виде числа
     * @returns {number}
     */
    getType = () => this.#type;
    /**
     * Возвращает тип тайла в виде строки
     * @returns {string|string[]}
     */
    getTypeClass = () => self.classByType(this.#type);
    /**
     * Возвращает координаты тайла в виде {X, Y}
     * @returns {{X, Y}}
     */
    getPosition = () => ({
        X: this.#positionX,
        Y: this.#positionY,
    });
    /**
     * Возвращает координатный класс
     */
    getClass = () => '.'+this.#class;
    /**
     * Устанавливает тип тайла в виде числа
     * @param type {number|null}
     */
    setType = type => {
        this.#type = type;
    }
    /**
     * Устанавливает 'размер здоровья' сущности для тайла
     * @param value {number|null}
     */
    setHealth = value => {
        this.#health = value;
    }
    /**
     * Возвращает 'размер здоровья' сущности в виде числа
     * @returns {number|null}
     */
    getHealth = () => this.#health;
    /**
     * Устанавливает порядковый номер сущности ENEMY для тайла
     * @param id {number|null}
     */
    setIdEnemy = id => {
        this.#idEnemy = id;
    }
    /**
     * Возвращает порядковый номер сущности ENEMY для тайла
     * @returns {number|null}
     */
    getIdEnemy = () => this.#idEnemy;
    /**
     * Устанавливает несколько значений в тайл
     * @param type Тип тайла в виде числа
     * @param health 'Размер здоровья' сущности
     * @param idEnemy Порядковый номер сущности ENEMY
     */
    setOthers = (type = null, health = null, idEnemy = null) => {
        if(type !== null) this.#type = type;
        if(health !== null) this.#health = health;
        if(idEnemy !== null) this.#idEnemy = idEnemy;
    }

}