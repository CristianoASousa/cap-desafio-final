const moment = require('moment');

module.exports = (srv) => {

    const { Employees } = cds.entities('desafio.final')

    srv.on(['CREATE', 'UPDATE'], 'Employees', async (req, next) => {
        // gerando o score do funcionário
        req.data.score = generateScore(req.data)
        // verificando se atualmente ele está com COVID, em caso positivo ele vai para home office
        req.data.inHomeOffice = updateStatusCOVID(req.data);
        return next();
    })

    function generateScore(emp) {
        const {
            groupRisk,
            livesRiskGroup,
            publicTransport,
            hourPublicTransport,
            environmentEquipment,
            vaccinated,
            birthDate
        } = emp;

        var score = 0;

        //pegando a idade com base na data de nascimento
        var age = Math.floor(moment(new Date()).diff(moment(birthDate), 'years', true));

        // gernado pontuação com base na idade
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
        // verificando se a pessoa foi vacinada, caso positivo desconta 50 pontos
        score = vaccinated ? score - 50 : score;
        
        score = livesRiskGroup ? score + 20 : score;
        score = publicTransport ? score + 10 : score;
        score = hourPublicTransport ? score + 10 : score;
        score = environmentEquipment ? score + 10 : score;
        // ferifica se é do grupo de risco, caso positivo ganha pontuação máxima
        score = groupRisk ? 100 : score;

        // verifica se o funcionário está com covid, caso positivo ganha pontuação máxima,
        // elevando sua pontuação para que ele possa entrar na lista de home office  
        score = updateStatusCOVID(emp) ? 100 : score;
        // retira pontuações negativas
        if (score < 0) {
            score = 0;
        }

        return score;
    }

    srv.on('updateManyEmployees', async (req) => {
        const { employees } = req.data;
        const tx = cds.tx(req);
        const aPromise = [];

        employees.forEach(emp => {
            aPromise.push(updateOneEmployee(tx, emp));
        });

        try {
            await Promise.all(aPromise);
            await tx.commit();
        }
        catch (e) {
            await tx.rollback();
            return req.error({
                message: "Não foi possível inserir os funcionários",
                status: 500
            });
        }

    })

    async function updateOneEmployee(tx, emp) {
        emp.score = generateScore(emp);
        emp.gotCOVID = updateStatusCOVID(emp);
        return tx.run(
            UPDATE(Employees)
                .set(emp)
                .where({ ID: emp.ID })
        )
    }

    // verifica se o funcionário está com caso ativo de COVID
    function updateStatusCOVID(emp){
        if(emp.activeCase){
            return true
        }
        return false
    }

}