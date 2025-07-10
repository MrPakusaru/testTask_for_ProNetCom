/**
 * Класс, управляющий 2D матрицей
 */
class Matrix_2D {
    /**
     * Кол-во строк матрицы
     */
    #rows;
    /**
     * Кол-во ячеек в строке матрицы
     */
    #columns;
    /**
     * 2D матрица
     */
    #matrix;
    /**
     * Заполнение полей матрицы и создание самой матрицы
     * @param rows
     * @param columns
     * @param _function
     * @return {Matrix_2D}
     */
    constructor(rows, columns, _function) {
        this.#rows = rows;
        this.#columns = columns;
        this.#create(_function);
        return this;
    }
    /**
     * Создаёт 2D матрицу, ячейки которой могут быть обработаны callback функцией
     * @param _function
     */
    #create(_function) {
        this.#matrix = Array.from({length: this.#rows}).map((_, indexY) =>
        Array.from({length: this.#columns}).fill(null).map((_, indexX) =>
        _function(indexX, indexY)));
    }
    /**
     * Функции для управления содержанием матрицы при помощи callback функции
     */
    rule = {
        /**
         * Управляет содержанием прямоугольной области
         * @param rowStart Номер начальной строки
         * @param rowEnd Номер конечной строки
         * @param colStart Номер начальной колонки
         * @param colEnd Номер конечной колонки
         * @param _function Callback функция
         * @return {Matrix_2D}
         */
        area: (rowStart, rowEnd, colStart, colEnd, _function) => {
            // Нормализация границ (если start > end)
            [rowStart, rowEnd] = Tools.normalize([rowStart, rowEnd]);
            [colStart, colEnd] = Tools.normalize([colStart, colEnd]);
            Array.from(
                {length: rowEnd-rowStart+1},
                (_, numRow) => numRow+rowStart
            ).forEach(numRow =>
                Array.from(
                    {length: colEnd-colStart+1},
                    (_, numCol) => numCol+colStart
                ).forEach(numCol => this.rule.cell(numRow, numCol, _function))
            );
            return this;
        },
        /**
         * Управляет содержанием строк
         * @param rows[] Массив с номерами строк
         * @param _function Callback функция
         * @return {Matrix_2D}
         */
        rows: (rows, _function) => {
            rows.forEach(numRow => Array.from({length: this.#columns})
                .forEach((_, numCol) => this.rule.cell(numRow, numCol, _function))
            );
            return this;
        },
        /**
         * Управляет содержанием столбцов
         * @param columns[] Массив с номерами колонок
         * @param _function Callback функция
         * @return {Matrix_2D}
         */
        columns: (columns, _function) => {
            Array.from({length: this.#rows}).forEach((_, numRow) =>
                columns.forEach(numCol => this.rule.cell(numRow, numCol, _function))
            );
            return this;
        },
        /**
         * Управляет содержанием ячейки
         * @param row Номер строки
         * @param column Номер колонки
         * @param _function Callback функция
         * @return {Matrix_2D}
         */
        cell: (row, column, _function) => {
            _function(this.#matrix[row][column]);
            return this;
        }
    }
    get = {
        /**
         * Возвращает двумерную матрицу без обработки
         * @return {*[][]}
         */
        matrix: () => this.#matrix,
        /**
         * Возвращает двумерную матрицу с обработкой
         * @param _function
         * @return {*[][]}
         */
        matrixAs: _function => this.#matrix.map(row => row.map(col => _function(col))),
        /**
         * Возвращает содержимое ячейки
         * @param row
         * @param column
         * @return {*}
         */
        cell: (row, column) => this?.#matrix[row][column] ?? null
    }
    /**
     * Заменяет содержимое ячейки
     * @param row
     * @param column
     * @param _function
     * @return {Matrix_2D}
     */
    setCell = (row, column, _function) => {
        this.#matrix[row][column] = _function();
        return this;
    }
}