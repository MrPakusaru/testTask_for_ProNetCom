/**
 * Вспомогательный для GameField класс, управляющий генерацией координат для помещений
 */
class GeneratorObjects {
    /**
     * Комната-объект и связанные с ней функции
     */
    static Rooms = {
        height: null,
        width: null,
        startX: null,
        startY: null,
        endX: null,
        endY: null,
        /**
         * Генерирует случайные длину и ширину для 'комнаты'
         */
        generateFirst: function () {
            let {height, width} = SETTINGS.gameField.roomsRanges;
            this.height = Tools.randomInteger(height.min, height.max);
            this.width = Tools.randomInteger(width.min, height.max);
        },
        /**
         * Генерирует случайные параметры для 'комнаты'
         */
        generatePos: function () {
            //Случайные координаты X и Y нижнего левого угла
            this.startX = Tools.randomInteger(0, SETTINGS.gameField.width - this.width);
            this.startY = Tools.randomInteger(0, SETTINGS.gameField.height - this.height);
            //Координаты X и Y верхнего правого угла
            this.endX = this.startX + this.width - 1;
            this.endY = this.startY + this.height - 1;
        },
        /**
         * Проверяет, имеет ли 'комната' по соседству дорожки
         * @param matrix Матрица тайлов
         * @return {boolean}
         */
        ifAloneCheck: function (matrix) {
            //Массив с координатами для проверки линий возле комнаты
            let directions = [
                [this.endY + 1, this.endY + 1, this.startX, this.endX],    // Сверху
                [this.startY - 1, this.startY - 1, this.startX, this.endX], // Снизу
                [this.startY, this.endY, this.startX - 1, this.startX - 1], // Слева
                [this.startY, this.endY, this.endX + 1, this.endX + 1]      // Справа
            ];
            //Проводим проверку по каждой линии
            return !directions.some(([rowStart, rowEnd, colStart, colEnd]) => {
                //Получаем массив ячеек в каждой строке
                const slice = Tools.matrixSlice(matrix, rowStart, rowEnd, colStart, colEnd, tile => tile?.getType());
                //Возвращаем наличие в строке значения дорожки
                return slice?.flat().includes(GameTile.types.ROAD);
            });
        }
    };
    static Roads = {
        /**
         * Набор координат горизонтальных дорожек
         * @var Set
         */
        horizontal: null,
        /**
         * Набор координат вертикальных дорожек
         * @var Set
         */
        vertical: null,
        /**
         * Генерирует случайное количество горизонтальных и вертикальных дорожек
         */
        generateFirst: function (SETTINGS) {
            const {height, width, roadsRanges} = SETTINGS.gameField;
            const {min, max} = roadsRanges.amount;
            //Случайное количество дорожек по горизонтали и вертикали
            this.horizontal = new Set(this.generateCoords(1, height - 1, Tools.randomInteger(min, max)));
            this.vertical = new Set(this.generateCoords(1, width - 1, Tools.randomInteger(min, max)));
        },
        /**
         * Генерирует массив разных несоседних чисел
         * @param {*} minNum
         * @param {*} maxNum
         * @param {number} amountNums
         * @return {*[]}
         */
        generateCoords: function (minNum, maxNum, amountNums) {
            //Массив чисел
            let nums = [];
            //Набор с недопустимыми числами
            const forbiddenNums = new Set();
            while (nums.length < amountNums) {
                const temp = Tools.randomInteger(minNum, maxNum);
                if (nums.length === 0 || !forbiddenNums.has(temp)) {
                    nums.push(temp);
                    //Добавляет в набор с недопустимыми числами текущее число и два соседних
                    forbiddenNums.add(temp - 1).add(temp).add(temp + 1);
                }
            }
            return nums;
        }
    };
}