// set true to get DEBUG messages
const DEBUG = true;

export function info(msg, rest) {
    console.log(utcTimeForLogging() + ' INFOR ' + msg, !!rest ? rest : '');
}

export function debug(msg, rest) {
    if (!DEBUG) return;
    console.log(utcTimeForLogging() + ' DEBUG ' + msg, !!rest ? rest : '');
}

export function warning(msg, rest) {
    console.log(utcTimeForLogging() + ' WARNG ' + msg, !!rest ? rest : '');
}

export function error(msg, rest) {
    console.log(utcTimeForLogging() + ' ERROR ' + msg, !!rest ? rest : '');
}

export function utcTimeForLogging() {
    return new Date().toISOString();
}
