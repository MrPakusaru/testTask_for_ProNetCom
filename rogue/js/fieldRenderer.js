/**
 * Класс, управляющий отображением игрового поля
 */
class FieldRenderer {
    /**
     * Создаёт набор 'тайлов' с определёнными для них классами и помещает его в '.field'
     */
    static generateTiles = () => $('.field').append(
        Array.from({length: SETTINGS.gameField.height}, (_, Y) =>
            $('<div>').addClass('row').append(
                Array.from({length: SETTINGS.gameField.width}, (_, X) =>
                    $('<div>').addClass(Tools.classGenerate(X, Y))
                )
            )
        )
    )
    /**
     * Обновляет классы 'тайлов'
     */
    static updateField = (matrix) => {
        matrix.forEach(row => row.forEach(tile => {
            const $tile = $(tile.getClass());
            //Тип тайла
            const type = tile.getType();
            //Функция для частичного обновления тайлов
            const updateTiles = tileType => {
                switch (tileType) {
                    case GameTile.types.ENEMY:
                        $tile.attr('id', tile.getIdEnemy()).css('--health', tile.getHealth());
                        break;
                    case GameTile.types.PERSON:
                        $tile.css('--health', tile.getHealth());
                        break;
                    default:
                        $tile.removeAttr('style id');
                }
            }
            //Если 'тайл', не сменил тип, то обновить его частично
            if ($tile.hasClass(GameTile.classByType(type))) {
                updateTiles(type);
            } else {
                //Если 'тайл', расходится с матрицей, то обновить его полностью
                let temp = null;
                //Если класс тайла не совпадает тайлом из матрицы, то удалить класс
                for (;temp !== type; temp = type) {
                    $tile.removeClass(GameTile.classByType(type, true));
                }
                //Добавить новый класс
                $tile.addClass(GameTile.classByType(temp));
                //Обновляем атрибуты в зависимости от типа сущностей
                updateTiles(temp);
            }
        }));
    }
}