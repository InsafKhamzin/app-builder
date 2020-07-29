const Compilation = require('../models/Compilation');
const ClientError = require('../common/clientError');

module.exports = class CompilationService {
    async addCompilation({ appId, name, description, imageId, categoryId }) {
        const newCompilation = new Compilation({
            app: appId,
            name: name,
            description: description,
            image: imageId,
            category: categoryId
        });
        await newCompilation.save();
        return newCompilation;
    }

    async updateCompilation({ compilationId, name, description, imageId, categoryId }) {
        const compilation = await Compilation.findById(compilationId);
        if (!compilation) {
            throw new ClientError('Compilation not found', 404);
        }
        compilation.name = name;
        compilation.description = description;
        compilation.image = imageId;
        compilation.category = categoryId;

        await compilation.save();
        return compilation;
    }

    async deleteCompilation(compilationId) {
        await Compilation.findByIdAndDelete(compilationId);
    }

    async getCompilation(compilationId) {
        const compilation = await Compilation.findById(compilationId);
        if (!compilation) {
            throw new ClientError('Compilation not found', 404);
        }
        return compilation;
    }

    async getCompilations(appId) {
        const compilations = await Compilation.find({ app: appId }).populate('image');
        return compilations;
    }
}