const { KpopNews } = require('../../../models')

class KpopNewsEditRepository {

    editNewsInfo = async (newsId, newsLink, newsImg, newsDate) => {
        try {
            await KpopNews.update({ 
                newsLink, 
                newsImg, 
                newsDate,
            }, { where: { newsId } }); // 뉴스 정보 업데이트
            return

        }catch(error) {
            console.error(error);
            next();
        };
    };

    deleteNews = async (newsId) => {
        try {
            await KpopNews.destroy({ where: { newsId } });
            return 

        }catch(error) {
            console.error(error);
            next();
        };
    };
};

module.exports = KpopNewsEditRepository;