/**
 * Класс, содержащий вспомогательные функции для работы с массивом
 */
class Tools {
    /**
     * Генерирует случайное целое число от min до max включительно
     * @param min
     * @param max
     * @return {*}
     */
    static randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    /**
     * Установка формата вывода чисел в виде '00'
     * @param num
     * @returns {string|null}
     */
    static format = num => num?.toString().padStart(2, '0') ?? null;
    /**
     * Генерирует текст класса формата C_<координата X>_<координата Y>
     * @param X
     * @param Y
     * @returns {`.C_${string}_${string}`|`.C_${string}_null`|`.C_null_${string}`|".C_null_null"}
     */
    static classGenerate = (X, Y) => `C_${Tools.format(X)}_${Tools.format(Y)}`;
    /**
     * Получает на вход двумерный массив и параметры, возвращает обработанный двумерный массив.
     * Если idColStart === idColEnd, возвращает столбец.
     * Если idRowStart === idRowEnd && idColStart === idColEnd, возвращает содержимое ячейки.
     *
     * @param matrix Двумерная матрица
     * @param idRowStart Id начала строки
     * @param idRowEnd Id конца строки
     * @param idColStart Id начала колонки
     * @param idColEnd Id конца колонки
     * @param functions Callback-функция для операции над содержимым ячейки
     * @return {*|*[][]|null}
     */
    static matrixSlice = (matrix, idRowStart, idRowEnd, idColStart, idColEnd, functions) => {
        // Проверка пустой матрицы
        if (matrix.length === 0) return null;
        //Проверка на попадание значений в диапазон матрицы
        const ifInvalid = (index, maxIndex) => index < 0 || index >= maxIndex;
        //Если хоть одно из значений вне диапазона - return null
        if (
            ifInvalid(idRowStart, matrix.length) ||
            ifInvalid(idRowEnd, matrix.length) ||
            ifInvalid(idColStart, matrix[0].length) ||
            ifInvalid(idColEnd, matrix[0].length)
        ) return null;
        // Нормализация границ (если start > end)
        [idRowStart, idRowEnd] = this.normalize([idRowStart, idRowEnd]);
        [idColStart, idColEnd] = this.normalize([idColStart, idColEnd]);
        // Обработка случая одной ячейки
        if (idRowStart === idRowEnd && idColStart === idColEnd) {
            const cell = matrix[idRowStart][idColStart];
            return [[functions ? functions(cell) : cell]];
        }
        // Выборка строк
        const fragment = matrix.slice(idRowStart, idRowEnd + 1);
        // Обработка одного столбца
        if (idColStart === idColEnd) {
            return fragment.map(row => {
                const cell = row[idColStart];
                return [functions ? functions(cell) : cell];
            });
        }
        // Обработка строк
        return fragment.map(row => {
            const sliced = row.slice(idColStart, idColEnd + 1);
            return functions ? sliced.map(cell => functions(cell)) : sliced;
        });
    };
    /**
     * Выполняет случайную функцию из списка
     * Формат списка: `[{ action: () => functionBody }, {...}, ...]`
     * @param functionsArray {[]}
     */
    static executeRandomFunction = functionsArray => {
        functionsArray[this.randomInteger(0,functionsArray.length-1)].action();
    }
    /**
     * Меняет местами начальное и конечное значения, если конечное меньше начального
     * @param start
     * @param end
     * @return {*[]}
     */
    static normalize = ([start, end]) => start < end ? [start, end] : [end, start];
}