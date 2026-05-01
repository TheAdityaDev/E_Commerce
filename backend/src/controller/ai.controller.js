const axios = require("axios");

exports.fusion = async (req, res) => {
  try {
    const { imageBase64, referenceImageBase64 } = req.body;

    if (!imageBase64 || !referenceImageBase64) {
      return res.status(400).json({
        success: false,
        message: "Both images required",
      });
    }

    const userImage = `data:image/png;base64,${imageBase64}`;
    const clothImage = `data:image/png;base64,${referenceImageBase64}`;

    const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
    if (!REPLICATE_TOKEN) {
      return res.status(500).json({ success: false, message: "Missing REPLICATE_API_TOKEN in env" });
    }

    // Accept either REPLICATE_VERSION (explicit version id) or REPLICATE_MODEL_SLUG (owner/model)
    let version = process.env.REPLICATE_VERSION || process.env.REPLICATE_MODEL_VERSION;
    const modelSlug = process.env.REPLICATE_MODEL_SLUG; // e.g. owner/model-name

    // Input mode: 'vton' expects person_image/garment_image, 'img2img' expects image/reference_image
    const inputMode = (process.env.REPLICATE_INPUT_MODE || "vton").toLowerCase();

    const buildPayload = (ver) => {
      const p = {};
      if (ver) p.version = ver;
      else if (modelSlug) p.model = modelSlug;

      // If frontend provided a prompt, build a prompt-style input (e.g., qwen/qwen-image-2512)
      if (req.body.prompt || (modelSlug && modelSlug.startsWith("qwen/"))) {
        const body = req.body || {};

        p.input = {
          prompt: body.prompt || "",
          go_fast: body.go_fast ?? true,
          guidance: body.guidance ?? 4,
          strength: body.strength ?? 0.8,
          aspect_ratio: body.aspect_ratio ?? "16:9",
          output_format: body.output_format ?? "webp",
          output_quality: body.output_quality ?? 95,
          negative_prompt: body.negative_prompt ?? "",
          num_inference_steps: body.num_inference_steps ?? 40,
        };
      } else {
        // Default: image-to-image / virtual-try-on inputs
        p.input =
          inputMode === "img2img"
            ? { image: userImage, reference_image: clothImage }
            : { person_image: userImage, garment_image: clothImage };
      }

      return p;
    };

    const sendPrediction = async (payload, allowAutoFetch = true) => {
      try {
        const response = await axios.post(
          "https://api.replicate.com/v1/predictions",
          payload,
          {
            headers: {
              Authorization: `Token ${REPLICATE_TOKEN}`,
              "Content-Type": "application/json",
            },
            maxBodyLength: Infinity,
          }
        );

        return response.data;
      } catch (err) {
        const resp = err.response;

        // If the version is invalid (422) and we have a model slug, try to fetch latest version and retry once
        if (resp && resp.status === 422 && modelSlug && allowAutoFetch) {
          try {
            const versionsRes = await axios.get(
              `https://api.replicate.com/v1/models/${modelSlug}/versions`,
              { headers: { Authorization: `Token ${REPLICATE_TOKEN}` } }
            );

            const versionsList = Array.isArray(versionsRes.data)
              ? versionsRes.data
              : versionsRes.data && versionsRes.data.results
              ? versionsRes.data.results
              : null;

            if (versionsList && versionsList.length > 0) {
              const newVersion = versionsList[0].id || versionsList[0].version || versionsList[0].pk;
              if (newVersion) {
                payload.version = newVersion;
                payload._retriedWithVersion = true;

                const retry = await axios.post(
                  "https://api.replicate.com/v1/predictions",
                  payload,
                  {
                    headers: {
                      Authorization: `Token ${REPLICATE_TOKEN}`,
                      "Content-Type": "application/json",
                    },
                    maxBodyLength: Infinity,
                  }
                );

                return retry.data;
              }
            }
          } catch (fetchErr) {
            console.error("Failed to fetch model versions:", fetchErr?.message || fetchErr);
          }
        }

        throw err;
      }
    };

    // If neither version nor model slug provided, fail fast with guidance
    if (!version && !modelSlug) {
      return res.status(500).json({
        success: false,
        message:
          "Missing REPLICATE_VERSION or REPLICATE_MODEL_SLUG in env. Provide a valid version id or owner/model slug.",
      });
    }

    const payload = buildPayload(version);
    const prediction = await sendPrediction(payload);

    // Poll for result
    let output;
    while (true) {
      const check = await axios.get(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
      });

      if (check.data.status === "succeeded") {
        output = check.data.output && check.data.output[0];
        break;
      }

      if (check.data.status === "failed") {
        throw new Error(check.data.error || "Generation failed");
      }

      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!output) throw new Error("No output URL returned by prediction");

    const img = await axios.get(output, { responseType: "arraybuffer" });

    res.setHeader("Content-Type", img.headers?.["content-type"] || "image/png");
    return res.send(img.data);
  } catch (err) {
    console.error("Fusion error:", err.response?.data || err.message || err);

    return res.status(500).json({
      success: false,
      message: "AI fusion failed",
      error: err.response?.data || err.message,
    });
  }
};