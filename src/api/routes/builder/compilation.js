const express = require('express');
const router = express.Router({ mergeParams: true });
const CompilationService = require('../../../services/compilation');
const { addValidation, updateValidation, getAndDeleteValidation } = require('../../validators/compilationValidator');

const compilationService = new CompilationService();

// @route POST compilation/
// @desc create compilation
// @param appId - app id
// @body name
// @body description
// @body imageId
// @body categoryId

router.post('/', addValidation, async (req, res) => {
    const appId = req.params.appId;
    const result = await compilationService.addCompilation({ appId, ...req.body });
    res.json(result);
});

// @route PUT compilation/:compilationId
// @desc update compilation
// @param appId - app id
// @param compilationId - compilation id
// @body name
// @body description
// @body imageId
// @body categoryId

router.put('/:compilationId', updateValidation, async (req, res) => {
    const compilationId = req.params.compilationId;
    const result = await compilationService.updateCompilation({ compilationId, ...req.body });
    res.json(result);
});

// @route DELETE compilation/:compilationId
// @desc delete compilation
// @param appId - app id
// @param compilationId - compilation id

router.delete('/:compilationId', getAndDeleteValidation, async (req, res) => {
    const compilationId = req.params.compilationId;
    await compilationService.deleteCompilation(compilationId);
    res.send();
});

// @route GET compilation/:compilationId
// @desc get compilation
// @param appId - app id
// @param compilationId - compilation id

router.get('/:compilationId', getAndDeleteValidation, async (req, res) => {
    const compilationId = req.params.compilationId;
    const result = await compilationService.getCompilation(compilationId);
    res.json(result);
});

// @route GET compilation/
// @desc get all compilations
// @param appId - app id

router.get('/', async (req, res) => {
    const appId = req.params.appId;
    const result = await compilationService.getCompilations(appId);
    res.json(result);
});

module.exports = router;