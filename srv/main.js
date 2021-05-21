const moment = require('moment');

module.exports = (srv) => {

    const { Employees } = cds.entities('desafio.final')

    srv.on(['CREATE','UPDATE'], 'Employees', async (req, next) => {
        const {
            groupRisk,
            livesRiskGroup,
            publicTransport,
            hourPublicTransport,
            environmentEquipment,
            birthDate
        } = req.data;

        var score = 0;

        var age = Math.floor(moment(new Date()).diff(moment(birthDate), 'years', true));
        if (age >= 50 && age <= 59) {
            score += 50;
        } else if (age >= 40 && age <= 49) {
            score += 40;
        } else if (age >= 30 && age <= 39) {
            score += 30;
        } else if (age >= 20 && age <= 29) {
            score += 20;
        } else if (age >= 17 && age <= 18) {
            score += 10;
        }
        
        score = groupRisk ? score + 100 : score;
        score = livesRiskGroup ? score + 20 : score;
        score = publicTransport ? score + 10 : score;
        score = hourPublicTransport ? score + 10 : score;
        score = environmentEquipment ? score + 10 : score;

        req.data.score = score;
        return next();
    })

}