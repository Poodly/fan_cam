const KpopNewsEditService = require('../../services/kpop.news.services/kpop.news.edit.service')

class KpopNewsEditController {
    kpopNewsEditService = new KpopNewsEditService();

    editNewsInfo = async (req, res, next) => {
        try {
            const { newsId, newsLink, newsImg, newsDate } = req.body;
            await this.kpopNewsEditService.editNewsInfo(newsId, newsLink, newsImg, newsDate)
            res.status(200).json({ message: '뉴스 수정 성공' });

        }catch (error){
            console.error(error);
            next(error); 
        };
    };

    deleteNews = async (req, res, next) => {
        try {
            const { newsId } = req.body;
            await this.kpopNewsEditService.deleteNews(newsId)
            res.status(200).json({ message: '뉴스 삭제 성공' });

        }catch (error){
            console.error(error);
            next(error); 
        };
    };
};

module.exports = KpopNewsEditController;