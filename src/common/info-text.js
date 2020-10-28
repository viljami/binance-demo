import terminalKit from 'terminal-kit';

const { terminal: term } = terminalKit;

export default text => term.white(text);
