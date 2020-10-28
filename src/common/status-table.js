import terminalKit from 'terminal-kit';

const { terminal: term } = terminalKit;

const TABLE_TITLES = [['Non Zero User Balance', 'Balance', '24h Top By Volume', 'Volume']];

export default data => {
    term
        .table(TABLE_TITLES.concat(data), {
            borderChars: 'lightRounded',
            borderAttr: { color: 'blue' },
            hasBorder: false,
            fit: true,
            width: term.width,
            firstRowTextAttr: { bgColor: 'blue' },
        });
};
