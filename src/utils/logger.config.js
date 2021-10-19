const logger = require("npmlog");
Object.defineProperty(logger, "heading", {
    get: () => {
        return newDateFormated(new Date());
    },
});
logger.headingStyle = { bg: "white", fg: "black" };

function newDateFormated(date) {
    date = date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    return date;
}