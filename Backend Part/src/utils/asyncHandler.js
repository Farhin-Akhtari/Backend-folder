const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
        catch((err) => next(err))
    }
}

export { asyncHandler }







/*
//METHOD 1: USING TRY-CATCH (ASYNC, AWAIT)
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: falselse,
            message: error.message
        })
    }
}
    */