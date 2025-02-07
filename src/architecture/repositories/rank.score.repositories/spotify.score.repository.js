const { IdolData } = require('../../../models')
const { IdolRankScore } = require('../../../models')

class SpotifyScoreRepository {

    getIdolDatas = async () => {
        try {
            const allIdolDatas = await IdolData.findAll({
                attributes: [ 'idolId', 'idolName' ],
                // limit: 3
            });
            return allIdolDatas;

        }catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    };

    getIdolData = async (idolId) => {
        try {
            const idolData = await IdolData.findOne({ where: { idolId } });
            return idolData;

        }catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    };

    updateSpotifyScore = async (spotifyScore, idolId) => {
        try {
            await IdolRankScore.update({ spotifyScore }, { where: { idolId } });
            return

        }catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
}

module.exports = SpotifyScoreRepository;
