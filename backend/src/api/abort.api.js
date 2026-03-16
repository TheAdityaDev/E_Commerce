module.exports = (timeoutMs) => {
  return (req, res, next) => {
    const controller = new AbortController();
    req.abortSignal = controller.signal;

    const start = Date.now();

    const timer = setTimeout(() => {
      if (!res.headersSent) { // Check if headers have already been sent
        controller.abort(); // API abort हो जाएगा
        console.log("API Aborted due to timeout:", Date.now() - start, "ms");
      }
    }, timeoutMs);

    res.on("finish", () => {
      clearTimeout(timer); // Timer cleanup
      if (!controller.signal.aborted) { // Only log if not already aborted by timeout
        console.log("API Time:", Date.now() - start, "ms");
      }
    });

    next(); // अगले middleware/controller को call करता है
  };
};
