import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})
const model = 'qwen/qwen-image-2512:47c060e80055269a615f9636df2d51fd50239dc439f5ecde465a7d513a0abda6'
const input = {
  prompt: 'This is a modern slide with a deep blue gradient background. The title is "Qwen Image 2512 Major Release" in white sans serif bold font. \nOn the left a female portrait lacks detail. On the right a highly realistic young woman\'s portrait close to photographic quality. An arrow links the images labeled "2512 Quality Upgrade" \nFaint glow effects besides the arrow enhance dynamism\nText below reads: "More realistic texture, finer details, enhanced text rendering"',
  go_fast: true,
  guidance: 4,
  strength: 0.8,
  aspect_ratio: '16:9',
  output_format: 'webp',
  output_quality: 95,
  negative_prompt: ' ',
  num_inference_steps: 40,
}

console.log('Using model: %s', model)
console.log('With input: %O', input)

console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)
